import fs from 'fs';
import path from 'path';
import { User, Task, Note, PomodoroLog, Streak, StudyGroup, Message } from './src/types';

const DB_FILE = path.join(process.cwd(), 'db_store.json');

interface Schema {
  users: { [id: string]: User };
  tasks: Task[];
  notes: Note[];
  pomodoros: PomodoroLog[];
  streaks: { [userId: string]: Streak };
  groups: StudyGroup[];
}

const DEFAULT_DB: Schema = {
  users: {},
  tasks: [],
  notes: [],
  pomodoros: [],
  streaks: {},
  groups: []
};

// Seed outstanding content to make the sandbox populate immediately with premium student data
function getSeedData(): Schema {
  const seedUsers: { [id: string]: User } = {
    "student123": {
      id: "student123",
      email: "studymate_demo@gmail.com",
      name: "Alex Rivera",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      customSystemPrompt: "Explain complex terms using analogies and break descriptions into direct, concise bullet points.",
      learningStyle: "visual",
      learningGoals: "Master quantum computing fundamentals and prep for Advanced Machine Learning finals."
    }
  };

  const seedTasks: Task[] = [
    {
      id: "task-1",
      userId: "student123",
      title: "Review Quantum Entanglement lecture notes",
      completed: false,
      priority: "high",
      subject: "Physics",
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      createdAt: new Date().toISOString()
    },
    {
      id: "task-2",
      userId: "student123",
      title: "Complete linear algebra exercise set 4",
      completed: true,
      priority: "medium",
      subject: "Mathematics",
      dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: "task-3",
      userId: "student123",
      title: "Draft chapter 1 summary of Gatsby critique",
      completed: false,
      priority: "low",
      subject: "Literature",
      dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // in 2 days
      createdAt: new Date().toISOString()
    },
    {
      id: "task-4",
      userId: "student123",
      title: "Compile backpropagation training equations",
      completed: false,
      priority: "high",
      subject: "Computer Science",
      dueDate: new Date().toISOString().split('T')[0], // today
      createdAt: new Date().toISOString()
    }
  ];

  const seedNotes: Note[] = [
    {
      id: "note-1",
      userId: "student123",
      title: "Quantum Computing Basics",
      subject: "Physics",
      content: `# Quantum Superposition & Entanglement

Quantum computers leverage the principles of quantum mechanics to process information in ways classical computers cannot.

## 1. Superposition
Unlike a classical bit which is strictly 0 or 1, a qubit exists in a linear combination of states:
$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$
Where $\\alpha$ and $\\beta$ are probability amplitudes, and:
$$|\\alpha|^2 + |\\beta|^2 = 1$$

## 2. Quantum Entanglement
When two qubits are entangled, their states are linked. Measuring one instantaneously determines the state of the other:
- Bell State: $|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$

## Key Takeaway
Perfect superposition is extremely fragile and breaks due to *quantum decoherence*. Shielding qubits remains the core engineering challenge.`,
      updatedAt: new Date().toISOString()
    },
    {
      id: "note-2",
      userId: "student123",
      title: "Neural Network Architecture Foundations",
      subject: "Computer Science",
      content: `# Neural Network Foundations

An artificial neuron computes the weighted sum of inputs, adds a bias, and passes it through an activation function.

## 1. Backpropagation
We compute the local gradient of cost $C$ with respect to weight $w_{ij}$:
$$\\frac{\\partial C}{\\partial w_{ij}} = a_j \\cdot \\delta_i$$

## 2. Gradient Descent Updates
We adjust parameters using a learning rate $\\eta$:
$$w_{ij} \\leftarrow w_{ij} - \\eta \\frac{\\partial C}{\\partial w_{ij}}$$

## Common Terms
- **ReLU**: $f(x) = \\max(0, x)$ - solves vanishing gradients.
- **Overfitting**: Prevent using L2 regularization or Dropout layers.`,
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  const seedPomodoros: PomodoroLog[] = [
    {
      id: "pomo-1",
      userId: "student123",
      duration: 25,
      subject: "Physics",
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      completedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: "pomo-2",
      userId: "student123",
      duration: 25,
      subject: "Computer Science",
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      completedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "pomo-3",
      userId: "student123",
      duration: 25,
      subject: "Physics",
      date: new Date().toISOString().split('T')[0],
      completedAt: new Date().toISOString()
    }
  ];

  const seedStreaks: { [userId: string]: Streak } = {
    "student123": {
      currentStreak: 3,
      maxStreak: 5,
      lastActive: new Date().toISOString().split('T')[0],
      freezesLeft: 2
    }
  };

  const seedGroups: StudyGroup[] = [
    {
      id: "group-stem",
      name: "STEM Elite Study Group",
      code: "STEM88",
      members: [
        {
          email: "studymate_demo@gmail.com",
          name: "Alex Rivera",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          lastActive: new Date().toISOString(),
          currentActivity: { status: "focusing", timeRemaining: "12:44", subject: "Computer Science" }
        },
        {
          email: "Sophia_neuro@gmail.com",
          name: "Sophia Chen",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          lastActive: new Date().toISOString(),
          currentActivity: { status: "break", timeRemaining: "04:59", subject: "Biology" }
        },
        {
          email: "siddharth_codes@gmail.com",
          name: "Siddharth Mehta",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          lastActive: new Date().toISOString(),
          currentActivity: { status: "idle" }
        }
      ],
      messages: [
        {
          id: "m1",
          senderEmail: "Sophia_neuro@gmail.com",
          senderName: "Sophia Chen",
          text: "Hey study squad! Just started a 50-minute blocks session on neuroplasticity reading.",
          sentAt: new Date(Date.now() - 10 * 60000).toISOString()
        },
        {
          id: "m2",
          senderEmail: "siddharth_codes@gmail.com",
          senderName: "Siddharth Mehta",
          text: "Nice! I am currently debugging my microservice tasks. Need to study for tomorrow's lab.",
          sentAt: new Date(Date.now() - 8 * 60000).toISOString()
        }
      ],
      sharedTasks: [
        {
          id: "group-task-1",
          userId: "group-stem",
          title: "Complete mock exams for Finals preparation",
          completed: false,
          priority: "high",
          subject: "Physics",
          dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }
      ]
    }
  ];

  return {
    users: seedUsers,
    tasks: seedTasks,
    notes: seedNotes,
    pomodoros: seedPomodoros,
    streaks: seedStreaks,
    groups: seedGroups
  };
}

class DiskDB {
  private memoryData: Schema = { ...DEFAULT_DB };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.memoryData = JSON.parse(fileContent);
      } else {
        this.memoryData = getSeedData();
        this.save();
      }
    } catch (e) {
      console.error("Error reading database file, using seed/fallback data", e);
      this.memoryData = getSeedData();
      this.save();
    }
  }

  public async loadFromFirestore() {
    // Disabled Admin SDK Firestore sync as it lacks service account credentials in this environment
    return;
  }

  private save() {
    try {
      // Async write to not block main thread
      fs.writeFile(DB_FILE, JSON.stringify(this.memoryData, null, 2), 'utf-8', (err) => {
        if (err) console.error("Error saving database file to disk", err);
      });
    } catch (e) {
      console.error("Error initiating save", e);
    }
  }

  // Users APIs
  getUser(id: string): User | undefined {
    return this.memoryData.users[id];
  }

  getUserByEmail(email: string): User | undefined {
    return Object.values(this.memoryData.users).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  saveUser(user: User) {
    this.memoryData.users[user.id] = user;
    // ensure streak model
    if (!this.memoryData.streaks[user.id]) {
      this.memoryData.streaks[user.id] = {
        currentStreak: 0,
        maxStreak: 0,
        lastActive: null,
        freezesLeft: 3
      };
    }
    this.save();
  }

  updateUserProfile(userId: string, customSystemPrompt?: string, learningGoals?: string, learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic') {
    const user = this.getUser(userId);
    if (user) {
      if (customSystemPrompt !== undefined) user.customSystemPrompt = customSystemPrompt;
      if (learningGoals !== undefined) user.learningGoals = learningGoals;
      if (learningStyle !== undefined) user.learningStyle = learningStyle;
      this.save();
    }
  }

  // Tasks APIs
  getTasks(userId: string): Task[] {
    return this.memoryData.tasks.filter(t => t.userId === userId);
  }

  getTask(id: string): Task | undefined {
    return this.memoryData.tasks.find(t => t.id === id);
  }

  saveTask(task: Task) {
    // Check if exists
    const idx = this.memoryData.tasks.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      this.memoryData.tasks[idx] = task;
    } else {
      this.memoryData.tasks.unshift(task);
    }
    this.save();
  }

  deleteTask(id: string) {
    this.memoryData.tasks = this.memoryData.tasks.filter(t => t.id !== id);
    this.save();
  }

  // Notes APIs
  getNotes(userId: string): Note[] {
    return this.memoryData.notes.filter(n => n.userId === userId);
  }

  saveNote(note: Note) {
    const idx = this.memoryData.notes.findIndex(n => n.id === note.id);
    if (idx !== -1) {
      this.memoryData.notes[idx] = note;
    } else {
      this.memoryData.notes.unshift(note);
    }
    this.save();
  }

  deleteNote(id: string) {
    this.memoryData.notes = this.memoryData.notes.filter(n => n.id !== id);
    this.save();
  }

  // Pomodoro & Streaks
  getPomodoros(userId: string): PomodoroLog[] {
    return this.memoryData.pomodoros.filter(p => p.userId === userId);
  }

  addPomodoro(log: PomodoroLog) {
    this.memoryData.pomodoros.unshift(log);
    this.updateStreak(log.userId, log.date);
    this.save();
  }

  getStreak(userId: string): Streak {
    if (!this.memoryData.streaks[userId]) {
      this.memoryData.streaks[userId] = {
        currentStreak: 0,
        maxStreak: 0,
        lastActive: null,
        freezesLeft: 3
      };
      this.save();
    }
    return this.memoryData.streaks[userId];
  }

  freezeStreak(userId: string): Streak {
    const streak = this.getStreak(userId);
    if (streak.freezesLeft > 0) {
      streak.freezesLeft -= 1;
      const today = new Date().toISOString().split('T')[0];
      streak.lastActive = today;
      // Freeze maintains currentStreak
      this.save();
    }
    return streak;
  }

  recoverStreak(userId: string): Streak {
    const streak = this.getStreak(userId);
    // resets currentStreak back to 0 or restores based on penalty
    streak.currentStreak = 1;
    streak.lastActive = new Date().toISOString().split('T')[0];
    this.save();
    return streak;
  }

  private updateStreak(userId: string, dateStr: string) {
    const streak = this.getStreak(userId);
    const last = streak.lastActive;

    if (!last) {
      streak.currentStreak = 1;
      streak.maxStreak = Math.max(streak.maxStreak, 1);
    } else {
      const lastDate = new Date(last);
      const currDate = new Date(dateStr);
      const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Next consecutive day
        streak.currentStreak += 1;
        streak.maxStreak = Math.max(streak.maxStreak, streak.currentStreak);
      } else if (diffDays > 1) {
        // Missed days - streak lost
        // Wait, did they recover or break? Reset to 1 on active day.
        streak.currentStreak = 1;
      }
      // Same day does nothing to currentStreak, keeping existing value.
    }
    streak.lastActive = dateStr;
    this.save();
  }

  // Groups
  getGroups(): StudyGroup[] {
    return this.memoryData.groups;
  }

  getGroup(id: string): StudyGroup | undefined {
    return this.memoryData.groups.find(g => g.id === id);
  }

  getGroupByCode(code: string): StudyGroup | undefined {
    return this.memoryData.groups.find(g => g.code.toUpperCase() === code.toUpperCase());
  }

  createGroup(name: string, userId: string, userName: string, avatarUrl: string): StudyGroup {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    const id = "group-" + Date.now();
    const user = this.getUser(userId);

    const newGroup: StudyGroup = {
      id,
      name,
      code,
      members: [{
        email: user?.email || "unknown@studymate.com",
        name: userName,
        avatarUrl,
        lastActive: new Date().toISOString(),
        currentActivity: { status: "idle" }
      }],
      messages: [{
        id: "sys-" + Date.now(),
        senderEmail: "system@studymate.com",
        senderName: "StudyMate System",
        text: `Welcome to study group "${name}"! Share code "${code}" with your colleagues to collaborate.`,
        sentAt: new Date().toISOString()
      }],
      sharedTasks: []
    };

    this.memoryData.groups.push(newGroup);
    this.save();
    return newGroup;
  }

  joinGroup(code: string, userId: string, userName: string, avatarUrl: string): StudyGroup | null {
    const group = this.getGroupByCode(code);
    if (!group) return null;

    const user = this.getUser(userId);
    const email = user?.email || "unknown@studymate.com";

    // check if already a member
    const existing = group.members.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      group.members.push({
        email,
        name: userName,
        avatarUrl,
        lastActive: new Date().toISOString(),
        currentActivity: { status: "idle" }
      });

      group.messages.push({
        id: "sys-" + Date.now(),
        senderEmail: "system@studymate.com",
        senderName: "StudyMate System",
        text: `${userName} joined the study group! 🚀`,
        sentAt: new Date().toISOString()
      });
      this.save();
    }
    return group;
  }

  addMessage(groupId: string, senderEmail: string, senderName: string, text: string): Message | null {
    const group = this.getGroup(groupId);
    if (!group) return null;

    const message: Message = {
      id: "msg-" + Date.now() + Math.random().toString(36).substring(2, 5),
      senderEmail,
      senderName,
      text,
      sentAt: new Date().toISOString()
    };

    group.messages.push(message);
    // Maintain maximum 100 messages for fast synchronization
    if (group.messages.length > 100) {
      group.messages.shift();
    }
    this.save();
    return message;
  }

  deleteGroup(groupId: string): boolean {
    const initialLength = this.memoryData.groups.length;
    this.memoryData.groups = this.memoryData.groups.filter(g => g.id !== groupId);
    if (this.memoryData.groups.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  syncActivity(groupId: string, email: string, activity: { status: 'idle' | 'focusing' | 'break'; timeRemaining?: string; subject?: string }) {
    const group = this.getGroup(groupId);
    if (!group) return;

    const member = group.members.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (member) {
      member.lastActive = new Date().toISOString();
      member.currentActivity = activity;
      this.save();
    }
  }
}

export const dbStore = new DiskDB();
