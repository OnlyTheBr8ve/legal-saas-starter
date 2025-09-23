// app/wizard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { saveDraftAndGo } from "@/lib/save-draft";

export default function WizardPage() {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role, company }),
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const { markdown } = (await res.json()) as { markdown: string };
      saveDraftAndGo(markdown, "/dashboard");
    } catch (e: any) {
      setError(e?.message || "Failed to generate");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Contract Wizard</h1>

      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Role Title</span>
          <input
            className="bg-black/20 border border-white/10 rounded-md px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Family Solicitor"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Company</span>
          <input
            className="bg-black/20 border border-white/10 rounded-md px-3 py-2"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Acme Legal Ltd"
          />
        </label>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rounded-md px-4 py-2 bg-white text-black disabled:opacity-50"
        >
          {isGenerating ? "Generating…" : "Generate Contract"}
        </button>

        <Link href="/dashboard" className="text-sm underline opacity-70">
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
