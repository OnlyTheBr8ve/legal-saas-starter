'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // This triggers Supabase to parse the URL fragment and set the session.
    // Once it’s done (or even if it was already set), send the user onward.
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
