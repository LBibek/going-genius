import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolvedParams = await params;
    const threadId = resolvedParams.threadId;

    const thread = await prisma.thread.findUnique({
      where: { id: threadId }
    });

    if (!thread || thread.userId !== session.userId) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Thread Messages API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
