import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().catch(''),
  NEXTAUTH_SECRET: z.string().min(16).catch(''),
  NEXT_PUBLIC_APP_URL: z.string().url().catch(''),
  
  // Third-party Providers (Optional but recommended for full feature set)
  GOOGLE_GENAI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  KHALTI_SECRET_KEY: z.string().optional(),
  ESEWA_SECRET_KEY: z.string().optional(),
  
  // Auth
  SUPABASE_URL: z.string().url().catch(''),
  SUPABASE_ANON_KEY: z.string().catch(''),
});

export const env = envSchema.parse(process.env);

export function validateEnv() {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated');
  } catch (error: any) {
    console.error('❌ Invalid environment variables:', error.errors);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing or invalid environment variables in production');
    }
  }
}
