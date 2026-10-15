'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { X, Lock, Mail, User as UserIcon, GraduationCap, Sparkles, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogin,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'profile'>('signin');
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

    if (mode !== 'profile' && password.length < 6) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#18181b] border border-gray-800 rounded-2xl shadow-2xl p-6 text-gray-100 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {mode === 'signin' ? 'Sign In to Hub' : mode === 'signup' ? 'Create Student Account' : 'Student Profile'}
              </h3>
              <p className="text-xs text-gray-400">AI Study & Productivity Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#121214] p-1 rounded-lg mb-5 border border-white/5">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'signin' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setMode('profile'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            My Profile
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {(mode === 'signup' || mode === 'profile') && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-9 pr-3 py-2 bg-[#232328] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3 py-2 bg-[#232328] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {mode !== 'profile' && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-[#232328] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {(mode === 'signup' || mode === 'profile') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Field / Major</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full pl-9 pr-2 py-2 bg-[#232328] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target Hours/Wk</label>
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#232328] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-lg shadow-blue-600/30 transition-all"
          >
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Save Profile Changes'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#18181b] px-2 text-gray-500">Or quick test</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Sign In with 1-Click Demo Student Account
        </button>
      </div>
    </div>
  );
};
