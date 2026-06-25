<div align="center">

# 🎓 STUDENTMATE
### AI-Powered Student Productivity Assistant

**Built for the [5-Day AI Agents: Intensive Vibe Coding Capstone — Kaggle](https://www.kaggle.com/competitions/ai-agents-intensive-vibe-coding-capstone)**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-studentmate.onrender.com-brightgreen?style=for-the-badge)](https://studentmate.onrender.com)
[![Built with Gemini](https://img.shields.io/badge/Built%20with-Google%20Gemini-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 🧩 Problem Statement

Students today struggle with **fragmented study workflows** — tasks are in one app, notes in another, and getting academic help requires switching between multiple tools. There is no single place where a student can:

- Manage assignments and deadlines
- Take and search through notes
- Track focused study sessions
- Get personalized AI tutoring
- Review their study analytics

**STUDENTMATE** solves this by combining a full productivity suite with a **multi-agent AI system** — all in one app. The agents don't just chat; they **take real actions**: creating tasks, searching notes, and generating analytics reports, all powered by Google Gemini AI.

---

## 🤖 Why Agents?

Traditional chatbots answer questions. **AI Agents go further** — they can:

- 🧠 **Understand context** (who the student is, their goals, pending tasks, streaks)
- 🔀 **Route requests** to the right specialist agent
- 🛠️ **Call tools** to take real actions (create a task, search a knowledge base)
- 📊 **Generate structured reports** based on live student data

A single monolithic AI cannot do all of this well. A **multi-agent architecture** allows each agent to specialize, making the system smarter, more accurate, and more maintainable.

---

## 🏗️ Agent Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        STUDENTMATE SYSTEM                        │
│                                                                   │
│   Student Input                                                   │
│       │                                                           │
│       ▼                                                           │
│  ┌─────────────────────────────────────────┐                     │
│  │      MCP SERVER (Model Context Protocol) │                     │
│  │  Injects: Student Profile, Tasks,        │                     │
│  │           Streaks, Learning Goals,        │                     │
│  │           Kaggle Data Node               │                     │
│  └──────────────────┬──────────────────────┘                     │
│                     │  Context-enriched prompt                    │
│                     ▼                                             │
│  ┌─────────────────────────────────────────┐                     │
│  │     ROUTE COORDINATOR AGENT (ADK)        │                     │
│  │  Reads intent → Routes to best agent    │                     │
│  └────┬──────────┬──────────┬──────────────┘                     │
│       │          │          │                                     │
│       ▼          ▼          ▼                                     │
│  ┌─────────┐ ┌────────┐ ┌───────────┐                           │
│  │ MENTOR  │ │RESEARCH│ │ANALYTICS  │                           │
│  │  AGENT  │ │ AGENT  │ │  AGENT    │                           │
│  └────┬────┘ └────────┘ └───────────┘                           │
│       │                                                           │
│       ▼  ADK SKILLS (Function Calling)                           │
│  ┌──────────────────────────────────────┐                        │
│  │  createTask | fetchKnowledge |        │                        │
│  │  analyzeKaggleDataset                 │                        │
│  └──────────────────────────────────────┘                        │
│                                                                   │
│  AI PROVIDER: NVIDIA LLaMA (primary) → Google Gemini (fallback) │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Course Concepts Demonstrated

### 1. 🤖 Agent / Multi-Agent System (ADK)

**File:** `server_adk.ts`, `server.ts`

STUDENTMATE uses **4 specialized agents** coordinated by a supervisor:

| Agent | Role |
|---|---|
| **Route Coordinator Agent** | Reads the student's message and routes it to the correct agent |
| **Mentor Agent** | Personalized AI tutor — explains concepts, creates tasks |
| **Research Agent** | Fast notebook search and academic Q&A |
| **Analytics Agent** | Generates weekly study habit reports |

```typescript
// Route Coordinator decides which agent handles the request
export async function RouteCoordinatorAgent(userMessage: string, userId: string) {
  // Uses Gemini to classify intent → returns: 'mentor' | 'researcher' | 'analytics' | 'kaggle_analyst'
}
```

---

### 2. 🔌 MCP Server (Model Context Protocol)

**File:** `server_adk.ts` — `MCPContext`

The MCP Server dynamically **builds a personalized context snapshot** from the live database and injects it into the AI's system prompt before every response. This means the AI always knows exactly who it's talking to.

```typescript
export const MCPContext = {
  getStudentData(userId: string) {
    // Pulls: student profile, pending tasks, streak, learning goals
    // Returns structured context injected into AI system prompt
  },
  getKaggleMCPInstance() {
    // Connects agents to Kaggle empirical datasets
  }
};
```

**Two MCP nodes:**
- **Local Student Data Node** — profile, tasks, streaks, learning goals
- **Kaggle Data Node** — empirical study & performance datasets

---

### 3. 🛠️ Agent Skills (ADK Function Declarations)

**File:** `server_adk.ts` — `ADKSkills`

Skills are **function declarations** that let the AI take real actions beyond just generating text:

```typescript
export const ADKSkills = {
  createTask: { ... },          // Creates a real task in the task manager
  fetchKnowledge: { ... },      // Searches the academic knowledge base
  analyzeKaggleDataset: { ... } // Fetches and analyzes Kaggle dataset summaries
};
```

**Example flow:** Student says *"Remind me to study Physics tonight"*
→ Mentor Agent calls `createTask` skill
→ Backend saves a real task to the database
→ Agent confirms: *"I've scheduled: Study Physics tonight ✅"*

---

### 4. 🛡️ Security Features

**Files:** `server.ts`, `server_adk.ts`

Security is implemented in **multiple layers**:

| Layer | Implementation |
|---|---|
| **API Key Protection** | All keys stored in `.env` (never committed to GitHub) |
| **Auth Middleware** | Every API request validates a Bearer token |
| **AI Safety Guardrails** | `ADKSafetyConfig` injects a safety system prompt to prevent jailbreaks |
| **Input Validation** | All endpoints return `400` errors for missing/invalid fields |
| **Secrets excluded from Git** | `.gitignore` blocks all `.env*` files |

```typescript
// Safety guardrails injected into every AI system prompt
export const ADKSafetyConfig = {
  systemInstruction: "You are a secure educational AI. Maintain a helpful and academic tone."
};
```

```typescript
// API key validation before any AI call is made
function getGeminiClient() {
  let key = process.env.GEMINI_API_KEY1 || process.env.GEMINI_API_KEY;
  if (!key || key.includes("MY_GEMINI_API_KEY")) return null;
  return new GoogleGenAI({ apiKey: key });
}
```

---

### 5. 🚀 Deployability

**Live URL:** [https://studentmate.onrender.com](https://studentmate.onrender.com)

STUDENTMATE is **fully deployed and publicly accessible** — no login, no paywall:

- ✅ **Deployed on Render** — accessible from any browser globally
- ✅ **Offline fallback mode** — app works even without API keys (graceful degradation)
- ✅ **Environment-based config** — `.env.example` provided for easy setup by anyone
- ✅ **Firebase integration** — `firebase-applet-config.json` for Firestore cloud database
- ✅ **One-command startup** — `npm install && npm run dev`

---

### 6. 🪄 Antigravity (AI Coding Assistant)

This project was built with the assistance of **Antigravity** — Google's AI coding assistant integrated into AI Studio. Antigravity was used to:

- Design and implement the multi-agent architecture
- Write ADK skill function declarations
- Implement the MCP context protocol
- Handle API fallback logic between NVIDIA and Gemini
- Fix security issues (moving hardcoded API keys to environment variables)
- Improve project documentation

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 **Task Manager** | Create, complete, and prioritize study tasks by subject |
| 📓 **Notebook Editor** | Write and search notes by subject |
| ⏱️ **Pomodoro Timer** | 25-min focus sessions with study streak tracking |
| 🔥 **Streak System** | Daily study streaks with freeze and recovery options |
| 👥 **Study Groups** | Create/join groups and sync study activity with peers |
| 🤖 **AI Mentor** | Personalized tutor that creates tasks and references your notes |
| 🔍 **Research Agent** | Semantic search across your notebooks |
| 📊 **Analytics Agent** | Weekly AI-generated productivity and habit reports |
| 🌐 **Offline Fallback** | App works even without an API key |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Zustand, Lucide Icons, Motion |
| **Backend** | Node.js, Express, TypeScript, tsx |
| **AI Primary** | NVIDIA NIM (LLaMA 3.1 70B / 8B) |
| **AI Fallback** | Google Gemini 2.5 Flash via `@google/genai` |
| **Database** | Firebase Firestore + local JSON store |
| **Build Tool** | Vite |
| **Deployment** | Render (web service) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/studentmate.git
cd studentmate

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Edit `.env` and add your keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NVIDIA_API_KEY=your_nvidia_api_key_here   # Optional: get from build.nvidia.com
```

```bash
# 4. Start the development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
studentmate/
├── server.ts            # Express API server — all routes & AI agent endpoints
├── server_adk.ts        # ADK Skills, MCP Context, Route Coordinator Agent, Safety Config
├── server_db.ts         # Firebase Firestore + JSON persistence layer
├── src/
│   ├── App.tsx          # Main React app shell and navigation
│   ├── components/
│   │   └── AiAgents.tsx # AI Mentor, Research, and Analytics UI panels
│   ├── store/
│   │   └── useStudyStore.ts  # Zustand global state + all API calls
│   └── types.ts         # Shared TypeScript interfaces
├── .env.example         # Environment variable template (no real keys)
├── .gitignore           # Excludes .env files from version control
└── package.json         # Dependencies and npm scripts
```

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Authenticate user session |
| `/api/tasks` | GET/POST | Get or create study tasks |
| `/api/notes` | GET/POST | Get or save notebook notes |
| `/api/pomodoro` | POST | Log a Pomodoro focus session |
| `/api/streaks` | GET | Get current study streak |
| `/api/groups` | GET | List study groups |
| `/api/agent/mentor/chat` | POST | AI Mentor tutor chat |
| `/api/agent/research/search` | POST | AI Research notebook search |
| `/api/agent/analytics/report` | GET | AI Analytics habit report |
| `/api/agent/debug` | GET | Diagnose AI API connection |

---

## 📜 License

This project is a capstone submission for the *5-Day AI Agents: Intensive Vibe Coding Course with Google* on Kaggle.
Free to use and customize for educational purposes.
