import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { prisma } from './prisma';

// Initialize Genkit
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// Tool to query pricing plans for an app
export const getAppPricingTool = ai.defineTool({
  name: 'getAppPricing',
  description: 'Gets the subscription pricing plans for a specific application by appId.',
  inputSchema: z.object({
    appId: z.string().describe('The unique ID of the application'),
  }),
  outputSchema: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    interval: z.string(),
    currency: z.string(),
    features: z.string().nullable()
  }))
}, async ({ appId }) => {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { appId, isActive: true },
    select: { id: true, name: true, price: true, interval: true, currency: true, features: true }
  });
  return plans;
});

// Tool to capture leads
export const captureLeadTool = ai.defineTool({
  name: 'captureLead',
  description: 'Saves a users contact information (like email or name) as a lead. Call this tool when a user provides their contact details indicating interest.',
  inputSchema: z.object({
    appId: z.string().describe('The unique ID of the application'),
    name: z.string().optional().describe('The name of the user, if provided'),
    email: z.string().optional().describe('The email address of the user, if provided'),
    phone: z.string().optional().describe('The phone number of the user, if provided')
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string()
  })
}, async ({ appId, name, email, phone }) => {
  if (!name && !email && !phone) {
    return { success: false, message: 'No contact information provided' };
  }
  
  await prisma.lead.create({
    data: {
      appId,
      name,
      email,
      phone,
      source: 'AI Chat Bot',
      status: 'NEW'
    }
  });

  return { success: true, message: 'Lead captured successfully' };
});

// Define the sales bot flow
export const salesBotFlow = ai.defineFlow({
  name: 'salesBotFlow',
  inputSchema: z.object({
    appId: z.string(),
    message: z.string(),
    history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({ text: z.string() }))
    })).optional()
  }),
  outputSchema: z.string(),
}, async ({ appId, message, history }) => {
  // Fetch app name to give context to the bot
  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });

  // Fetch the active, live system prompt for this app, if one exists
  const activePromptVersion = await prisma.aIPromptVersion.findFirst({
    where: { 
      isLive: true,
      prompt: { appId }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  let systemPrompt = `You are a helpful sales and support agent for the application "${app?.name || 'this app'}". 
You can use the getAppPricing tool to look up subscription plans and prices if the user asks about pricing.
If a user expresses interest and provides contact info, use the captureLead tool to save their details.
Keep your answers concise, helpful, and professional.`;

  if (activePromptVersion?.content) {
    // If the developer wrote a custom prompt, use that, but append tool instructions.
    systemPrompt = `${activePromptVersion.content}\n\n[System Note]: You have access to getAppPricing and captureLead tools. Use them appropriately.`;
  }

  const response = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: message,
    system: systemPrompt,
    tools: [getAppPricingTool, captureLeadTool],
    history: history || [],
    config: { temperature: 0.7 }
  });

  return response.text;
});
