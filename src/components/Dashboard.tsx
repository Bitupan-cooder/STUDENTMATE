import React, { useEffect, useState } from "react";
import { useStudyStore } from "../store/useStudyStore";

import {
  Flame,
  Clock,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Brain,
  Plus,
  Play,
  Award,
  Calendar,
  ArrowRight,
  RefreshCw,
  Search,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  onTabChange: (tab: string) => void;
  onSelectNote: (noteId: string) => void;
}

export default function Dashboard({
  onTabChange,
  onSelectNote,
}: DashboardProps) {
  const {
    user,
    tasks,
    notes,
    streak,
    history,
    analyticsReport,
    analyticsLoading,
    fetchTasks,
    fetchNotes,
    fetchStreak,
    fetchHistory,
    fetchAnalytics,
    addTask,
    toggleTask,
    addPomodoroLog,
  } = useStudyStore();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [pomoSubject, setPomoSubject] = useState("General");

  useEffect(() => {
    fetchTasks();
    fetchNotes();
    fetchStreak();
    fetchHistory();
    fetchAnalytics();
  }, []);

  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(
      newTaskTitle.trim(),
      "medium",
      "General",
      new Date().toISOString().split("T")[0],
    );
    setNewTaskTitle("");
  };

  // Focus Log statistics
  const totalFocusMinutes = history.reduce(
    (sum, item) => sum + item.duration,
    0,
  );
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  // Filter tasks due today or pending
  const topPendingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  // Recent notes
  const recentNotes = notes.slice(0, 3);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#090a0f] p-6 rounded-2xl border border-slate-200 dark:border-white/10 transition-all shadow-sm">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-marker text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Welcome back, {user?.name || "Scholar"}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Track focus blocks, consult specialized study companions, and
            collaborate in study guilds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {streak?.lastActive && (
            <div className="flex items-center gap-1.5 bg-red-600 px-4 py-1.5 rounded-full text-white text-xs font-bold leading-none transform -skew-x-6 border border-white/20 shadow shadow-red-650/30 font-marvel uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-yellow-400 stroke-yellow-400 animate-pulse" />
              <span>{streak.currentStreak} Day Streak</span>
            </div>
          )}
          <button
            onClick={fetchAnalytics}
            disabled={analyticsLoading}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${analyticsLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 1. STREAK HERO CARD */}
        <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-red-500/20 md:col-span-2 relative overflow-hidden min-h-[200px] marvel-glow">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-red-500/10 rounded-full blur-xl -ml-12 -mb-12 pointer-events-none"></div>

          <div className="space-y-3 z-10 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/20 px-3 py-1 rounded-md border border-white/10 font-marvel">
                Productivity Streak
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-yellow-300">
                <Flame className="w-4 h-4 fill-yellow-300 stroke-red-500 animate-pulse" />
                <span>+12 PTS</span>
              </span>
            </div>

            <div className="flex items-baseline gap-3 my-4">
              <span className="text-6xl font-black font-marvel text-white tracking-tight drop-shadow-sm leading-none">
                {streak?.currentStreak || 0}
              </span>
              <div className="space-y-0.5">
                <span className="text-xl font-black font-marvel text-white block uppercase tracking-wide">
                  Days
                </span>
                <span className="text-xs text-red-100 block font-medium">
                  consecutive active days
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 pt-4 mt-auto text-xs text-red-100 z-10 select-none">
            <div className="flex flex-col gap-1 text-[11px] text-left">
              <div>
                Personal High Streak Record:{" "}
                <strong className="text-white">
                  {streak?.maxStreak || 0} days
                </strong>
              </div>
              <div>
                Freezes Left:{" "}
                <strong className="text-yellow-350 font-bold">
                  {streak?.freezesLeft || 0} left
                </strong>
              </div>
            </div>
            <button
              onClick={() => onTabChange("calendar")}
              className="px-4 py-2 bg-white text-red-600 rounded-lg flex items-center justify-center gap-1.5 font-marvel uppercase tracking-wider text-xs font-black transition-all cursor-pointer self-start sm:self-auto hover:bg-slate-100 shadow shadow-black/10 transform -skew-x-4"
            >
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Activity Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-600" />
            </button>
          </div>
        </div>

        {/* 2. FOCUS MODE / POMODORO TIMER */}
        <div className="liquid-glass rounded-3xl border border-red-500/10 dark:border-white/10 p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-md md:col-span-1 min-h-[200px] text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-marvel">
                Focus Mode
              </span>
              <Clock className="w-4 h-4 text-red-600" />
            </div>

            <div className="flex flex-col items-center justify-center py-2 space-y-1">
              <div className="w-[85px] h-[85px] border-4 border-red-50 dark:border-red-950/20 border-t-red-600 dark:border-t-red-500 rounded-full flex items-center justify-center relative shadow-sm">
                <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-500 tracking-tight leading-none">
                  25:00
                </div>
              </div>
              <div className="text-[9px] text-slate-450 dark:text-slate-500 font-bold tracking-widest font-marvel uppercase mt-2">
                Deep Work Session
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => onTabChange("timer")}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-marvel uppercase tracking-wider font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow shadow-red-600/25 cursor-pointer transform -skew-x-4"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Launch Board</span>
            </button>
          </div>
        </div>

        {/* 3. AI ANALYTICS AGENT */}
        <div className="bg-[#0f172a] dark:bg-slate-950 text-slate-150 rounded-3xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-lg md:col-span-1 relative overflow-hidden min-h-[200px] border border-red-500/10">
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-red-550/5 rounded-full blur-xl pointer-events-none"></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-marvel">
                Study Diagnostics
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            {analyticsLoading ? (
              <div className="flex flex-col items-center justify-center py-5 space-y-2">
                <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                <span className="text-[10px] text-slate-400">
                  Assessing logs...
                </span>
              </div>
            ) : analyticsReport ? (
              <div className="space-y-3 text-left">
                <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-3">
                  {analyticsReport.weeklyReport
                    ? `"${analyticsReport.weeklyReport}"`
                    : "No inconsistencies flagged this cycle. Keep study blocks consistent!"}
                </p>

                {analyticsReport.weakSubjects.length > 0 ? (
                  <div className="bg-red-600/15 p-2.5 rounded-xl border border-red-500/20 text-[10px]">
                    <p className="text-red-400 font-extrabold uppercase tracking-widest text-[9px] mb-0.5">
                      WEAK TOPIC FLAG
                    </p>
                    <p className="font-semibold text-slate-200 truncate">
                      {analyticsReport.weakSubjects[0]}
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/10 text-[10px]">
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-[9px] mb-0.5">
                      HEALTH STATUS
                    </p>
                    <p className="font-semibold text-slate-250 truncate">
                      Consistent focus pace!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed py-2 text-left">
                "Begin logging Pomodoro hours to generate smart weekly
                diagnostics."
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-850 pt-3 mt-4 text-[11px]">
            <span className="text-[#22c55e] font-semibold flex items-center gap-1">
              <span>+8.2% Efficiency</span>
            </span>
            <button
              onClick={() => onTabChange("agents")}
              className="font-marvel uppercase tracking-wider font-extrabold text-red-500 hover:text-red-450 cursor-pointer"
            >
              Analyze &rarr;
            </button>
          </div>
        </div>

        {/* 4. TODAY'S GOALS / SPECIALIZED TASK MANAGER */}
        <div className="liquid-glass rounded-3xl border border-red-500/10 dark:border-white/10 p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-md md:col-span-2 min-h-[300px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5 text-left pb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-650 dark:text-red-500" />
                  <span className="font-marvel text-sm uppercase tracking-wider text-slate-950 dark:text-slate-100">
                    Today's Goals
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Active credentials state linked with primary Tasks view
                </p>
              </div>
              <button
                onClick={() => onTabChange("tasks")}
                className="text-xs font-bold text-red-600 dark:text-red-500 hover:underline cursor-pointer font-marvel uppercase tracking-wider"
              >
                See all
              </button>
            </div>

            {/* Quick task form */}
            <form onSubmit={handleQuickAddTask} className="flex gap-2 mb-4">
              <input
                id="dash-quick-add-input"
                type="text"
                placeholder="Quick add: Complete chapter 3 analysis..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button
                id="dash-quick-add-btn"
                type="submit"
                className="px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow shadow-red-600/10"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Tasks list */}
            <div className="space-y-2.5 max-h-[185px] overflow-y-auto pr-1">
              {topPendingTasks.length > 0 ? (
                topPendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/60 rounded-2xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        className="w-4.5 h-4.5 text-red-600 border-slate-300 dark:border-slate-700 rounded focus:ring-red-500 cursor-pointer text-left"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id, !task.completed)}
                      />
                      <div className="space-y-0.5 min-w-0 flex-1 text-left">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] px-2 py-0.2 bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md font-bold">
                            {task.subject}
                          </span>
                          <span
                            className={`text-[9px] px-2 py-0.2 rounded-md font-black uppercase ${
                              task.priority === "high"
                                ? "bg-red-100 dark:bg-red-950/45 text-red-650 dark:text-red-400"
                                : task.priority === "medium"
                                  ? "bg-amber-100 dark:bg-amber-955 text-amber-600 dark:text-amber-400"
                                  : "bg-slate-150 dark:bg-slate-900 text-slate-500"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono ml-2 whitespace-nowrap">
                      {task.dueDate}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 dark:bg-slate-805 rounded-2xl border border-dashed border-slate-200 dark:border-slate-850">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    All caught up! Zero pending actions.
                  </p>
                  <p className="text-[10px] text-slate-550 mt-0.5">
                    Enjoy focused sprints or create fresh notebooks.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. RECENT NOTES */}
        <div className="liquid-glass rounded-3xl border border-red-500/10 dark:border-white/10 p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-md md:col-span-2 min-h-[300px]">
          <div className="flex flex-col h-full justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5 text-left pb-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-red-650 dark:text-red-500" />
                    <span className="font-marvel text-sm uppercase tracking-wider text-slate-950 dark:text-slate-100">
                      Recent Notes
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Local markdown documents and auto-saved draft syncs
                  </p>
                </div>
                <button
                  onClick={() => onTabChange("notes")}
                  className="text-xs font-bold text-red-600 dark:text-red-500 hover:underline cursor-pointer font-marvel uppercase tracking-wider"
                >
                  See all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recentNotes.length > 0 ? (
                  recentNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => {
                        onSelectNote(note.id);
                        onTabChange("notes");
                      }}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between min-h-[110px]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">
                            {note.title}
                          </h4>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-400 line-clamp-3 leading-snug">
                          {note.content
                            .replace(/[#*`_$-]/g, "")
                            .substring(0, 50) || "Empty draft..."}
                        </p>
                      </div>

                      <div className="mt-2.5">
                        <span className="text-[9px] px-2 py-0.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100/30 rounded-md font-bold uppercase tracking-wider block text-center truncate font-marvel">
                          {note.subject}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center justify-center py-10 text-center bg-slate-50 dark:bg-slate-805 rounded-2xl border border-dashed border-slate-200 dark:border-slate-850">
                    <p className="text-xs font-bold text-slate-450 dark:text-slate-500">
                      Notebook is empty.
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Jot down your notes.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectNote("new");
                onTabChange("notes");
              }}
              className="w-full mt-2 py-2.5 bg-white dark:bg-slate-900 border border-red-550/15 text-red-600 dark:text-red-500 text-xs font-marvel uppercase tracking-wider font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:bg-red-600/5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write new note</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. AI COGNITIVE STUDY ASSISTANTS COMPACT DOCK */}
      <div className="liquid-glass border border-red-500/15 dark:border-white/10 p-5 rounded-3xl mt-2 select-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 text-white rounded-2xl shadow-md border border-white/20 transform -skew-x-4">
              <Brain className="w-5 h-5 text-yellow-350" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-black font-marvel text-red-600 dark:text-red-500 uppercase tracking-wide">
                STUDY MENTORING AND RESEARCH SHIELDS
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                Interactive AI study companions sharing a unified database
                context
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mentor Agent Pill */}
          <div
            onClick={() => {
              localStorage.setItem("activeAgentTab", "mentor");
              onTabChange("agents");
            }}
            className="group flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-red-500 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 dark:bg-red-950/40 text-red-600 font-marvel font-black text-sm rounded-xl flex items-center justify-center select-none group-hover:bg-red-600 group-hover:text-white transition-colors">
                M
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  Mentor Companion
                </p>
                <p className="text-[10px] text-slate-450 dark:text-slate-400">
                  Explanation & learning styles
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
          </div>

          {/* Research Agent Pill */}
          <div
            onClick={() => {
              localStorage.setItem("activeAgentTab", "research");
              onTabChange("agents");
            }}
            className="group flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-red-500 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 dark:bg-red-950/40 text-red-600 font-marvel font-black text-sm rounded-xl flex items-center justify-center select-none group-hover:bg-red-600 group-hover:text-white transition-colors">
                R
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  Research Companion
                </p>
                <p className="text-[10px] text-slate-450 dark:text-slate-400">
                  Search notebook citations
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
          </div>

          {/* Diagnostics Agent Pill */}
          <div
            onClick={() => {
              localStorage.setItem("activeAgentTab", "analytics");
              onTabChange("agents");
            }}
            className="group flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:border-red-500 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 dark:bg-red-950/40 text-red-600 font-marvel font-black text-sm rounded-xl flex items-center justify-center select-none group-hover:bg-red-600 group-hover:text-white transition-colors">
                A
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                  Diagnostics Companion
                </p>
                <p className="text-[10px] text-slate-450 dark:text-slate-400">
                  Weekly study health logs
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
