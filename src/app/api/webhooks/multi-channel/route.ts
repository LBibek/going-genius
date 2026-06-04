import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { leadGenFlow } from '@/lib/ai/flows';

/**
 * Universal Multi-Channel Webhook Handler (WhatsApp & Viber)
 * Routes incoming messages to the AI Lead Gen flow.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Determine Source (WhatsApp or Viber)
    const isWhatsApp = body.object === 'whatsapp_business_account';
    const isViber = body.event === 'message';

    if (isWhatsApp) {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];
      const contact = value?.contacts?.[0];

      if (!message) return NextResponse.json({ received: true });

      const phoneNumber = contact?.wa_id;
      const text = message.text?.body;
      
      // WhatsApp requires verification of the phone ID to find the appId
      const phoneId = value?.metadata?.phone_number_id;
      const app = await prisma.oAuthApp.findFirst({
        where: { whatsappPhoneId: phoneId, whatsappEnabled: true }
      });

      if (!app || !text) return NextResponse.json({ error: 'App not configured' }, { status: 404 });

      // Run AI Flow
      const aiResponse = await leadGenFlow({
        appId: app.id,
        message: text,
        history: [] // We can expand this to fetch previous conversation history later
      });

      // WhatsApp API call to send back aiResponse.text
      if (app.whatsappAccessToken) {
        try {
          await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${app.whatsappAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: phoneNumber,
              type: 'text',
              text: { body: aiResponse.text }
            })
          });
          console.log(`[WhatsApp] Reply sent to ${phoneNumber}`);
        } catch (err) {
          console.error(`[WhatsApp] Failed to send reply to ${phoneNumber}`, err);
        }
      } else {
        console.warn(`[WhatsApp] Cannot send reply: missing whatsappAccessToken for app ${app.id}`);
      }

      return NextResponse.json({ success: true });
    }

    if (isViber) {
      const senderId = body.sender?.id;
      const text = body.message?.text;
      const authToken = req.headers.get('X-Viber-Auth-Token');

      const app = await prisma.oAuthApp.findFirst({
        where: { viberAuthToken: authToken, viberEnabled: true }
      });

      if (!app || !text) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      const aiResponse = await leadGenFlow({
        appId: app.id,
        message: text,
        history: []
      });

      // Viber API call to send back aiResponse.text
      if (app.viberAuthToken) {
        try {
          await fetch('https://chatapi.viber.com/pa/send_message', {
            method: 'POST',
            headers: {
              'X-Viber-Auth-Token': app.viberAuthToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              receiver: senderId,
              min_api_version: 1,
              sender: {
                name: app.name
              },
              type: 'text',
              text: aiResponse.text
            })
          });
          console.log(`[Viber] Reply sent to ${senderId}`);
        } catch (err) {
          console.error(`[Viber] Failed to send reply to ${senderId}`, err);
        }
      } else {
        console.warn(`[Viber] Cannot send reply: missing viberAuthToken for app ${app.id}`);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unsupported source' }, { status: 400 });
  } catch (error) {
    console.error('Multi-Channel Webhook Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Webhook Verification (WhatsApp specific)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token) {
    // Check across all apps for this verify token
    const app = await prisma.oAuthApp.findFirst({
      where: { whatsappWebhookVerifyToken: token }
    });

    if (app) {
      return new Response(challenge, { status: 200 });
    }
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
