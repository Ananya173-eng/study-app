import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, signToken } from '@/lib/auth';
import { dbService } from '@/lib/db-service';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify bcrypt password hash
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      major: user.major,
      targetWeeklyHours: user.targetWeeklyHours,
      streakDays: user.streakDays || 1,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      user: safeUser,
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error('Login route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
