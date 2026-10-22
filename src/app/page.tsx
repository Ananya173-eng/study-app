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
import { AIStudyHubLanding } from '@/components/Landing/AIStudyHubLanding';
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
  Home as HomeIcon,
  LogOut,
} from 'lucide-react';

export default function Home() {
  // Mode state: 'app' (Direct interactive study workspace) or 'landing' (showcase interface)
  const [mode, setMode] = useState<'app' | 'landing'>('app');

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

    if (typeof window !== 'undefined') {
      if (window.location.hash === '#app' || window.location.search.includes('view=app')) {
        setMode('app');
      }
    }
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

  const handleSignOut = () => {
    const guestUser: User = {
      id: 'guest_student',
      name: 'Student User',
      email: 'student@university.edu',
      major: 'General Studies',
      targetWeeklyHours: 20,
      streakDays: 1,
    };
    setUser(guestUser);
    Storage.setUser(guestUser);
    addToast('info', 'Signed Out', 'You have been signed out from your workspace.');
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

  const handleUpdateMaterial = (updatedMaterial: StudyMaterial) => {
    const updated = materials.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m));
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

  // If in Landing Mode, render the full AI Study Hub website interface (matching aistudyhub.org)
  if (mode === 'landing') {
    return (
      <>
        <AIStudyHubLanding
          onOpenApp={(view) => {
            if (view) setCurrentView(view);
            setMode('app');
          }}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          currentUser={user}
          onClose={() => setIsAuthOpen(false)}
          onLogin={(updatedUser) => {
            handleLogin(updatedUser);
            setMode('app');
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // Theme Classes for the requested balanced "na hi jyada light na jyada dark"
  const themeClass =
    themeMode === 'soft'
      ? 'bg-[#21242d] text-[#e8ebf2]'
      : themeMode === 'dark'
      ? 'bg-[#121418] text-[#e0e3ea]'
      : 'bg-[#1a1d24] text-[#edf0f7]'; // default eye-care calm

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Ambient background glows from aistudyhub.org */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-32 -left-20 w-[30rem] h-[30rem] bg-gradient-to-tr from-fuchsia-600/20 via-violet-600/15 to-indigo-500/15 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[28rem] h-[28rem] bg-gradient-to-b from-blue-600/15 via-cyan-500/15 to-violet-600/15 rounded-full blur-3xl opacity-30 animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-10 left-1/3 w-[22rem] h-[22rem] bg-gradient-to-tr from-purple-600/15 via-indigo-500/15 to-pink-500/15 rounded-full blur-3xl opacity-25 animate-pulse [animation-delay:4s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* 1. Left Modern Explorer Sidebar */}
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
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-950/40 backdrop-blur-sm">
        {/* Sleek Dark Header with Centered Pill Search Bar */}
        <header className="h-16 px-4 md:px-8 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between gap-4 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('landing')}
              title="View Marketing Landing Page"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 transition-all shadow-sm"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 font-extrabold text-sm">✦</span>
              <span className="hidden sm:inline">Landing Page</span>
            </button>

            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Open Sidebar (Ctrl+B)"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors border border-slate-800"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="font-bold text-white tracking-tight">AI Study Hub</span>
              <span>/</span>
              <span className="capitalize bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400 font-semibold">
                {currentView.replace('ai-', 'AI ')}
              </span>
            </div>
          </div>

          {/* Centered Pill Search Bar */}
          <div className="flex-1 max-w-xl mx-2 md:mx-4">
            <form onSubmit={handleGlobalSearchSubmit} className="relative">
              <Search className="absolute left-4 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search notes, tasks, or ask AI anything..."
                className="w-full pl-11 pr-12 py-2 bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-900 border border-slate-800 focus:border-indigo-500/60 rounded-full text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition-all shadow-sm"
              />
              {globalSearch ? (
                <button
                  type="button"
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="absolute right-4 top-2.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  ⌘K
                </span>
              )}
            </form>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Streak Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{user.streakDays || 7} Days</span>
            </div>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Hub Settings & AI Keys"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile Pill & Sign-Out Button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsAuthOpen(true)}
                title="Account Settings"
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm overflow-hidden">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={handleSignOut}
                title="Sign Out of Workspace"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-red-500/20 text-xs font-semibold transition-all shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
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
              onUpdateMaterial={handleUpdateMaterial}
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
        onSignOut={handleSignOut}
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
