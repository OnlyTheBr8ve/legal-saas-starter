'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();

    // Trigger a session read; with detectSessionInUrl: true, the client
    // processes the magic-link fragment and stores the session.
    supabase.auth.getSession().finally(() => {
      router.replace('/dashboard');
    });
  }, [router]);

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Signing you in…</h1>
      <p className="text-white/70">Just a moment.</p>
    </main>
  );
}
