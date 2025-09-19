// app/dashboard/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const FULL_DRAFT_PRIMER = `Draft a complete, professional contract in Markdown. 
If details are missing, use [placeholders]. Include a Schedule of Key Terms.`;

export default function DashboardPage() {
  const params = useSearchParams();
  const prefill = params.get("prompt") || "";
  const [prompt, setPrompt] = useState(prefill);
  const [sectorClauses, setSectorClauses] = useState(""); // if you pass from wizard, set here
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  // If prompt came from /wizard, you may already include sector clauses in it.
  // Otherwise, let this stay blank or wire it up from localStorage/state as you prefer.
  useEffect(() => {
    if (prefill && !prompt) setPrompt(prefill);
  }, [prefill]); // eslint-disable-line

  const finalPrompt = useMemo(() => {
    // Prepend the primer if the user didn’t paste a base doc (simple heuristic)
    const hasSections = /\b(Definitions|Termination|Governing Law)\b/i.test(prompt);
    return hasSections ? prompt : `${FULL_DRAFT_PRIMER}\n\n${prompt}`;
  }, [prompt]);

  async function generate() {
    try {
      setLoading(true);
      setOut("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, sectorClauses }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Generation failed");
      setOut(data.text || "");
    } catch (e: any) {
      setOut(`Error: ${e.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  function downloadTxt() {
    const blob = new Blob([out || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contract.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-4xl font-extrabold">Dashboard</h1>
      <p className="text-white/70">
        Describe the document you want. Or start from one of the templates and tweak it here.
      </p>

      <div className="space-y-3">
        <label className="block text-sm text-white/70">Prompt</label>
        <textarea
          className="w-full min-h-[220px] rounded-md bg-black/30 border border-white/10 p-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Role, employment type, jurisdiction, pay, hours, probation, notice, key responsibilities, etc."
        />
      </div>

      {/* If you want to surface sector clauses to the user, keep this visible; otherwise, hide it or wire from wizard */}
      <div className="space-y-3">
        <label className="block text-sm text-white/70">Sector Clauses (optional)</label>
        <textarea
          className="w-full min-h-[120px] rounded-md bg-black/20 border border-white/10 p-3"
          value={sectorClauses}
          onChange={(e) => setSectorClauses(e.target.value)}
          placeholder="Paste sector-specific requirements from the wizard (licenses, compliance, on-call, etc.)"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
        <button
          onClick={() => setPrompt("")}
          className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-white/70">Output</label>
        <div className="rounded-md bg-black/30 border border-white/10 p-4 whitespace-pre-wrap">
          {out || "—"}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(out || "")}
            className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20"
          >
            Copy
          </button>
          <button
            onClick={downloadTxt}
            className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20"
          >
            Download .txt
          </button>
        </div>
      </div>
    </main>
  );
}
