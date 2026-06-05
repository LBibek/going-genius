import { z } from 'genkit';
import { ai } from '../genkit';
import { prisma } from '../prisma';

export const evaluateMarketplaceListingFlow = ai.defineFlow(
  {
    name: 'evaluateMarketplaceListingFlow',
    inputSchema: z.object({ appId: z.string() }),
    outputSchema: z.object({
      riskScore: z.number(),
      status: z.enum(['APPROVED', 'FLAGGED', 'REJECTED']),
      reasoning: z.string()
    }),
  },
  async ({ appId }) => {
    const app = await prisma.oAuthApp.findUnique({
      where: { id: appId },
      include: { owner: true }
    });

    if (!app) throw new Error('Application not found');

    const promptText = `
      Evaluate the following application for the marketplace. Look for spam, phishing, or malicious intent.
      
      App Name: ${app.name}
      Description: ${app.marketplaceDescription || app.description || 'N/A'}
      Category: ${app.marketplaceCategory || 'N/A'}
      Redirect URIs: ${app.redirectUris.join(', ')}
      Owner: ${app.owner.displayName}
      
      Respond with a JSON object strictly matching this schema:
      {
        "riskScore": number between 0.0 (perfectly safe) and 1.0 (highly malicious),
        "status": "APPROVED", "FLAGGED" (for manual review if score is > 0.3 and < 0.8), or "REJECTED" (if score >= 0.8),
        "reasoning": "A concise explanation"
      }
    `;

    // Note: While the genkitEval plugin provides standardized metrics for batch evaluations,
    // we use a direct generate call here for runtime marketplace moderation so we can
    // dynamically steer the JSON output to directly update our Prisma schema fields.
    const { text } = await ai.generate({
      prompt: promptText,
    });

    let result;
    try {
      result = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('Failed to parse moderation output:', text);
      result = { riskScore: 0.5, status: 'FLAGGED', reasoning: 'Failed to parse AI output, requires manual review.' };
    }

    // Update the app in the DB
    await prisma.oAuthApp.update({
      where: { id: appId },
      data: {
        riskScore: result.riskScore,
        moderationStatus: result.status,
        moderationNotes: result.reasoning
      }
    });

    return result;
  }
);
