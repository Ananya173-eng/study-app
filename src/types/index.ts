export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  major?: string;
  targetWeeklyHours?: number;
  streakDays?: number;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string; // ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm)
  createdAt: string;
  completedAt?: string;
}

export interface StudyMaterial {
  id: string;
  userId: string;
  name: string;
  originalName: string;
  fileSize: number; // in bytes
  fileSizeFormatted: string;
  mimeType: string;
  uploadDate: string;
  textSnippet: string;
  fullText: string;
  pageCount?: number;
  tags: string[];
  isAnalyzed?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  sourceType: 'material' | 'note' | 'topic';
  sourceTitle: string;
  questions: QuizQuestion[];
  createdAt: string;
  bestScore?: number;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  category?: string;
  mastered?: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  sourceType: 'material' | 'note' | 'custom';
  sourceTitle: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface PlannedTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  estimatedHours: number;
  suggestedDeadline: string;
  selected?: boolean;
}

export interface StudyGoalPlan {
  id: string;
  goal: string;
  subject: string;
  timeframeDays: number;
  overview: string;
  tasks: PlannedTask[];
  createdAt: string;
}

export interface ChatSource {
  title: string;
  type: 'pdf' | 'note';
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: ChatSource[];
}

export interface ToastAlert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export type ViewType = 
  | 'dashboard'
  | 'notes'
  | 'tasks'
  | 'deadlines'
  | 'materials'
  | 'ai-summarizer'
  | 'ai-quiz'
  | 'ai-flashcards'
  | 'ai-assistant'
  | 'ai-planner';
