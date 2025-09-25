"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DraftLibraryPanel from "@/components/DraftLibraryPanel";
import SaveDraftButton from "@/components/SaveDraftButton";
import { SECTORS } from "@/lib/sector-config";

/** Normalize SECTORS whether it's an array like [{value,label}] or a record { key: "Label" } */
function useSectorOptions() {
  return useMemo(() => {
    if (Array.isArray(SECTORS)) {
      return (SECTORS as any[]).map((s) => ({
        value: s.value ?? s.slug ?? s.id ?? String(s),
        label: s.label ?? s.name ?? String(s.value ?? s.slug ?? s.id ?? s),
      }));
    }
    const rec = SECTORS as Record<string, string>;
    return Object.keys(rec).map((k) => ({ value: k, label: rec[k] }));
  }, []);
}

/** Sector selector that syncs with the URL (?sector=…) */
function SectorSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const options = useSectorOptions();
  const current = params.get("sector") ?? "";

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const sp = new URLSearchParams(params.toString());
      if (value) sp.set("sector", value);
      else sp.delete("sector");
      router.replace(`?${sp.toString()}`);
    },
    [params, router]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">Sector</label>
      <select
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-zinc-600"
        value={current}
        onChange={onChange}
      >
        <option value="">— Choose a sector —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function DashboardPage() {
  const params = useSearchParams();

  // read possible prefilled values from the URL once
  const initialPrompt = params.get("prompt") ?? "";
  const initialSector = params.get("sector") ?? "";

  const [title, setTitle] = useState<string>("");
  const [prompt, setPrompt] = useState<string>(initialPrompt);

  // keep local prompt in sync if someone lands with ?prompt=…
  useEffect(() => {
    // only update if prompt was empty locally (avoid clobbering typing)
    if (!prompt && initialPrompt) setPrompt(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  // show a human label for current sector (works for array or record)
  const sectorLabel = useMemo(() => {
    const cur = initialSector;
    if (!cur) return "";
    if (Array.isArray(SECTORS)) {
      const opt = (SECTORS as any[]).find(
        (o) => (o.value ?? o.slug ?? o.id) === cur
      );
      return opt?.label ?? String(cur);
    } else {
      const rec = SECTORS as Record<string, string>;
      return rec[cur] ?? String(cur);
    }
  }, [initialSector]);

  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[1fr_380px]">
      {/* Left: compose area */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <h1 className="text-xl font-semibold text-zinc-100">Compose</h1>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Title (optional)
            </label>
            <input
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-zinc-600"
              placeholder="Untitled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <SectorSelect />
        </div>

        {initialSector && (
          <p className="mt-2 text-xs text-zinc-400">
            Selected sector: <span className="text-zinc-200">{sectorLabel}</span>
          </p>
        )}

        <div className="mt-5 space-y-2">
          <label className="block text-sm font-medium text-zinc-300">
            Prompt
          </label>
          <textarea
            className="h-56 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-zinc-600"
            placeholder="Describe what you’d like to draft…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          {/* Save draft to your library (uses existing component/lib) */}
          <SaveDraftButton
            content={prompt}
            title={title || "Untitled"}
            sector={initialSector || undefined}
          />
          {/* You can add your Generate button here if you have one */}
        </div>
      </section>

      {/* Right: Drafts panel */}
      <aside className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <h2 className="text-lg font-semibold text-zinc-100">Your drafts</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Saved locally and synced to Supabase when available.
        </p>
        <div className="mt-4">
          <DraftLibraryPanel />
        </div>
      </aside>
    </main>
  );
}
