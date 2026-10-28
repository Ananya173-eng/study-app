import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const user = await dbService.findUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      major: user.major,
      targetWeeklyHours: user.targetWeeklyHours,
      streakDays: user.streakDays || 1,
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch current user' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const updated = await dbService.updateUser(session.userId, body);

    return NextResponse.json({
      success: true,
      user: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
