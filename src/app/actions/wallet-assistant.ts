'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { createSafeAction } from '@/lib/safe-action';
import { getEcosystemBillingSummary } from '@/lib/billing';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const walletAssistantSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty'),
});

const walletAssistantAction = createSafeAction(
  walletAssistantSchema,
  async ({ prompt }, userId) => {
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      system: `You are the Going Genius Wallet Assistant. 
      Your job is to help users understand their spending and manage their subscriptions across the GG ecosystem.
      Always be professional, concise, and helpful. 
      Use the provided tools to fetch real data for the user.`,
      tools: {
        getBillingSummary: {
          description: 'Get a summary of the user\'s ecosystem billing, including total spend and active subscriptions.',
          parameters: z.object({}),
          execute: async () => {
            const summary = await getEcosystemBillingSummary(userId);
            return summary;
          },
        },
        getAppDetails: {
          description: 'Get details about a specific app by its name.',
          parameters: z.object({
            name: z.string(),
          }),
          execute: async ({ name }: { name: string }) => {
            const app = await prisma.oAuthApp.findFirst({
              where: { name: { contains: name, mode: 'insensitive' } },
              select: { id: true, name: true, description: true }
            });
            return app || { error: 'App not found' };
          },
        },
      } as any,
      prompt,
      maxSteps: 5,
    } as any);

    return { text: result.text };
  }
);

/**
 * Public Server Action for the Wallet Assistant.
 * Uses Vercel AI SDK with Gemini 1.5 Flash for high-performance billing insights.
 */
export async function walletAssistant(prompt: string): Promise<{ text: string; error?: never } | { error: string; text?: never }> {
  const result = await walletAssistantAction({ prompt });
  if (!result.success) {
    return { error: result.error || 'Failed to process request' };
  }
  return { text: result.data?.text || '' };
}

