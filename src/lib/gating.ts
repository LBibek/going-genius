import { getSession } from './session';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';

export async function hasAccessToPlan(appId: string, planId: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const subscription = await prisma.subscription.findUnique({
    where: { appId_userId: { appId, userId: session.userId } }
  });

  if (!subscription || subscription.status !== 'active') return false;

  // Ideally, if a user has a higher tier plan, they should access lower tier content.
  // For simplicity in this demo, we check exact planId match.
  // You could expand this by fetching the plans and comparing prices.
  return subscription.planId === planId;
}

export async function requirePlan(appId: string, planId: string, redirectTo: string = '/auth/login') {
  const hasAccess = await hasAccessToPlan(appId, planId);
  if (!hasAccess) {
    redirect(redirectTo);
  }
}
