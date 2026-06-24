<div align="center">
  <img width="1200" height="475" alt="STUDENTMATE" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# STUDENTMATE

STUDENTMATE is the final capstone project for the *5 Days AI Agents: Intensive Vibe Coding Course With Google*. This repo demonstrates a real-world student productivity assistant built with React, Express, Google Gemini AI, and an experimental NVIDIA fallback path.

Live app: https://studentmate.onrender.com

The app presents a multi-agent study dashboard and is designed to showcase key course concepts such as:

- Agent Development Kit (ADK) skills and function declarations
- Model Context Protocol (MCP) context routing
- AI agent skill orchestration and safe guardrails
- Notebook-aware research and reasoning flows
- Hybrid AI integration with Gemini and NVIDIA chat completions
- Kaggle-style dataset analysis simulation

## What is this app?

STUDENTMATE is a study management platform for students who want:

- A task planner for assignments, exam preparation, and study priorities.
- A notebook editor for notes, subjects, and academic drafts.
- Pomodoro timers and streak tracking for disciplined study sessions.
- Collaborative study group simulation.
- An AI-powered mentor, research assistant, and analytics advisor.

## Purpose

The app is designed to help students stay organized, focus faster, and learn more effectively by combining productivity tools with adaptive AI assistance.

It is ideal for:

- managing coursework and study schedules,
- saving and searching class notes,
- practicing active learning with Pomodoro timers,
- receiving subject explanations from an AI tutor,
- exploring research-style query responses,
- reviewing personalized study analytics.

## Advantages

- **Integrated workflow:** calendar, tasks, notes, and AI all in one app.
- **AI support:** uses Google Gemini plus a fallback NVIDIA chat API path for smarter responses.
- **Offline fallback:** when the AI key is missing, the app still returns local simulated guidance.
- **Flexible learning style:** students can customize their learning preferences and prompts.
- **Mock collaboration:** study groups and shared activity tracking simulate team study.
- **Fast local setup:** uses Vite, Express, and Zustand for a lightweight development experience.

## Disadvantages

- **Not production-ready:** data is stored in a simple local JSON-backed store, not a secure database.
- **Limited authentication:** login is simulated and not backed by a real auth provider.
- **Hardcoded NVIDIA fallback key:** the NVIDIA integration currently uses a fixed key in code.
- **No persistent cloud storage:** app data and notes are not persisted across real deployments without additional database work.
- **AI dependency:** features that require AI need a valid `GEMINI_API_KEY` and may be rate-limited.

## How it works

### Frontend

- `src/App.tsx` contains the main layout and navigation.
- `src/components/AiAgents.tsx` provides the AI mentor, research, and analytics UI.
- `src/store/useStudyStore.ts` manages state with Zustand and calls backend API routes.
- Features include dashboards, tasks, notebooks, timer, calendar, groups, and AI agents.

### Backend

- `server.ts` runs an Express server with API routes for auth, tasks, notes, pomodoro logs, streaks, groups, and AI agent endpoints.
- `server_adk.ts` contains AI integration logic and the fallback mechanism used by the app.
- `src/types.ts` defines shared TypeScript interfaces used by both frontend and backend.
- `server_db.ts` is the in-memory / JSON-backed persistence layer for demo data.

### AI integration

- The app is built to use the Google Gemini API via the `@google/genai` SDK.
- The `server.ts` backend loads environment variables with `dotenv/config`.
- `server_adk.ts` attempts to call NVIDIA chat completions first, then falls back to Gemini.
- AI endpoints include:
  - `/api/agent/mentor/chat`
  - `/api/agent/research/search`
  - `/api/agent/analytics/report`

## How to run locally

### Prerequisites

- Node.js installed.
- A Gemini API key from Google Cloud or AI Studio.

### Install and start

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the repo root and add your Gemini key:

```env
GEMINI_API_KEY=your_real_gemini_api_key_here
```

If you prefer, you can also set `GEMINI_API_KEY1`.

3. Start the app:

```bash
npm run dev
```

4. Open the app in your browser at:

```
http://localhost:3000
```

## NVIDIA API integration

### Current NVIDIA support in this app

The app currently includes a fallback path in `server_adk.ts` that makes a direct HTTP request to NVIDIA's chat completions endpoint:

- Endpoint: `https://integrate.api.nvidia.com/v1/chat/completions`
- Models: `meta/llama-3.1-70b-instruct`, `meta/llama-3.1-8b-instruct`
- This fallback is triggered before Gemini if the hardcoded NVIDIA key is present.

### How to enable your own NVIDIA API key

1. Open `server_adk.ts`.
2. Replace the hardcoded `nvidiaKey` assignment with your environment variable, for example:

```ts
const nvidiaKey = process.env.NVIDIA_API_KEY || "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";
```

3. Add your NVIDIA key to `.env.local`:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
```

4. Restart the server.

### Using an NVIDIA SDK instead of direct fetch

This repo does not currently install an NVIDIA SDK package. If you want to use NVIDIA's official SDK, do the following:

1. Install the SDK package (if available):

```bash
npm install @nvidia/sdk-name
```

2. Replace the direct REST `fetch(...)` logic in `server_adk.ts` with the SDK client calls.
3. Configure the SDK client with `process.env.NVIDIA_API_KEY`.

> Note: The repository currently uses `@google/genai` for Gemini, and the NVIDIA integration path is implemented via direct REST calls.

## Important files

- `README.md` — project overview and setup.
- `package.json` — dependencies and scripts.
- `server.ts` — Express API server and AI route definitions.
- `server_adk.ts` — AI fallback logic, NVIDIA integration, ADK skill declarations.
- `server_db.ts` — demo persistence layer.
- `src/App.tsx` — frontend application shell.
- `src/components/AiAgents.tsx` — AI agent UI panel.
- `src/store/useStudyStore.ts` — app state and REST data fetches.
- `src/types.ts` — shared TypeScript models.

## Notes and recommendations

- If you want production-grade persistence, replace `server_db.ts` with a real database (PostgreSQL, MongoDB, Firebase, etc.).
- For secure auth, replace the simulated JWT-style login with a proper authentication provider.
- If you want NVIDIA fallback to be configurable, add `NVIDIA_API_KEY` support and remove the hardcoded key.
- Keep `.env.local` out of version control and do not commit secrets.

---

## License

This project is a demo / educational prototype. Use and customize it freely for learning purposes.
