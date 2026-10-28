import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';
import { Quiz } from '@/types';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const quizzes = await dbService.getQuizzes(userId);
    return NextResponse.json({ success: true, quizzes });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const body = await req.json();
    const quizId = body.id || `quiz_${Date.now()}`;

    const quizToSave: Quiz = {
      id: quizId,
      title: body.title || 'Untitled Quiz',
      sourceType: body.sourceType || 'topic',
      sourceTitle: body.sourceTitle || '',
      questions: body.questions || [],
      bestScore: body.bestScore,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const saved = await dbService.saveQuiz(userId, quizToSave);
    return NextResponse.json({ success: true, quiz: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save quiz' },
      { status: 500 }
    );
  }
}
