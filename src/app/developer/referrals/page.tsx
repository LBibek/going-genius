import { getReferralStats } from '@/app/actions/referral';
import { ReferralPageClient } from './components/ReferralPageClient';

export default async function ReferralPage() {
  const stats = await getReferralStats();

  if ('error' in stats) {
    return <div>Error loading referrals: {stats.error}</div>;
  }

  return <ReferralPageClient stats={stats} />;
}
