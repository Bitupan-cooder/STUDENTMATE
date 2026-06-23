import React, { useState, useEffect, useRef } from 'react';
import { useStudyStore } from '../store/useStudyStore';
import { StudyGroup, Message } from '../types';
import { Users, Plus, Key, Send, Circle, LogOut, Flame, MessageSquare, CheckSquare, Clock, Trash } from 'lucide-react';

export default function StudyGroups() {
  const {
    user,
    groups,
    activeGroup,
    fetchGroups,
    createGroup,
    joinGroup,
    sendMessage,
    syncGroupActivity,
    setActiveGroup,
    deleteGroup,
  } = useStudyStore();

  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchGroups();
    // Refresh group lists periodically
    const listTimer = setInterval(() => {
      fetchGroups();
    }, 10000);

    return () => {
      clearInterval(listTimer);
    };
  }, []);

  // Sync Activity Polling (Heartbeat loop)
  // When an activeGroup is selected, we sync current user details every 4 seconds
  useEffect(() => {
    if (activeGroup) {
      // Immediate sync
      syncGroupActivity("idle");

      syncTimerRef.current = setInterval(() => {
        // Read active progress if any, for this demo we'll send a standard synced activity
        syncGroupActivity("idle");
      }, 4000);
    } else {
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    }

    return () => {
      if (syncTimerRef.current) clearInterval(syncTimerRef.current);
    };
  }, [activeGroup?.id]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeGroup?.messages]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    await createGroup(groupName.trim());
    setGroupName('');
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    setJoinSuccess('');
    if (!joinCode.trim()) return;

    const err = await joinGroup(joinCode.trim().toUpperCase());
    if (err) {
      setJoinError(err);
    } else {
      setJoinSuccess('Successfully joined group!');
      setJoinCode('');
      setTimeout(() => setJoinSuccess(''), 3000);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeGroup) return;
    await sendMessage(typedMessage.trim());
    setTypedMessage('');
  };

  // Helper
  const getInitials = (n: string) => {
    return n.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div id="study-groups-view" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            Real-Time Study Guild Panels
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Join room cohorts using invite credentials. Experience synchronized heartbeats, chat updates, and Pomodoro collaboration targets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT COLUMN: Groups Navigation & Joins */}
        <div className="lg:col-span-1 space-y-5">

          {/* Create Guild card */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-805 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
              <Plus className="w-4 h-4 text-indigo-505" />
              <span>Create Study Cohort</span>
            </h3>
            <form onSubmit={handleCreate} className="space-y-2">
              <input
                id="group-create-input"
                type="text"
                required
                placeholder="e.g. Harvard CS Masters"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-250 dark:border-slate-755 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <button
                id="group-create-btn"
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Create Cohort
              </button>
            </form>
          </div>

          {/* Join with code card */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-805 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
              <Key className="w-4 h-4 text-indigo-555" />
              <span>Join with Invite Code</span>
            </h3>
            <form onSubmit={handleJoin} className="space-y-2">
              <input
                id="group-join-input"
                type="text"
                required
                placeholder="e.g. STEM88 or ABCD"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-250 dark:border-slate-755 text-slate-850 dark:text-slate-100 focus:outline-none font-mono uppercase"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              {joinError && <p className="text-[10px] text-red-500 font-bold leading-normal">{joinError}</p>}
              {joinSuccess && <p className="text-[10px] text-emerald-500 font-bold leading-normal">{joinSuccess}</p>}
              <button
                id="group-join-btn"
                type="submit"
                className="w-full py-2 bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-755 font-bold text-xs rounded-xl cursor-pointer"
              >
                Join Cohort
              </button>
            </form>
          </div>

          {/* Active List */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xs space-y-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">My Study Rooms</span>
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
              {groups.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setActiveGroup(g)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex justify-between items-center group ${
                    g.id === activeGroup?.id
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-200 dark:border-indigo-900 text-indigo-755 dark:text-indigo-405 font-bold shadow-xs'
                      : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs truncate">{g.name}</p>
                    <span className="text-[9px] text-slate-400 font-mono">Code: {g.code}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGroup(g.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors md:opacity-0 md:group-hover:opacity-100 opacity-100 dark:hover:bg-red-900/40"
                    title="Delete Group"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT AREA: ACTIVE GROUP CHATS & SYNCHRONIZATION LEDGER */}
        <div className="lg:col-span-3">
          {activeGroup ? (
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:h-[480px]">

              {/* Chat panel */}
              <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xs flex flex-col justify-between overflow-hidden h-[65vh] md:h-auto min-h-[400px]">
                {/* Chat header */}
                <div className="p-3.5 bg-slate-50/50 dark:bg-slate-850/30 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-xs font-black text-slate-850 dark:text-slate-50">{activeGroup.name}</h4>
                    <span className="text-[9px] text-indigo-655 font-bold font-mono">INVITE CODE: {activeGroup.code}</span>
                  </div>
                  <button
                    onClick={() => setActiveGroup(null)}
                    className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] text-slate-400 dark:text-slate-500 font-bold rounded-md flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3 text-red-405" />
                    <span>Exit Guild</span>
                  </button>
                </div>

                {/* Live Message listings */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20 dark:bg-slate-900/40">
                  {activeGroup.messages.map((m: Message) => {
                    const isSelf = m.senderEmail.toLowerCase() === user?.email.toLowerCase();
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[85%] ${isSelf ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className="flex gap-1.5 text-[9px] text-slate-400 font-bold mb-0.5 px-1">
                          <span>{m.senderName}</span>
                          <span>•</span>
                          <span>{new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isSelf
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : m.senderEmail === "system@studymate.com"
                              ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-205/30 rounded-tl-none font-bold'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-705 text-slate-800 dark:text-slate-100 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef}></div>
                </div>

                {/* Input submission */}
                <form onSubmit={handleSendChat} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <input
                    id="group-chat-input"
                    type="text"
                    required
                    placeholder="Type study coordination update..."
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-250 dark:border-slate-755 text-slate-850 dark:text-slate-100 focus:outline-none"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                  />
                  <button
                    id="group-chat-send-btn"
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

              {/* Dynamic Synchronization Ledger (Sidebar members tracking) */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-xs p-4 flex flex-col justify-between overflow-hidden h-[300px] md:h-auto">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-505" />
                    <span>Live Studiers Sync ({activeGroup.members.length})</span>
                  </span>

                  <div className="space-y-3 overflow-y-auto max-h-[360px]">
                    {activeGroup.members.map((mem) => {
                      const isOnline = new Date().getTime() - new Date(mem.lastActive).getTime() < 12000;
                      return (
                        <div key={mem.email} className="flex items-center gap-2.5 p-2 bg-slate-50/50 dark:bg-slate-800/15 rounded-xl border border-slate-100 dark:border-slate-800/60 text-left">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold overflow-hidden flex items-center justify-center relative flex-shrink-0 text-xs shadow-xs border border-white">
                            {mem.avatarUrl ? (
                              <img src={mem.avatarUrl} alt={mem.name} className="w-full h-full object-cover" />
                            ) : (
                              getInitials(mem.name)
                            )}
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          </div>

                          <div className="overflow-hidden flex-1 leading-none space-y-1">
                            <p className="text-[11px] font-black text-slate-850 dark:text-slate-100 truncate">{mem.name}</p>
                            {mem.currentActivity ? (
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
                                {mem.currentActivity.status === 'focusing' ? `⚡ focusing: ${mem.currentActivity.subject || 'CS'}` : '🌸 resting/on break'}
                              </p>
                            ) : (
                              <p className="text-[9px] text-slate-400">Idle</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center select-none pt-2 border-t border-slate-50 dark:border-slate-850">
                  ⚡ Activity heartbeats sync every 4s.
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 py-24 rounded-2xl border border-slate-205 dark:border-slate-800 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-500">No active Study Cohort panel selected</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select an existing study room on the left panel or create an invite code to coordinate Pomodoros live with other students!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
