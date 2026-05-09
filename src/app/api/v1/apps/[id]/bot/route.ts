import { NextResponse } from 'next/server';
import { appBotFlow } from '@/lib/ai/flows';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { message, history } = body;

    // 1. Basic Validation
    if (!id || !message) {
      return NextResponse.json({ error: 'Missing appId or message' }, { status: 400 });
    }

    // 2. Fetch App Configuration to ensure it exists
    const app = await prisma.oAuthApp.findUnique({
      where: { id },
      select: { id: true, name: true }
    });

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // 3. Run the Flow directly
    // Since we are in a server component/route, we call the flow function directly.
    const result = await appBotFlow({
      appId: id,
      message,
      history
    });

    // 4. Set CORS headers for the SDK
    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    console.error('Public AI Agent Error:', error);
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
