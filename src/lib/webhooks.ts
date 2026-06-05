import crypto from 'crypto';

export type WebhookEvent = 'subscription.created' | 'subscription.updated' | 'payment.failed';

/**
 * Dispatches a webhook to the specified URL, signed with the secret.
 */
export async function dispatchWebhook(
  url: string,
  secret: string,
  event: WebhookEvent,
  payload: any
) {
  try {
    const body = JSON.stringify({
      id: crypto.randomUUID(),
      event,
      timestamp: new Date().toISOString(),
      data: payload
    });

    // Generate HMAC SHA256 signature
    const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gg-signature': signature,
        'x-gg-event': event,
      },
      body,
    });

    if (!response.ok) {
      console.error(`[Webhook] Failed to deliver ${event} to ${url}. Status: ${response.status}`);
      return false;
    }

    console.log(`[Webhook] Delivered ${event} to ${url}`);
    return true;
  } catch (error) {
    console.error(`[Webhook] Network error delivering ${event} to ${url}:`, error);
    return false;
  }
}
