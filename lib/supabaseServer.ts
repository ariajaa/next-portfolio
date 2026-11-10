import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use safe defaults during build to prevent errors
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeAnonKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

/**
 * Server-side client using anon key (respects RLS)
 */
export function createServerClient() {
  return createClient(safeUrl, safeAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Server-side admin client using service role key (bypasses RLS)
 * Only use in secure API routes / server actions
 */
export function createAdminClient() {
  if (!supabaseServiceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to anon key.');
    return createServerClient();
  }
  return createClient(safeUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
