import { NextResponse } from 'next/server';
import { appBotFlow } from '@/lib/ai/flows';
import { getSession } from '@/lib/session';
import { UsageMonitor } from '@/lib/usage';
import { AiChatRequest } from '@/lib/definitions';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AiChatRequest = await req.json();
    const { message, appId, history } = body;

    if (!message || !appId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Run the Genkit Flow (Unified appBotFlow handles lead capture dynamically)
    const result = await appBotFlow.run({
      appId,
      message,
      history: history || []
    }) as any;

    const reply = typeof result === 'string' ? result : result.text;
    const model = result.model || 'gemini-2.0-flash';
    const tokens = result.usage?.totalTokens || 0;

    // Track AI Usage (Asynchronous - don't block response)
    UsageMonitor.trackAiTokens({
      appId,
      userId: session.userId,
      model,
      tokens
    }).catch(err => console.error('[MCP AI] Usage tracking failed:', err));

    return NextResponse.json({ 
      reply,
      model,
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
