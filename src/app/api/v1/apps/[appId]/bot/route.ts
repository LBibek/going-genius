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

    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Verify app exists
    const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Run the Genkit flow
    const responseText = await salesBotFlow({ appId, message, history });

    return NextResponse.json({
      text: responseText,
      // Provide a mock threadId for stateful persistence if they want to implement memory later
      threadId: body.threadId || `thread_${Date.now()}`
    });
  } catch (error: any) {
    console.error('Bot API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
