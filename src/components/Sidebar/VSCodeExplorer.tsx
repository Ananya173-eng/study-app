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
  onSelectTask?: (task: Task) => void;
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
    <div className="w-64 md:w-72 bg-[#1f1f1f] border-r border-[#2b2b2b] flex flex-col h-full text-[#cccccc] text-xs select-none shrink-0 overflow-hidden">
      {/* Explorer Title Bar */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-[#2b2b2b] text-[11px] font-semibold tracking-wider text-gray-400 uppercase bg-[#181818]">
        <span>EXPLORER: STUDY HUB</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectView('dashboard')}
            title="Open Dashboard"
            className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Explorer Search / Filter Bar */}
      <div className="p-2 border-b border-[#2b2b2b]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={explorerSearch}
            onChange={(e) => setExplorerSearch(e.target.value)}
            placeholder="Filter files & tools..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-[#141414] border border-[#333333] rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
        {/* SECTION: STUDY NOTES */}
        <div>
          <div
            onClick={() => toggleSection('notes')}
            className="flex items-center justify-between px-2 py-1.5 hover:bg-[#2a2d2e] cursor-pointer group text-gray-300 font-semibold uppercase text-[11px] tracking-wide"
          >
            <div className="flex items-center gap-1 truncate">
              {openSections.notes ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <span className="truncate">STUDY NOTES</span>
              <span className="text-[10px] text-gray-500 font-normal">({filteredNotes.length})</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNewNote();
                }}
                title="New Study Note"
                className="p-0.5 hover:text-white hover:bg-white/10 rounded"
              >
                <Plus className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          </div>

          {openSections.notes && (
            <div className="pl-4 pr-1 space-y-0.5">
              <button
                onClick={() => onSelectView('notes')}
                className={`w-full text-left px-2 py-1 rounded flex items-center justify-between group transition-colors ${
                  currentView === 'notes' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="font-medium text-xs">All Notes (Search & Filter)</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                  {notes.length}
                </span>
              </button>

              {filteredNotes.slice(0, 6).map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note);
                    onSelectView('notes');
                  }}
                  title={note.title}
                  className="w-full text-left px-2 py-1 rounded flex items-center gap-1.5 hover:bg-[#2a2d2e] text-gray-300 group truncate transition-colors"
                >
                  <FileText className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate text-xs">{note.title.replace(/\s+/g, '_').slice(0, 24)}.md</span>
                </button>
              ))}

              {filteredNotes.length > 6 && (
                <button
                  onClick={() => onSelectView('notes')}
                  className="w-full text-left pl-5 py-1 text-[11px] text-blue-400 hover:underline"
                >
                  +{filteredNotes.length - 6} more notes...
                </button>
              )}
            </div>
          )}
        </div>

        {/* SECTION: TASKS */}
        <div className="mt-1">
          <div
            onClick={() => toggleSection('tasks')}
            className="flex items-center justify-between px-2 py-1.5 hover:bg-[#2a2d2e] cursor-pointer group text-gray-300 font-semibold uppercase text-[11px] tracking-wide"
          >
            <div className="flex items-center gap-1 truncate">
              {openSections.tasks ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <span className="truncate">TASKS</span>
              <span className="text-[10px] text-gray-500 font-normal">
                ({tasks.filter((t) => t.status !== 'completed').length} pending)
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNewTask();
                }}
                title="New Task"
                className="p-0.5 hover:text-white hover:bg-white/10 rounded"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>

          {openSections.tasks && (
            <div className="pl-4 pr-1 space-y-0.5">
              <button
                onClick={() => onSelectView('tasks')}
                className={`w-full text-left px-2 py-1 rounded flex items-center justify-between group transition-colors ${
                  currentView === 'tasks' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium text-xs">Task Tracker & Kanban</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  {tasks.length}
                </span>
              </button>

              {filteredTasks.slice(0, 5).map((task) => {
                const isCompleted = task.status === 'completed';
                return (
                  <button
                    key={task.id}
                    onClick={() => onSelectView('tasks')}
                    title={task.title}
                    className="w-full text-left px-2 py-1 rounded flex items-center gap-1.5 hover:bg-[#2a2d2e] text-gray-300 group truncate transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3 h-3 text-amber-400 shrink-0" />
                    )}
                    <span
                      className={`truncate text-xs ${
                        isCompleted ? 'line-through text-gray-500' : 'text-gray-300'
                      }`}
                    >
                      {task.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION: DEADLINES AND PROGRESS */}
        <div className="mt-1">
          <div
            onClick={() => toggleSection('deadlines')}
            className="flex items-center justify-between px-2 py-1.5 hover:bg-[#2a2d2e] cursor-pointer group text-gray-300 font-semibold uppercase text-[11px] tracking-wide"
          >
            <div className="flex items-center gap-1 truncate">
              {openSections.deadlines ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <span className="truncate">DEADLINES & PROGRESS</span>
            </div>
          </div>

          {openSections.deadlines && (
            <div className="pl-4 pr-1 space-y-1">
              <button
                onClick={() => onSelectView('deadlines')}
                className={`w-full text-left px-2 py-1 rounded flex items-center justify-between group transition-colors ${
                  currentView === 'deadlines' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-medium text-xs">Progress Overview</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {progressPercent}%
                </span>
              </button>

              {/* Progress mini bar */}
              <div className="px-2 py-1">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Completed Tasks</span>
                  <span>{completedTasksCount}/{tasks.length}</span>
                </div>
                <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="px-2 py-1 flex items-center gap-2 text-xs text-amber-300/90 bg-amber-500/10 rounded mx-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">7-Day Study Streak Active</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: LEARNING MATERIAL WITH AI ASSISTANCE */}
        <div className="mt-1">
          <div
            onClick={() => toggleSection('materials')}
            className="flex items-center justify-between px-2 py-1.5 hover:bg-[#2a2d2e] cursor-pointer group text-gray-300 font-semibold uppercase text-[11px] tracking-wide"
          >
            <div className="flex items-center gap-1 truncate">
              {openSections.materials ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <span className="truncate">LEARNING MATERIALS</span>
              <span className="text-[10px] text-gray-500 font-normal">({filteredMaterials.length})</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadPDF();
                }}
                title="Upload Local PDF (Max 70 MB)"
                className="p-0.5 hover:text-white hover:bg-white/10 rounded"
              >
                <FileUp className="w-3.5 h-3.5 text-purple-400" />
              </button>
            </div>
          </div>

          {openSections.materials && (
            <div className="pl-4 pr-1 space-y-0.5">
              <button
                onClick={() => onSelectView('materials')}
                className={`w-full text-left px-2 py-1 rounded flex items-center justify-between group transition-colors ${
                  currentView === 'materials' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="font-medium text-xs">PDF Library & Upload</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                  {materials.length}
                </span>
              </button>

              {filteredMaterials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => {
                    onSelectMaterial(mat);
                    onSelectView('materials');
                  }}
                  title={`${mat.name} (${mat.fileSizeFormatted})`}
                  className="w-full text-left px-2 py-1 rounded flex items-center justify-between hover:bg-[#2a2d2e] text-gray-300 group truncate transition-colors"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <FileSpreadsheet className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate text-xs">{mat.name}</span>
                  </span>
                  <span className="text-[9px] text-gray-400 shrink-0 font-mono">
                    {mat.fileSizeFormatted}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SECTION: AI FEATURES & MODULES */}
        <div className="mt-1">
          <div
            onClick={() => toggleSection('aiTools')}
            className="flex items-center justify-between px-2 py-1.5 hover:bg-[#2a2d2e] cursor-pointer group text-gray-300 font-semibold uppercase text-[11px] tracking-wide"
          >
            <div className="flex items-center gap-1 truncate">
              {openSections.aiTools ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <span className="truncate">AI ASSISTANT & TOOLS</span>
            </div>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>

          {openSections.aiTools && (
            <div className="pl-4 pr-1 space-y-0.5">
              <button
                onClick={() => onSelectView('ai-summarizer')}
                className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 group transition-colors ${
                  currentView === 'ai-summarizer' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate text-xs">AI Summarizer</span>
              </button>

              <button
                onClick={() => onSelectView('ai-quiz')}
                className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 group transition-colors ${
                  currentView === 'ai-quiz' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate text-xs">AI Quiz Generator</span>
              </button>

              <button
                onClick={() => onSelectView('ai-flashcards')}
                className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 group transition-colors ${
                  currentView === 'ai-flashcards' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate text-xs">AI Flashcards</span>
              </button>

              <button
                onClick={() => onSelectView('ai-assistant')}
                className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 group transition-colors ${
                  currentView === 'ai-assistant' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate text-xs">AI Study Assistant (RAG)</span>
              </button>

              <button
                onClick={() => onSelectView('ai-planner')}
                className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 group transition-colors ${
                  currentView === 'ai-planner' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate text-xs">AI Task Planner</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
