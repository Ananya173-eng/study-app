import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Study Hub API is running',
  });
}
