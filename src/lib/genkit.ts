import { genkit, z } from 'genkit';
export { z };
import { googleAI } from '@genkit-ai/google-genai';
import { openAI } from '@genkit-ai/compat-oai/openai';
import { deepSeek } from '@genkit-ai/compat-oai/deepseek';

const plugins: any[] = [];

if (process.env.GOOGLE_GENAI_API_KEY) {
  plugins.push(googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }));
}

if (process.env.OPENAI_API_KEY) {
  plugins.push(openAI({ apiKey: process.env.OPENAI_API_KEY }));
}

if (process.env.DEEPSEEK_API_KEY) {
  plugins.push(deepSeek({ apiKey: process.env.DEEPSEEK_API_KEY }));
}

export const ai = genkit({
  plugins,
  // Default to Gemini if available, otherwise it relies on explicit model selection in generate() calls
  model: process.env.GOOGLE_GENAI_API_KEY ? googleAI.model('gemini-2.0-flash') : undefined,
});
