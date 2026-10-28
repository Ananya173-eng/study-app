import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthenticatedUser(req);
    const userId = session?.userId || 'user_default';

    const data = await dbService.getDashboardStats(userId);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error('Dashboard stats route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
