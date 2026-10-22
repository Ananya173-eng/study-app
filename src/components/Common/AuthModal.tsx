'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  GraduationCap,
  Sparkles,
  CheckCircle,
  Zap,
  ShieldCheck,
  ArrowRight,
  LogOut,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onLogin: (user: User) => void;
  onSignOut?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogin,
  onSignOut,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState(currentUser.major || 'Computer Science & AI');
  const [weeklyGoal, setWeeklyGoal] = useState(currentUser.targetWeeklyHours || 25);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid student or institutional email address.');
      return;
    }

    if (mode === 'signup' && (!name || name.trim().length < 2)) {
      setError('Please provide your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      name: name || 'Student User',
      email: email,
      major: major,
      targetWeeklyHours: Number(weeklyGoal),
      streakDays: currentUser.streakDays || 1,
    };

    onLogin(updatedUser);
    setSuccess(mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
    setTimeout(() => {
      setSuccess('');
      onClose();
    }, 600);
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      id: 'demo_student',
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      major: 'Computer Science & AI',
      targetWeeklyHours: 25,
      streakDays: 7,
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-slate-100">
        {/* Left Visual Column with AI Study Hero Image */}
        <div className="relative w-full md:w-5/12 bg-cover bg-center min-h-[220px] md:min-h-[540px] flex flex-col justify-between p-6 md:p-8 overflow-hidden select-none">
          {/* Background image & gradient overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 filter brightness-90"
            style={{ backgroundImage: `url('/images/ai_study_hero.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/80 md:block hidden" />

          {/* Top Badge */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-fuchsia-300 border border-fuchsia-500/30 backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              ✦ AI Study Hub
            </span>
          </div>

          {/* Bottom Overlay Text */}
          <div className="relative z-10 space-y-2 mt-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
              Elevate your academic workflow.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed drop-shadow">
              Synthesize notes, master complex syllabus topics with MCQs & 3D flashcards, and chat with your PDFs using RAG.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                ⚡ Intent-Driven
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                🧠 Context-Aware
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 backdrop-blur-sm">
                🎯 Active Recall
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-slate-950/60 backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {mode === 'signin' ? 'Welcome Back' : 'Create Student Account'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign in to access your notes, tasks, and uploaded PDFs
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs & Sign-Out feature */}
            <div className="flex bg-slate-950 p-1 rounded-xl my-4 border border-slate-800 gap-1.5">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signin' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signup' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
              {onSignOut && (
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-red-400 hover:text-red-300 hover:bg-red-500/15 flex items-center justify-center gap-1.5 border border-red-500/20"
                  title="Sign Out of Workspace"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

            {error && (
              <div className="mb-3.5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-3.5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#9aa2b4] mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Student Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Major / Field</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="Computer Science"
                        className="w-full pl-9 pr-2 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Target Hours/Wk</label>
                    <input
                      type="number"
                      min="5"
                      max="80"
                      value={weeklyGoal}
                      onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Student Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* 1-Click Demo Login Button */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2 group shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-fuchsia-400 group-hover:rotate-12 transition-transform" />
              <span>Sign In with 1-Click Demo Student Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
