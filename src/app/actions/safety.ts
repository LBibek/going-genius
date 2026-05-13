'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { scanAppForRisk, predictUserChurn } from '@/lib/ai/flows';

export async function triggerSafetyScan(appId: string) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    const result = await scanAppForRisk.run({ appId });
    revalidatePath('/admin/safety');
    return { success: true, result };
  } catch (error) {
    console.error('Safety scan error:', error);
    return { error: 'Failed to complete safety scan.' };
  }
}

export async function runChurnPrediction(userId: string) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    const result = await predictUserChurn.run({ userId });
    return { success: true, result };
  } catch (error) {
    console.error('Churn prediction error:', error);
    return { error: 'Failed to run churn prediction.' };
  }
}
