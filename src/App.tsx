import React, { useState, useEffect } from 'react';
import { useStudyStore } from './store/useStudyStore';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import TasksManager from './components/TasksManager';
import NotebookManager from './components/NotebookManager';
import PomodoroTimer from './components/PomodoroTimer';
import CalendarPlanner from './components/CalendarPlanner';
import StudyGroups from './components/StudyGroups';
import AiAgents from './components/AiAgents';
import BackgroundEffects from './components/BackgroundEffects';

import {
  GraduationCap,
  LayoutDashboard,
  CheckCircle2,
  BookOpen,
  Clock,
  Calendar,
  Users,
  Brain,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Toaster } from 'sonner';

export default function App() {
  const { user, token, logout, fetchTasks, fetchNotes, fetchStreak, fetchHistory, fetchGroups } = useStudyStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Theme support
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'; // Default to gorgeous high-contrast dark scheme
  });

  useEffect(() => {
    // Apply class to HTML root
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch initial profile specific data upon app mount
  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchNotes();
      fetchStreak();
      fetchHistory();
      fetchGroups();
    }
  }, [token]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const selectNoteHandler = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  const clearSelectedNoteHandler = () => {
    setSelectedNoteId(null);
  };

  if (!token) {
    return <AuthScreen />;
  }

  // Sidebar navigation scannable labels
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Study Tasks', icon: CheckCircle2 },
    { id: 'notes', label: 'Notebook', icon: BookOpen },
    { id: 'timer', label: 'Pomodoro timer', icon: Clock },
    { id: 'calendar', label: 'Streak matrix', icon: Calendar },
    { id: 'groups', label: 'Study Guilds', icon: Users },
    { id: 'agents', label: 'AI Agent suite', icon: Brain },
  ];

  const getActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} onSelectNote={selectNoteHandler} />;
      case 'tasks':
        return <TasksManager />;
      case 'notes':
        return <NotebookManager selectedNoteId={selectedNoteId} onClearSelectedNote={clearSelectedNoteHandler} />;
      case 'timer':
        return <PomodoroTimer />;
      case 'calendar':
        return <CalendarPlanner />;
      case 'groups':
        return <StudyGroups />;
      case 'agents':
        return <AiAgents />;
      default:
        return <Dashboard onTabChange={setActiveTab} onSelectNote={selectNoteHandler} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 antialiased relative selection:bg-red-500/15 overflow-x-hidden font-sans">
      <Toaster theme={theme} position="top-center" richColors />
      <div className="min-h-screen flex bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative z-10 w-full">
        {/* Dynamic particles for premium visual atmosphere */}
        {theme === 'dark' && <BackgroundEffects />}

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#090a0f] border-r border-slate-200 dark:border-red-500/10 transition-all select-none justify-between h-screen sticky top-0 z-20 backdrop-blur-md">
          <div className="space-y-6 flex flex-col p-4 w-full">
            {/* Logo Brand Header */}
            <div className="flex items-center gap-2.5 px-1 py-1 select-none mt-2">
              <div className="relative text-center select-none">
                <span className="font-syncopate text-xl font-bold tracking-widest uppercase text-slate-900 dark:text-white block leading-none">
                  STUDENTMATE
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5 w-full">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-marvel uppercase tracking-wider rounded-lg transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 transform -skew-x-4 border-l-4 border-yellow-300 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-red-650/10 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Card & Settings footer */}
          <div className="p-4 border-t border-slate-200 dark:border-neutral-900 flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-neutral-800 p-2.5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-red-950 font-bold overflow-hidden flex items-center justify-center text-xs text-white">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="leading-none flex-1 text-left min-w-0">
                <p className="text-[11px] font-black tracking-tight text-slate-800 dark:text-white truncate">{user?.name || 'Academic Student'}</p>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 text-xs">
              <button
                onClick={toggleTheme}
                className="p-2 border border-slate-200 dark:border-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-900 rounded-lg flex-1 cursor-pointer transition-colors"
                title="Toggle design theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500 mx-auto" /> : <Moon className="w-4 h-4 text-slate-500 mx-auto" />}
              </button>

              <button
                onClick={logout}
                className="p-2 border border-slate-200 dark:border-neutral-800 text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-950/20 rounded-lg flex-1 cursor-pointer transition-colors"
                title="Log Out Session"
              >
                <LogOut className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE NAVIGATION LAYOUT */}
        <div className="md:hidden flex flex-col w-full min-h-screen bg-slate-50 dark:bg-transparent font-sans relative z-10">
          <header className="flex items-center justify-between p-3.5 bg-white dark:bg-black border-b border-slate-200 dark:border-neutral-800 relative z-10 select-none">
            <div className="flex items-center gap-1.5">
              <div className="relative text-center select-none">
                <span className="font-syncopate text-lg font-bold tracking-widest uppercase text-slate-900 dark:text-white block leading-none">
                  STUDENTMATE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-marvel">
              <button onClick={toggleTheme} className="p-1.5 text-slate-500 dark:text-slate-400">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={logout} className="p-1.5 text-rose-500">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mobile main content view */}
          <main className="flex-1 p-4 overflow-y-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >
                {getActiveView()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Mobile tab bar */}
          <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-neutral-800 sticky bottom-0 z-40 p-1">
            <div className="flex justify-around items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-0.5 p-1.5 text-[8.5px] font-marvel uppercase tracking-wider rounded-lg flex-1 cursor-pointer transition-colors ${
                      isActive ? 'text-red-650 dark:text-red-500 bg-red-100/30 dark:bg-red-950/30 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate max-w-[50px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </footer>
        </div>

        {/* DESKTOP CONTENT VIEW */}
        <main className="hidden md:block flex-1 p-8 overflow-y-auto h-screen relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              {getActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
