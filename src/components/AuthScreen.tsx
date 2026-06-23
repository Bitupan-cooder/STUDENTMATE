import React, { useState } from 'react';
import { useStudyStore } from '../store/useStudyStore';
import { Mail, Shield, BookOpen, Star, Sparkles, User, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import BackgroundEffects from './BackgroundEffects';

export default function AuthScreen() {
  const login = useStudyStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);
    const success = await login(email, name || email.split('@')[0]);
    setIsLoading(false);
    if (!success) {
      setError('Authentication failed. Please verify the credentials.');
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await login('studymate_demo@gmail.com', 'Alex Rivera', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
    setIsLoading(false);
  };

  return (
    <div id="auth-screen" className="relative min-h-screen bg-[#010101] text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* 3D background effects - video loop + starry canvases */}
      <BackgroundEffects />

      {/* Floating static particles in front of overlay */}
      <div className="absolute inset-0 bg-[#010101]/40 z-1" />

      {/* Header static navigation bar */}
      <motion.header 
        className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/5 select-none md:sticky md:top-0 bg-[#010101]/90"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <span className="font-syncopate text-xl font-bold text-white tracking-widest uppercase select-none cursor-default">
            STUDENTMATE
          </span>
        </div>
      </motion.header>

      {/* Main landing contents mixed with login control panels */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column hero information */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#E21227] text-white text-[10px] uppercase font-marvel tracking-widest font-black px-3.5 py-1.5 rounded shadow-lg transform -skew-x-6 border border-white/10">
              <span>Next Generation Learning Engine</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-marvel tracking-normal uppercase leading-[1.08] text-white">
              With great knowledge{' '}
              <span className="relative inline-block text-white">
                <span className="absolute bottom-2 left-0 right-0 h-4 bg-[#E21227] -skew-x-6 z-0" />
                <span className="relative z-10 px-2">comes with</span>
              </span>{' '}
              ,Great Consistency
            </h1>

            <p className="text-neutral-400 text-sm md:text-base max-w-xl leading-relaxed font-sans pt-2">
              StudentMate helps you build your ultimate high-focus academic environment. Keep your streaks active, sync with guilds, collaborate on notebooks, and master any discipline with consistent, daily practice.
            </p>
          </motion.div>

          {/* Fixed cards section at bottom of left core */}
          <motion.div 
            id="core-companions" 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 select-none"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-5 bg-neutral-950 border border-neutral-800 hover:border-[#E21227] rounded-xl transition-all group">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-center flex items-center justify-center mb-3 group-hover:bg-[#E21227] group-hover:text-white transition-all text-xs font-bold text-[#E21227]">
                💬
              </div>
              <h3 className="text-xs uppercase font-marvel tracking-wider font-extrabold text-white">Mentor Engine</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                Personalized study profiles with custom formatting for step-by-step solutions.
              </p>
            </div>

            <div className="p-5 bg-neutral-950 border border-neutral-800 hover:border-[#E21227] rounded-xl transition-all group">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-center flex items-center justify-center mb-3 group-hover:bg-[#E21227] group-hover:text-white transition-all text-xs font-bold text-[#E21227]">
                🔍
              </div>
              <h3 className="text-xs uppercase font-marvel tracking-wider font-extrabold text-white">Semantic Search</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                Sourced facts research hub scans note files to find cross-referenced citations.
              </p>
            </div>

            <div className="p-5 bg-neutral-950 border border-neutral-800 hover:border-[#E21227] rounded-xl transition-all group">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-center flex items-center justify-center mb-3 group-hover:bg-[#E21227] group-hover:text-white transition-all text-xs font-bold text-[#E21227]">
                📊
              </div>
              <h3 className="text-xs uppercase font-marvel tracking-wider font-extrabold text-white">Diagnostics</h3>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                Automation habit assessment tracks Pomodoros, streak multipliers, and pending dues.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right column signup card panel */}
        <motion.div 
          id="auth-panel" 
          className="lg:col-span-5 flex justify-center w-full relative z-20"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full max-w-md bg-black border-2 border-[#E21227] rounded-2xl p-8 shadow-2xl relative">
            <div className="text-left mb-6 space-y-1">
              <h2 className="text-xl font-black font-marvel text-[#E21227] tracking-wider uppercase flex items-center gap-2">
                STUDENT TERMINAL
              </h2>
              <p className="text-neutral-400 text-xs">
                Instate credentials to mount notebooks, daily objectives, and habit tracking.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="text-left space-y-1">
                <label className="block text-[10px] uppercase font-bold text-neutral-400 font-marvel tracking-wider">
                  Student Name (Optional)
                </label>
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-white focus:outline-none focus:ring-1 focus:ring-[#E21227] focus:border-[#E21227] text-xs transition-all placeholder:text-neutral-600 font-mono"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="text-left space-y-1">
                <label className="block text-[10px] uppercase font-bold text-neutral-400 font-marvel tracking-wider">
                  Academic Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    placeholder="alex.rivera@university.edu"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-white focus:outline-none focus:ring-1 focus:ring-[#E21227] focus:border-[#E21227] text-xs transition-all placeholder:text-neutral-600 font-mono"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <p className="text-[10px] text-[#E21227] font-mono bg-[#E21227]/10 p-2.5 rounded border border-[#E21227]/20 text-left">
                  ERROR: {error}
                </p>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#E21227] hover:bg-[#b00e1e] text-white font-marvel uppercase tracking-wider font-extrabold rounded-lg text-xs transition-all shadow-md select-none disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transform -skew-x-4 border border-white/10"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5 text-center text-[10px] font-marvel font-black uppercase tracking-widest text-neutral-500">
              <span className="relative z-10 px-3 bg-black">OR QUICK DEMO</span>
              <div className="absolute top-1/2 left-0 right-0 h-[10px] border-t border-neutral-800"></div>
            </div>

            {/* Single button simulate demo access */}
            <button
              id="auth-demo-btn"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-3 bg-white hover:bg-neutral-100 text-black rounded-lg text-xs font-marvel uppercase tracking-wider font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer transform -skew-x-4"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                alt="Google Icon"
                className="w-4 h-4 object-contain"
              />
              <span>Explore Demo Environment</span>
            </button>

            <div className="mt-5 p-3.5 bg-neutral-950 border border-neutral-850 rounded-xl flex items-start gap-2 text-left">
              <Shield className="w-3.5 h-3.5 text-[#E21227] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-neutral-400 leading-normal font-sans">
                <strong>Workspace Security Protocol</strong>: Local records are persistently cached securely. Direct chat tokens and session caches are encrypted.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 py-6 px-6 md:px-12 text-center text-[10px] text-neutral-500 font-mono border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; STUDENTMATE LABS. ALL RIGHTS RESERVED.</span>
          <span className="text-[#E21227] font-semibold">SECURE AUTHENTICATION MATRIX ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
