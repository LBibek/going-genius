import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolvedParams = await params;
    const appId = resolvedParams.appId;

    // Verify app ownership
    const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
    if (!app || app.ownerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const threads = await prisma.thread.findMany({
      where: { appId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        userId: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error('Developer Threads API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
