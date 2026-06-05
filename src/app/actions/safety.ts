'use server';

import { revalidatePath } from 'next/cache';
import { createSafeAction } from '@/lib/safe-action';
import { z } from 'zod';
import { predictUserChurn } from '@/lib/ai/flows';
import { evaluateMarketplaceListingFlow as scanAppForRisk } from '@/lib/ai/moderation';

const triggerSafetyScanSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
});

const triggerSafetyScanAction = createSafeAction(
  triggerSafetyScanSchema,
  async ({ appId }, userId, role) => {
    if (role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    const result = await scanAppForRisk.run({ appId });
    revalidatePath('/admin/safety');
    return { success: true, result };
  }
);

export async function triggerSafetyScan(appId: string): Promise<
  | { success: true; result: any; error?: never }
  | { success: false; error: string; result?: never }
> {
  const result = await triggerSafetyScanAction({ appId });
  if (!result.success) {
    return { success: false, error: result.error || 'Failed to complete safety scan.' };
  }
  return {
    success: true,
    result: result.data?.result
  };
}

const runChurnPredictionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

const runChurnPredictionAction = createSafeAction(
  runChurnPredictionSchema,
  async ({ userId: targetUserId }, userId, role) => {
    if (role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }
    const result = await predictUserChurn.run({ userId: targetUserId });
    return { success: true, result };
  }
);

export async function runChurnPrediction(userId: string): Promise<
  | { success: true; result: any; error?: never }
  | { success: false; error: string; result?: never }
> {
  const result = await runChurnPredictionAction({ userId });
  if (!result.success) {
    return { success: false, error: result.error || 'Failed to run churn prediction.' };
  }
  return {
    success: true,
    result: result.data?.result
  };
}

