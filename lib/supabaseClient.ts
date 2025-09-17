'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Lazily create a browser Supabase client.
 * Do NOT create at module top-level (breaks during prerender/build).
 */
export function getSupabase() {
  // Only read envs inside the function so they’re evaluated at runtime in the browser.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    // Don’t throw during build — fail nicely in the browser instead.
    console.warn('Supabase envs missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createClient(url || '', anon || '', {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
