'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Code2,
  Brain,
  PenTool,
  Calendar,
  Zap,
  CheckCircle2,
  Check,
  ChevronRight,
  Flame,
  Search,
  LayoutDashboard,
  Layers,
  GraduationCap,
  FileText,
  Clock,
  Compass,
  Menu,
  X,
  Play,
  ShieldCheck,
  Cpu,
  FileSpreadsheet,
  Edit3,
  Target,
  Key,
  RefreshCw,
  Lock,
  CheckSquare,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { ViewType } from '@/types';

interface AIStudyHubLandingProps {
  onOpenApp: (view?: ViewType) => void;
  onOpenAuth: () => void;
}

export function AIStudyHubLanding({ onOpenApp, onOpenAuth }: AIStudyHubLandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDomain, setActiveDomain] = useState<'writing' | 'coding' | 'productivity' | 'research' | 'planner'>('writing');
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  // Dynamic sample prompts for the dashboard mockup
  const samplePrompts = [
    {
      prompt: "Summarize key algorithms in Discrete Math for my final exam...",
      plan: "Graph Theory & Trees",
      progress: 75,
      nextQuiz: "Data Structures",
      confidence: "92% Ready",
      mode: "Active Recall Mode"
    },
    {
      prompt: "Generate 10 flashcards for Organic Chemistry reaction mechanisms...",
      plan: "Electrophilic Addition & SN1/SN2",
      progress: 88,
      nextQuiz: "Stereochemistry",
      confidence: "96% Ready",
      mode: "Spaced Repetition"
    },
    {
      prompt: "Break down Macroeconomics Monetary Policy into 5 study sprints...",
      plan: "Central Banking & Inflation Models",
      progress: 64,
      nextQuiz: "Fiscal Multipliers",
      confidence: "89% Ready",
      mode: "Sprint Planner"
    }
  ];

  const currentMockup = samplePrompts[activePromptIndex];

  return (
    <div className="relative min-h-screen font-sans bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white antialiased overflow-x-hidden">
      {/* Background ambient glowing orbs & grid - Exact match to aistudyhub.org */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950" aria-hidden="true">
        {/* Top-center ambient indigo bloom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        
        {/* Top-left animated fuchsia orb */}
        <div className="absolute -top-32 -left-20 w-[30rem] h-[30rem] bg-gradient-to-tr from-fuchsia-600/30 via-violet-600/20 to-indigo-500/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        
        {/* Right animated cyan/blue orb */}
        <div className="absolute top-1/3 -right-20 w-[28rem] h-[28rem] bg-gradient-to-b from-blue-600/20 via-cyan-500/20 to-violet-600/20 rounded-full blur-3xl opacity-40 animate-pulse [animation-delay:2s]" />
        
        {/* Bottom purple orb */}
        <div className="absolute bottom-10 left-1/3 w-[22rem] h-[22rem] bg-gradient-to-tr from-purple-600/20 via-indigo-500/20 to-pink-500/20 rounded-full blur-3xl opacity-30 animate-pulse [animation-delay:4s]" />
        
        {/* Geometric subtle grid mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 py-4">
        <nav className="flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 font-extrabold text-lg leading-none">
                  ✦
                </span>
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-slate-200 transition-colors">
              AI Study Hub
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#tools" className="hover:text-white transition-colors duration-200">
              Tools
            </a>
            <a href="#about" className="hover:text-white transition-colors duration-200">
              About Us
            </a>
          </div>

          {/* Right Header Buttons */}
          <div className="flex items-center gap-3">
            {/* Quick App Launcher Button */}
            <button
              onClick={() => onOpenApp('dashboard')}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open Web App</span>
            </button>

            {/* Gradient Outline 'Get Started' Button */}
            <button
              onClick={onOpenAuth}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 p-[1px] font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="px-5 py-2 rounded-[11px] bg-slate-950 text-white group-hover:bg-transparent transition-colors duration-300">
                Get Started
              </div>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pt-4 pb-6 bg-slate-950/95 border-b border-slate-800 backdrop-blur-2xl flex flex-col gap-4 animate-fade-in">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white font-medium py-1"
            >
              Features
            </a>
            <a
              href="#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white font-medium py-1"
            >
              Tools
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white font-medium py-1"
            >
              About Us
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApp('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-semibold text-sm text-slate-200"
              >
                Launch Study Workspace
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-center font-bold text-sm text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* 1. HERO SECTION */}
        <section className="relative z-10 pt-16 pb-12 md:pt-24 md:pb-20 px-6 flex flex-col items-center justify-center text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-purple-300 mb-8 backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 animate-ping" />
            <span>Next-Gen Academic Intelligence</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Study Smarter with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-fuchsia-400">
              AI Tools
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-400 font-normal mb-10 leading-relaxed">
            Discover powerful AI assistants tailored for student success—from deep essay synthesis and active recall planning to fast code execution.
          </p>

          {/* Action CTAs */}
          <div className="flex gap-4 flex-col sm:flex-row justify-center w-full max-w-sm sm:max-w-none">
            <a
              href="#tools"
              className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Explore Tools
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center bg-slate-900/80 border border-slate-800 backdrop-blur-md px-8 py-3.5 text-slate-200 font-semibold rounded-xl hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all duration-200 shadow-sm"
            >
              Learn More
            </a>
          </div>

          {/* Interactive Preset Chips to try the dashboard mockup */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium mr-1">Try live scenarios:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePromptIndex(idx)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  activePromptIndex === idx
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {idx === 0 ? 'Discrete Math' : idx === 1 ? 'Organic Chemistry' : 'Macroeconomics'}
              </button>
            ))}
          </div>

          {/* 2. DASHBOARD PREVIEW CARD (MATCHES ATTACHED SCREENSHOT EXACTLY) */}
          <div className="w-full max-w-5xl mx-auto mt-10 relative group">
            {/* Ambient aura glow behind card */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            
            {/* Glass Container */}
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden">
              {/* Window Header Bar */}
              <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500/30" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/30" />
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  aistudyhub.ai/dashboard
                </div>
                <button
                  onClick={() => onOpenApp('dashboard')}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Dashboard Content Grid */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Left 2 Columns */}
                <div className="md:col-span-2 space-y-4">
                  {/* AI Prompt Input Pill */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/40 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                      AI
                    </div>
                    <p className="text-xs text-slate-300 font-mono italic">
                      &quot;{currentMockup.prompt}&quot;
                    </p>
                  </div>

                  {/* Study Plan Generated Box */}
                  <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Study Plan Generated
                      </span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-medium">
                        {currentMockup.mode}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-700 rounded-full"
                          style={{ width: `${currentMockup.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span className="font-medium text-slate-300">{currentMockup.plan}</span>
                        <span className="font-semibold text-purple-300">{currentMockup.progress}% Mastered</span>
                      </div>
                    </div>
                  </div>

                  {/* Stat Cards in Dashboard */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Next Quiz</span>
                      <span className="text-sm font-semibold text-slate-200">
                        {currentMockup.nextQuiz}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-0.5">AI Confidence</span>
                      <span className="text-sm font-semibold text-emerald-400">
                        {currentMockup.confidence}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Quick Assistants */}
                <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                      Quick Assistants
                    </span>

                    <div className="space-y-2.5">
                      {/* Assistant 1 */}
                      <button
                        onClick={() => onOpenApp('ai-summarizer')}
                        className="w-full text-left p-3 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-all flex items-center justify-between group/card"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover/card:text-white">
                            Essay Architect
                          </div>
                          <div className="text-[10px] font-mono text-fuchsia-400 font-medium">Writing</div>
                        </div>
                        <span className="text-slate-500 group-hover/card:text-slate-300 group-hover/card:translate-x-0.5 transition-all text-xs">
                          →
                        </span>
                      </button>

                      {/* Assistant 2 */}
                      <button
                        onClick={() => onOpenApp('ai-assistant')}
                        className="w-full text-left p-3 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-all flex items-center justify-between group/card"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover/card:text-white">
                            Code Debugger
                          </div>
                          <div className="text-[10px] font-mono text-blue-400 font-medium">Coding</div>
                        </div>
                        <span className="text-slate-500 group-hover/card:text-slate-300 group-hover/card:translate-x-0.5 transition-all text-xs">
                          →
                        </span>
                      </button>

                      {/* Assistant 3 */}
                      <button
                        onClick={() => onOpenApp('materials')}
                        className="w-full text-left p-3 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 transition-all flex items-center justify-between group/card"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover/card:text-white">
                            Research Synthesizer
                          </div>
                          <div className="text-[10px] font-mono text-purple-400 font-medium">Research</div>
                        </div>
                        <span className="text-slate-500 group-hover/card:text-slate-300 group-hover/card:translate-x-0.5 transition-all text-xs">
                          →
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenApp('dashboard')}
                    className="mt-4 w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Launch Full Interactive Workspace</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. METRICS / STATS SECTION */}
        <section className="relative z-10 py-12 md:py-16 flex justify-center px-6 max-w-5xl mx-auto">
          <div className="w-full bg-slate-900/50 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-800/80 px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
            <div className="pt-4 md:pt-0">
              <span className="block text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
                10K+
              </span>
              <span className="text-slate-400 text-sm font-medium mt-2 block">
                Students Empowered
              </span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-300">
                100+
              </span>
              <span className="text-slate-400 text-sm font-medium mt-2 block">
                Integrated AI Workflows
              </span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
                24/7
              </span>
              <span className="text-slate-400 text-sm font-medium mt-2 block">
                Productivity Acceleration
              </span>
            </div>
          </div>
        </section>

        {/* 4. AI FEATURES BUILT FOR MODERN SCHOLARS */}
        <section id="features" className="relative z-10 px-6 py-16 md:py-24 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              AI Features Built for Modern Scholars
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Tailored tools designed to simplify complex subjects and supercharge your academic output.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1: AI Writing Assistant */}
            <div
              onClick={() => onOpenApp('ai-summarizer')}
              className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 flex flex-col gap-4 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:border-indigo-500/50">
                <svg className="w-7 h-7 text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M11 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                  <path d="M18.5 2a2.121 2.121 0 1 1 3 3L12 14l-4 1 1-4Z" />
                </svg>
              </div>
              <div className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                AI Writing Assistant
              </div>
              <div className="text-slate-400 text-sm leading-relaxed font-normal">
                Craft essays and research assignments with advanced AI-powered writing, structure, and citation assistance.
              </div>
              <div className="mt-auto pt-2 text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Feature</span>
                <span>→</span>
              </div>
            </div>

            {/* Feature 2: Smart Study Planner */}
            <div
              onClick={() => onOpenApp('ai-planner')}
              className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 flex flex-col gap-4 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:border-indigo-500/50">
                <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="4" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Smart Study Planner
              </div>
              <div className="text-slate-400 text-sm leading-relaxed font-normal">
                Organize your study schedule, manage exam deadlines, and optimize revision with intelligent active recall prompts.
              </div>
              <div className="mt-auto pt-2 text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Feature</span>
                <span>→</span>
              </div>
            </div>

            {/* Feature 3: Productivity Assistant */}
            <div
              onClick={() => onOpenApp('ai-assistant')}
              className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 flex flex-col gap-4 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:border-indigo-500/50">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Productivity Assistant
              </div>
              <div className="text-slate-400 text-sm leading-relaxed font-normal">
                Boost focus, prioritize heavy course workloads, and conquer academic burnout with personalized AI coaching.
              </div>
              <div className="mt-auto pt-2 text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Feature</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FEATURED AI ENGINES */}
        <section id="tools" className="relative z-10 px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Featured AI Engines
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Direct access to the world&apos;s most powerful productivity platforms.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {/* Tool 1: ChatGPT */}
            <div className="group bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-start border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                C
              </div>
              <div className="font-bold text-lg text-white mb-2">ChatGPT</div>
              <div className="text-slate-400 text-sm font-normal mb-6 leading-relaxed">
                Cutting-edge conversational AI for essays, brainstorming, and complex problem Q&amp;A.
              </div>
              <a
                href="https://chatgpt.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full text-center px-4 py-2.5 bg-slate-800/80 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-fuchsia-500 text-slate-200 hover:text-white rounded-xl font-semibold text-xs border border-slate-700/80 hover:border-transparent transition-all duration-200 shadow-sm"
              >
                Open External Tool ↗
              </a>
            </div>

            {/* Tool 2: Claude */}
            <div className="group bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-start border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                C
              </div>
              <div className="font-bold text-lg text-white mb-2">Claude</div>
              <div className="text-slate-400 text-sm font-normal mb-6 leading-relaxed">
                Advanced text model for deep synthesis, paper summaries, and technical writing.
              </div>
              <a
                href="https://claude.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full text-center px-4 py-2.5 bg-slate-800/80 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-fuchsia-500 text-slate-200 hover:text-white rounded-xl font-semibold text-xs border border-slate-700/80 hover:border-transparent transition-all duration-200 shadow-sm"
              >
                Open External Tool ↗
              </a>
            </div>

            {/* Tool 3: Cursor AI */}
            <div className="group bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-start border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                C
              </div>
              <div className="font-bold text-lg text-white mb-2">Cursor AI</div>
              <div className="text-slate-400 text-sm font-normal mb-6 leading-relaxed">
                AI-native code editor designed to accelerate programming coursework.
              </div>
              <a
                href="https://www.cursor.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full text-center px-4 py-2.5 bg-slate-800/80 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-fuchsia-500 text-slate-200 hover:text-white rounded-xl font-semibold text-xs border border-slate-700/80 hover:border-transparent transition-all duration-200 shadow-sm"
              >
                Open External Tool ↗
              </a>
            </div>

            {/* Tool 4: Notion AI */}
            <div className="group bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-start border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                N
              </div>
              <div className="font-bold text-lg text-white mb-2">Notion AI</div>
              <div className="text-slate-400 text-sm font-normal mb-6 leading-relaxed">
                Smart workspace organization for integrated study plans and lecture summaries.
              </div>
              <a
                href="https://www.notion.so/product/ai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full text-center px-4 py-2.5 bg-slate-800/80 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-fuchsia-500 text-slate-200 hover:text-white rounded-xl font-semibold text-xs border border-slate-700/80 hover:border-transparent transition-all duration-200 shadow-sm"
              >
                Open External Tool ↗
              </a>
            </div>
          </div>
        </section>

        {/* 6. EXPLORE BY LEARNING DOMAIN */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
              Explore by Learning Domain
            </h2>
            <p className="text-slate-400 text-sm">
              Select a category to view specialized assistants and guides.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => {
                setActiveDomain('writing');
                onOpenApp('ai-summarizer');
              }}
              className="flex items-center bg-slate-900/80 backdrop-blur-xl px-6 py-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 font-semibold text-sm text-slate-200 hover:text-white shadow-lg gap-3"
            >
              <span className="text-lg">✏️</span>
              <span>Writing</span>
            </button>

            <button
              onClick={() => {
                setActiveDomain('coding');
                onOpenApp('ai-assistant');
              }}
              className="flex items-center bg-slate-900/80 backdrop-blur-xl px-6 py-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 font-semibold text-sm text-slate-200 hover:text-white shadow-lg gap-3"
            >
              <span className="text-lg">💻</span>
              <span>Coding</span>
            </button>

            <button
              onClick={() => {
                setActiveDomain('productivity');
                onOpenApp('tasks');
              }}
              className="flex items-center bg-slate-900/80 backdrop-blur-xl px-6 py-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 font-semibold text-sm text-slate-200 hover:text-white shadow-lg gap-3"
            >
              <span className="text-lg">🚀</span>
              <span>Productivity</span>
            </button>

            <button
              onClick={() => {
                setActiveDomain('research');
                onOpenApp('materials');
              }}
              className="flex items-center bg-slate-900/80 backdrop-blur-xl px-6 py-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 font-semibold text-sm text-slate-200 hover:text-white shadow-lg gap-3"
            >
              <span className="text-lg">📚</span>
              <span>Research</span>
            </button>

            <button
              onClick={() => {
                setActiveDomain('planner');
                onOpenApp('ai-planner');
              }}
              className="flex items-center bg-slate-900/80 backdrop-blur-xl px-6 py-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 hover:scale-105 transition-all duration-200 font-semibold text-sm text-slate-200 hover:text-white shadow-lg gap-3"
            >
              <span className="text-lg">📅</span>
              <span>Study Planner</span>
            </button>
          </div>
        </section>



        {/* 8. ABOUT US & HOW IT WORKS SECTION */}
        <section id="about" className="relative z-10 px-6 py-20 md:py-28 max-w-6xl mx-auto scroll-mt-20">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Platform Architecture & Purpose</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              About AI Study Hub & How It Works
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Discover how our Google Gemini-driven cognitive engine transforms complex study materials into active retention, structured notes, and productive daily execution.
            </p>
          </div>

          {/* Part 1: How the Platform Works (3-Step Pipeline) */}
          <div className="mb-16">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>The End-to-End Workflow</span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm mb-4">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                    <span>Upload & Ingestion</span>
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Import lecture slides, research papers, or syllabus PDFs. The system runs an instant client/server extraction and hashes every document with cryptographic SHA-256 to prevent duplicate clutter.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  Fast parsing • Duplicate detection
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 bg-purple-950/10 hover:border-purple-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm mb-4">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Gemini AI Synthesis</span>
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Our server-side Gemini 3.8 Flash pipeline analyzes your content semantically. It breaks complex topics down into key takeaways, creates active-recall quiz cards, and builds milestone roadmaps.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-purple-400 font-mono">
                  gemini-3.8-flash • Enterprise Fallback
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm mb-4">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Retention & Execution</span>
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Study with distraction-free normal text notes, test yourself with instant interactive quizzes, and stay disciplined with 7-day study consistency streaks and weekly milestone hours.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                  Active recall • Habit formation
                </div>
              </div>
            </div>
          </div>

          {/* Part 2: How Google Gemini API is Integrated & Why It Matters */}
          <div className="mb-16 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/30 rounded-2xl border border-indigo-500/20 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                  Core AI Infrastructure
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Powered by Google Gemini Intelligence
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  API Active & Verified
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                  gemini-3.8-flash
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Secure Server-Side Route</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Your Gemini API key is safeguarded exclusively within backend environment variables (<code className="text-indigo-300 bg-indigo-950/40 px-1 py-0.5 rounded text-[11px]">/api/ai</code>), preventing public browser exposure and keeping your academic queries completely confidential.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Fail-Safe Multi-Tier Recovery</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    If Google Gemini encounters network throttling or quota boundaries (HTTP 429), our adaptive dispatcher gracefully falls back to secondary model tiers and local academic heuristic synthesizers. Your revision session never crashes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-1">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Deep Academic Reasoning</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Unlike generic chat models, our prompts configure Gemini to act as an expert Socratic tutor—evaluating syllabus context, highlighting conceptual traps, and generating rigorous multiple-choice assessments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">Sub-Second Active Response</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Leveraging Google's low-latency 2026 Flash architecture, full document summaries and 10-question quizzes are generated in under 2 seconds, maintaining smooth flow state during intensive revision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Part 3: How Core Features Skyrocket Student Productivity */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>How Each Feature Boosts Your Academic Performance</span>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Feature 1: Study Materials */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Smart Study Materials & Duplicate Shield</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">The Problem:</span>
                    <p className="text-slate-400 leading-relaxed">
                      Students waste 30+ minutes hunting for files or re-downloading identical PDFs with different names, cluttering their workspace.
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-400 block mb-1">The AI Study Hub Solution:</span>
                    <p className="text-slate-400 leading-relaxed">
                      Instant text extraction, live editing/annotation, and a SHA-256 cryptographic duplicate detector that blocks redundant uploads automatically.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Zero duplicate storage clutter</span>
                  </div>
                </div>
              </div>

              {/* Feature 2: Notes */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Normal Text Notes with Quick Toolbar</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">The Problem:</span>
                    <p className="text-slate-400 leading-relaxed">
                      Forced markdown tags disrupt focus during rapid lectures. Raw plain text lacks structure for efficient visual review.
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-purple-400 block mb-1">The AI Study Hub Solution:</span>
                    <p className="text-slate-400 leading-relaxed">
                      Clean normal text by default with 1-click styling (• Bullet, 1. List, 📌 Highlight, Divider) plus 1-click AI note generation directly from materials.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>3x faster lecture note capture</span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Tasks & Consistency Streaks */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Tasks, Streaks & Weekly Milestones</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block mb-1">The Problem:</span>
                    <p className="text-slate-400 leading-relaxed">
                      Last-minute cramming causes acute cognitive fatigue and 70% knowledge decay within 48 hours after exams.
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-400 block mb-1">The AI Study Hub Solution:</span>
                    <p className="text-slate-400 leading-relaxed">
                      Eisenhower matrix priority, 7-day study consistency streaks (triggering habit dopamine loops), and weekly pacing metrics (e.g. 19/25 hrs).
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-slate-500 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Eliminates all-nighters completely</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. BOTTOM CALL TO ACTION BANNER */}
        <section className="relative z-10 px-6 py-16 md:py-28 max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-950/90 backdrop-blur-2xl p-10 md:p-16 text-center border border-indigo-500/30 shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">
              Ready to Elevate Your Study Workflow?
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto mb-8 font-normal">
              Join thousands of students who are mastering subjects faster with AI Study Hub.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 px-9 py-4 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200 text-base"
              >
                Get Started for Free
              </button>
              <button
                onClick={() => onOpenApp('dashboard')}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900/90 border border-slate-700/80 px-8 py-4 text-slate-200 font-semibold hover:bg-slate-800 hover:text-white transition-all text-base"
              >
                Explore Live Workspace
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 10. FOOTER */}
      <footer className="relative z-10 px-6 py-12 bg-slate-950/90 border-t border-slate-800/80 text-slate-400 text-sm">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
              ✦
            </div>
            <span className="font-extrabold text-lg text-white">AI Study Hub</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#tools" className="hover:text-white transition-colors">
              Tools
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About Us
            </a>
            <button
              onClick={() => onOpenApp('dashboard')}
              className="hover:text-white transition-colors"
            >
              Web App
            </button>
          </nav>

          <div className="text-xs text-slate-500">
            © 2026 AI Study Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
