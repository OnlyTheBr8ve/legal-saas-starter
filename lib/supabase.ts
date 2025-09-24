// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// ---- ENV ----
// Browser (public) – safe to expose, used by client if/when needed
const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server (secret) – NEVER expose to the browser. Used in route handlers.
const SERVICE_URL = process.env.SUPABASE_URL || PUBLIC_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_URL) {
  throw new Error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL env var");
}

// Re-use a singleton between hot reloads in dev
const globalForSupabase = global as unknown as {
  serverClient?: ReturnType<typeof createClient>;
  browserClient?: ReturnType<typeof createClient>;
};

export function createServerSupabase() {
  if (!globalForSupabase.serverClient) {
    if (!SERVICE_ROLE) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env var");
    }
    globalForSupabase.serverClient = createClient(SERVICE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });
  }
  return globalForSupabase.serverClient;
}

export function createBrowserSupabase() {
  if (!PUBLIC_URL || !PUBLIC_ANON) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars"
    );
  }
  if (!globalForSupabase.browserClient) {
    globalForSupabase.browserClient = createClient(PUBLIC_URL, PUBLIC_ANON, {
      auth: { persistSession: true },
    });
  }
  return globalForSupabase.browserClient;
}

// Minimal row type (matches the SQL we ran)
export type DraftRow = {
  id: string;
  title: string;
  content: string;
  sector: string | null;
  created_at: string; // ISO
  updated_at: string; // ISO
};
