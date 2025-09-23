"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function WizardClient() {
  // useSearchParams MUST be used in a client component
  const params = useSearchParams();
  const sector = params.get("sector") || "";
  const role = params.get("role") || "";
  const seniority = params.get("seniority") || "";

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Contract Wizard</h1>

      <div className="text-sm opacity-80">
        <div>Sector: {sector || "—"}</div>
        <div>Role: {role || "—"}</div>
        <div>Seniority: {seniority || "—"}</div>
      </div>

      {/* Your existing wizard UI goes here. Keep it client-side. */}
      <div className="rounded-md border border-white/10 p-4">
        <p className="mb-3">Adjust your selections or continue.</p>
        <Link href="/dashboard" className="underline">
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
