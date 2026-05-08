import { NextResponse } from 'next/server';
import { appBotFlow } from '@/lib/ai/flows';
import { getSession } from '@/lib/session';

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
    const result = await appBotFlow.run({
      appId,
      message,
      history: history || []
    });

    return NextResponse.json({ reply: result.text });
  } catch (error: any) {
    console.error('AI Agent Chat Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate response', 
      details: error.message 
    }, { status: 500 });
  }
}
