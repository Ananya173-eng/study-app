import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';

export const runtime = 'nodejs';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';
    const { id } = await params;

    await dbService.deleteQuiz(userId, id);
    return NextResponse.json({ success: true, message: 'Quiz deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}
