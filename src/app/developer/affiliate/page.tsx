import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AffiliateDashboardClient } from './AffiliateDashboardClient';

export default async function AffiliateDashboardPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    include: {
      referralEarnings: {
        orderBy: { createdAt: 'desc' },
        include: {
          referred: {
            select: { displayName: true, username: true }
          }
        }
      }
    }
  });

  if (!user) redirect('/auth/login');

  // Calculate stats
  const totalReferrals = user.referralEarnings.length;
  const pendingCommissions = user.referralEarnings.filter((r: any) => r.status === 'PENDING').reduce((acc: number, r: any) => acc + r.amount, 0);
  const paidCommissions = user.referralEarnings.filter((r: any) => r.status === 'PAID').reduce((acc: number, r: any) => acc + r.amount, 0);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="fluid-h2" style={{ margin: 0 }}>Creator Affiliate Program</h1>
        <p style={{ color: 'var(--muted)' }}>Invite developers and earn 20% lifetime commission on their paid apps.</p>
      </div>

      <AffiliateDashboardClient 
        user={user} 
        stats={{ totalReferrals, pendingCommissions, paidCommissions }} 
      />
    </div>
  );
}
