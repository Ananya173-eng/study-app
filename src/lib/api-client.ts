import { Note, Task, StudyMaterial, Quiz, FlashcardDeck, User } from '@/types';

const TOKEN_KEY = 'ai_study_hub_jwt_token';

export const authStorage = {
  getToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(TOKEN_KEY) || '';
  },
  setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export const apiClient = {
  // Authentication
  async register(data: {
    name: string;
    email: string;
    password: string;
    major?: string;
    targetWeeklyHours?: number;
  }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    if (result.token) {
      authStorage.setToken(result.token);
    }
    return result;
  },

  async login(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Login failed');
    }

    if (result.token) {
      authStorage.setToken(result.token);
    }
    return result;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetchWithAuth('/api/auth/me');
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    authStorage.removeToken();
  },

  // Notes
  async getNotes(): Promise<Note[]> {
    const res = await fetchWithAuth('/api/notes');
    if (!res.ok) throw new Error('Failed to fetch notes');
    const data = await res.json();
    return data.notes || [];
  },

  async saveNote(note: Note): Promise<Note> {
    const res = await fetchWithAuth('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error('Failed to save note');
    const data = await res.json();
    return data.note;
  },

  async deleteNote(id: string): Promise<void> {
    const res = await fetchWithAuth(`/api/notes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete note');
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const res = await fetchWithAuth('/api/tasks');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    return data.tasks || [];
  },

  async saveTask(task: Task): Promise<Task> {
    const res = await fetchWithAuth('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to save task');
    const data = await res.json();
    return data.task;
  },

  async saveTasksBatch(tasks: Task[]): Promise<Task[]> {
    const res = await fetchWithAuth('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    });
    if (!res.ok) throw new Error('Failed to save tasks batch');
    const data = await res.json();
    return data.tasks;
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetchWithAuth(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
  },

  // Study Materials & S3 File Storage
  async getMaterials(): Promise<StudyMaterial[]> {
    const res = await fetchWithAuth('/api/materials');
    if (!res.ok) throw new Error('Failed to fetch materials');
    const data = await res.json();
    return data.materials || [];
  },

  async uploadMaterial(file: File, tags: string[] = []): Promise<StudyMaterial> {
    const formData = new FormData();
    formData.append('file', file);
    if (tags.length > 0) {
      formData.append('tags', tags.join(', '));
    }

    const res = await fetchWithAuth('/api/materials', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to upload material');
    }

    const data = await res.json();
    return data.material;
  },

  async saveMaterial(material: StudyMaterial): Promise<StudyMaterial> {
    const res = await fetchWithAuth('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
    if (!res.ok) throw new Error('Failed to save material');
    const data = await res.json();
    return data.material;
  },

  async deleteMaterial(id: string): Promise<void> {
    const res = await fetchWithAuth(`/api/materials/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete material');
  },

  // Quizzes
  async getQuizzes(): Promise<Quiz[]> {
    const res = await fetchWithAuth('/api/quizzes');
    if (!res.ok) throw new Error('Failed to fetch quizzes');
    const data = await res.json();
    return data.quizzes || [];
  },

  async saveQuiz(quiz: Quiz): Promise<Quiz> {
    const res = await fetchWithAuth('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quiz),
    });
    if (!res.ok) throw new Error('Failed to save quiz');
    const data = await res.json();
    return data.quiz;
  },

  async deleteQuiz(id: string): Promise<void> {
    const res = await fetchWithAuth(`/api/quizzes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete quiz');
  },

  // Flashcards
  async getFlashcards(): Promise<FlashcardDeck[]> {
    const res = await fetchWithAuth('/api/flashcards');
    if (!res.ok) throw new Error('Failed to fetch flashcards');
    const data = await res.json();
    return data.flashcards || [];
  },

  async saveFlashcards(deck: FlashcardDeck): Promise<FlashcardDeck> {
    const res = await fetchWithAuth('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deck),
    });
    if (!res.ok) throw new Error('Failed to save flashcards');
    const data = await res.json();
    return data.deck;
  },

  async deleteFlashcards(id: string): Promise<void> {
    const res = await fetchWithAuth(`/api/flashcards/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete flashcards');
  },

  // Health & Dashboard Statistics
  async getHealth(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getDashboardStats(): Promise<any> {
    const res = await fetchWithAuth('/api/dashboard');
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    const data = await res.json();
    return data.data;
  },
};

