import { prisma } from './prisma';
import { Note, Task, StudyMaterial, Quiz, FlashcardDeck, User } from '@/types';
import { hashPassword } from './auth';

// In-memory / persistent resilient fallback for when PostgreSQL server is not yet provisioned
class ResilientStore {
  private users: Map<string, any> = new Map();
  private notes: Map<string, Note[]> = new Map();
  private tasks: Map<string, Task[]> = new Map();
  private materials: Map<string, StudyMaterial[]> = new Map();
  private quizzes: Map<string, Quiz[]> = new Map();
  private flashcards: Map<string, FlashcardDeck[]> = new Map();

  constructor() {
    this.seedDemo();
  }

  private async seedDemo() {
    const defaultId = 'user_default';
    this.users.set('alex.rivera@university.edu', {
      id: defaultId,
      email: 'alex.rivera@university.edu',
      passwordHash: await hashPassword('password123'),
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      major: 'Computer Science & AI',
      targetWeeklyHours: 25,
      streakDays: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  getUserByEmail(email: string) {
    return this.users.get(email.toLowerCase()) || null;
  }

  getUserById(id: string) {
    for (const u of this.users.values()) {
      if (u.id === id) return u;
    }
    return null;
  }

  saveUser(user: any) {
    this.users.set(user.email.toLowerCase(), user);
    return user;
  }

  getNotes(userId: string): Note[] {
    return this.notes.get(userId) || [];
  }

  saveNote(userId: string, note: Note): Note {
    const list = this.getNotes(userId);
    const idx = list.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      list[idx] = note;
    } else {
      list.unshift(note);
    }
    this.notes.set(userId, list);
    return note;
  }

  deleteNote(userId: string, noteId: string): boolean {
    const list = this.getNotes(userId);
    this.notes.set(userId, list.filter((n) => n.id !== noteId));
    return true;
  }

  getTasks(userId: string): Task[] {
    return this.tasks.get(userId) || [];
  }

  saveTask(userId: string, task: Task): Task {
    const list = this.getTasks(userId);
    const idx = list.findIndex((t) => t.id === task.id);
    if (idx >= 0) {
      list[idx] = task;
    } else {
      list.unshift(task);
    }
    this.tasks.set(userId, list);
    return task;
  }

  deleteTask(userId: string, taskId: string): boolean {
    const list = this.getTasks(userId);
    this.tasks.set(userId, list.filter((t) => t.id !== taskId));
    return true;
  }

  getMaterials(userId: string): StudyMaterial[] {
    return this.materials.get(userId) || [];
  }

  saveMaterial(userId: string, mat: StudyMaterial): StudyMaterial {
    const list = this.getMaterials(userId);
    const idx = list.findIndex((m) => m.id === mat.id);
    if (idx >= 0) {
      list[idx] = mat;
    } else {
      list.unshift(mat);
    }
    this.materials.set(userId, list);
    return mat;
  }

  deleteMaterial(userId: string, matId: string): boolean {
    const list = this.getMaterials(userId);
    this.materials.set(userId, list.filter((m) => m.id !== matId));
    return true;
  }

  getQuizzes(userId: string): Quiz[] {
    return this.quizzes.get(userId) || [];
  }

  saveQuiz(userId: string, quiz: Quiz): Quiz {
    const list = this.getQuizzes(userId);
    const idx = list.findIndex((q) => q.id === quiz.id);
    if (idx >= 0) {
      list[idx] = quiz;
    } else {
      list.unshift(quiz);
    }
    this.quizzes.set(userId, list);
    return quiz;
  }

  deleteQuiz(userId: string, quizId: string): boolean {
    const list = this.getQuizzes(userId);
    this.quizzes.set(userId, list.filter((q) => q.id !== quizId));
    return true;
  }

  getFlashcards(userId: string): FlashcardDeck[] {
    return this.flashcards.get(userId) || [];
  }

  saveFlashcards(userId: string, deck: FlashcardDeck): FlashcardDeck {
    const list = this.getFlashcards(userId);
    const idx = list.findIndex((d) => d.id === deck.id);
    if (idx >= 0) {
      list[idx] = deck;
    } else {
      list.unshift(deck);
    }
    this.flashcards.set(userId, list);
    return deck;
  }

  deleteFlashcards(userId: string, deckId: string): boolean {
    const list = this.getFlashcards(userId);
    this.flashcards.set(userId, list.filter((d) => d.id !== deckId));
    return true;
  }
}

const resilientStore = new ResilientStore();

export const dbService = {
  // Check if PostgreSQL is actively connected
  async isPostgresConnected(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  },

  // USERS
  async findUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (err) {
      return resilientStore.getUserByEmail(email);
    }
  },

  async findUserById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (err) {
      return resilientStore.getUserById(id);
    }
  },

  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
    major?: string;
    targetWeeklyHours?: number;
  }) {
    try {
      return await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          passwordHash: data.passwordHash,
          name: data.name,
          major: data.major || 'Computer Science & AI',
          targetWeeklyHours: data.targetWeeklyHours || 25,
          streakDays: 1,
        },
      });
    } catch (err) {
      const newUser = {
        id: `user_${Date.now()}`,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        name: data.name,
        major: data.major || 'Computer Science & AI',
        targetWeeklyHours: data.targetWeeklyHours || 25,
        streakDays: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return resilientStore.saveUser(newUser);
    }
  },

  async updateUser(id: string, data: Partial<User>) {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          major: data.major,
          targetWeeklyHours: data.targetWeeklyHours,
          streakDays: data.streakDays,
        },
      });
    } catch (err) {
      const existing = resilientStore.getUserById(id);
      if (existing) {
        Object.assign(existing, data);
        resilientStore.saveUser(existing);
      }
      return existing;
    }
  },

  // NOTES (Strictly isolated by userId)
  async getNotes(userId: string): Promise<Note[]> {
    try {
      const records = await prisma.note.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });
      return records.map((n: any) => ({
        id: n.id,
        userId: n.userId,
        title: n.title,
        content: n.content,
        category: n.category,
        tags: n.tags,
        priority: n.priority as any,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      }));
    } catch (err) {
      return resilientStore.getNotes(userId);
    }
  },

  async saveNote(userId: string, note: Note): Promise<Note> {
    try {
      const record = await prisma.note.upsert({
        where: { id: note.id },
        create: {
          id: note.id,
          userId,
          title: note.title,
          content: note.content,
          category: note.category || 'General',
          tags: note.tags || [],
          priority: note.priority || 'medium',
        },
        update: {
          title: note.title,
          content: note.content,
          category: note.category,
          tags: note.tags,
          priority: note.priority,
          updatedAt: new Date(),
        },
      });
      return {
        id: record.id,
        userId: record.userId,
        title: record.title,
        content: record.content,
        category: record.category,
        tags: record.tags,
        priority: record.priority as any,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
      };
    } catch (err) {
      return resilientStore.saveNote(userId, note);
    }
  },

  async deleteNote(userId: string, noteId: string): Promise<boolean> {
    try {
      await prisma.note.deleteMany({
        where: { id: noteId, userId },
      });
      return true;
    } catch (err) {
      return resilientStore.deleteNote(userId, noteId);
    }
  },

  // TASKS (Strictly isolated by userId)
  async getTasks(userId: string): Promise<Task[]> {
    try {
      const records = await prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((t: any) => ({
        id: t.id,
        userId: t.userId,
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority as any,
        status: t.status as any,
        deadline: t.deadline,
        createdAt: t.createdAt.toISOString(),
        completedAt: t.completedAt ? t.completedAt.toISOString() : undefined,
      }));
    } catch (err) {
      return resilientStore.getTasks(userId);
    }
  },

  async saveTask(userId: string, task: Task): Promise<Task> {
    try {
      const record = await prisma.task.upsert({
        where: { id: task.id },
        create: {
          id: task.id,
          userId,
          title: task.title,
          description: task.description || '',
          category: task.category || 'General',
          priority: task.priority || 'medium',
          status: task.status || 'todo',
          deadline: task.deadline,
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
        },
        update: {
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
          status: task.status,
          deadline: task.deadline,
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
          updatedAt: new Date(),
        },
      });
      return {
        id: record.id,
        userId: record.userId,
        title: record.title,
        description: record.description,
        category: record.category,
        priority: record.priority as any,
        status: record.status as any,
        deadline: record.deadline,
        createdAt: record.createdAt.toISOString(),
        completedAt: record.completedAt ? record.completedAt.toISOString() : undefined,
      };
    } catch (err) {
      return resilientStore.saveTask(userId, task);
    }
  },

  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    try {
      await prisma.task.deleteMany({
        where: { id: taskId, userId },
      });
      return true;
    } catch (err) {
      return resilientStore.deleteTask(userId, taskId);
    }
  },

  // STUDY MATERIALS (Strictly isolated by userId)
  async getMaterials(userId: string): Promise<StudyMaterial[]> {
    try {
      const records = await prisma.studyMaterial.findMany({
        where: { userId },
        orderBy: { uploadDate: 'desc' },
      });
      return records.map((m: any) => ({
        id: m.id,
        userId: m.userId,
        name: m.name,
        originalName: m.originalName,
        fileSize: m.fileSize,
        fileSizeFormatted: m.fileSizeFormatted,
        mimeType: m.mimeType,
        uploadDate: m.uploadDate.toISOString(),
        textSnippet: m.textSnippet,
        fullText: m.fullText,
        pageCount: m.pageCount,
        tags: m.tags,
        isAnalyzed: m.isAnalyzed,
        contentHash: m.contentHash || undefined,
        fileUrl: m.fileUrl || undefined,
        s3Key: m.s3Key || undefined,
      }));
    } catch (err) {
      return resilientStore.getMaterials(userId);
    }
  },

  async saveMaterial(userId: string, mat: StudyMaterial): Promise<StudyMaterial> {
    try {
      const record = await prisma.studyMaterial.upsert({
        where: { id: mat.id },
        create: {
          id: mat.id,
          userId,
          name: mat.name,
          originalName: mat.originalName || mat.name,
          fileSize: mat.fileSize || 0,
          fileSizeFormatted: mat.fileSizeFormatted || '0 Bytes',
          mimeType: mat.mimeType || 'application/pdf',
          textSnippet: mat.textSnippet || '',
          fullText: mat.fullText || '',
          pageCount: mat.pageCount || 1,
          tags: mat.tags || [],
          isAnalyzed: Boolean(mat.isAnalyzed),
          contentHash: mat.contentHash || null,
          fileUrl: (mat as any).fileUrl || null,
          s3Key: (mat as any).s3Key || null,
        },
        update: {
          name: mat.name,
          tags: mat.tags,
          fullText: mat.fullText,
          textSnippet: mat.textSnippet,
          isAnalyzed: mat.isAnalyzed,
        },
      });
      return {
        id: record.id,
        userId: record.userId,
        name: record.name,
        originalName: record.originalName,
        fileSize: record.fileSize,
        fileSizeFormatted: record.fileSizeFormatted,
        mimeType: record.mimeType,
        uploadDate: record.uploadDate.toISOString(),
        textSnippet: record.textSnippet,
        fullText: record.fullText,
        pageCount: record.pageCount,
        tags: record.tags,
        isAnalyzed: record.isAnalyzed,
        contentHash: record.contentHash || undefined,
      };
    } catch (err) {
      return resilientStore.saveMaterial(userId, mat);
    }
  },

  async deleteMaterial(userId: string, matId: string): Promise<boolean> {
    try {
      await prisma.studyMaterial.deleteMany({
        where: { id: matId, userId },
      });
      return true;
    } catch (err) {
      return resilientStore.deleteMaterial(userId, matId);
    }
  },

  // QUIZZES (Strictly isolated by userId)
  async getQuizzes(userId: string): Promise<Quiz[]> {
    try {
      const records = await prisma.quiz.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((q: any) => ({
        id: q.id,
        title: q.title,
        sourceType: q.sourceType as any,
        sourceTitle: q.sourceTitle,
        questions: q.questions as any,
        bestScore: q.bestScore || undefined,
        createdAt: q.createdAt.toISOString(),
      }));
    } catch (err) {
      return resilientStore.getQuizzes(userId);
    }
  },

  async saveQuiz(userId: string, quiz: Quiz): Promise<Quiz> {
    try {
      const record = await prisma.quiz.upsert({
        where: { id: quiz.id },
        create: {
          id: quiz.id,
          userId,
          title: quiz.title,
          sourceType: quiz.sourceType,
          sourceTitle: quiz.sourceTitle,
          questions: quiz.questions as any,
          bestScore: quiz.bestScore || null,
        },
        update: {
          title: quiz.title,
          bestScore: quiz.bestScore || null,
          questions: quiz.questions as any,
        },
      });
      return {
        id: record.id,
        title: record.title,
        sourceType: record.sourceType as any,
        sourceTitle: record.sourceTitle,
        questions: record.questions as any,
        bestScore: record.bestScore || undefined,
        createdAt: record.createdAt.toISOString(),
      };
    } catch (err) {
      return resilientStore.saveQuiz(userId, quiz);
    }
  },

  async deleteQuiz(userId: string, quizId: string): Promise<boolean> {
    try {
      await prisma.quiz.deleteMany({
        where: { id: quizId, userId },
      });
      return true;
    } catch (err) {
      return resilientStore.deleteQuiz(userId, quizId);
    }
  },

  // FLASHCARDS (Strictly isolated by userId)
  async getFlashcards(userId: string): Promise<FlashcardDeck[]> {
    try {
      const records = await prisma.flashcardDeck.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return records.map((d: any) => ({
        id: d.id,
        title: d.title,
        sourceType: d.sourceType as any,
        sourceTitle: d.sourceTitle,
        cards: d.cards as any,
        createdAt: d.createdAt.toISOString(),
      }));
    } catch (err) {
      return resilientStore.getFlashcards(userId);
    }
  },

  async saveFlashcards(userId: string, deck: FlashcardDeck): Promise<FlashcardDeck> {
    try {
      const record = await prisma.flashcardDeck.upsert({
        where: { id: deck.id },
        create: {
          id: deck.id,
          userId,
          title: deck.title,
          sourceType: deck.sourceType,
          sourceTitle: deck.sourceTitle,
          cards: deck.cards as any,
        },
        update: {
          title: deck.title,
          cards: deck.cards as any,
        },
      });
      return {
        id: record.id,
        title: record.title,
        sourceType: record.sourceType as any,
        sourceTitle: record.sourceTitle,
        cards: record.cards as any,
        createdAt: record.createdAt.toISOString(),
      };
    } catch (err) {
      return resilientStore.saveFlashcards(userId, deck);
    }
  },

  async deleteFlashcards(userId: string, deckId: string): Promise<boolean> {
    try {
      await prisma.flashcardDeck.deleteMany({
        where: { id: deckId, userId },
      });
      return true;
    } catch (err) {
      return resilientStore.deleteFlashcards(userId, deckId);
    }
  },

  // DASHBOARD STATISTICS
  async getDashboardStats(userId: string) {
    try {
      const [
        totalNotes,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        upcomingTasks,
      ] = await Promise.all([
        prisma.note.count({ where: { userId } }),
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: 'completed' } }),
        prisma.task.count({ where: { userId, status: 'in-progress' } }),
        prisma.task.count({ where: { userId, status: 'todo' } }),
        prisma.task.findMany({
          where: {
            userId,
            status: { not: 'completed' },
          },
          orderBy: { deadline: 'asc' },
          take: 5,
        }),
      ]);

      const completionPercentage =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      return {
        statistics: {
          totalNotes,
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          completionPercentage,
        },
        upcomingDeadlines: upcomingTasks.map((t: any) => ({
          id: t.id,
          title: t.title,
          deadline: t.deadline,
          status: t.status,
          priority: t.priority,
        })),
      };
    } catch {
      const notes = resilientStore.getNotes(userId);
      const tasks = resilientStore.getTasks(userId);
      const completedTasks = tasks.filter((t) => t.status === 'completed').length;
      const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
      const todoTasks = tasks.filter((t) => t.status === 'todo').length;
      const totalTasks = tasks.length;
      const completionPercentage =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      const upcomingDeadlines = tasks
        .filter((t) => t.status !== 'completed')
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          title: t.title,
          deadline: t.deadline,
          status: t.status,
          priority: t.priority,
        }));

      return {
        statistics: {
          totalNotes: notes.length,
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          completionPercentage,
        },
        upcomingDeadlines,
      };
    }
  },
};

