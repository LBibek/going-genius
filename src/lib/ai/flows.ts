/* eslint-disable @typescript-eslint/no-explicit-any */
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
        redirectUris: true,
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
    // Fetch the app to get its specific API key and system prompt if configured
    const app = await prisma.oAuthApp.findUnique({
      where: { id: appId },
      select: { 
        geminiApiKey: true,
        systemPrompt: true,
        name: true
      }
    });

    // Determine which API key to use
    const apiKey = app?.geminiApiKey || process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
      throw new Error('No Google AI API Key configured for this app or the system.');
    }

    // Initialize a temporary AI instance if using a specific app key
    let activeAi = ai;
    if (app?.geminiApiKey) {
      activeAi = genkit({
        plugins: [googleAI({ apiKey: app.geminiApiKey })],
        model: googleAI.model('gemini-2.0-flash'),
      });
    }

    // Map history roles to Genkit's expected roles
    const messages = [...(history?.map((msg: any) => ({
      role: msg.role === 'bot' ? 'model' : msg.role,
      content: typeof msg.content === 'string' ? [{ text: msg.content }] : msg.content,
    })) || []), { role: 'user', content: [{ text: message }] }];

    const response = await activeAi.generate({
      model: 'googleAI/gemini-2.0-flash',
      system: `You are the ${app?.name || 'Going Genius'} App Assistant.
      
      ${app?.systemPrompt || 'You help users interact with the application and provide helpful guidance based on the application context.'}
      
      Contextual Rules:
      1. Use the provided tools to fetch real-time application data when asked about users, config, or metrics.
      2. Keep responses concise and focused on the application: ${app?.name}.
      3. Environment: Current App ID is ${appId}.`,
      messages,
      tools: [getAppInfo],
    });

    return { text: response.text };
  }
);
