'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function getReferralStats() {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    include: {
      referrals: true,
      referralEarnings: true
    }
  });

  if (!user) return { error: 'User not found' };

  // If user doesn't have a referral code yet, generate one
  if (!user.referralCode) {
    const code = crypto.randomBytes(5).toString('hex').toUpperCase();
    await prisma.gGUser.update({
      where: { id: session.userId },
      data: { referralCode: code }
    });
    user.referralCode = code;
  }

  const totalEarned = user.referralEarnings.reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const pendingAmount = user.referralEarnings
    .filter((e: any) => e.status === 'PENDING')
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

  return {
    referralCode: user.referralCode,
    referralCount: user.referrals.length,
    totalEarned,
    pendingAmount,
    history: user.referralEarnings
  };
}

export async function applyReferralCode(code: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const currentUser = await prisma.gGUser.findUnique({
    where: { id: session.userId }
  });

  if (currentUser?.referredById) {
    return { error: 'You have already been referred.' };
  }

  const referrer = await prisma.gGUser.findUnique({
    where: { referralCode: code }
  });

  if (!referrer) {
    return { error: 'Invalid referral code.' };
  }

  if (referrer.id === session.userId) {
    return { error: 'You cannot refer yourself.' };
  }

  await prisma.gGUser.update({
    where: { id: session.userId },
    data: { referredById: referrer.id }
  });

  revalidatePath('/developer/referrals');
  return { success: true };
}
