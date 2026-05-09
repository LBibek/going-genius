import { NextResponse } from 'next/server';
import { appBotFlow } from '@/lib/ai/flows';
import { prisma } from '@/lib/prisma';
import { captureError } from '@/lib/monitoring';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { message, history, threadId, userId } = body;

    if (!id || !message) {
      return NextResponse.json({ error: 'Missing appId or message' }, { status: 400 });
    }

    // Verify the app exists
    const app = await prisma.oAuthApp.findUnique({
      where: { id },
      select: { id: true, name: true }
    });

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Run the AI flow (handles memory internally)
    const result = await appBotFlow({
      appId: id,
      message,
      threadId,  // Pass through for memory persistence
      userId,    // Optional: tie to a user
      history
    });

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error: any) {
    captureError(error, { appId: 'unknown', action: 'public_bot_api' });
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
