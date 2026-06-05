import { NextResponse } from 'next/server';
import { salesBotFlow } from '@/lib/genkit';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const resolvedParams = await params;
    const appId = resolvedParams.appId;
    const body = await request.json();

    const { message } = body;
    let { threadId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Verify app exists
    const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Handle Thread initialization
    let thread;
    if (!threadId) {
      // Create new thread
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      thread = await prisma.thread.create({
        data: {
          appId,
          title
        }
      });
      threadId = thread.id;
    } else {
      thread = await prisma.thread.findUnique({ where: { id: threadId } });
      if (!thread || thread.appId !== appId) {
        return NextResponse.json({ error: 'Thread not found or belongs to another app' }, { status: 404 });
      }
    }

    // Save user message
    await prisma.message.create({
      data: {
        threadId,
        role: 'user',
        content: message
      }
    });

    // Fetch history from database
    const dbMessages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' }
    });

    // Format for Genkit history (exclude the newly added user message from history)
    const history = dbMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      content: [{ text: msg.content }]
    }));

    // Run the Genkit flow
    const responseText = await salesBotFlow({ appId, message, history });

    // Save model response
    await prisma.message.create({
      data: {
        threadId,
        role: 'model',
        content: responseText
      }
    });

    return NextResponse.json({
      text: responseText,
      threadId
    });
  } catch (error: any) {
    console.error('Bot API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
