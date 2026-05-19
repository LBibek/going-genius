'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/safe-action';
import { z } from 'zod';
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

// Validation Schema for applying a referral code
const applyReferralSchema = z.object({
  code: z.string().min(1, 'Referral code is required').max(20, 'Invalid referral code length'),
});

// Wrapped internal safe action
const applyReferralSafeAction = createSafeAction(
  applyReferralSchema,
  async ({ code }, userId) => {
    const currentUser = await prisma.gGUser.findUnique({
      where: { id: userId }
    });

    if (currentUser?.referredById) {
      throw new Error('You have already been referred.');
    }

    const referrer = await prisma.gGUser.findUnique({
      where: { referralCode: code }
    });

    if (!referrer) {
      throw new Error('Invalid referral code.');
    }

    if (referrer.id === userId) {
      throw new Error('You cannot refer yourself.');
    }

    await prisma.gGUser.update({
      where: { id: userId },
      data: { referredById: referrer.id }
    });

    revalidatePath('/developer/referrals');
    return { success: true };
  }
);

/**
 * Public Server Action to apply a referral code.
 * Keeps backward compatibility with the client form action payload.
 */
export async function applyReferralCode(code: string) {
  const result = await applyReferralSafeAction({ code });
  if (!result.success) {
    return { error: result.error || 'Failed to apply referral code' };
  }
  return { success: true };
}

