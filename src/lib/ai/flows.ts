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
        name: true,
        leadCaptureEnabled: true
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

    const isLeadGen = app?.leadCaptureEnabled;

    const response = await activeAi.generate({
      model: 'googleAI/gemini-2.0-flash',
      system: isLeadGen 
        ? `You are the Lead Qualification Assistant for ${app?.name || 'Going Genius'}.
        
        Your Goal:
        1. Be helpful and professional.
        2. Answer questions about the product/service based on: ${app?.systemPrompt || 'General application context'}.
        3. Proactively ask for name, email, or phone number if the user seems interested.
        4. Once you have enough info, use the 'saveLead' tool to record their interest.
        
        Current App Context: ${appId}`
        : `You are the ${app?.name || 'Going Genius'} App Assistant.
      
      ${app?.systemPrompt || 'You help users interact with the application and provide helpful guidance based on the application context.'}
      
      Contextual Rules:
      1. Use the provided tools to fetch real-time application data when asked about users, config, or metrics.
      2. Keep responses concise and focused on the application: ${app?.name}.
      3. Environment: Current App ID is ${appId}.`,
      messages,
      tools: isLeadGen ? [getAppInfo, saveLead] : [getAppInfo],
    });

    return { text: response.text };
  }
);
/**
 * Tool to capture and save a lead to the database.
 */
export const saveLead = ai.defineTool(
  {
    name: 'saveLead',
    description: 'Saves a potential customer (lead) information to the application database.',
    inputSchema: z.object({
      appId: z.string(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      interest: z.string().optional(),
      metadata: z.any().optional(),
    }),
    outputSchema: z.object({ success: z.boolean(), leadId: z.string().optional() }),
  },
  async ({ appId, name, email, phone, interest, metadata }) => {
    try {
      const lead = await prisma.lead.create({
        data: {
          appId,
          name,
          email,
          phone,
          source: 'AI Chat Agent',
          metadata: { ...metadata, interest },
        }
      });
      return { success: true, leadId: lead.id };
    } catch (error) {
      console.error('Save Lead Error:', error);
      return { success: false };
    }
  }
);

/**
 * Specialized Lead Generation Agent Flow.
 * Focuses on qualifying users and capturing contact details.
 */
export const leadGenFlow = ai.defineFlow(
  {
    name: 'leadGenFlow',
    inputSchema: z.object({
      appId: z.string(),
      message: z.string(),
      history: z.array(z.any()).optional(),
    }),
    outputSchema: z.object({ text: z.string() }),
  },
  async ({ appId, message, history }) => {
    const app = await prisma.oAuthApp.findUnique({
      where: { id: appId },
      select: { name: true, systemPrompt: true, geminiApiKey: true }
    });

    const apiKey = app?.geminiApiKey || process.env.GOOGLE_GENAI_API_KEY;
    
    let activeAi = ai;
    if (app?.geminiApiKey) {
      activeAi = genkit({
        plugins: [googleAI({ apiKey: app.geminiApiKey })],
        model: googleAI.model('gemini-2.0-flash'),
      });
    }

    const response = await activeAi.generate({
      model: 'googleAI/gemini-2.0-flash',
      system: `You are the Lead Qualification Assistant for ${app?.name || 'Going Genius'}.
      
      Your Goal:
      1. Be helpful and professional.
      2. Answer questions about the product/service based on: ${app?.systemPrompt || 'General application context'}.
      3. Proactively ask for name, email, or phone number if the user seems interested.
      4. Once you have enough info, use the 'saveLead' tool to record their interest.
      
      Current App Context: ${appId}`,
      messages: [...(history || []), { role: 'user', content: [{ text: message }] }],
      tools: [saveLead],
    });

    return { text: response.text };
  }
);

/**
 * Tool to fetch user's ecosystem billing summary.
 */
export const getBillingSummaryTool = ai.defineTool(
  {
    name: 'getBillingSummary',
    description: 'Retrieves a summary of the user\'s subscriptions and spending across the entire Going Genius ecosystem.',
    inputSchema: z.object({ userId: z.string() }),
    outputSchema: z.any(),
  },
  async ({ userId }) => {
    const { getEcosystemBillingSummary } = await import('../billing');
    return await getEcosystemBillingSummary(userId);
  }
);

/**
 * Wallet Assistant Flow for the Universal Wallet dashboard.
 * Helps users manage their subscriptions and understand their spending.
 */
export const walletAssistantFlow = ai.defineFlow(
  {
    name: 'walletAssistantFlow',
    inputSchema: z.object({
      userId: z.string(),
      message: z.string(),
      history: z.array(z.any()).optional(),
    }),
    outputSchema: z.object({ text: z.string() }),
  },
  async ({ userId, message, history }) => {
    const response = await ai.generate({
      model: 'googleAI/gemini-2.0-flash',
      system: `You are the Going Genius Wallet Assistant. 
      Your job is to help users understand their spending and manage their subscriptions across the GG ecosystem.
      You have access to their real-time billing data. Always be professional, concise, and helpful.
      
      User Context: User ID is ${userId}`,
      messages: [...(history || []), { role: 'user', content: [{ text: message }] }],
      tools: [getBillingSummaryTool],
    });

    return { text: response.text };
  }
);
