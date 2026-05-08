import { genkit, z } from 'genkit';
import { ai } from '../genkit';
import { prisma } from '../prisma';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Tool to fetch application details from the database.
 */
export const getAppInfo = ai.defineTool(
  {
    name: 'getAppInfo',
    description: 'Fetches technical and configuration details for a specific application by its ID.',
    inputSchema: z.object({ appId: z.string() }),
    outputSchema: z.any(),
  },
  async ({ appId }) => {
    const app = await prisma.oAuthApp.findUnique({
      where: { id: appId },
      select: {
        id: true,
        name: true,
        description: true,
        redirectUris: true,
        homepageUrl: true,
        createdAt: true,
        _count: {
          select: { appUsers: true }
        }
      }
    });

    if (!app) return { error: 'Application not found' };
    return app;
  }
);

/**
 * Main AI Agent Flow for the Developer Console.
 */
export const appBotFlow = ai.defineFlow(
  {
    name: 'appBotFlow',
    inputSchema: z.object({
      appId: z.string(),
      message: z.string(),
      history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.array(z.object({ text: z.string() }))
      })).optional(),
    }),
    outputSchema: z.object({
      text: z.string(),
    }),
  },
  async ({ appId, message, history }) => {
    // Fetch the app to get its specific API key if configured
    const app = await prisma.oAuthApp.findUnique({
      where: { id: appId },
      select: { geminiApiKey: true }
    });

    // Determine which API key to use
    const apiKey = app?.geminiApiKey || process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
      throw new Error('No Google AI API Key configured for this app or the system.');
    }

    // Initialize a temporary AI instance if using a specific app key
    // Otherwise use the default 'ai' instance
    let activeAi = ai;
    if (app?.geminiApiKey) {
      activeAi = genkit({
        plugins: [googleAI({ apiKey: app.geminiApiKey })],
        model: googleAI.model('gemini-2.5-flash'),
      });
    }

    const chat = activeAi.chat({
      model: 'googleAI/gemini-2.5-flash',
      system: `You are the Going Genius App Assistant. 
      You help developers manage their OAuth applications. 
      You have access to the 'getAppInfo' tool to look up details about the current application.
      Be professional, concise, and helpful. 
      If you don't know something, suggest checking the documentation.`,
      history: history as any,
      tools: [getAppInfo],
    });

    const result = await chat.send(message);
    return { text: result.text };
  }
);
