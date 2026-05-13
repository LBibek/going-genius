'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * PHASE 8: COMPLIANCE AUTOMATION
 * Exports all user data in compliance with GDPR Art. 20 (Data Portability).
 */
export async function exportUserData() {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId },
    include: {
      subscriptions: true,
      sessions: true,
      transactions: true,
      ownedApps: true,
      appMemberships: true,
      referrals: true,
      referralEarnings: true,
      threads: { include: { messages: true } }
    }
  });

  if (!user) return { error: 'User not found' };

  // In a real app, we'd probably upload this to a secure bucket and give a signed URL
  // For now, we return it as a structured object
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: user
  };
}

/**
 * Triggers the "Right to be Forgotten" (GDPR Art. 17).
 * Permanently deletes user account and all associated data.
 */
export async function deleteUserAccount() {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    // Prisma Cascade deletion should be configured in schema for these relations
    await prisma.gGUser.delete({
      where: { id: session.userId }
    });

    // Clear session cookies/token (this logic depends on your auth implementation)
    // For now we just redirect
    return { success: true };
  } catch (error) {
    console.error('Account deletion error:', error);
    return { error: 'Failed to delete account. Please contact support.' };
  }
}
