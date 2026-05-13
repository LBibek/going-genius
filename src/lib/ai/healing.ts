import { ai, z } from '../genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * PHASE 8: SELF-HEALING INFRASTRUCTURE
 * The HealAgent analyzes an error and suggests an automated recovery strategy.
 */
export const healAgent = ai.defineFlow(
  {
    name: 'healAgent',
    inputSchema: z.object({
      flowName: z.string(),
      error: z.string(),
      inputData: z.any().optional(),
    }),
    outputSchema: z.object({
      action: z.enum(['RETRY_WITH_TEMPERATURE', 'SWITCH_MODEL', 'TRUNCATE_INPUT', 'ALERT_ADMIN']),
      parameters: z.any().optional(),
      explanation: z.string(),
    }),
  },
  async (input) => {
    const { text: output } = await ai.generate({
      model: googleAI.model('gemini-2.0-flash') as any,
      prompt: `An AI flow has failed. Analyze the error and determine the best self-healing action.
      Flow: ${input.flowName}
      Error: ${input.error}
      Input Data: ${JSON.stringify(input.inputData)}
      
      Return a JSON object with:
      - action: RETRY_WITH_TEMPERATURE, SWITCH_MODEL, TRUNCATE_INPUT, or ALERT_ADMIN
      - parameters: e.g. { temperature: 0.8 } or { model: 'gemini-1.5-flash' }
      - explanation: Reasoning for the choice`,
      config: { temperature: 0.1 }
    });

    try {
      return JSON.parse(output.replace(/```json|```/g, '').trim() || '{}');
    } catch (e) {
      console.error('[HEALING] Failed to parse healing plan:', e);
      return { action: 'ALERT_ADMIN', explanation: 'Failed to parse AI response' };
    }
  }
);

/**
 * Wrapper to run flows with self-healing capabilities.
 */
export async function runWithHealing<T, I>(
  flow: { run: (input: I) => Promise<any>; name: string },
  input: I
): Promise<T | { error: string; healed: boolean }> {
  try {
    return await flow.run(input);
  } catch (error: any) {
    console.error(`[HEALING] Flow ${flow.name} failed. Triggering HealAgent...`);
    
    try {
      const healingPlan: any = await healAgent.run({
        flowName: flow.name,
        error: error.message || String(error),
        inputData: input
      });

      console.info(`[HEALING] Plan: ${healingPlan.action} - ${healingPlan.explanation}`);

      if (healingPlan.action === 'RETRY_WITH_TEMPERATURE') {
        // In a real implementation, we would pass these params to the flow
        // For now, we simulate a one-time retry
        return await flow.run(input);
      }

      return { error: error.message, healed: false };
    } catch (healError) {
      console.error('[HEALING] HealAgent failed as well:', healError);
      return { error: 'Critical failure. Healing exhausted.', healed: false };
    }
  }
}
