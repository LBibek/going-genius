'use server';

import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function generateReferralCode(customCode?: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const user = await prisma.gGUser.findUnique({
      where: { id: session.userId },
      select: { referralCode: true, username: true }
    });

    if (!user) return { error: 'User not found' };

    if (user.referralCode) {
      return { error: 'You already have a referral code.' };
    }

    const code = customCode || `gg_${user.username}`;

    // Verify uniqueness
    const existing = await prisma.gGUser.findUnique({
      where: { referralCode: code }
    });

    if (existing) {
      return { error: 'This referral code is already taken. Try a different one.' };
    }

    await prisma.gGUser.update({
      where: { id: session.userId },
      data: { referralCode: code }
    });

    revalidatePath('/developer/affiliate');
    return { success: true, code };
  } catch (error) {
    console.error('Failed to generate referral code:', error);
    return { error: 'Internal Server Error' };
  }
}
