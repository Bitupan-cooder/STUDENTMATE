export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  customSystemPrompt?: string;
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  learningGoals?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  subject: string;
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string; // Markdown content
  subject: string;
  updatedAt: string;
}

export interface PomodoroLog {
  id: string;
  userId: string;
  duration: number; // minutes
  subject: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
}

export interface Streak {
  currentStreak: number;
  maxStreak: number;
  lastActive: string | null; // YYYY-MM-DD
  freezesLeft: number;
}

export interface Message {
  id: string;
  senderEmail: string;
  senderName: string;
  text: string;
  sentAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  code: string;
  members: Array<{
    email: string;
    name: string;
    avatarUrl: string;
    lastActive: string; // ISO date string
    currentActivity?: {
      status: 'idle' | 'focusing' | 'break';
      timeRemaining?: string; // e.g. "21:35"
      subject?: string;
    };
  }>;
  messages: Message[];
  sharedTasks: Task[];
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'mentor' | 'research' | 'analytics';
  text: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  weeklyReport: string;
  weakSubjects: string[];
  inconsistentHabits: string[];
  studyTimeBySubject: { [subject: string]: number }; // minutes
  completionRate: number; // percentage
}
