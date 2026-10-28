import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';
import { FlashcardDeck } from '@/types';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const flashcards = await dbService.getFlashcards(userId);
    return NextResponse.json({ success: true, flashcards });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const body = await req.json();
    const deckId = body.id || `deck_${Date.now()}`;

    const deckToSave: FlashcardDeck = {
      id: deckId,
      title: body.title || 'Untitled Flashcard Deck',
      sourceType: body.sourceType || 'custom',
      sourceTitle: body.sourceTitle || '',
      cards: body.cards || [],
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const saved = await dbService.saveFlashcards(userId, deckToSave);
    return NextResponse.json({ success: true, deck: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save flashcard deck' },
      { status: 500 }
    );
  }
}
