import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, signToken } from '@/lib/auth';
import { dbService } from '@/lib/db-service';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, major, targetWeeklyHours } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name is required (minimum 2 characters)' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await dbService.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    // Hash password securely with bcrypt
    const passwordHash = await hashPassword(password);

    // Create user in PostgreSQL database via Prisma
    const newUser = await dbService.createUser({
      email,
      passwordHash,
      name: name.trim(),
      major: major || 'Computer Science & AI',
      targetWeeklyHours: Number(targetWeeklyHours) || 25,
    });

    // Generate secure JWT token
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      major: newUser.major,
      targetWeeklyHours: newUser.targetWeeklyHours,
      streakDays: newUser.streakDays || 1,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully',
        user: safeUser,
        token,
      },
      { status: 201 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Registration route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to register account' },
      { status: 500 }
    );
  }
}
