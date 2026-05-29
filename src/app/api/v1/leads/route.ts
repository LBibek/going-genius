import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const leadSchema = z.object({
  appId: z.string().min(1),
  name: z.string().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  source: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = leadSchema.parse(body);

    if (!parsed.email && !parsed.phone) {
       return NextResponse.json({ error: 'Either email or phone is required' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Verify appId exists
    const app = await prisma.oAuthApp.findUnique({
      where: { id: parsed.appId }
    });

    if (!app) {
      return NextResponse.json({ error: 'Invalid application ID' }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const lead = await prisma.lead.create({
      data: {
        appId: parsed.appId,
        name: parsed.name || null,
        email: parsed.email || null,
        phone: parsed.phone || null,
        source: parsed.source || 'Embedded Form',
        metadata: parsed.metadata || {},
        status: 'NEW'
      }
    });

    return NextResponse.json({ success: true, lead }, {
      status: 201,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error: any) {
    console.error('Lead capture error:', error);
    return NextResponse.json({ error: 'Failed to capture lead. Invalid data provided.' }, { 
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
