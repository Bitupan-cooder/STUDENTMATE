import React, { useState, useEffect, useRef } from 'react';
import { useStudyStore } from '../store/useStudyStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  Flame, 
  Zap, 
  ShieldAlert, 
  Clock, 
  Check, 
  Monitor, 
  Settings, 
  Eye, 
  EyeOff, 
  Palette, 
  Minimize2, 
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PomodoroTimer() {
  const { streak, history, addPomodoroLog, fetchStreak } = useStudyStore();

  // Settings
  const [durationSetting, setDurationSetting] = useState(25); // Minutes
  const [subject, setSubject] = useState('Physics');

  // Timer run variables
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // Seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const completedSessionsCount = history.filter(h => h.date === todayStr).length;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Screensaver clock state variables
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const [screensaverBg, setScreensaverBg] = useState<'charcoal' | 'cosmic' | 'sunset' | 'forest' | 'aurora' | 'oatmeal'>('cosmic');
  const [screensaverAccent, setScreensaverAccent] = useState<'rose' | 'emerald' | 'violet' | 'cyan' | 'orange' | 'amber'>('cyan');
  const [clockStyle, setClockStyle] = useState<'analog' | 'digital'>('analog');
  const [showParticles, setShowParticles] = useState(true);
  const [showTimerHUD, setShowTimerHUD] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');

  // Synchronize initial time remaining values
  useEffect(() => {
    if (!isActive) {
      if (sessionType === 'focus') {
        setTimeRemaining(durationSetting * 60);
      } else {
        setTimeRemaining(5 * 60); // standard breaks
      }
    }
  }, [durationSetting, sessionType]);

  // Main countdown orchestrator
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Sync Current Real-World Clock Time
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const handleSessionEnd = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (sessionType === 'focus') {
      // Log focused sprint
      addPomodoroLog(durationSetting, subject);

      // Play alert noise if browser permits
      try {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {}

      // Prompt next break cycle
      setSessionType('break');
    } else {
      setSessionType('focus');
    }
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    if (sessionType === 'focus') {
      setTimeRemaining(durationSetting * 60);
    } else {
      setTimeRemaining(5 * 60);
    }
  };

  // Format Helper
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  // Percentage for progress ring SVG
  const maxTime = sessionType === 'focus' ? durationSetting * 60 : 5 * 60;
  const progressPercent = ((maxTime - timeRemaining) / maxTime) * 100;

  // Custom theme choices configuration
  const BACKGROUNDS = [
    {
      id: 'charcoal' as const,
      name: 'Charcoal Noir',
      classes: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white',
      isLight: false,
    },
    {
      id: 'cosmic' as const,
      name: 'Cosmic Nebula',
      classes: 'bg-gradient-to-br from-[#0a0a1a] via-[#111233] to-[#030308] text-white',
      isLight: false,
    },
    {
      id: 'sunset' as const,
      name: 'Deep Sunset',
      classes: 'bg-gradient-to-br from-[#1d0b0b] via-[#331212] to-[#120404] text-white',
      isLight: false,
    },
    {
      id: 'forest' as const,
      name: 'Sage Forest',
      classes: 'bg-gradient-to-br from-[#0a1e19] via-[#04281f] to-[#01100c] text-white',
      isLight: false,
    },
    {
      id: 'aurora' as const,
      name: 'Aurora Glow',
      classes: 'bg-gradient-to-br from-[#120524] via-[#1a0c32] to-[#260426] text-white',
      isLight: false,
    },
    {
      id: 'oatmeal' as const,
      name: 'Cozy Oatmeal',
      classes: 'bg-[#f7f5f0] text-slate-800 border border-slate-205 shadow-inner',
      isLight: true,
    },
  ];

  const ACCENTS = [
    {
      id: 'rose' as const,
      name: 'Hot Rose',
      hex: '#f43f5e',
      textClass: 'text-rose-500',
      bgClass: 'bg-rose-500',
      borderClass: 'border-rose-500',
    },
    {
      id: 'emerald' as const,
      name: 'Emerald Glow',
      hex: '#10b981',
      textClass: 'text-emerald-400 dark:text-emerald-400',
      bgClass: 'bg-emerald-500',
      borderClass: 'border-emerald-500',
    },
    {
      id: 'violet' as const,
      name: 'Electric Violet',
      hex: '#a78bfa',
      textClass: 'text-violet-500 dark:text-violet-400',
      bgClass: 'bg-violet-500',
      borderClass: 'border-violet-500',
    },
    {
      id: 'cyan' as const,
      name: 'Cyber Cyan',
      hex: '#22d3ee',
      textClass: 'text-cyan-500 dark:text-cyan-400',
      bgClass: 'bg-cyan-500',
      borderClass: 'border-cyan-500',
    },
    {
      id: 'orange' as const,
      name: 'Sunset Orange',
      hex: '#fb923c',
      textClass: 'text-orange-500 dark:text-orange-400',
      bgClass: 'bg-orange-500',
      borderClass: 'border-orange-500',
    },
    {
      id: 'amber' as const,
      name: 'Golden Sage',
      hex: '#f59e0b',
      textClass: 'text-amber-500 dark:text-amber-400',
      bgClass: 'bg-amber-500',
      borderClass: 'border-amber-500',
    },
  ];

  // Particle list setup
  const particlesList = useRef(
    Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 102}%`,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 10,
    }))
  ).current;

  // Active configurations
  const activeBg = BACKGROUNDS.find(b => b.id === screensaverBg) || BACKGROUNDS[0];
  const activeAccent = ACCENTS.find(a => a.id === screensaverAccent) || ACCENTS[0];

  // Helper text mapper depending on light background theme to safeguard accessibility contrast standards
  const getThemeText = (lightClass: string, darkClass: string) => {
    return activeBg.isLight ? lightClass : darkClass;
  };

  // Clock rotational calculations
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourDeg = ((hours % 12) * 30) + (minutes * 0.5);
  const minDeg = (minutes * 6) + (seconds * 0.1);
  const secDeg = seconds * 6;

  // Digital time formatting helpers for 12h vs 24h
  const getDigitalHours = () => {
    if (timeFormat === '24h') {
      return hours.toString().padStart(2, '0');
    } else {
      const formatted12 = hours % 12 || 12;
      return formatted12.toString().padStart(2, '0');
    }
  };

  const getPeriod = () => {
    return hours >= 12 ? 'PM' : 'AM';
  };

  return (
    <div id="pomodoro-timer-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5 text-left">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            Pomodoro Focus Hub
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Embark on distraction-free interval sprints. Logging a full session extends and secures your active daily learning streak.
          </p>
        </div>
        <button
          onClick={() => setIsScreensaverActive(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-550 to-purple-600 hover:from-indigo-650 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Launch Desk Clock Screensaver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TIMER DIAL CONTAINER CARD */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800 p-6 shadow-xs flex flex-col items-center justify-center space-y-6">

          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider ${
              sessionType === 'focus'
                ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-455'
                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-455'
            }`}>
              {sessionType === 'focus' ? '⚡ FOCUS SPRINT' : '🌸 REFRESH BREAK'}
            </span>
            <span className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-150 rounded-full px-2.5 py-0.5 font-bold text-slate-500 font-mono">
              Subject: {subject}
            </span>
          </div>

          {/* SVG Countdown Circle */}
          <div className="relative w-48 h-48 select-none flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                className="stroke-slate-100 dark:stroke-slate-800 fill-transparent stroke-8"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                className={`fill-transparent stroke-8 transition-all duration-300 ${
                  sessionType === 'focus' ? 'stroke-rose-500' : 'stroke-emerald-500'
                }`}
                strokeDasharray="502"
                strokeDashoffset={502 - (502 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center space-y-0.5">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter block font-mono">
                {formatTime(timeRemaining)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {isActive ? 'WORKING...' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleStartPause}
              className={`px-8 py-3.5 text-white font-black text-sm rounded-2xl transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                isActive
                  ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-605/10'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/15'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isActive ? 'Pause Interval' : 'Start Focus Session'}</span>
            </button>
          </div>

        </div>

        {/* TIMER CONFIGURATION CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-205 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-805 dark:text-slate-100 flex items-center gap-1.5 border-b border-slate-50 dark:border-slate-805 pb-3">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Interval Dashboard Configuration</span>
            </h3>

            {/* Config Subject */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Focus Subject Category</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Literature">Literature</option>
                <option value="History">History</option>
                <option value="Biology">Biology</option>
                <option value="General">General Study</option>
              </select>
            </div>

            {/* Config Length block buttons */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Focus Length (Minutes)</label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 25, 45].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setDurationSetting(mins);
                      setSessionType('focus');
                      setTimeRemaining(mins * 60);
                      setIsActive(false);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      durationSetting === mins && sessionType === 'focus'
                        ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-950'
                        : 'bg-slate-50 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400 border-slate-150 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Milestones stats display */}
            <div className="p-3.5 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                  <span>Streak days active:</span>
                </span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100">{streak?.currentStreak || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sprint runs completed today:</span>
                </span>
                <span className="font-extrabold text-slate-800 dark:text-slate-100">{completedSessionsCount}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/5 dark:bg-indigo-950/10 rounded-xl border border-indigo-100/40 dark:border-indigo-900/10 flex items-start gap-2 text-xs text-slate-505">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="leading-normal">
              <strong>Keep active focus intervals</strong> of 25 minutes daily to prevent procrastination triggers.
            </p>
          </div>
        </div>
      </div>

      {/* MULTI-FEATURABLE SCREENSAVER OVERLAY */}
      <AnimatePresence>
        {isScreensaverActive && (
          <motion.div
            id="screensaver-overlay-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none overflow-hidden transition-all duration-550 ${activeBg.classes}`}
          >
            {/* Drifting subtle particles */}
            {showParticles && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particlesList.map((p) => {
                  const themeParticleClass = activeBg.isLight ? 'bg-zinc-400/20' : 'bg-indigo-500/15';
                  return (
                    <div
                      key={p.id}
                      className={`absolute rounded-full pointer-events-none ${themeParticleClass}`}
                      style={{
                        top: p.top,
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animation: `microDrift ${p.duration}s linear infinite`,
                        animationDelay: `${p.delay}s`,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Particle Anim Styles */}
            <style>{`
              @keyframes microDrift {
                0% {
                  transform: translateY(110vh) rotate(0deg);
                  opacity: 0;
                }
                15% {
                  opacity: 0.45;
                }
                85% {
                  opacity: 0.45;
                }
                100% {
                  transform: translateY(-20vh) rotate(360deg);
                  opacity: 0;
                }
              }
            `}</style>

            {/* Navigation Header inside Screensaver */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5 text-xs font-bold font-sans">
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={`${getThemeText('text-slate-800', 'text-white/80')}`}>
                  {subject} Screensaver Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Palette configurator state */}
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isSettingsOpen
                      ? 'bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30'
                      : getThemeText('bg-zinc-200/60 hover:bg-zinc-300 text-slate-800', 'bg-white/5 hover:bg-white/10 text-white')
                  }`}
                  title="Customize Screensaver theme"
                >
                  <Palette className="w-4 h-4" />
                </button>

                {/* Return button */}
                <button
                  onClick={() => {
                    setIsScreensaverActive(false);
                    setIsSettingsOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                    getThemeText('bg-slate-200 hover:bg-slate-300 text-slate-800', 'bg-white/5 hover:bg-white/10 text-white')
                  }`}
                >
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Exit Screensaver</span>
                </button>
              </div>
            </div>

            {/* CENTRAL SCREENSAVER CLOCK FACE */}
            <div className="flex flex-col items-center justify-center space-y-6 z-10">
              
              {clockStyle === 'analog' ? (
                <div className="flex flex-col items-center justify-center space-y-5">
                  {/* Glassmorphic analog face design */}
                  <div className={`relative w-72 h-72 rounded-full border shadow-2xl transition-all duration-500 flex items-center justify-center ${
                    getThemeText(
                      'bg-white/95 border-slate-300/40 shadow-slate-300/50', 
                      'bg-white/[0.03] border-white/10 shadow-black/50'
                    )
                  }`}>
                    {/* Hour markings */}
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = i * 30;
                      const isMajor = i % 3 === 0;
                      return (
                        <div
                          key={i}
                          className="absolute inset-0 flex items-start justify-center"
                          style={{ transform: `rotate(${angle}deg)` }}
                        >
                          <div 
                            className={`w-[2.5px] rounded-full mt-3.5 transition-colors ${
                              isMajor 
                                ? getThemeText('bg-slate-800 h-3.5', 'bg-slate-100 h-3.5') 
                                : getThemeText('bg-slate-400 h-1.5', 'bg-white/20 h-1.5')
                            }`}
                          />
                        </div>
                      );
                    })}

                    {/* Clock numerals */}
                    <div className={`absolute top-8 text-xs font-extrabold tracking-tight select-none leading-none ${getThemeText('text-slate-800', 'text-slate-100')}`}>12</div>
                    <div className={`absolute right-8 text-xs font-extrabold tracking-tight select-none leading-none ${getThemeText('text-slate-800', 'text-slate-100')}`}>3</div>
                    <div className={`absolute bottom-8 text-xs font-extrabold tracking-tight select-none leading-none ${getThemeText('text-slate-800', 'text-slate-100')}`}>6</div>
                    <div className={`absolute left-8 text-xs font-extrabold tracking-tight select-none leading-none ${getThemeText('text-slate-800', 'text-slate-100')}`}>9</div>

                    {/* Rotation Hands */}
                    {/* Hour Hand */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ transform: `rotate(${hourDeg}deg)` }}
                    >
                      <div className="w-[5.5px] rounded-full" 
                           style={{ 
                             backgroundColor: activeBg.isLight ? '#1e293b' : '#f8fafc',
                             height: '62px',
                             transform: 'translateY(-25px)'
                           }} 
                      />
                    </div>

                    {/* Minute Hand */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ transform: `rotate(${minDeg}deg)` }}
                    >
                      <div className="w-[3.5px] rounded-full" 
                           style={{ 
                             backgroundColor: activeBg.isLight ? '#475569' : '#cbd5e1',
                             height: '84px',
                             transform: 'translateY(-36px)'
                           }} 
                      />
                    </div>

                    {/* Custom chosen Feature Accent Second Hand */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ transform: `rotate(${secDeg}deg)` }}
                    >
                      <div className="w-[2px] rounded-full z-30" 
                           style={{ 
                             backgroundColor: activeAccent.hex,
                             height: '98px',
                             transform: 'translateY(-39px)'
                           }} 
                      />
                      {/* Accent counter weight */}
                      <div className="w-[2px] rounded-sm mt-3.5 z-30"
                           style={{
                             backgroundColor: activeAccent.hex,
                             height: '18px',
                             transform: 'translateY(9px)'
                           }}
                      />
                    </div>

                    {/* Center cap pins */}
                    <div className={`absolute w-3 h-3 rounded-full border shadow-sm z-45 ${
                      getThemeText('bg-slate-200 border-slate-350', 'bg-zinc-900 border-white/20')
                    }`} />
                  </div>

                  {/* Dynamic digital ticking reference */}
                  <div className={`text-xs font-extrabold tracking-widest font-mono select-none px-3 py-1 rounded-full ${
                    getThemeText('bg-slate-200/60 text-slate-800', 'bg-white/5 text-slate-300')
                  }`}>
                    {getDigitalHours()}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')} {timeFormat === '12h' && getPeriod()}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-baseline gap-2 select-none">
                    <span className={`text-7xl sm:text-8xl font-black tracking-tighter leading-none ${getThemeText('text-slate-900', 'text-white drop-shadow-lg')}`}>
                      {getDigitalHours()}
                    </span>
                    <span className={`text-6xl sm:text-7xl font-bold animate-pulse leading-none filter drop-shadow-sm ${activeAccent.textClass}`}>
                      :
                    </span>
                    <span className={`text-7xl sm:text-8xl font-black tracking-tighter leading-none ${getThemeText('text-slate-900', 'text-white drop-shadow-lg')}`}>
                      {minutes.toString().padStart(2, '0')}
                    </span>
                    <span className={`text-2xl sm:text-3xl font-extrabold font-mono leading-none align-baseline ml-2 ${activeAccent.textClass}`}>
                      .{seconds.toString().padStart(2, '0')}
                    </span>
                    {timeFormat === '12h' && (
                      <span className={`text-xl sm:text-2xl font-black font-sans uppercase tracking-widest leading-none align-baseline ml-2 filter drop-shadow-xs ${activeAccent.textClass}`}>
                        {getPeriod()}
                      </span>
                    )}
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans uppercase tracking-widest border ${
                    getThemeText('bg-slate-200/50 border-slate-300 text-slate-800', 'bg-white/5 border-white/10 text-slate-300')
                  }`}>
                    {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )}

              {/* INTEGRATED POMODORO TIMER HUD OVERLAY */}
              {showTimerHUD && (
                <div className={`px-6 py-4 rounded-2xl max-w-sm w-80 sm:w-88 border backdrop-blur-md shadow-2xl transition-all flex flex-col items-center space-y-3 mr-auto ml-auto ${
                  getThemeText('bg-white/90 border-slate-300/40 shadow-slate-200/30', 'bg-black/40 border-white/10 shadow-black/40')
                }`}>
                  <div className="flex items-center gap-2 justify-between w-full">
                    <span className={`text-[9px] uppercase tracking-widest font-black ${
                      sessionType === 'focus' ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {sessionType === 'focus' ? '⚡ FOCUS RUN' : '🌸 REFRESH BREAK'}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      getThemeText('bg-slate-200 text-slate-700', 'bg-white/5 text-slate-300')
                    }`}>
                      {subject}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full gap-4 pt-1">
                    <div className="text-left">
                      <span className={`text-3xl font-black font-mono leading-none tracking-tight block ${getThemeText('text-slate-850', 'text-white')}`}>
                        {formatTime(timeRemaining)}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 block ${getThemeText('text-slate-500', 'text-white/40')}`}>
                        {isActive ? 'WORKING SPRINT' : 'PAUSED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleStartPause}
                        className={`p-2.5 rounded-full text-white transition-all shadow-md cursor-pointer ${
                          isActive 
                            ? 'bg-slate-705 dark:bg-stone-800 hover:brightness-110' 
                            : activeAccent.bgClass + ' hover:brightness-110 shadow-lg'
                        }`}
                        title={isActive ? 'Pause Study' : 'Resume Focus'}
                      >
                        {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      <button
                        onClick={handleReset}
                        className={`p-2.5 rounded-full transition-all border cursor-pointer ${
                          getThemeText('bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800', 'bg-white/5 hover:bg-white/10 border-white/10 text-white')
                        }`}
                        title="Reset countdown"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COLLAPSIBLE VISUAL OPTIONS AND FEATURES DRAWER */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  id="screensaver-settings-card"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  className={`absolute right-4 top-20 bottom-4 w-72 p-5 rounded-2xl border backdrop-blur-md shadow-2xl flex flex-col justify-between overflow-y-auto z-40 transition-all ${
                    getThemeText('bg-white/95 border-slate-205 shadow-slate-200/60', 'bg-zinc-950/85 border-white/10 shadow-black/60')
                  }`}
                >
                  <div className="space-y-5 text-left">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between border-b pb-2"
                         style={{ borderColor: activeBg.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                      <h4 className={`text-xs font-black uppercase tracking-wider ${getThemeText('text-slate-800', 'text-white')}`}>
                        Screensaver Config
                      </h4>
                      <button
                        onClick={() => setIsSettingsOpen(false)}
                        className={`p-1 rounded-md transition-colors ${getThemeText('hover:bg-slate-200 text-slate-500', 'hover:bg-white/10 text-white/50')}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Clock style picker */}
                    <div className="space-y-1.5">
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${getThemeText('text-slate-500', 'text-white/40')}`}>
                        Clock Style Mode
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setClockStyle('analog')}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            clockStyle === 'analog'
                              ? activeAccent.bgClass + ' text-white border-transparent'
                              : getThemeText('bg-slate-200/50 text-slate-700 border-slate-200 hover:bg-slate-200', 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10')
                          }`}
                        >
                          Analog style
                        </button>
                        <button
                          onClick={() => setClockStyle('digital')}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            clockStyle === 'digital'
                              ? activeAccent.bgClass + ' text-white border-transparent'
                              : getThemeText('bg-slate-200/50 text-slate-700 border-slate-200 hover:bg-slate-200', 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10')
                          }`}
                        >
                          Digital style
                        </button>
                      </div>
                    </div>

                    {/* Time Display Format picker (12h vs 24h) */}
                    <div className="space-y-1.5">
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${getThemeText('text-slate-500', 'text-white/40')}`}>
                        Time Display Format
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setTimeFormat('12h')}
                          className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer text-center truncate ${
                            timeFormat === '12h'
                              ? activeAccent.bgClass + ' text-white border-transparent'
                              : getThemeText('bg-slate-200/50 text-slate-700 border-slate-200 hover:bg-slate-200', 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10')
                          }`}
                          title="12-Hour standard with AM/PM format (Common in India)"
                        >
                          12-Hr (AM/PM)
                        </button>
                        <button
                          onClick={() => setTimeFormat('24h')}
                          className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer text-center truncate ${
                            timeFormat === '24h'
                              ? activeAccent.bgClass + ' text-white border-transparent'
                              : getThemeText('bg-slate-200/50 text-slate-700 border-slate-200 hover:bg-slate-200', 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10')
                          }`}
                          title="24-Hour continuous format (Railway standard)"
                        >
                          24-Hr format
                        </button>
                      </div>
                    </div>

                    {/* Background selections */}
                    <div className="space-y-1.5">
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${getThemeText('text-slate-500', 'text-white/40')}`}>
                        Theme Background Space
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {BACKGROUNDS.map((bg) => (
                          <button
                            key={bg.id}
                            onClick={() => setScreensaverBg(bg.id)}
                            className={`flex items-center gap-1.5 p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-left truncate ${
                              screensaverBg === bg.id
                                ? 'border-indigo-400 dark:border-indigo-500 text-indigo-600 bg-indigo-50/10'
                                : getThemeText('bg-slate-250/20 border-slate-200 text-slate-800 hover:bg-slate-150', 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10')
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${bg.classes}`} />
                            <span className="truncate">{bg.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Features color accents */}
                    <div className="space-y-1.5">
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${getThemeText('text-slate-500', 'text-white/40')}`}>
                        Custom Features Color Accent
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {ACCENTS.map((acc) => (
                          <button
                            key={acc.id}
                            onClick={() => setScreensaverAccent(acc.id)}
                            className={`flex items-center justify-center gap-1 p-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer text-center group ${
                              screensaverAccent === acc.id
                                ? 'border-indigo-505 bg-indigo-50/10'
                                : getThemeText('bg-slate-250/20 border-slate-202 hover:bg-slate-150', 'bg-white/5 border-white/5 hover:bg-white/10')
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: acc.hex }} />
                            <span className={`truncate ${getThemeText('text-slate-800', 'text-white/80')}`}>{acc.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-2 border-t pt-3.5 text-left"
                         style={{ borderColor: activeBg.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                      <label className="flex items-center justify-between cursor-pointer select-none">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${getThemeText('text-slate-700', 'text-slate-300')}`}>
                          Drifting Stars
                        </span>
                        <input
                          type="checkbox"
                          checked={showParticles}
                          onChange={(e) => setShowParticles(e.target.checked)}
                          className="w-4 h-4 text-indigo-500 border-slate-300 dark:border-slate-800 rounded-sm focus:ring-indigo-500 cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer select-none">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${getThemeText('text-slate-700', 'text-slate-300')}`}>
                          Activity Focus HUD
                        </span>
                        <input
                          type="checkbox"
                          checked={showTimerHUD}
                          onChange={(e) => setShowTimerHUD(e.target.checked)}
                          className="w-4 h-4 text-indigo-500 border-slate-300 dark:border-slate-800 rounded-sm focus:ring-indigo-500 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t"
                       style={{ borderColor: activeBg.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                    <p className={`text-[9px] font-medium leading-normal ${getThemeText('text-slate-400', 'text-indigo-200/40')}`}>
                      Perfect for placing on your desk when pursuing extensive learning blocks.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

