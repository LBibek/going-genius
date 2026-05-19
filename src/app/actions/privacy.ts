'use server';

import { prisma } from '@/lib/prisma';
import { createSafeAction } from '@/lib/safe-action';
import { z } from 'zod';

const emptySchema = z.object({});

const exportUserDataAction = createSafeAction(
  emptySchema,
  async (_, userId) => {
    const user = await prisma.gGUser.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: user
    };
  }
);

/**
 * PHASE 8: COMPLIANCE AUTOMATION
 * Exports all user data in compliance with GDPR Art. 20 (Data Portability).
 */
export async function exportUserData(): Promise<
  | { success: true; timestamp: string; data: any; error?: never }
  | { success: false; error: string; timestamp?: never; data?: never }
> {
  const result = await exportUserDataAction({});
  if (!result.success) {
    return { success: false, error: result.error || 'Failed to export user data' };
  }
  return {
    success: true,
    timestamp: result.data?.timestamp || new Date().toISOString(),
    data: result.data?.data
  };
}

const deleteUserAccountAction = createSafeAction(
  emptySchema,
  async (_, userId) => {
    // Prisma Cascade deletion should be configured in schema for these relations
    await prisma.gGUser.delete({
      where: { id: userId }
    });

    return { success: true };
  }
);

/**
 * Triggers the "Right to be Forgotten" (GDPR Art. 17).
 * Permanently deletes user account and all associated data.
 */
export async function deleteUserAccount(): Promise<
  | { success: true; error?: never }
  | { success: false; error: string }
> {
  const result = await deleteUserAccountAction({});
  if (!result.success) {
    return { success: false, error: result.error || 'Failed to delete account. Please contact support.' };
  }
  return { success: true };
}

