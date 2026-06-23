import { create } from 'zustand';
import { toast } from 'sonner';
import { User, Task, Note, PomodoroLog, Streak, StudyGroup, Message, AgentMessage, AnalyticsSummary } from '../types';

interface StudyState {
  // Auth
  user: User | null;
  token: string | null;
  login: (email: string, name: string, avatarUrl?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (customSystemPrompt: string, learningGoals: string, learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic') => Promise<void>;

  // Tasks
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (title: string, priority: 'low' | 'medium' | 'high', subject: string, dueDate: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Notes
  notes: Note[];
  activeNoteId: string | null;
  fetchNotes: () => Promise<void>;
  saveNote: (id: string | null, title: string, content: string, subject: string) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  setActiveNoteId: (id: string | null) => void;

  // Streak & History
  streak: Streak | null;
  history: PomodoroLog[];
  fetchStreak: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  addPomodoroLog: (duration: number, subject: string) => Promise<void>;
  freezeStreak: () => Promise<void>;
  recoverStreak: () => Promise<void>;

  // Collaborative Groups
  groups: StudyGroup[];
  activeGroup: StudyGroup | null;
  fetchGroups: () => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  joinGroup: (code: string) => Promise<string | null>; // Returns null on success, error string on failure
  sendMessage: (text: string) => Promise<void>;
  syncGroupActivity: (status: 'idle' | 'focusing' | 'break', timeRemaining?: string, subject?: string) => Promise<void>;
  setActiveGroup: (group: StudyGroup | null) => void;

  // Agents
  agentMessages: AgentMessage[];
  mentorLoading: boolean;
  researchResult: string;
  researchLoading: boolean;
  analyticsReport: AnalyticsSummary | null;
  analyticsLoading: boolean;
  askMentor: (text: string) => Promise<void>;
  searchResearch: (query: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  clearAgentHistory: () => void;
}

// Helper to get headers with simulated JWT authorization header
const getAuthHeaders = (token: string | null) => {
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const useStudyStore = create<StudyState>((set, get) => ({
  // Auth initial state
  user: JSON.parse(localStorage.getItem("studymate_user") || "null"),
  token: localStorage.getItem("studymate_token"),

  login: async (email: string, name: string, avatarUrl?: string) => {
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, avatarUrl })
      });
      if (!resp.ok) return false;
      const data = await resp.json();

      localStorage.setItem("studymate_user", JSON.stringify(data.user));
      localStorage.setItem("studymate_token", data.token);

      set({ user: data.user, token: data.token });
      // Fetch user specific records directly upon logging in
      get().fetchTasks();
      get().fetchNotes();
      get().fetchStreak();
      get().fetchHistory();
      get().fetchGroups();
      return true;
    } catch (e) {
      console.error("Login failure", e);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("studymate_user");
    localStorage.removeItem("studymate_token");
    set({
      user: null,
      token: null,
      tasks: [],
      notes: [],
      streak: null,
      history: [],
      groups: [],
      activeGroup: null,
      agentMessages: [],
      analyticsReport: null
    });
  },

  updateProfile: async (customSystemPrompt: string, learningGoals: string, learningStyle) => {
    const { token } = get();
    try {
      const resp = await fetch("/api/profile", {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ customSystemPrompt, learningGoals, learningStyle })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.user) {
          localStorage.setItem("studymate_user", JSON.stringify(data.user));
          set({ user: data.user });
        }
      }
    } catch (e) {
      console.error("Profile update failed", e);
    }
  },

  // Tasks manager
  tasks: [],
  fetchTasks: async () => {
    const { token } = get();
    try {
      const resp = await fetch("/api/tasks", { headers: getAuthHeaders(token) });
      if (resp.ok) {
        const data = await resp.json();
        set({ tasks: data });
      }
    } catch (e) {
      console.error("Fetch tasks failed", e);
    }
  },

  addTask: async (title, priority, subject, dueDate) => {
    const { token } = get();
    try {
      const resp = await fetch("/api/tasks", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ title, priority, subject, dueDate })
      });
      if (resp.ok) {
        get().fetchTasks();
      }
    } catch (e) {
      console.error("Add task failed", e);
    }
  },

  toggleTask: async (id: string, completed: boolean) => {
    const { token } = get();
    try {
      const resp = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ completed })
      });
      if (resp.ok) {
        get().fetchTasks();
      }
    } catch (e) {
      console.error("Toggle task failed", e);
    }
  },

  deleteTask: async (id: string) => {
    const { token } = get();
    try {
      const resp = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token)
      });
      if (resp.ok) {
        get().fetchTasks();
      }
    } catch (e) {
      console.error("Delete task failed", e);
    }
  },

  // Notebook content
  notes: [],
  activeNoteId: null,
  setActiveNoteId: (id) => set({ activeNoteId: id }),

  fetchNotes: async () => {
    const { token } = get();
    try {
      const resp = await fetch("/api/notes", { headers: getAuthHeaders(token) });
      if (resp.ok) {
        const data = await resp.json();
        set({ notes: data });
      }
    } catch (e) {
      console.error("Fetch notes failed", e);
    }
  },

  saveNote: async (id, title, content, subject) => {
    const { token } = get();
    try {
      const resp = await fetch("/api/notes", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ id, title, content, subject })
      });
      const note = await resp.json();
      get().fetchNotes();
      return note;
    } catch (e) {
      console.error("Save note failed", e);
      throw e;
    }
  },

  deleteNote: async (id) => {
    const { token } = get();
    try {
      const resp = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token)
      });
      if (resp.ok) {
        get().fetchNotes();
        if (get().activeNoteId === id) {
          set({ activeNoteId: null });
        }
      }
    } catch (e) {
      console.error("Delete note failed", e);
    }
  },

  // Streaks & focus logs
  streak: null,
  history: [],

  fetchStreak: async () => {
    const { token } = get();
    try {
      const resp = await fetch("/api/streaks", { headers: getAuthHeaders(token) });
      if (resp.ok) {
        const data = await resp.json();
        set({ streak: data });
      }
    } catch (e) {
      console.error("Fetch streak failed", e);
    }
  },

  fetchHistory: async () => {
    const { token } = get();
    try {
      const resp = await fetch("/api/pomodoro/history", { headers: getAuthHeaders(token) });
      if (resp.ok) {
        const data = await resp.json();
        set({ history: data });
      }
    } catch (e) {
      console.error("Fetch history statistics failed", e);
    }
  },

  addPomodoroLog: async (duration, subject) => {
    const { token } = get();
    try {
      const prevStreak = get().streak?.currentStreak || 0;

      const resp = await fetch("/api/pomodoro", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ duration, subject })
      });
      if (resp.ok) {
        get().fetchHistory();
        await get().fetchStreak();
        get().fetchAnalytics(); // dynamically update analytics insights since they changed logs
        
        const newStreak = get().streak?.currentStreak || 0;
        
        if (newStreak > prevStreak && newStreak > 0) {
           const milestones = [1, 3, 7, 14, 30, 50, 100];
           if (milestones.includes(newStreak)) {
               toast.success(`🎉 Milestone Reached! You have studied for ${newStreak} consecutive days!`, {
                  description: "Keep the momentum going!",
                  duration: 5000,
               });
           } else {
               toast.success(`🔥 Streak updated! Current streak: ${newStreak} days.`);
           }
        }
      }
    } catch (e) {
      console.error("Logging Pomodoro failed", e);
    }
  },

  freezeStreak: async () => {
    const { token } = get();
    try {
      const resp = await fetch("/api/streaks/freeze", {
        method: "POST",
        headers: getAuthHeaders(token)
      });
      if (resp.ok) {
        get().fetchStreak();
      }
    } catch (e) {
      console.error("Freeze streak failure", e);
    }
  },

  recoverStreak: async () => {
    const { token } = get();
    try {
      const resp = await fetch("/api/streaks/recover", {
        method: "POST",
        headers: getAuthHeaders(token)
      });
      if (resp.ok) {
        get().fetchStreak();
      }
    } catch (e) {
      console.error("Recover streak failure", e);
    }
  },

  // Groups
  groups: [],
  activeGroup: null,
  setActiveGroup: (group) => set({ activeGroup: group }),

  fetchGroups: async () => {
    const { token } = get();
    try {
      const resp = await fetch("/api/groups", { headers: getAuthHeaders(token) });
      if (resp.ok) {
        const data = await resp.json();
        set({ groups: data });
        // update active group if open
        const { activeGroup } = get();
        if (activeGroup) {
          const fresh = data.find((g: any) => g.id === activeGroup.id);
          if (fresh) set({ activeGroup: fresh });
        }
      }
    } catch (e) {
      console.error("Fetch groups failed", e);
    }
  },

  createGroup: async (name) => {
    const { token } = get();
    try {
      const resp = await fetch("/api/groups/create", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ name })
      });
      if (resp.ok) {
        get().fetchGroups();
      }
    } catch (e) {
      console.error("Create group failed", e);
    }
  },

  joinGroup: async (code) => {
    const { token } = get();
    try {
      const resp = await fetch("/api/groups/join", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ code })
      });
      if (resp.ok) {
        const data = await resp.json();
        get().fetchGroups();
        set({ activeGroup: data });
        return null;
      } else {
        const err = await resp.json();
        return err.error || "Could not join. Check code.";
      }
    } catch (e) {
      console.error("Join group failed", e);
      return "An unexpected error occurred.";
    }
  },

  deleteGroup: async (id) => {
    const { token, activeGroup } = get();
    try {
      const resp = await fetch(`/api/groups/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });
      if (resp.ok) {
        if (activeGroup?.id === id) {
          set({ activeGroup: null });
        }
        get().fetchGroups();
      }
    } catch (e) {
      console.error("Delete group failed", e);
    }
  },

  sendMessage: async (text) => {
    const { token, activeGroup } = get();
    if (!activeGroup) return;
    try {
      const resp = await fetch("/api/groups/message", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ groupId: activeGroup.id, text })
      });
      if (resp.ok) {
        get().fetchGroups();
      }
    } catch (e) {
      console.error("Send message failed", e);
    }
  },

  syncGroupActivity: async (status, timeRemaining, subject) => {
    const { token, activeGroup } = get();
    if (!activeGroup) return;
    try {
      const resp = await fetch("/api/groups/sync", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          groupId: activeGroup.id,
          status,
          timeRemaining,
          subject
        })
      });
      if (resp.ok) {
        const fresh = await resp.json();
        set({ activeGroup: fresh });
      }
    } catch (e) {
      console.error("Sync heartbeat error", e);
    }
  },

  // Agents Orchestration
  agentMessages: [
    {
      id: "init-m",
      sender: "mentor",
      text: "Hello! I am your StudyMate Mentor. I have full context on your markdown drafts and goals. Ask me to explain a concept or help you map out your study plan!",
      timestamp: new Date().toLocaleTimeString()
    }
  ],
  mentorLoading: false,
  researchResult: "",
  researchLoading: false,
  analyticsReport: null,
  analyticsLoading: false,

  askMentor: async (text) => {
    const { token, agentMessages } = get();
    const userMsg: AgentMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    set({ agentMessages: [...agentMessages, userMsg], mentorLoading: true });

    try {
      const resp = await fetch("/api/agent/mentor/chat", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ message: text, chatHistory: get().agentMessages })
      });
      const data = await resp.json();
      const mentorMsg: AgentMessage = {
        id: "mentor-" + Date.now(),
        sender: "mentor",
        text: data.text || "I apologize, but I am having trouble connecting to my cognitive grid right now. Let me know if you would like me to retry.",
        timestamp: new Date().toLocaleTimeString()
      };
      set({ agentMessages: [...get().agentMessages, mentorMsg] });
      
      // Update tasks in case the agent created one
      get().fetchTasks();
    } catch (e) {
      console.error("Error asking tutor", e);
      const errMsg: AgentMessage = {
        id: "mentor-err",
        sender: "mentor",
        text: "Oops, an error occurred while connecting. Please review your server logs and try again.",
        timestamp: new Date().toLocaleTimeString()
      };
      set({ agentMessages: [...get().agentMessages, errMsg] });
    } finally {
      set({ mentorLoading: false });
    }
  },

  searchResearch: async (query) => {
    const { token } = get();
    set({ researchLoading: true, researchResult: "" });
    try {
      const resp = await fetch("/api/agent/research/search", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ query })
      });
      if (resp.ok) {
        const data = await resp.json();
        set({ researchResult: data.text });
      } else {
        set({ researchResult: "Search request failed. Please check backend log details." });
      }
    } catch (e) {
      console.error("Research search failed", e);
      set({ researchResult: "An error occurred during search connection." });
    } finally {
      set({ researchLoading: false });
    }
  },

  fetchAnalytics: async () => {
    const { token } = get();
    set({ analyticsLoading: true });
    try {
      const resp = await fetch("/api/agent/analytics/report", { headers: getAuthHeaders(token) });
      if (resp.ok) {
        const data = await resp.json();
        set({ analyticsReport: data });
      }
    } catch (e) {
      console.error("Analytics fetch failed", e);
    } finally {
      set({ analyticsLoading: false });
    }
  },

  clearAgentHistory: () => {
    set({
      agentMessages: [
        {
          id: "init-m",
          sender: "mentor",
          text: "Hello! History cleared. I am your StudyMate Mentor. Ask me anything to jump back in!",
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    });
  }
}));
