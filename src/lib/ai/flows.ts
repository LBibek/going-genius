/* eslint-disable @typescript-eslint/no-explicit-any */
import { genkit, z } from 'genkit';
import { ai } from '../genkit';
import { prisma } from '../prisma';
import { googleAI } from '@genkit-ai/google-genai';
import { openAI } from '@genkit-ai/compat-oai/openai';
import { deepSeek } from '@genkit-ai/compat-oai/deepseek';
import { logAiUsage } from './metering';

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
 * Helper to determine the active AI instance and model based on app config and system fallbacks.
 * Prioritizes DeepSeek, then OpenAI, then Gemini.
 */
function getActiveAiAndModel(appConfig?: { geminiApiKey?: string | null, openaiApiKey?: string | null, deepseekApiKey?: string | null } | null) {
  if (appConfig?.deepseekApiKey) {
    const aiInstance = genkit({
      plugins: [deepSeek({ apiKey: appConfig.deepseekApiKey })],
      model: deepSeek.model('deepseek-chat'),
    });
    return { activeAi: aiInstance as any, activeModel: deepSeek.model('deepseek-chat') as any, modelName: 'deepseek-chat' };
  }
  if (appConfig?.openaiApiKey) {
    const aiInstance = genkit({
      plugins: [openAI({ apiKey: appConfig.openaiApiKey })],
      model: openAI.model('gpt-4o'),
    });
    return { activeAi: aiInstance as any, activeModel: openAI.model('gpt-4o') as any, modelName: 'gpt-4o' };
  }
  if (appConfig?.geminiApiKey) {
    const aiInstance = genkit({
      plugins: [googleAI({ apiKey: appConfig.geminiApiKey })],
      model: googleAI.model('gemini-2.0-flash'),
    });
    return { activeAi: aiInstance as any, activeModel: googleAI.model('gemini-2.0-flash') as any, modelName: 'gemini-2.0-flash' };
  }
  
  // Fallbacks to system configured providers
  if (process.env.DEEPSEEK_API_KEY) {
    return { activeAi: ai as any, activeModel: deepSeek.model('deepseek-chat') as any, modelName: 'deepseek-chat' };
  }
  if (process.env.OPENAI_API_KEY) {
    return { activeAi: ai as any, activeModel: openAI.model('gpt-4o') as any, modelName: 'gpt-4o' };
  }
  if (process.env.GOOGLE_GENAI_API_KEY) {
    return { activeAi: ai as any, activeModel: googleAI.model('gemini-2.0-flash') as any, modelName: 'gemini-2.0-flash' };
  }

  throw new Error('No AI provider keys configured for this app or the system.');
}

/**
 * Helper to fetch a live prompt version for an app by its slug.
 */
async function getLivePrompt(appId: string, slug: string, defaultPrompt: string): Promise<string> {
  try {
    const prompt = await prisma.aIPrompt.findFirst({
      where: { appId, slug },
      include: {
        versions: {
          where: { isLive: true }
        }
      }
    });

    if (!prompt || prompt.versions.length === 0) return defaultPrompt;

    // Simple weighted selection for A/B testing
    const versions = prompt.versions;
    if (versions.length === 1) return versions[0].content;

    const totalWeight = versions.reduce((sum: number, v: any) => sum + (v.variantWeight || 1.0), 0);
    let random = Math.random() * totalWeight;

    for (const v of versions) {
      random -= (v.variantWeight || 1.0);
      if (random <= 0) return v.content;
    }

    return versions[0].content;
  } catch (error) {
    console.error('Error fetching live prompt:', error);
    return defaultPrompt;
  }
}

/**
 * Main AI Agent Flow for the Developer Console.
 */
export const appBotFlow = ai.defineFlow(
  {
    name: 'appBotFlow',
    inputSchema: z.object({
      appId: z.string(),
      message: z.string(),
      threadId: z.string().optional(),   // For persistent memory
      userId: z.string().optional(),     // Optional: tie thread to a user
      history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.array(z.object({ text: z.string() }))
      })).optional(),
    }),
    outputSchema: z.object({
      text: z.string(),
      threadId: z.string(),             // Always return threadId for SDK to persist
    }),
  },
  async ({ appId, message, threadId, userId, history }) => {
    // Fetch the app to get its specific API key and system prompt if configured
    const app = await prisma.oAuthApp.findUnique({
      where: { id: appId },
      select: { 
        geminiApiKey: true,
        openaiApiKey: true,
        deepseekApiKey: true,
        systemPrompt: true,
        name: true,
        leadCaptureEnabled: true
      }
    });

    // Determine which API key and model to use
    const { activeAi, activeModel, modelName } = getActiveAiAndModel(app);

    // Fetch the versioned system prompt if it exists, otherwise fallback to app.systemPrompt
    const systemPromptBase = await getLivePrompt(appId, 'system-prompt', app?.systemPrompt || 'You help users interact with the application.');

    // --- MEMORY: Load or create a Thread ---
    let thread = threadId
      ? await prisma.thread.findUnique({
          where: { id: threadId },
          include: { messages: { orderBy: { createdAt: 'asc' }, take: 40 } }
        })
      : null;

    if (!thread) {
      // Create a new thread for this conversation
      thread = await prisma.thread.create({
        data: {
          appId,
          userId: userId ?? null,
          title: message.slice(0, 80), // Use first message as title
        },
        include: { messages: true }
      });
    }

    // Build message history: DB memory takes precedence over client-provided history
    const dbHistory = thread.messages.map((m: any) => ({
      role: m.role as 'user' | 'model',
      content: [{ text: m.content }]
    }));

    const historyToUse = dbHistory.length > 0 ? dbHistory : (history?.map((msg: any) => ({
      role: msg.role === 'bot' ? 'model' : msg.role,
      content: typeof msg.content === 'string' ? [{ text: msg.content }] : msg.content,
    })) || []);

    const messages = [...historyToUse, { role: 'user' as const, content: [{ text: message }] }];

    const isLeadGen = app?.leadCaptureEnabled;

    const response = await activeAi.generate({
      model: activeModel,
      system: isLeadGen 
        ? `You are the Lead Qualification Assistant for ${app?.name || 'Going Genius'}.
        
        Your Goal:
        1. Be helpful and professional.
        2. Answer questions about the product/service based on: ${systemPromptBase}.
        3. Proactively ask for name, email, or phone number if the user seems interested.
        4. Once you have enough info, use the 'saveLead' tool to record their interest.
        
        Current App Context: ${appId}`
        : `You are the ${app?.name || 'Going Genius'} App Assistant.
      
      ${systemPromptBase}
      
      Contextual Rules:
      1. Use the provided tools to fetch real-time application data when asked about users, config, or metrics.
      2. Keep responses concise and focused on the application: ${app?.name}.
      3. Environment: Current App ID is ${appId}.`,
      messages,
      tools: isLeadGen ? [getAppInfo, saveLead] : [getAppInfo],
    });

    // --- MEMORY: Persist messages to Thread ---
    await prisma.message.createMany({
      data: [
        { threadId: thread.id, role: 'user', content: message },
        { threadId: thread.id, role: 'model', content: response.text }
      ]
    });

    // Log AI usage for metering and billing
    const usage = (response as any).usage || {};
    await logAiUsage({
      appId,
      model: modelName,
      tokens: usage.totalTokens || 0,
      type: 'ai_tokens'
    });

    return { text: response.text, threadId: thread.id };
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
      select: { 
        name: true, 
        systemPrompt: true, 
        geminiApiKey: true,
        openaiApiKey: true,
        deepseekApiKey: true
      }
    });

    const { activeAi, activeModel, modelName } = getActiveAiAndModel(app);

    const systemPromptBase = await getLivePrompt(appId, 'system-prompt', app?.systemPrompt || 'General application context');

    const response = await activeAi.generate({
      model: activeModel,
      system: `You are the Lead Qualification Assistant for ${app?.name || 'Going Genius'}.
      
      Your Goal:
      1. Be helpful and professional.
      2. Answer questions about the product/service based on: ${systemPromptBase}.
      3. Proactively ask for name, email, or phone number if the user seems interested.
      4. Once you have enough info, use the 'saveLead' tool to record their interest.
      
      Current App Context: ${appId}`,
      messages: [...(history || []), { role: 'user', content: [{ text: message }] }],
      tools: [saveLead],
    });

    // Log AI usage for metering and billing
    const usage = (response as any).usage || {};
    await logAiUsage({
      appId,
      model: modelName,
      tokens: usage.totalTokens || 0,
      type: 'ai_tokens'
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
    const { activeAi, activeModel, modelName } = getActiveAiAndModel();
    
    const response = await activeAi.generate({
      model: activeModel,
      system: `You are the Going Genius Wallet Assistant. 
      Your job is to help users understand their spending and manage their subscriptions across the GG ecosystem.
      You have access to their real-time billing data. Always be professional, concise, and helpful.
      
      User Context: User ID is ${userId}`,
      messages: [...(history || []), { role: 'user', content: [{ text: message }] }],
      tools: [getBillingSummaryTool],
    });

    // Log AI usage for metering and billing
    const usage = (response as any).usage || {};
    await logAiUsage({
      appId: 'system-wallet', // Use a system ID for wallet internal actions
      userId,
      model: modelName,
      tokens: usage.totalTokens || 0,
      type: 'ai_tokens'
    });

    return { text: response.text };
  }
);
/**
 * Tool to update application moderation status.
 */
export const updateAppModeration = ai.defineTool(
  {
    name: 'updateAppModeration',
    description: 'Updates the risk score and moderation status of an application.',
    inputSchema: z.object({
      appId: z.string(),
      riskScore: z.number(),
      status: z.enum(['PENDING', 'APPROVED', 'FLAGGED', 'REJECTED']),
      notes: z.string().optional()
    }),
    outputSchema: z.any(),
  },
  async ({ appId, riskScore, status, notes }) => {
    await prisma.oAuthApp.update({
      where: { id: appId },
      data: {
        riskScore,
        moderationStatus: status,
        moderationNotes: notes
      }
    });
    return { success: true };
  }
);

/**
 * AI Flow to scan an application for potential fraud or risk.
 */
export const scanAppForRisk = ai.defineFlow(
  {
    name: 'scanAppForRisk',
    inputSchema: z.object({ appId: z.string() }),
    outputSchema: z.any(),
  },
  async ({ appId }) => {
    const app = await prisma.oAuthApp.findUnique({
      where: { id: appId },
      include: { owner: true }
    });

    if (!app) return { error: 'Application not found' };

    const { activeAi, activeModel } = getActiveAiAndModel();

    const response = await activeAi.generate({
      model: activeModel,
      system: `You are the Going Genius Platform Safety Agent. Your task is to analyze new application submissions for fraud, phishing, spam, or Terms of Service violations.
      
      CRITERIA:
      - Phishing: Does the name or logo mimic a known brand (Google, Facebook, Khalti) to steal credentials?
      - Spam: Is the description nonsensical or just a list of keywords?
      - Malicious Intent: Are the redirect URIs suspicious or non-standard?
      - Branding: Does it follow premium design guidelines?
      
      Respond with a JSON object:
      {
        "riskScore": 0.0 to 1.0 (1.0 being high risk),
        "status": "APPROVED" | "FLAGGED" | "REJECTED",
        "reasoning": "Brief explanation"
      }`,
      prompt: `Analyze this application:
      Name: ${app.name}
      Description: ${app.marketplaceDescription || app.description || 'N/A'}
      Category: ${app.marketplaceCategory || 'N/A'}
      Redirect URIs: ${app.redirectUris.join(', ')}
      Owner: ${app.owner.displayName} (${app.owner.email})`,
    });

    try {
      const result = JSON.parse(response.text.replace(/```json|```/g, '').trim());
      
      // Persist the result
      await prisma.oAuthApp.update({
        where: { id: appId },
        data: {
          riskScore: result.riskScore,
          moderationStatus: result.status,
          moderationNotes: result.reasoning
        }
      });

      return result;
    } catch (e) {
      console.error('Failed to parse safety agent response:', e);
      return { error: 'Safety check failed to parse' };
    }
  }
);

/**
 * PHASE 7: PREDICTIVE ANALYTICS
 * Analyzes user engagement data to predict churn risk.
 */
export const predictUserChurn = ai.defineFlow(
  {
    name: 'predictUserChurn',
    inputSchema: z.object({ userId: z.string() }),
    outputSchema: z.object({
      userId: z.string(),
      churnRisk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      riskScore: z.number().min(0).max(1),
      factors: z.array(z.string()),
      recommendations: z.array(z.string()),
      predictedLTV: z.number().optional()
    }),
  },
  async (input) => {
    const user = await prisma.gGUser.findUnique({
      where: { id: input.userId },
      include: {
        sessions: { orderBy: { createdAt: 'desc' }, take: 10 },
        subscriptions: true,
        transactions: { orderBy: { createdAt: 'desc' }, take: 5 },
        appMemberships: true
      }
    });

    if (!user) throw new Error('User not found');

    const profileData = {
      displayName: user.displayName,
      lastLogin: user.lastLoginAt,
      loginCountLast10: user.sessions.length,
      subscriptionStatus: user.subscriptions.map((s: any) => s.status),
      transactionCount: user.transactions.length,
      appCount: user.appMemberships.length,
      createdAt: user.createdAt
    };

    const { text: output } = await ai.generate({
      model: googleAI.model('gemini-2.0-flash') as any,
      prompt: `Analyze the following user engagement profile and predict their churn risk (likelihood of canceling subscription or stopping use).
      User Profile: ${JSON.stringify(profileData)}
      
      Return a JSON object with:
      - churnRisk: LOW, MEDIUM, HIGH, or CRITICAL
      - riskScore: 0.0 to 1.0
      - factors: List of reasons for this score
      - recommendations: Actions to retain this user
      - predictedLTV: Estimated Lifetime Value in NPR`,
      config: { temperature: 0.2 },
    });

    try {
      const result = JSON.parse(output || '{}');
      return {
        userId: input.userId,
        ...result
      };
    } catch (e) {
      console.error('Failed to parse churn prediction response:', e);
      return { error: 'Churn prediction failed to parse' };
    }
  }
);
