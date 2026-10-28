import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';

export const runtime = 'nodejs';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';
    const { id } = await params;

    const body = await req.json();
    const task = await dbService.saveTask(userId, {
      ...body,
      id,
      userId,
    });

    return NextResponse.json({ success: true, task });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';
    const { id } = await params;

    await dbService.deleteTask(userId, id);
    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to delete task' },
      { status: 500 }
    );
  }
}
