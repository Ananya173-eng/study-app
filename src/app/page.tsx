'use client';

import React, { useState, useEffect } from 'react';
import {
  ViewType,
  Note,
  Task,
  StudyMaterial,
  Quiz,
  FlashcardDeck,
  User,
  ToastAlert,
} from '@/types';
import { Storage, DEFAULT_USER } from '@/lib/storage';
import { VSCodeExplorer } from '@/components/Sidebar/VSCodeExplorer';
import { DashboardView } from '@/components/Dashboard/DashboardView';
import { NotesView } from '@/components/Notes/NotesView';
import { TasksView } from '@/components/Tasks/TasksView';
import { DeadlinesProgressView } from '@/components/Deadlines/DeadlinesProgressView';
import { MaterialsView } from '@/components/Materials/MaterialsView';
import { AISummarizer } from '@/components/AI/AISummarizer';
import { AIQuizGenerator } from '@/components/AI/AIQuizGenerator';
import { AIFlashcards } from '@/components/AI/AIFlashcards';
import { AIStudyAssistant } from '@/components/AI/AIStudyAssistant';
import { AITaskPlanner } from '@/components/AI/AITaskPlanner';
import { AuthModal } from '@/components/Common/AuthModal';
import { SettingsModal } from '@/components/Common/SettingsModal';
import { ToastContainer } from '@/components/Common/ToastContainer';
import {
  Menu,
  Search,
  Sparkles,
  Flame,
  Settings,
  SunMedium,
  Moon,
  Eye,
  PanelLeft,
  X,
} from 'lucide-react';

export default function Home() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Core Data State
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardDeck[]>([]);

  // Global Search in Top Bar
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // AI Active Context Transfer
  const [aiInitialTitle, setAiInitialTitle] = useState('');
  const [aiInitialContent, setAiInitialContent] = useState('');

  // Modals & Notifications
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  // Eye-care theme modes: 'calm' (balanced eye-care slate), 'soft' (softer paper tone), 'dark' (midnight)
  const [themeMode, setThemeMode] = useState<'calm' | 'soft' | 'dark'>('calm');

  // Initialize from LocalStorage
  useEffect(() => {
    setUser(Storage.getUser());
    setNotes(Storage.getNotes());
    setTasks(Storage.getTasks());
    setMaterials(Storage.getMaterials());
    setQuizzes(Storage.getQuizzes());
    setFlashcards(Storage.getFlashcards());
  }, []);

  // Keyboard shortcut Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // System Toast Alert helper
  const addToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    const newToast: ToastAlert = {
      id: `toast_${Date.now()}_${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User Actions
  const handleLogin = (updatedUser: User) => {
    setUser(updatedUser);
    Storage.setUser(updatedUser);
  };

  // Notes Actions
  const handleSaveNote = (note: Note) => {
    const exists = notes.some((n) => n.id === note.id);
    let updated: Note[];
    if (exists) {
      updated = notes.map((n) => (n.id === note.id ? note : n));
    } else {
      updated = [note, ...notes];
    }
    setNotes(updated);
    Storage.setNotes(updated);
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    Storage.setNotes(updated);
  };

  // Tasks Actions
  const handleSaveTask = (task: Task) => {
    const exists = tasks.some((t) => t.id === task.id);
    let updated: Task[];
    if (exists) {
      updated = tasks.map((t) => (t.id === task.id ? task : t));
    } else {
      updated = [task, ...tasks];
    }
    setTasks(updated);
    Storage.setTasks(updated);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        return {
          ...t,
          status: nextStatus as any,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    setTasks(updated);
    Storage.setTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    Storage.setTasks(updated);
  };

  const handleAddTasksBatch = (newTasks: Task[]) => {
    const updated = [...newTasks, ...tasks];
    setTasks(updated);
    Storage.setTasks(updated);
  };

  // Study Materials Actions
  const handleAddMaterial = (material: StudyMaterial) => {
    const updated = [material, ...materials];
    setMaterials(updated);
    Storage.setMaterials(updated);
  };

  const handleDeleteMaterial = (matId: string) => {
    const updated = materials.filter((m) => m.id !== matId);
    setMaterials(updated);
    Storage.setMaterials(updated);
  };

  // Quizzes & Flashcards
  const handleSaveQuiz = (quiz: Quiz) => {
    const exists = quizzes.some((q) => q.id === quiz.id);
    const updated = exists ? quizzes.map((q) => (q.id === quiz.id ? quiz : q)) : [quiz, ...quizzes];
    setQuizzes(updated);
    Storage.setQuizzes(updated);
  };

  const handleSaveDeck = (deck: FlashcardDeck) => {
    const exists = flashcards.some((d) => d.id === deck.id);
    const updated = exists ? flashcards.map((d) => (d.id === deck.id ? deck : d)) : [deck, ...flashcards];
    setFlashcards(updated);
    Storage.setFlashcards(updated);
  };

  // AI Content Hand-off
  const handleSetAIContent = (title: string, content: string) => {
    setAiInitialTitle(title);
    setAiInitialContent(content);
  };

  // Reset to Demo
  const handleResetData = () => {
    setUser(Storage.getUser());
    setNotes(Storage.getNotes());
    setTasks(Storage.getTasks());
    setMaterials(Storage.getMaterials());
    setQuizzes(Storage.getQuizzes());
    setFlashcards(Storage.getFlashcards());
  };

  // Handle global search submission
  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    setCurrentView('notes');
  };

  // Theme Classes for the requested balanced "na hi jyada light na jyada dark"
  const themeClass =
    themeMode === 'soft'
      ? 'bg-[#21242d] text-[#e8ebf2]'
      : themeMode === 'dark'
      ? 'bg-[#121418] text-[#e0e3ea]'
      : 'bg-[#1a1d24] text-[#edf0f7]'; // default eye-care calm

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${themeClass} font-sans selection:bg-pink-500/30 selection:text-white`}>
      {/* 1. Left Modern Explorer Sidebar (Magnific Inspired) */}
      {isSidebarOpen && (
        <VSCodeExplorer
          currentView={currentView}
          onSelectView={setCurrentView}
          notes={notes}
          tasks={tasks}
          materials={materials}
          onSelectNote={(n) => {
            handleSetAIContent(n.title, n.content);
            setCurrentView('notes');
          }}
          onSelectMaterial={(m) => {
            handleSetAIContent(m.name, m.fullText);
            setCurrentView('materials');
          }}
          onNewNote={() => setCurrentView('notes')}
          onNewTask={() => setCurrentView('tasks')}
          onUploadPDF={() => setCurrentView('materials')}
          onToggleSidebar={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Main Content Workspace */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#171920]">
        {/* Magnific-Style Header with Centered Pill Search Bar */}
        <header className="h-16 px-4 md:px-8 border-b border-[#323846] bg-[#1c1f26]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Open Sidebar (Ctrl+B)"
                className="p-2 rounded-xl text-[#9aa2b4] hover:text-white hover:bg-[#252934] transition-colors border border-[#323846]"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#9aa2b4]">
              <span className="font-bold text-[#edf0f7] tracking-tight">AI Study Hub</span>
              <span>/</span>
              <span className="capitalize text-pink-400 font-medium">
                {currentView.replace('ai-', 'AI ')}
              </span>
            </div>
          </div>

          {/* Centered Pill Search Bar (From Magnific Screenshot) */}
          <div className="flex-1 max-w-xl mx-2 md:mx-4">
            <form onSubmit={handleGlobalSearchSubmit} className="relative">
              <Search className="absolute left-4 top-2.5 w-4 h-4 text-[#9aa2b4]" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search notes, tasks, or ask AI anything..."
                className="w-full pl-11 pr-12 py-2 bg-[#252934] hover:bg-[#282d3b] focus:bg-[#252934] border border-[#323846] focus:border-pink-500/60 rounded-full text-xs text-[#edf0f7] placeholder-[#80899c] focus:outline-none transition-all shadow-sm"
              />
              {globalSearch ? (
                <button
                  type="button"
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3.5 top-2.5 text-[#9aa2b4] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="absolute right-4 top-2.5 text-[10px] font-mono font-semibold text-[#80899c] bg-[#1c1f26] px-1.5 py-0.5 rounded border border-[#323846]">
                  ⌘K
                </span>
              )}
            </form>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Eye-Care Theme Switcher (Calm / Soft / Midnight) */}
            <div className="hidden md:flex items-center bg-[#252934] p-1 rounded-full border border-[#323846]">
              <button
                onClick={() => {
                  setThemeMode('calm');
                  addToast('info', 'Eye-Care Slate Active', 'Balanced, soothing mode optimal for studying without glare.');
                }}
                title="Eye-Care Calm Mode (Recommended for reading)"
                className={`p-1.5 rounded-full transition-colors ${
                  themeMode === 'calm' ? 'bg-pink-500 text-white shadow-sm' : 'text-[#9aa2b4] hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setThemeMode('soft');
                  addToast('info', 'Soft Paper Mode', 'Warm gentle tone for daytime focus.');
                }}
                title="Soft Paper Mode"
                className={`p-1.5 rounded-full transition-colors ${
                  themeMode === 'soft' ? 'bg-pink-500 text-white shadow-sm' : 'text-[#9aa2b4] hover:text-white'
                }`}
              >
                <SunMedium className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setThemeMode('dark');
                  addToast('info', 'Midnight Dark Mode', 'Deeper contrast mode.');
                }}
                title="Midnight Dark Mode"
                className={`p-1.5 rounded-full transition-colors ${
                  themeMode === 'dark' ? 'bg-pink-500 text-white shadow-sm' : 'text-[#9aa2b4] hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Streak Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.streakDays || 7} Days</span>
            </div>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Hub Settings & AI Keys"
              className="p-2 rounded-xl text-[#9aa2b4] hover:text-white hover:bg-[#252934] border border-[#323846] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile Pill */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#252934] hover:bg-[#2c3140] border border-[#323846] text-xs text-[#edf0f7] transition-all shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm overflow-hidden">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        {/* View Router with Smooth Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              notes={notes}
              tasks={tasks}
              materials={materials}
              onSelectView={setCurrentView}
              onNewNote={() => setCurrentView('notes')}
              onNewTask={() => setCurrentView('tasks')}
              onUploadPDF={() => setCurrentView('materials')}
              onToggleTaskStatus={handleToggleTaskStatus}
              onSelectNote={(note) => {
                handleSetAIContent(note.title, note.content);
                setCurrentView('notes');
              }}
            />
          )}

          {currentView === 'notes' && (
            <NotesView
              notes={notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onSelectView={setCurrentView}
              onSetAIContent={handleSetAIContent}
              onNotify={addToast}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView
              tasks={tasks}
              onSaveTask={handleSaveTask}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleTaskStatus}
              onNotify={addToast}
            />
          )}

          {currentView === 'deadlines' && (
            <DeadlinesProgressView
              tasks={tasks}
              user={user}
              onToggleStatus={handleToggleTaskStatus}
            />
          )}

          {currentView === 'materials' && (
            <MaterialsView
              materials={materials}
              onAddMaterial={handleAddMaterial}
              onDeleteMaterial={handleDeleteMaterial}
              onSelectView={setCurrentView}
              onSetAIContent={handleSetAIContent}
              onNotify={addToast}
            />
          )}

          {currentView === 'ai-summarizer' && (
            <AISummarizer
              notes={notes}
              materials={materials}
              initialTitle={aiInitialTitle}
              initialContent={aiInitialContent}
              onSaveAsNote={handleSaveNote}
              onNotify={addToast}
            />
          )}

          {currentView === 'ai-quiz' && (
            <AIQuizGenerator
              materials={materials}
              notes={notes}
              quizzes={quizzes}
              onSaveQuiz={handleSaveQuiz}
              onNotify={addToast}
            />
          )}

          {currentView === 'ai-flashcards' && (
            <AIFlashcards
              materials={materials}
              notes={notes}
              decks={flashcards}
              onSaveDeck={handleSaveDeck}
              onNotify={addToast}
            />
          )}

          {currentView === 'ai-assistant' && (
            <AIStudyAssistant
              materials={materials}
              notes={notes}
              onNotify={addToast}
            />
          )}

          {currentView === 'ai-planner' && (
            <AITaskPlanner
              onAddTasks={handleAddTasksBatch}
              onSelectView={setCurrentView}
              onNotify={addToast}
            />
          )}
        </div>
      </main>

      {/* Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        currentUser={user}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      {/* Settings & API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={handleResetData}
        onNotify={addToast}
      />

      {/* Global Alerts & Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
