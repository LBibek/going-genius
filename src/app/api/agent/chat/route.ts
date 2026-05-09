/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { appBotFlow } from '@/lib/ai/flows';
import { getSession } from '@/lib/session';
import { UsageMonitor } from '@/lib/usage';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, appId, history } = await req.json();

    if (!message || !appId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Run the Genkit Flow
    const result: any = await appBotFlow.run({
      appId,
      message,
      history: history || []
    });

    // Track AI Usage (Asynchronous - don't block response)
    UsageMonitor.trackAiTokens({
      appId,
      userId: session.userId,
      model: result.model || 'gemini-1.5-flash',
      tokens: result.usage?.totalTokens || 0
    }).catch(err => console.error('Usage tracking failed:', err));

    return NextResponse.json({ reply: result.text || result });
  } catch (error: any) {
    console.error('AI Agent Chat Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response', 
      details: error.message 
    }, { status: 500 });
  }
}
