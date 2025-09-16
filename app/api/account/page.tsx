// app/account/page.tsx
"use client";

import { useState } from "react";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | {
    pro: boolean;
    plan?: string;
    error?: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/account?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setStatus({ pro: data.pro, plan: data.plan });
    } catch (e: any) {
      setStatus({ pro: false, error: e.message || "Error" });
    } finally {
      setLoading(false);
    }
  };

  const manageBilling = () => {
    if (!email) return alert("Enter the email used at checkout first.");
    window.location.href = `/api/portal?email=${encodeURIComponent(email)}`;
  };

  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-extrabold">Account</h1>
      <p className="text-white/70">
        Enter the email you used at checkout to check your plan or manage your
        subscription.
      </p>

      <div className="grid gap-4 max-w-xl">
        <input
          className="input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-3">
          <button className="btn" onClick={checkStatus} disabled={loading}>
            {loading ? "Checking…" : "Check status"}
          </button>
          <button className="btn" onClick={manageBilling}>
            Manage billing
          </button>
        </div>

        {status && (
          <div
            className={`rounded-xl border p-4 ${
              status.pro ? "border-emerald-500" : "border-white/10"
            }`}
          >
            {status.error ? (
              <p className="text-red-400">Error: {status.error}</p>
            ) : status.pro ? (
              <p>
                ✅ <strong>Pro</strong> — {status.plan}
              </p>
            ) : (
              <p>
                You’re on the <strong>Free</strong> plan.{" "}
                <a className="underline" href="/pricing">
                  Upgrade
                </a>
                .
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
