import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client using the service role key.
 * Only use this in Server Components, Route Handlers, or Server Actions.
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 * The public client uses NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
