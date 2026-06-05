import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ error: 'App ID required' }, { status: 400 });
    }

    const threads = await prisma.thread.findMany({
      where: {
        appId,
        userId: session.userId
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error('Threads API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
