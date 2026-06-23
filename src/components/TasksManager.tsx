import React, { useState } from 'react';
import { useStudyStore } from '../store/useStudyStore';
import { CheckCircle2, Circle, AlertCircle, Plus, Trash2, Tag, Calendar, Filter } from 'lucide-react';

export default function TasksManager() {
  const { tasks, addTask, toggleTask, deleteTask } = useStudyStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [subject, setSubject] = useState('Physics');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCompleted, setFilterCompleted] = useState('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask(title.trim(), priority, subject, dueDate);
    setTitle('');
  };

  // Extract unique subjects
  const subjects = ['Physics', 'Mathematics', 'Computer Science', 'Literature', 'History', 'Biology', 'General'];

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const sMatch = filterSubject === 'all' || t.subject.toLowerCase() === filterSubject.toLowerCase();
    const pMatch = filterPriority === 'all' || t.priority === filterPriority;
    const cMatch =
      filterCompleted === 'all' ||
      (filterCompleted === 'completed' && t.completed) ||
      (filterCompleted === 'pending' && !t.completed);
    return sMatch && pMatch && cMatch;
  });

  return (
    <div id="tasks-manager-view" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            Class study planner
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Log outstanding assignments, exam prep blocks, and group project coordinates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation Box */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-805 dark:text-slate-100 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-500" />
            <span>Create Study Assignment</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase">Task Title</label>
              <input
                id="task-title-input"
                type="text"
                required
                placeholder="e.g. Read Quantum Entanglement theory"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-250 dark:border-slate-755 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-2.5 py-1.8 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-250 dark:border-slate-755 text-slate-850 dark:text-slate-100 focus:outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-2.5 py-1.8 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-250 dark:border-slate-755 text-slate-850 dark:text-slate-100 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase">Target Due Date</label>
              <input
                id="task-date-input"
                type="date"
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-250 dark:border-slate-755 text-slate-850 dark:text-slate-100 focus:outline-none"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <button
              id="task-submit-btn"
              type="submit"
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Add Task to Board
            </button>
          </form>
        </div>

        {/* Filters and Tasks Ledger */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-505">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350 focus:outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filterCompleted}
                onChange={(e) => setFilterCompleted(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-755 text-slate-700 dark:text-slate-350 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* List display */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 bg-white dark:bg-slate-900 border rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-850/50 ${
                    task.completed
                      ? 'border-emerald-100 dark:border-emerald-950 bg-emerald-500/5 dark:bg-emerald-950/5 opacity-80'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id, !task.completed)}
                      className="text-slate-400 hover:text-indigo-650 transition-colors cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-555 fill-emerald-505/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <p className={`text-sm font-bold leading-none ${
                        task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full font-medium">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{task.subject}</span>
                        </span>
                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${
                          task.priority === 'high' ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400' :
                          task.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-900/30' :
                          'bg-slate-100 dark:bg-slate-900 text-slate-550'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-mono">{task.dueDate}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        deleteTask(task.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer relative z-10"
                    >
                      <Trash2 className="w-4 h-4 pointer-events-none" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 py-12 rounded-2xl border border-slate-205 dark:border-slate-800 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No matching assignments found</p>
                <p className="text-xs text-slate-400">Readjust your tags/priorities filter presets above to clear.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
