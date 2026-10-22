'use client';

import React, { useState } from 'react';
import { ViewType, Note, Task, StudyMaterial } from '@/types';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Circle,
  FileSpreadsheet,
  Sparkles,
  HelpCircle,
  Layers,
  Calendar,
  Compass,
  FileUp,
  Clock,
  Flame,
  LayoutDashboard,
  Home,
  CheckSquare,
  TrendingUp,
  BookOpen,
  PanelLeftClose,
  Zap,
} from 'lucide-react';

interface VSCodeExplorerProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  notes: Note[];
  tasks: Task[];
  materials: StudyMaterial[];
  onSelectNote: (note: Note) => void;
  onSelectMaterial: (mat: StudyMaterial) => void;
  onNewNote: () => void;
  onNewTask: () => void;
  onUploadPDF: () => void;
  onToggleSidebar?: () => void;
}

export const VSCodeExplorer: React.FC<VSCodeExplorerProps> = ({
  currentView,
  onSelectView,
  notes,
  tasks,
  materials,
  onSelectNote,
  onSelectMaterial,
  onNewNote,
  onNewTask,
  onUploadPDF,
  onToggleSidebar,
}) => {
  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    notes: true,
    tasks: true,
    deadlines: true,
    materials: true,
    aiTools: true,
  });

  const [explorerSearch, setExplorerSearch] = useState('');
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const term = explorerSearch.toLowerCase().trim();

  const filteredNotes = notes.filter(
    (n) => n.title.toLowerCase().includes(term) || n.category.toLowerCase().includes(term)
  );
  const filteredTasks = tasks.filter(
    (t) => t.title.toLowerCase().includes(term) || t.category.toLowerCase().includes(term)
  );
  const filteredMaterials = materials.filter(
    (m) => m.name.toLowerCase().includes(term) || m.tags.some((t) => t.toLowerCase().includes(term))
  );

  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  return (
    <aside className="w-64 md:w-72 bg-slate-950/85 backdrop-blur-xl border-r border-slate-800/80 flex flex-col h-full text-slate-400 text-xs select-none shrink-0 overflow-hidden shadow-2xl z-10">
      {/* Brand & Toggle Header (AI Study Hub Style) */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div 
          onClick={() => onSelectView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500 p-0.5 shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 font-extrabold text-sm leading-none">
                ✦
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors">
              AI Study Hub
            </h2>
            <p className="text-[10px] text-slate-400 font-medium leading-none">Next-Gen Academic</p>
          </div>
        </div>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title="Toggle Sidebar"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main + Create Button (Vibrant Gradient CTA matching aistudyhub.org) */}
      <div className="p-3">
        <div className="relative">
          <button
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create</span>
          </button>

          {/* Quick Create Dropdown */}
          {isCreateMenuOpen && (
            <div className="absolute left-0 right-0 top-12 z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-1.5 space-y-1 animate-fade-in text-xs text-slate-200">
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onNewNote();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>New Study Note</span>
              </button>
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onNewTask();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>New Task</span>
              </button>
              <button
                onClick={() => {
                  setIsCreateMenuOpen(false);
                  onUploadPDF();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2"
              >
                <FileUp className="w-3.5 h-3.5 text-purple-400" />
                <span>Upload PDF (Max 70 MB)</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Primary Nav Links */}
      <div className="px-3 pb-2 space-y-1">
        <button
          onClick={() => onSelectView('dashboard')}
          className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-all ${
            currentView === 'dashboard'
              ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-transparent text-white font-semibold border-l-2 border-fuchsia-500 shadow-sm'
              : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-4 h-4 ${currentView === 'dashboard' ? 'text-fuchsia-400' : 'text-slate-400'}`} />
          <span>Home</span>
        </button>

        <button
          onClick={() => onSelectView('notes')}
          className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-medium transition-all ${
            currentView === 'notes'
              ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-transparent text-white font-semibold border-l-2 border-fuchsia-500 shadow-sm'
              : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className={`w-4 h-4 ${currentView === 'notes' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span>Study Notes</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            {notes.length}
          </span>
        </button>

        <button
          onClick={() => onSelectView('tasks')}
          className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-medium transition-all ${
            currentView === 'tasks'
              ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-transparent text-white font-semibold border-l-2 border-fuchsia-500 shadow-sm'
              : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckSquare className={`w-4 h-4 ${currentView === 'tasks' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Tasks</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            {tasks.filter((t) => t.status !== 'completed').length}
          </span>
        </button>

        <button
          onClick={() => onSelectView('deadlines')}
          className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-medium transition-all ${
            currentView === 'deadlines'
              ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-transparent text-white font-semibold border-l-2 border-fuchsia-500 shadow-sm'
              : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className={`w-4 h-4 ${currentView === 'deadlines' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Deadlines & Progress</span>
          </div>
          <span className="text-[10px] font-bold text-amber-400">
            {progressPercent}%
          </span>
        </button>

        <button
          onClick={() => onSelectView('materials')}
          className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-medium transition-all ${
            currentView === 'materials'
              ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-transparent text-white font-semibold border-l-2 border-fuchsia-500 shadow-sm'
              : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BookOpen className={`w-4 h-4 ${currentView === 'materials' ? 'text-purple-400' : 'text-slate-400'}`} />
            <span>Learning Materials</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            {materials.length}
          </span>
        </button>
      </div>

      {/* Explorer Search / Filter Bar */}
      <div className="px-3 py-2 border-t border-slate-800/80">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={explorerSearch}
            onChange={(e) => setExplorerSearch(e.target.value)}
            placeholder="Filter files & tools..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Tree Content (VS Code Explorer Sections) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-2">
        {/* SECTION: STUDY NOTES */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
          <div
            onClick={() => toggleSection('notes')}
            className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 cursor-pointer group text-slate-200 font-semibold text-[11px] tracking-wide"
          >
            <div className="flex items-center gap-1.5 truncate">
              {openSections.notes ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate">STUDY NOTES</span>
              <span className="text-[10px] text-slate-400 font-normal">({filteredNotes.length})</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNewNote();
              }}
              title="New Study Note"
              className="p-1 hover:text-white hover:bg-white/10 rounded"
            >
              <Plus className="w-3 h-3 text-indigo-400" />
            </button>
          </div>

          {openSections.notes && (
            <div className="px-2 pb-2 space-y-0.5 border-t border-slate-800/80 pt-1">
              {filteredNotes.slice(0, 5).map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note);
                    onSelectView('notes');
                  }}
                  title={note.title}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-800/60 text-slate-400 hover:text-slate-100 group truncate transition-colors text-xs"
                >
                  <FileText className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{note.title.replace(/\s+/g, '_').slice(0, 22)}.md</span>
                </button>
              ))}

              {filteredNotes.length > 5 && (
                <button
                  onClick={() => onSelectView('notes')}
                  className="w-full text-left pl-3 py-1 text-[11px] text-indigo-400 hover:underline"
                >
                  +{filteredNotes.length - 5} more notes...
                </button>
              )}
            </div>
          )}
        </div>

        {/* SECTION: LEARNING MATERIALS (PDFs) */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
          <div
            onClick={() => toggleSection('materials')}
            className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 cursor-pointer group text-slate-200 font-semibold text-[11px] tracking-wide"
          >
            <div className="flex items-center gap-1.5 truncate">
              {openSections.materials ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate">LEARNING MATERIALS</span>
              <span className="text-[10px] text-slate-400 font-normal">({filteredMaterials.length})</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUploadPDF();
              }}
              title="Upload PDF (Up to 70 MB)"
              className="p-1 hover:text-white hover:bg-white/10 rounded"
            >
              <FileUp className="w-3 h-3 text-purple-400" />
            </button>
          </div>

          {openSections.materials && (
            <div className="px-2 pb-2 space-y-0.5 border-t border-slate-800/80 pt-1">
              {filteredMaterials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => {
                    onSelectMaterial(mat);
                    onSelectView('materials');
                  }}
                  title={`${mat.name} (${mat.fileSizeFormatted})`}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-slate-800/60 text-slate-400 hover:text-slate-100 group truncate transition-colors text-xs"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <FileSpreadsheet className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate">{mat.name}</span>
                  </span>
                  <span className="text-[9px] text-slate-500 shrink-0 font-mono">
                    {mat.fileSizeFormatted}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SECTION: AI TOOLS */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
          <div
            onClick={() => toggleSection('aiTools')}
            className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 cursor-pointer group text-slate-200 font-semibold text-[11px] tracking-wide"
          >
            <div className="flex items-center gap-1.5 truncate">
              {openSections.aiTools ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate">AI ACADEMIC TOOLS</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
          </div>

          {openSections.aiTools && (
            <div className="px-2 pb-2 space-y-1 border-t border-slate-800/80 pt-1.5">
              <button
                onClick={() => onSelectView('ai-summarizer')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 group transition-colors text-xs ${
                  currentView === 'ai-summarizer' ? 'bg-indigo-950/40 text-purple-200 font-semibold border-l-2 border-indigo-400' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">AI Summarizer</span>
              </button>

              <button
                onClick={() => onSelectView('ai-quiz')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 group transition-colors text-xs ${
                  currentView === 'ai-quiz' ? 'bg-indigo-950/40 text-purple-200 font-semibold border-l-2 border-indigo-400' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">AI Quiz Generator</span>
              </button>

              <button
                onClick={() => onSelectView('ai-flashcards')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 group transition-colors text-xs ${
                  currentView === 'ai-flashcards' ? 'bg-indigo-950/40 text-purple-200 font-semibold border-l-2 border-indigo-400' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">AI Flashcards</span>
              </button>

              <button
                onClick={() => onSelectView('ai-assistant')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 group transition-colors text-xs ${
                  currentView === 'ai-assistant' ? 'bg-indigo-950/40 text-purple-200 font-semibold border-l-2 border-indigo-400' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">AI Study Assistant (RAG)</span>
              </button>

              <button
                onClick={() => onSelectView('ai-planner')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 group transition-colors text-xs ${
                  currentView === 'ai-planner' ? 'bg-indigo-950/40 text-purple-200 font-semibold border-l-2 border-indigo-400' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">AI Task Planner</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
