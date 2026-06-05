import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.EMAIL_FROM || 'Going Genius <noreply@going-genius.com>';

export async function sendEmail({
  to,
  subject,
  html,
  text
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!resend) {
    console.log(`\n\n[MOCK EMAIL] To: ${to}\nSubject: ${subject}\n\n${text || html}\n\n`);
    return { success: true, messageId: 'mock-id' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || '', // Fallback for text
    });

    if (data.error) {
      console.error('[EMAIL ERROR]', data.error);
      return { success: false, error: data.error };
    }

    return { success: true, messageId: data.data?.id };
  } catch (error) {
    console.error('[EMAIL CATCH ERROR]', error);
    return { success: false, error };
  }
}

// Pre-built Templates
export async function sendPaymentReceipt(to: string, planName: string, amount: number, currency: string) {
  const subject = `Your Receipt for ${planName}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you for your purchase!</h2>
      <p>We've received your payment of <strong>${currency} ${amount}</strong> for the <strong>${planName}</strong> subscription.</p>
      <p>Your account is now active.</p>
      <hr style="border: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="color: #666; font-size: 12px;">Going Genius Identity Platform</p>
    </div>
  `;
  
  return sendEmail({ to, subject, html });
}

export async function sendAppInvite(to: string, appName: string, inviteUrl: string) {
  const subject = `You've been invited to join ${appName}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Collaboration Invite</h2>
      <p>You have been invited to collaborate on the application <strong>${appName}</strong> on Going Genius.</p>
      <a href="${inviteUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 10px;">Accept Invitation</a>
      <p style="margin-top: 20px; font-size: 14px; color: #666;">Or copy and paste this URL into your browser: ${inviteUrl}</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}
