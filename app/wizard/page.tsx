// app/wizard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { saveDraftAndGo } from "@/lib/save-draft";

export default function WizardPage() {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // ✨ Build your markdown draft here (replace with your real generator if you have one)
    const markdown = [
      `# Employment Contract — ${role || "Role"}`,
      ``,
      `**Employer:** ${company || "Your Company Ltd"}`,
      `**Employee:** ___________________________`,
      ``,
      `## 1. Start Date`,
      `The employment will commence on ___/___/____.`,
      ``,
      `## 2. Duties`,
      `The Employee will perform duties reasonably associated with the role of ${role || "the role"}.`,
      ``,
      `## 3. Compensation`,
      `Pay and benefits as agreed.`,
      ``,
      `---`,
      `_Generated via ClauseCraft Wizard_`,
    ].join("\n");

    // ✅ Store + redirect to /dashboard
    saveDraftAndGo(markdown, "/dashboard");
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
