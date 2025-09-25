// lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Keep a single client per runtime to avoid re-creating on hot reloads
type SupaStore = {
  browserClient?: SupabaseClient;
  serverClient?: SupabaseClient;
};
const __store = (globalThis as any).__supa ?? ((globalThis as any).__supa = {} as SupaStore);

// Helper to *narrow* env var types to string for TS and fail fast at runtime
function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v; // <- now typed as string
}

/**
 * Use on the server (API routes, Route Handlers, Server Components).
 * Uses the Service Role key. NEVER expose this in the browser.
 */
export function createServerSupabase(): SupabaseClient {
  if (__store.serverClient) return __store.serverClient;

  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  __store.serverClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false }, // no cookies/sessions on server client
  });
  return __store.serverClient;
}

/**
 * Use in Client Components only if/when you need client-side Supabase.
 * Uses the anon key which is safe for the browser.
 */
export function createBrowserSupabase(): SupabaseClient {
  if (__store.browserClient) return __store.browserClient;

  const url = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  __store.browserClient = createClient(url, anonKey);
  return __store.browserClient;
}

export type { SupabaseClient };
