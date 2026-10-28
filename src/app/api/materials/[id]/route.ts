import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { dbService } from '@/lib/db-service';
import { deleteFromStorage } from '@/lib/s3';

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
    const updated = await dbService.saveMaterial(userId, {
      ...body,
      id,
      userId,
    });

    return NextResponse.json({ success: true, material: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update material' },
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

    // Check material to see if it has an S3 key to clean up
    const materials = await dbService.getMaterials(userId);
    const found = materials.find((m) => m.id === id);

    if (found && (found as any).s3Key) {
      await deleteFromStorage((found as any).s3Key);
    }

    await dbService.deleteMaterial(userId, id);
    return NextResponse.json({ success: true, message: 'Material and file deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to delete material' },
      { status: 500 }
    );
  }
}
