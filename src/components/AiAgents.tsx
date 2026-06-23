import React, { useState, useEffect } from 'react';
import { useStudyStore } from '../store/useStudyStore';
import { MessageSquare, Search, Brain, Save, Send, Trash2, ShieldCheck, FileText, ChevronRight, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function AiAgents() {
  const {
    user,
    agentMessages,
    mentorLoading,
    researchResult,
    researchLoading,
    analyticsReport,
    analyticsLoading,
    updateProfile,
    askMentor,
    searchResearch,
    fetchAnalytics,
    clearAgentHistory
  } = useStudyStore();

  const [activeAgentTab, setActiveAgentTab] = useState<'mentor' | 'research' | 'analytics'>(() => {
    return (localStorage.getItem('activeAgentTab') as 'mentor' | 'research' | 'analytics') || 'mentor';
  });

  useEffect(() => {
    localStorage.setItem('activeAgentTab', activeAgentTab);
  }, [activeAgentTab]);

  // Mentor profile config states
  const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'reading' | 'kinesthetic'>('visual');
  const [learningGoals, setLearningGoals] = useState('');
  const [customSystemPrompt, setCustomSystemPrompt] = useState('');

  // Queries
  const [tutorQuery, setTutorQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Track profile saves sync
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setLearningStyle(user.learningStyle || 'visual');
      setLearningGoals(user.learningGoals || '');
      setCustomSystemPrompt(user.customSystemPrompt || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeAgentTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeAgentTab]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    await updateProfile(customSystemPrompt, learningGoals, learningStyle);
    setProfileSuccess('Tutor learning style coordinates updated on server database!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleSendMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim() || mentorLoading) return;
    await askMentor(tutorQuery.trim());
    setTutorQuery('');
  };

  const handleSearchResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || researchLoading) return;
    await searchResearch(searchQuery.trim());
  };



  return (
    <div id="ai-agents-view" className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 liquid-glass p-6 rounded-2xl border border-red-500/15 dark:border-white/10 transition-all shadow-md marvel-glow">
        <div className="space-y-0.5 text-left">
          <h2 className="text-xl font-black font-marvel text-red-600 dark:text-red-500 tracking-wider uppercase flex items-center gap-1.5">
            AI STUDY COMPANIONS BOARD
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs text-left">
            Consult specialized learning tools carry isolated training contexts, synchronized with your notebooks.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start border border-slate-200 dark:border-slate-700 select-none">
          <button
            onClick={() => setActiveAgentTab('mentor')}
            className={`p-2 px-3 rounded-lg text-xs font-marvel uppercase tracking-wider font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAgentTab === 'mentor' ? 'bg-red-600 text-white shadow transform -skew-x-4' : 'text-slate-500 hover:text-red-600'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Mentor Companion</span>
          </button>
          <button
            onClick={() => setActiveAgentTab('research')}
            className={`p-2 px-3 rounded-lg text-xs font-marvel uppercase tracking-wider font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAgentTab === 'research' ? 'bg-red-600 text-white shadow transform -skew-x-4' : 'text-slate-500 hover:text-red-600'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Research Tool</span>
          </button>
          <button
            onClick={() => setActiveAgentTab('analytics')}
            className={`p-2 px-3 rounded-lg text-xs font-marvel uppercase tracking-wider font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              activeAgentTab === 'analytics' ? 'bg-red-600 text-white shadow transform -skew-x-4' : 'text-slate-500 hover:text-red-600'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Habit Insights</span>
          </button>
        </div>
      </div>

      {/* WORKSPACES PER AGENT TAB */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* 1. TUTOR CHAT AGENT (Agent 1) */}
        {activeAgentTab === 'mentor' && (
          <>
            {/* Left Column: Tutor configs updates */}
            <div className="lg:col-span-1 liquid-glass p-5 rounded-2xl border border-red-500/10 dark:border-white/10 shadow-xs space-y-4 text-left font-sans">
              <h3 className="text-sm font-black font-marvel text-red-600 dark:text-red-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-red-550/10 pb-2">
                <GraduationCap className="w-4 h-4 text-red-600" />
                <span>Learn profiles style</span>
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 font-marvel tracking-wider select-none">Learning Style</label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="w-full px-2.5 py-1.8 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-205 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-600 cursor-pointer"
                  >
                    <option value="visual">Visual (Analogies & Diagrams)</option>
                    <option value="auditory">Auditory (Listen & repeat steps)</option>
                    <option value="reading">Reading/Writing (Direct texts)</option>
                    <option value="kinesthetic">Kinesthetic (Exercises & code)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 font-marvel tracking-wider select-none">Exams & Academic Goals</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Master Linear Algebra finals prep and Quantum systems formulas."
                    className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-205 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-600 text-left leading-relaxed resize-none"
                    value={learningGoals}
                    onChange={(e) => setLearningGoals(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 font-marvel tracking-wider select-none">Tutor Custom Prompt / Tone</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Always explain formulas step-by-step and break things into bullet lists."
                    className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-205 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-600 text-left leading-relaxed resize-none"
                    value={customSystemPrompt}
                    onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  />
                </div>

                {profileSuccess && <p className="text-[10px] text-emerald-500 font-bold leading-normal">{profileSuccess}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-marvel uppercase tracking-wider font-extrabold text-xs rounded-lg flex items-center justify-center gap-1 shadow cursor-pointer transform -skew-x-4 border border-white/5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Tutor Settings</span>
                </button>
              </form>
            </div>

            {/* Right Column: Chat panel */}
            <div className="lg:col-span-3 liquid-glass rounded-2xl border border-red-500/10 dark:border-white/10 shadow-sm flex flex-col justify-between overflow-hidden h-[460px]">
              <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-red-500/10 flex items-center justify-between select-none">
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-bold text-slate-855 dark:text-slate-50 flex items-center gap-1 font-marvel uppercase tracking-wider text-red-600 dark:text-red-500">
                    <span>💬 Mentor Chat Thread</span>
                  </h4>
                  <p className="text-[9px] text-slate-400">patient, highly structured academic companion</p>
                </div>
                <button
                  onClick={clearAgentHistory}
                  className="p-1 px-2 border.5 border-red-500/20 hover:bg-red-500/5 text-[10px] font-marvel uppercase tracking-wider font-extrabold text-red-600 dark:text-red-500 rounded cursor-pointer"
                >
                  Clear Chat Logs
                </button>
              </div>

              {/* Chat listings */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
                {agentMessages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className="flex gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 font-bold mb-0.5 px-1 bg-transparent border-none">
                        <span>{isUser ? user?.name || 'Student' : 'Tutor Companion'}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed text-left shadow-sm ${
                          isUser
                            ? 'bg-red-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none prose prose-rose'
                        }`}
                      >
                        <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</Markdown>
                      </div>
                    </div>
                  );
                })}
                {mentorLoading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                    <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                    <span>Companion is formulating concept explanations...</span>
                  </div>
                )}
              </div>

              {/* Chat form query */}
              <form onSubmit={handleSendMentor} className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  id="mentor-chat-input"
                  type="text"
                  required
                  placeholder="Ask physics formulas, programming functions, math analogies..."
                  className="flex-1 px-3.5 py-3 text-xs bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                />
                <button
                  id="mentor-send-btn"
                  type="submit"
                  disabled={mentorLoading}
                  className="px-5 bg-red-600 hover:bg-red-700 text-white font-marvel uppercase tracking-wider font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transform -skew-x-4 border border-white/10"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}

        {/* 2. RESEARCH SEARCH LOOKUP AGENT (Agent 2) */}
        {activeAgentTab === 'research' && (
          <div className="col-span-4 liquid-glass rounded-2xl p-6 border border-red-500/10 dark:border-white/10 shadow-sm space-y-5">
            <div className="space-y-1 text-left">
              <span className="text-xs font-black text-red-650 dark:text-red-500 uppercase tracking-widest font-marvel">Concept Semantic Search</span>
              <h3 className="text-md font-black text-slate-850 dark:text-slate-50">Sourced Facts Research Hub</h3>
              <p className="text-xs text-slate-500">
                Seeks specific topics across draft sheets. Given a subject request, outputs citing relevant titles and compilation logs.
              </p>
            </div>

            <form onSubmit={handleSearchResearch} className="flex gap-2">
              <input
                id="research-search-input"
                type="text"
                required
                placeholder="e.g. What is quantum superposition state of Bell formula? or linear activation ReLU"
                className="flex-1 px-4 py-3 text-xs bg-white dark:bg-slate-800 rounded-xl border border-slate-205 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                id="research-search-btn"
                type="submit"
                disabled={researchLoading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-marvel uppercase tracking-wider font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transform -skew-x-4 border border-white/10 shadow-sm"
              >
                {researchLoading ? 'Searching Notes...' : 'Sourced Lookup'}
              </button>
            </form>

            {/* Answer Display */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-205 dark:border-slate-755 min-h-[180px] text-left">
              {researchLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <span className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-xs text-slate-400 italic">Scanning note contents and cross-referencing citations...</span>
                </div>
              ) : researchResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-500 font-bold uppercase tracking-widest border-b border-red-100 dark:border-red-900/10 pl-1 pb-2 font-marvel">
                    <FileText className="w-4 h-4" />
                    <span>Citation results:</span>
                  </div>
                  <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl prose font-medium prose-rose">
                    <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{researchResult}</Markdown>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center space-y-1 select-none">
                  <Search className="w-8 h-8 text-neutral-350" />
                  <p className="text-xs font-bold">Awaiting lookup coordinates</p>
                  <p className="text-[10px] text-slate-500">Provide Q&A research request above; outputs cites relevant notebook chapters.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. ANALYTICS DIAGNOSTIC AGENT (Agent 3) */}
        {activeAgentTab === 'analytics' && (
          <div className="col-span-4 liquid-glass rounded-2xl p-6 border border-red-500/10 dark:border-white/10 shadow-sm space-y-6 font-sans">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1 text-left">
                <span className="text-xs font-black text-red-650 dark:text-red-500 uppercase tracking-widest font-marvel">Diagnostic habit logs</span>
                <h3 className="text-md font-black text-slate-850 dark:text-slate-50">Systems Habit Performance Audit</h3>
                <p className="text-xs text-slate-500 text-left">
                  Reviews pomodoro logs, study streak bounds, and pending tasks coordinates.
                </p>
              </div>

              <button
                id="analytics-regenerate-btn"
                onClick={fetchAnalytics}
                disabled={analyticsLoading}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-marvel uppercase tracking-wider font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer transform -skew-x-4 border border-white/10"
              >
                <span>Re-Assessment Diagnosis</span>
              </button>
            </div>

            {analyticsLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <span className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                <span className="text-xs text-slate-400 italic">Compiling habit matrix scores and generating diagnostics...</span>
              </div>
            ) : analyticsReport ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visual statistics grid column */}
                <div className="space-y-4 md:col-span-1 text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Statistical Matrices</span>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none block">Tasks Velocity Done</span>
                      <p className="text-2xl font-black text-red-600 dark:text-red-500 mt-1">{analyticsReport.completionRate}%</p>
                    </div>

                    <div className="border-t border-slate-205 dark:border-slate-800 pt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none block">Weak Subjects Logged</span>
                      <ul className="mt-1.5 space-y-1 flex flex-wrap gap-1">
                        {analyticsReport.weakSubjects.length > 0 ? (
                          analyticsReport.weakSubjects.map((sub, idx) => (
                            <span key={idx} className="text-[10px] bg-red-50 dark:bg-red-955 text-red-650 dark:text-red-400 font-bold px-2.5 py-0.5 rounded-full border border-red-200/30 font-marvel uppercase tracking-wide">
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">None logged. Clean!</span>
                        )}
                      </ul>
                    </div>

                    <div className="border-t border-slate-205 dark:border-slate-800 pt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase leading-none block font-mono">Focus hours breakdown</span>
                      <div className="mt-2 space-y-1.5">
                        {Object.entries(analyticsReport.studyTimeBySubject || {}).map(([sub, mins]) => (
                          <div key={sub} className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                            <strong>{sub}</strong>
                            <span>{mins} mins</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytical diagnostics column */}
                <div className="md:col-span-2 space-y-4 text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Productivity Coaching Diagnostics</span>

                  <div className="p-5 bg-white dark:bg-slate-850 text-slate-850 dark:text-slate-100 rounded-2xl border border-slate-205 dark:border-slate-755 font-normal leading-relaxed text-xs space-y-4 prose prose-rose">
                    <div className="text-slate-700 dark:text-slate-200">
                      <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{analyticsReport.weeklyReport}</Markdown>
                    </div>

                    {analyticsReport.inconsistentHabits.length > 0 && (
                      <div className="p-3.5 bg-red-50/20 dark:bg-red-950/10 rounded-xl border border-red-500/10 dark:border-red-900/10 flex items-start gap-2 text-xs">
                        <span className="text-red-500 font-bold">● Warning:</span>
                        <div className="text-slate-600 dark:text-slate-350">
                          {analyticsReport.inconsistentHabits.map((h, i) => (
                            <p key={i}>- {h}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Create user profile goals and log study hours to assess daily diagnostics.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
