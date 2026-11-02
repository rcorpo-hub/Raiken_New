import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Privileged service-role client for background jobs and secure form intake.
// NEVER import into client components.
export function createPrivilegedClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Privileged Supabase credentials missing; running in simulated offline mode.');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
