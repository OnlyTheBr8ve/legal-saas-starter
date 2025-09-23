// app/dashboard/page.tsx
"use client";

export const dynamic = "force-dynamic";
export const revalidate = false;

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SaveDraftButton from "@/components/SaveDraftButton";
import { SECTORS, type SectorKey } from "@/lib/sector-config";
import DraftLibraryPanel, { DraftItem, writeLocalDraft } from "@/components/DraftLibraryPanel";

type GenResponse = { text?: string; error?: string };
const GENERATE_API = "/api/generate";

function DashboardInner() {
  const sp = useSearchParams();

  const initialPrompt = sp.get("prompt") ?? "";
  const initialSector = (sp.get("sector") ?? "") as SectorKey | "";
  const templateSlug = sp.get("template") ?? "";

  const [prompt, setPrompt] = useState(initialPrompt);
  const [sector, setSector] = useState<SectorKey | "">(initialSector);
  const [title, setTitle] = useState(
    sp.get("title") ?? (templateSlug ? templateSlug.replace(/[-_]/g, " ") : "Untitled draft")
  );

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState("");

  const [libraryOpen, setLibraryOpen] = useState(false);

  useEffect(() => {
    if (initialPrompt && !output) {
      void onGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectorLabel = useMemo(() => {
    if (!sector) return "";
    return SECTORS[sector] ?? sector;
  }, [sector]);

  async function onGenerate() {
    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }
    setError(null);
    setGenerating(true);
    setOutput("");
    try {
      const res = await fetch(GENERATE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          sector: sector || undefined,
          templateSlug: templateSlug || undefined,
        }),
      });
      const json = (await res.json()) as GenResponse;
      if (!res.ok || json.error) {
        throw new Error(json.error || "Generation failed");
      }
      setOutput(json.text ?? "");
    } catch (e: any) {
      setError(e.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  function quickSaveLocal() {
    const draft: DraftItem = {
      id: crypto.randomUUID(),
      title: title || "Untitled draft",
      content: output || "",
      prompt: prompt || "",
      sector: (sector as string) || "",
      templateSlug: templateSlug || "",
      updatedAt: new Date().toISOString(),
      source: "local",
    };
    writeLocalDraft(draft);
    // tiny toast
    alert("Saved to local library ✅");
  }

  function loadFromDraft(d: DraftItem) {
    setTitle(d.title || "Untitled draft");
    setOutput(d.content || "");
    if (d.prompt) setPrompt(d.prompt);
    if (d.sector) setSector(d.sector as SectorKey);
    // keep templateSlug from URL unless draft has one
    // (no-op is fine for now)
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-white/70">Generate documents, then save them to your Library.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLibraryOpen(true)}
            className="px-4 py-2 rounded-md bg-black/40 border border-white/10"
          >
            Open Library
          </button>
        </div>
      </header>

      {/* Title + Sector */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Document title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-black/30 border border-white/10"
            placeholder="e.g., Employment Contract (Permanent)"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Sector (optional)</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value as SectorKey | "")}
            className="w-full px-3 py-2 rounded-md bg-black/30 border border-white/10"
          >
            <option value="">No sector</option>
            {Object.entries(SECTORS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Prompt */}
      <section>
        <label className="block text-sm mb-1">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 rounded-md bg-black/30 border border-white/10"
          placeholder={`Describe what you want drafted…\n\nExample: Draft a sector-specific employment contract for a bar manager in London, UK. Include probation, personal licence condition, schedule of duties, and overtime policy.`}
        />
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            onClick={onGenerate}
            disabled={generating}
            className="px-4 py-2 rounded-md bg-white text-black font-medium border border-white/10 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Generate"}
          </button>
          <button
            type="button"
            onClick={quickSaveLocal}
            className="px-4 py-2 rounded-md bg-black/40 border border-white/10"
            title="Store this draft in your browser’s local Library"
          >
            Quick Save (local)
          </button>
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </section>

      {/* Output + Save */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Output</h2>
          <div className="text-sm text-white/60">
            {sectorLabel ? `Sector: ${sectorLabel}` : "No sector selected"}
          </div>
        </div>
        <textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          rows={18}
          className="w-full px-3 py-2 rounded-md bg-black/30 border border-white/10 font-mono text-sm"
          placeholder="Your generated document will appear here…"
        />
        <div className="flex items-center gap-3">
          <SaveDraftButton
            title={title || "Untitled draft"}
            content={output}
            prompt={prompt}
            templateSlug={templateSlug || undefined}
            sector={(sector as string) || undefined}
          />
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(output || "")}
            className="px-4 py-2 rounded-md bg-black/40 border border-white/10"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([output || ""], { type: "text/plain;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${(title || "document").replace(/\s+/g, "-")}.txt`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 rounded-md bg-black/40 border border-white/10"
          >
            Download .txt
          </button>
        </div>
      </section>

      {/* Library Panel */}
      <DraftLibraryPanel
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={loadFromDraft}
      />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="max-w-6xl mx-auto px-6 py-10">Loading…</main>}>
      <DashboardInner />
    </Suspense>
  );
}
