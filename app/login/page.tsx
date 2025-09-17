'use client';

export const dynamic = 'force-dynamic';

import { FormEvent, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setOk(null);
    setErr(null);
    try {
      const supabase = getSupabase();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setOk('Magic link sent! Check your inbox and click the link to finish sign-in.');
    } catch (e: any) {
      setErr(e?.message ?? 'Something went wrong sending the magic link.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-extrabold">Login</h1>
      <p className="text-white/70">Enter your email. We’ll send you a secure magic link to sign in.</p>

      <form onSubmit={onSubmit} className="max-w-md space-y-4">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-white/20"
        />
        <button
          disabled={sending}
          className="rounded-lg bg-violet-500 px-5 py-3 font-medium text-white hover:bg-violet-600 disabled:opacity-50"
        >
          {sending ? 'Sending…' : 'Send magic link'}
        </button>

        {ok && <p className="text-emerald-400">{ok}</p>}
        {err && <p className="text-red-400">{err}</p>}
      </form>
    </main>
  );
}
