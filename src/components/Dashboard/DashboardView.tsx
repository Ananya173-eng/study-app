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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-6 md:p-8 shadow-2xl backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Academic Command Center
              </span>
              <span className="text-xs text-gray-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Major in <span className="text-blue-300 font-medium">{user.major || 'Computer Science & AI'}</span>. You have{' '}
              <span className="text-amber-300 font-semibold">{pendingTasks.length} pending tasks</span> and{' '}
              <span className="text-emerald-300 font-semibold">{notes.length} synthesized notes</span> ready for AI review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNewNote}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
            <button
              onClick={onNewTask}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
            <button
              onClick={onUploadPDF}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-4 h-4" />
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
          className="p-4 rounded-xl bg-[#1c1c20] border border-white/5 hover:border-blue-500/40 cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Notes</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{notes.length}</div>
          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <span className="text-blue-400 font-medium">Categorized & Tagged</span>
          </p>
        </div>

        {/* Tasks */}
        <div
          onClick={() => onSelectView('tasks')}
          className="p-4 rounded-xl bg-[#1c1c20] border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks Done</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {completedTasks} <span className="text-sm font-normal text-gray-500">/ {tasks.length}</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            {completionRate}% Completed
          </p>
        </div>

        {/* Deadlines */}
        <div
          onClick={() => onSelectView('deadlines')}
          className="p-4 rounded-xl bg-[#1c1c20] border border-white/5 hover:border-amber-500/40 cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Due Soon</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{upcomingDeadlines.length}</div>
          <p className="text-[11px] text-amber-400 mt-1 font-medium">
            Next: {upcomingDeadlines[0] ? new Date(upcomingDeadlines[0].deadline).toLocaleDateString() : 'None pending'}
          </p>
        </div>

        {/* Materials & Streak */}
        <div
          onClick={() => onSelectView('materials')}
          className="p-4 rounded-xl bg-[#1c1c20] border border-white/5 hover:border-purple-500/40 cursor-pointer transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">PDF Materials</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{materials.length}</div>
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
          <div className="bg-[#1c1c20] rounded-xl border border-white/5 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Upcoming Deadlines & Prioritized Tasks
                </h3>
              </div>
              <button
                onClick={() => onSelectView('tasks')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
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
                    className="p-3 rounded-lg bg-[#242429] border border-white/5 hover:border-gray-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => onToggleTaskStatus(task.id)}
                        className="w-4 h-4 rounded text-emerald-500 bg-gray-800 border-gray-700 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px]">
                            {task.category}
                          </span>
                          <span>•</span>
                          <span>{task.description.slice(0, 45)}...</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOverdue
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : isDueToday
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}
                      >
                        {isOverdue ? 'Overdue' : isDueToday ? 'Due Today' : deadlineDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}

              {upcomingDeadlines.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-xs">
                  🎉 No pending deadlines! Great job staying ahead of your studies.
                </div>
              )}
            </div>
          </div>

          {/* Recent Notes */}
          <div className="bg-[#1c1c20] rounded-xl border border-white/5 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent Study Notes
                </h3>
              </div>
              <button
                onClick={() => onSelectView('notes')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                Browse all notes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notes.slice(0, 4).map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note);
                    onSelectView('notes');
                  }}
                  className="p-3.5 rounded-lg bg-[#242429] border border-white/5 hover:border-blue-500/40 cursor-pointer transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-medium">
                        {note.category}
                      </span>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {note.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {note.content.replace(/[#*`$]/g, '')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/5 text-[10px] text-blue-400 font-medium">
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
          <div className="bg-[#1c1c20] rounded-xl border border-white/5 p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Study Suite
              </h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Supercharge your retention with modular academic AI features trained on your uploaded materials and notes.
            </p>

            <div className="space-y-2.5">
              {/* AI Summarizer */}
              <button
                onClick={() => onSelectView('ai-summarizer')}
                className="w-full text-left p-3 rounded-lg bg-[#242429] border border-white/5 hover:border-amber-500/50 hover:bg-[#2a2a30] transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                    AI Summarizer
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Generate concise bullet points & study guides from PDFs.
                  </p>
                </div>
              </button>

              {/* AI Quiz Generator */}
              <button
                onClick={() => onSelectView('ai-quiz')}
                className="w-full text-left p-3 rounded-lg bg-[#242429] border border-white/5 hover:border-emerald-500/50 hover:bg-[#2a2a30] transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                    AI Quiz Generator
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Create interactive MCQs with scoring & explanations.
                  </p>
                </div>
              </button>

              {/* AI Flashcards */}
              <button
                onClick={() => onSelectView('ai-flashcards')}
                className="w-full text-left p-3 rounded-lg bg-[#242429] border border-white/5 hover:border-cyan-500/50 hover:bg-[#2a2a30] transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                    AI Flashcards
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Interactive 3D flip card decks with spaced repetition.
                  </p>
                </div>
              </button>

              {/* AI Study Assistant RAG */}
              <button
                onClick={() => onSelectView('ai-assistant')}
                className="w-full text-left p-3 rounded-lg bg-[#242429] border border-white/5 hover:border-purple-500/50 hover:bg-[#2a2a30] transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300">
                    AI Study Assistant (RAG)
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Ask questions grounded in your uploaded documents.
                  </p>
                </div>
              </button>

              {/* AI Task Planner */}
              <button
                onClick={() => onSelectView('ai-planner')}
                className="w-full text-left p-3 rounded-lg bg-[#242429] border border-white/5 hover:border-blue-500/50 hover:bg-[#2a2a30] transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-300">
                    AI Task Planner
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Turn broad syllabus goals into scheduled daily tasks.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Quick upload card */}
          <div className="bg-gradient-to-br from-purple-950/40 to-blue-950/40 rounded-xl border border-purple-500/20 p-4">
            <div className="flex items-center gap-2 mb-2 text-purple-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>PDF Study Materials (Up to 70 MB)</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Upload textbook chapters or lecture slides from your computer to run AI analysis.
            </p>
            <button
              onClick={onUploadPDF}
              className="w-full py-2 bg-purple-600/80 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Upload Local PDF File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
