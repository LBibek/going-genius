import { appRoute } from '@genkit-ai/next';
import { appBotFlow } from '@/lib/ai/flows';

/**
 * Exposes the appBotFlow as a secure Next.js API route.
 * This can be called from the frontend using the Genkit Next.js client.
 */
export const POST = appRoute(appBotFlow);
