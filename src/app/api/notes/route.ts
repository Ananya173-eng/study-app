import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';
import { Note } from '@/types';

export const runtime = 'nodejs';

// GET all notes for the authenticated user (strict user isolation)
export async function GET(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const notes = await dbService.getNotes(userId);
    return NextResponse.json({ success: true, notes });
  } catch (err: any) {
    console.error('Error fetching notes:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST create or upsert a note for authenticated user
export async function POST(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const body = await req.json();
    const noteId = body.id || `note_${Date.now()}`;

    const noteToSave: Note = {
      id: noteId,
      userId,
      title: body.title || 'Untitled Note',
      content: body.content || '',
      category: body.category || 'General',
      tags: Array.isArray(body.tags) ? body.tags : [],
      priority: body.priority || 'medium',
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await dbService.saveNote(userId, noteToSave);
    return NextResponse.json({ success: true, note: saved }, { status: 201 });
  } catch (err: any) {
    console.error('Error saving note:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to save note' },
      { status: 500 }
    );
  }
}
