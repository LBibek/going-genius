import { NextResponse } from 'next/server';
import { appBotFlow } from '@/lib/ai/flows';
import { getSession } from '@/lib/session';
import { UsageMonitor } from '@/lib/usage';
import { AiChatRequest } from '@/lib/definitions';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AiChatRequest = await req.json();
    const { message, appId } = body;
    let { threadId } = body as any;

    if (!message || !appId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle Thread initialization
    let thread;
    if (!threadId) {
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      thread = await prisma.thread.create({
        data: {
          appId,
          userId: session.userId,
          title
        }
      });
      threadId = thread.id;
    } else {
      thread = await prisma.thread.findUnique({ where: { id: threadId } });
      if (!thread || thread.appId !== appId || thread.userId !== session.userId) {
        return NextResponse.json({ error: 'Thread not found or forbidden' }, { status: 404 });
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

    // Format for Genkit history (exclude the newly added user message)
    const history = dbMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      content: [{ text: msg.content }]
    }));

    // Run the Genkit Flow
    const result = await appBotFlow.run({
      appId,
      message,
      history: history as any
    }) as any;

    const reply = typeof result === 'string' ? result : result.text;
    const model = result.model || 'gemini-2.0-flash';
    const tokens = result.usage?.totalTokens || 0;

    // Save model response
    await prisma.message.create({
      data: {
        threadId,
        role: 'model',
        content: reply
      }
    });

    // Track AI Usage
    UsageMonitor.trackAiTokens({
      appId,
      userId: session.userId,
      model,
      tokens
    }).catch(err => console.error('[MCP AI] Usage tracking failed:', err));

    return NextResponse.json({ 
      reply,
      model,
      threadId,
      usage: { totalTokens: tokens }
    });
  } catch (error: any) {
    console.error('[MCP AI] Agent Chat Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response', 
      details: error.message 
    }, { status: 500 });
  }
}
