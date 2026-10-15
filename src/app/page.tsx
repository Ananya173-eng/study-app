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
import { ActivityBar } from '@/components/Sidebar/ActivityBar';
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
  Sparkles,
  Search,
  BookOpen,
  LayoutDashboard,
  FileText,
  CheckSquare,
  TrendingUp,
  User as UserIcon,
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

  // AI Active Context Transfer
  const [aiInitialTitle, setAiInitialTitle] = useState('');
  const [aiInitialContent, setAiInitialContent] = useState('');

  // Modals & Notifications
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  // Initialize from LocalStorage
  useEffect(() => {
    setUser(Storage.getUser());
    setNotes(Storage.getNotes());
    setTasks(Storage.getTasks());
    setMaterials(Storage.getMaterials());
    setQuizzes(Storage.getQuizzes());
    setFlashcards(Storage.getFlashcards());
  }, []);

  // Keyboard shortcut Ctrl+B to toggle VS Code sidebar
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#121214] text-[#cccccc]">
      {/* 1. VS Code Far-Left Activity Bar */}
      <ActivityBar
        currentView={currentView}
        onSelectView={setCurrentView}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
      />

      {/* 2. VS Code Left Explorer Sidebar (Collapsible) */}
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
        />
      )}

      {/* 3. Main Content Workspace */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#121214] overflow-hidden">
        {/* Top Navbar Header */}
        <header className="h-12 bg-[#18181b] border-b border-[#2b2b2b] px-4 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-gray-400 truncate">
              <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Study Hub
              </span>
              <span>/</span>
              <span className="capitalize text-blue-300 font-medium">
                {currentView.replace('ai-', 'AI ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick View Switcher Badges */}
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currentView === 'dashboard' ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('notes')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currentView === 'notes' ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Notes ({notes.length})
              </button>
              <button
                onClick={() => setCurrentView('tasks')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currentView === 'tasks' ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Tasks ({tasks.filter((t) => t.status !== 'completed').length})
              </button>
              <button
                onClick={() => setCurrentView('materials')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currentView === 'materials' ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                PDFs ({materials.length})
              </button>
            </div>

            {/* User Profile Button */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-200 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                {user.name.charAt(0)}
              </div>
              <span className="hidden md:inline font-medium">{user.name}</span>
            </button>
          </div>
        </header>

        {/* View Router */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#121214]">
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
