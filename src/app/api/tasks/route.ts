import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';
import { Task } from '@/types';

export const runtime = 'nodejs';

// GET all tasks for current authenticated user
export async function GET(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const tasks = await dbService.getTasks(userId);
    return NextResponse.json({ success: true, tasks });
  } catch (err: any) {
    console.error('Error fetching tasks:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST create or upsert a task (or batch of tasks)
export async function POST(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const body = await req.json();

    // Check if batch of tasks is being added (e.g. from AI Planner)
    if (Array.isArray(body.tasks)) {
      const savedTasks: Task[] = [];
      for (const t of body.tasks) {
        const item: Task = {
          id: t.id || `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId,
          title: t.title || 'Untitled Task',
          description: t.description || '',
          category: t.category || 'General',
          priority: t.priority || 'medium',
          status: t.status || 'todo',
          deadline: t.deadline || new Date().toISOString(),
          createdAt: t.createdAt || new Date().toISOString(),
          completedAt: t.completedAt,
        };
        const saved = await dbService.saveTask(userId, item);
        savedTasks.push(saved);
      }
      return NextResponse.json({ success: true, tasks: savedTasks }, { status: 201 });
    }

    const taskId = body.id || `task_${Date.now()}`;
    const taskToSave: Task = {
      id: taskId,
      userId,
      title: body.title || 'Untitled Task',
      description: body.description || '',
      category: body.category || 'General',
      priority: body.priority || 'medium',
      status: body.status || 'todo',
      deadline: body.deadline || new Date().toISOString(),
      createdAt: body.createdAt || new Date().toISOString(),
      completedAt: body.completedAt,
    };

    const saved = await dbService.saveTask(userId, taskToSave);
    return NextResponse.json({ success: true, task: saved }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving task:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to save task' },
      { status: 500 }
    );
  }
}
