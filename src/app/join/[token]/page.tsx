/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-html-link-for-pages */
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

export default async function JoinPage({ params }: { params: { token: string } }) {
  const { token } = await params;

  const invite = await prisma.appInvite.findUnique({
    where: { token },
    include: { app: true }
  });

  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return (
      <div className="auth-layout">
        <div className="auth-card animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
          <h1 className="auth-title">Invalid or Expired</h1>
          <p className="auth-subtitle">This invitation link is no longer valid or has expired.</p>
          <a href="/" className="btn btn-primary" style={{ background: 'var(--primary)', color: '#000', width: '100%', justifyContent: 'center' }}>
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const session = await getSession();

  if (session) {
    // User is logged in, link them immediately
    await prisma.appUser.upsert({
      where: { appId_userId: { appId: invite.appId, userId: session.userId } },
      update: { isActive: true },
      create: { appId: invite.appId, userId: session.userId },
    });

    // Mark invite as used if it was specific to an email
    if (invite.email) {
      await prisma.appInvite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() }
      });
    }

    // Redirect to the app's first redirect URI or dashboard
    redirect(invite.app.redirectUris[0] || '/dashboard');
  }

  // Not logged in, redirect to register with the invite token
  redirect(`/auth/register?invite=${token}&app=${invite.appId}`);
}
