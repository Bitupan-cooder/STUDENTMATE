import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { dbStore } from "./server_db";

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function generateContentWithRetry(ai: any, params: any) {
  // Try NVIDIA API first to prevent Gemini Free Tier 429 Limits, utilizing the user-provided integration
  const nvidiaKey = "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";
  if (nvidiaKey) {
    const nvidiaModels = ["meta/llama-3.1-70b-instruct", "meta/llama-3.1-8b-instruct"];
    for (let i = 0; i < nvidiaModels.length; i++) {
        try {
          let messages = [];
          let sysPrompt = params.config?.systemInstruction || "";
          if (sysPrompt) {
            messages.push({ role: "system", content: sysPrompt });
          }

          if (typeof params.contents === "string") {
            messages.push({ role: "user", content: params.contents });
          } else if (Array.isArray(params.contents)) {
            for (const msg of params.contents) {
              if (typeof msg === "string") {
                messages.push({ role: "user", content: msg });
              } else {
                const role = msg.role === "model" ? "assistant" : "user";
                let content = "";
                if (msg.parts && Array.isArray(msg.parts)) {
                  content = msg.parts.map((p: any) => p.text || JSON.stringify(p)).join("\n");
                } else {
                  content = msg.text || JSON.stringify(msg);
                }
                messages.push({ role, content });
              }
            }
          }

          let tools: any[] | undefined = undefined;
          if (params.config?.tools && params.config?.tools[0]?.functionDeclarations) {
            tools = params.config.tools[0].functionDeclarations.map((f: any) => {
              let parameters = f.parameters ? {
                type: "object",
                properties: f.parameters.properties,
                required: f.parameters.required || []
              } : { type: "object", properties: {} };
              
              Object.keys(parameters.properties || {}).forEach(k => {
                 if (parameters.properties[k].type) {
                     parameters.properties[k].type = String(parameters.properties[k].type).toLowerCase();
                     if (parameters.properties[k].type === "type.string") parameters.properties[k].type = "string";
                 }
              });

              return {
                type: "function",
                function: {
                  name: f.name,
                  description: f.description,
                  parameters: parameters
                }
              };
            });
          }

          const payload: any = {
            model: nvidiaModels[i],
            messages: messages,
            max_tokens: 4096,
            temperature: params.config?.temperature || 0.7,
          };

          if (tools && tools.length > 0) {
            payload.tools = tools;
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
          const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${nvidiaKey}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const msg = data.choices[0]?.message;
            let text = msg?.content || "";
            
            let functionCalls: any[] | undefined = undefined;
            if (msg?.tool_calls && msg.tool_calls.length > 0) {
               functionCalls = msg.tool_calls.map((tc: any) => {
                  let args = {};
                  try {
                    args = JSON.parse(tc.function.arguments || "{}");
                  } catch(e) {}
                  return {
                    name: tc.function.name,
                    args: args
                  };
               });
            }

            if (params.config?.responseMimeType === "application/json") {
                text = text.replace(/^```json\n?/, '').replace(/\n?```$/,'').trim();
            }
            return { text, functionCalls };
          } else {
            const errText = await response.text();
            if (response.status !== 429 && response.status !== 404 && response.status !== 500) {
              console.warn(`[NVIDIA API Fallback Error ${nvidiaModels[i]}]`, errText);
            }
            if (response.status === 429) {
               await new Promise(r => setTimeout(r, 1000));
            }
          }
        } catch (err: any) {
          if (err.name !== 'AbortError' && !(err.message && err.message.includes('aborted'))) {
             console.warn(`[NVIDIA API Fallback Exception ${nvidiaModels[i]}]`, err.message || err);
          }
        }
    }
  }

  const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let lastError: any;
  // Reduce retries to 2 so we fail fast instead of waiting 16+ seconds
  for (let i = 0; i < 2; i++) {
    const model = models[i % models.length];
    try {
      const p = { ...params, model };
      return await ai.models.generateContent(p);
    } catch (e: any) {
      lastError = e;
      if (e.status === 429 || e.status === 503 || e.status === 500 || e.status === 404) {
        if (i < 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
      }
      throw e;
    }
  }
  throw lastError;
}

// -------------------------------------------------------------------------------- //
// AGENT DEVELOPMENT KIT (ADK) ARCHITECTURE
// -------------------------------------------------------------------------------- //

/**
 * 1. AGENT SKILLS: Defined function declarations for our AI to interact with the system.
 */
export const ADKSkills = {
  createTask: {
    name: "createTask",
    description: "Creates a new study task or reminder for the student in their task manager.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "The title or action item of the task." },
        subject: { type: Type.STRING, description: "The subject category of the task (e.g. Math, Physics)." }
      },
      required: ["title", "subject"],
    },
  } as FunctionDeclaration,
  
  fetchKnowledge: {
    name: "fetchKnowledge",
    description: "Searches the central knowledge base. ONLY use if the user explicitly asks to 'search the database' or 'look up a paper'. For general questions like 'explain kinetic energy', DO NOT use this tool.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING, description: "The search query topic." },
      },
      required: ["topic"],
    },
  } as FunctionDeclaration,

  analyzeKaggleDataset: {
    name: "analyzeKaggleDataset",
    description: "Fetches Kaggle datasets. ONLY use if the user explicitly asks to 'analyze a dataset', 'search kaggle', or 'find data'.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        datasetQuery: { type: Type.STRING, description: "The topic or subject to query against Kaggle datasets." }
      },
      required: ["datasetQuery"]
    }
  } as FunctionDeclaration 
};

/**
 * 2. MCP SERVER CONTEXT (Model Context Protocol) 
 * Dynamically builds context from external databases directly for the model workspace.
 */
export const MCPContext = {
  getStudentData(userId: string) {
    const profile = dbStore.getUser(userId);
    const tasks = dbStore.getTasks(userId);
    const streak = dbStore.getStreak(userId);
    return `
=== MCP LOCAL SERVER CONTEXT ===
Student Name: ${profile?.name}
Pending Tasks: ${tasks.filter(t => !t.completed).map(t => t.title).join(", ") || "None"}
Current Streak: ${streak.currentStreak} days
Learning Goals: ${profile?.learningGoals || "Not set"}
================================
    `;
  },
  
  getKaggleMCPInstance() {
    return `
=== KAGGLE MCP DATA NODE ===
Connection: ACTIVE (Mock Kaggle Integration)
Available Datasets: 
  - "Global Student Performance Index (2024)"
  - "STEM Learning Optimization Studies"
  - "Cognitive Load and Pomodoro Efficacy"
Context: This MCP server node connects the StudyMate agents directly to empirical data sources on Kaggle.
============================
    `;
  }
};

/**
 * 3. MULTI-AGENT SUPERVISOR ROUTER
 * Routes the user prompt to the correct specialized agent.
 */
export async function RouteCoordinatorAgent(userMessage: string, userId: string): Promise<{
    assignedAgent: 'mentor' | 'researcher' | 'analytics' | 'kaggle_analyst';
    rationale: string;
}> {
  const routerPrompt = `
  You are an ADK Multi-Agent Routing Supervisor. 
  Examine the user's message and determine which Agent must handle the request.
  
  Agents available:
  - "mentor": For general chatting, asking for help, tasks creation, and motivational support.
  - "researcher": For academic queries, deep web searching, definitions, explanations of concepts.
  - "analytics": For questions strictly about user stats, studying time, history, reports, and productivity metrics.
  - "kaggle_analyst": For specific questions asking to find, analyze, or process Kaggle datasets or empirical data studies.

  Message: "${userMessage}"
  
  Respond in EXACT JSON format with keys "assignedAgent" (one of the 4 names) and "rationale".
  `;
  
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return { assignedAgent: 'mentor', rationale: "No API key" };
    }
    const aiResponse = await generateContentWithRetry(ai, {
      contents: routerPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    let text = aiResponse.text || '{"assignedAgent":"mentor", "rationale":"fallback"}';
    try {
      return JSON.parse(text);
    } catch(err) {
      const match = text.match(/\{[\s\S]*?\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw err;
    }
  } catch (e: any) {
    console.error("[ADK Router Error]", e);
    return { assignedAgent: 'mentor', rationale: "Error in router" };
  }
}

/**
 * 4. SECURITY & GUARDRAILS
 * Apply safety configuration to incoming requests to prevent jailbreaks.
 */
export const ADKSafetyConfig = {
  systemInstruction: "You are a secure educational AI. Maintain a helpful and academic tone."
};
