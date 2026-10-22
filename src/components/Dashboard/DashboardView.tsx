'use client';

import React from 'react';
import { ViewType, Note, Task, StudyMaterial, User } from '@/types';
import {
  FileText,
  CheckSquare,
  Clock,
  BookOpen,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  Plus,
  HelpCircle,
  Layers,
  Calendar,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  notes: Note[];
  tasks: Task[];
  materials: StudyMaterial[];
  onSelectView: (view: ViewType) => void;
  onNewNote: () => void;
  onNewTask: () => void;
  onUploadPDF: () => void;
  onToggleTaskStatus: (taskId: string) => void;
  onSelectNote: (note: Note) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  notes,
  tasks,
  materials,
  onSelectView,
  onNewNote,
  onNewTask,
  onUploadPDF,
  onToggleTaskStatus,
  onSelectNote,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  
  // Tasks due soon
  const now = new Date().getTime();
  const upcomingDeadlines = [...pendingTasks].sort((a, b) => {
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Hero Banner with AI Study Hub theme */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-slate-900/90 to-purple-950/50 p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Subtle Ambient Glow inside banner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/25 backdrop-blur-md shadow-sm">
                ✦ Next-Gen Academic Intelligence
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Academic major: <span className="text-white font-semibold">{user.major || 'Computer Science & AI'}</span>. You have{' '}
              <span className="text-amber-300 font-semibold">{pendingTasks.length} pending deadlines</span> and{' '}
              <span className="text-emerald-300 font-semibold">{notes.length} synthesized notes</span> ready for active recall.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 backdrop-blur-sm">
                ⚡ Intent-Driven
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 backdrop-blur-sm">
                🧠 Context-Aware (RAG)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 backdrop-blur-sm">
                🎯 Active Recall Simulator
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNewNote}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
            <button
              onClick={onNewTask}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-sm"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              New Task
            </button>
            <button
              onClick={onUploadPDF}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              Upload PDF
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Notes */}
        <div
          onClick={() => onSelectView('notes')}
          className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-1 group shadow-xl hover:shadow-indigo-500/10"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Notes</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-gradient-to-tr group-hover:from-indigo-500 group-hover:to-fuchsia-500 group-hover:text-white transition-all shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{notes.length}</div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-indigo-400 font-medium">Categorized & Searchable</span>
          </p>
        </div>

        {/* Tasks */}
        <div
          onClick={() => onSelectView('tasks')}
          className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-1 group shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks Done</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {completedTasks} <span className="text-sm font-normal text-slate-400">/ {tasks.length}</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            {completionRate}% Completed
          </p>
        </div>

        {/* Deadlines */}
        <div
          onClick={() => onSelectView('deadlines')}
          className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-1 group shadow-xl hover:shadow-amber-500/10"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Due Soon</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{upcomingDeadlines.length}</div>
          <p className="text-[11px] text-amber-300 mt-1 font-medium">
            Next: {upcomingDeadlines[0] ? new Date(upcomingDeadlines[0].deadline).toLocaleDateString() : 'None pending'}
          </p>
        </div>

        {/* Materials & Streak */}
        <div
          onClick={() => onSelectView('materials')}
          className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-1 group shadow-xl hover:shadow-purple-500/10"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">PDF Materials</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{materials.length}</div>
          <p className="text-[11px] text-purple-400 mt-1 flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            {user.streakDays || 7} Days Study Streak
          </p>
        </div>
      </div>

      {/* Main Grid: Urgent Tasks & AI Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Tasks & Next Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#242833] rounded-2xl border border-[#333947] p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Upcoming Deadlines & Prioritized Tasks
                </h3>
              </div>
              <button
                onClick={() => onSelectView('tasks')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                View all tasks <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingDeadlines.slice(0, 4).map((task) => {
                const deadlineDate = new Date(task.deadline);
                const isOverdue = deadlineDate.getTime() < now;
                const isDueToday =
                  deadlineDate.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => onToggleTaskStatus(task.id)}
                        className="w-4 h-4 rounded text-fuchsia-500 bg-slate-900 border-slate-700 focus:ring-fuchsia-500 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-100 truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px]">
                            {task.category}
                          </span>
                          <span>•</span>
                          <span className="truncate">{task.description.slice(0, 45)}...</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isOverdue
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isDueToday
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {isOverdue ? 'Overdue' : isDueToday ? 'Due Today' : deadlineDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {upcomingDeadlines.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  🎉 No pending deadlines! Great job staying ahead of your studies.
                </div>
              )}
            </div>
          </div>

          {/* Recent Notes */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recent Study Notes
                </h3>
              </div>
              <button
                onClick={() => onSelectView('notes')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                Browse all notes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {notes.slice(0, 4).map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note);
                    onSelectView('notes');
                  }}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/80 cursor-pointer transition-all group flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-medium">
                        {note.category}
                      </span>
                      <span>{new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-1">
                      {note.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {note.content.replace(/[#*`$]/g, '')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-indigo-400 font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>AI review ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: AI Assistant Suite Shortcuts */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Study Suite
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supercharge your retention with modular academic AI features trained on your uploaded materials and notes.
            </p>

            <div className="space-y-2.5">
              {/* AI Summarizer */}
              <button
                onClick={() => onSelectView('ai-summarizer')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300">
                    AI Summarizer
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Generate concise bullet points & study guides from PDFs.
                  </p>
                </div>
              </button>

              {/* AI Quiz Generator */}
              <button
                onClick={() => onSelectView('ai-quiz')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300">
                    AI Quiz Generator
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Create interactive MCQs with scoring & explanations.
                  </p>
                </div>
              </button>

              {/* AI Flashcards */}
              <button
                onClick={() => onSelectView('ai-flashcards')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">
                    AI Flashcards
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Clean, solid cards with spaced recall & zero glare.
                  </p>
                </div>
              </button>

              {/* AI Study Assistant RAG */}
              <button
                onClick={() => onSelectView('ai-assistant')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300">
                    AI Study Assistant (RAG)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ask questions grounded in your uploaded documents.
                  </p>
                </div>
              </button>

              {/* AI Task Planner */}
              <button
                onClick={() => onSelectView('ai-planner')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300">
                    AI Task Planner
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Turn broad syllabus goals into scheduled daily tasks.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Quick upload card */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/40 rounded-2xl border border-indigo-500/30 p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span>PDF Study Materials (Up to 70 MB)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload textbook chapters or lecture slides from your computer to run AI analysis.
            </p>
            <button
              onClick={onUploadPDF}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]"
            >
              Upload Local PDF File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
