"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SECTORS, getSectorLabel } from "@/lib/sector-config";
import SaveDraftButton from "@/components/SaveDraftButton";

type SectorOption = { value: string; label: string };

type Draft = {
  id: string;
  title: string | null;
  content: string;
  sector: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

/* ---------- helpers ---------- */

function toTitleCase(s: string) {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeSectors(input: unknown): SectorOption[] {
  if (Array.isArray(input)) {
    const arr = input as any[];
    if (arr.length === 0) return [];
    const first = arr[0];
    if (first && typeof first === "object" && "value" in first && "label" in first) {
      return arr as SectorOption[];
    }
    if (typeof first === "string") {
      return (arr as string[]).map((v) => ({ value: v, label: toTitleCase(v) }));
    }
  }
  if (input && typeof input === "object") {
    const entries = Object.entries(input as Record<string, string>);
    return entries.map(([value, label]) => ({
      value,
      label: label ?? toTitleCase(value),
    }));
  }
  return [];
}

/* ---------- component ---------- */

export default function DashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // sector options
  const sectorOptions = useMemo(() => normalizeSectors(SECTORS), []);
  const firstSector = sectorOptions[0]?.value ?? "general";

  // read prompt & sector from URL (e.g. from Wizard hand-off)
  const urlPrompt = searchParams.get("prompt") ?? "";
  const urlSector = searchParams.get("sector") ?? "";

  // ensure URL sector is valid; otherwise fall back
  const urlSectorValid = sectorOptions.some((o) => o.value === urlSector);
  const initialSector = urlSectorValid ? urlSector : firstSector;

  // editor state
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>(urlPrompt);
  const [sector, setSector] = useState<string>(initialSector);

  // keep URL synced with chosen sector
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!urlSectorValid || urlSector !== initialSector) {
      params.set("sector", initialSector);
      router.replace(`${pathname}?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSector]);

  const onSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSector(val);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sector", val);
    router.replace(`${pathname}?${params.toString()}`);
  };

  /* ---------- drafts (right panel) ---------- */

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState<boolean>(false);
  const [errorDrafts, setErrorDrafts] = useState<string | null>(null);

  const loadDrafts = useCallback(async () => {
    try {
      setLoadingDrafts(true);
      setErrorDrafts(null);
      const res = await fetch("/api/drafts", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setDrafts(Array.isArray(json?.data) ? json.data : []);
    } catch (err: any) {
      setErrorDrafts(err?.message || "Failed to load drafts");
    } finally {
      setLoadingDrafts(false);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const recallDraft = async (id: string) => {
    try {
      const res = await fetch(`/api/drafts/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const d: Draft | null = json?.data ?? null;
      if (!d) return;

      setTitle(d.title ?? "");
      setContent(d.content ?? "");
      if (d.sector) {
        // only set if it's one of our known options, otherwise keep current
        const ok = sectorOptions.some((o) => o.value === d.sector);
        if (ok) {
          setSector(d.sector);
          const params = new URLSearchParams(searchParams.toString());
          params.set("sector", d.sector);
          router.replace(`${pathname}?${params.toString()}`);
        }
      }
    } catch {
      // noop
    }
  };

  /* ---------- UI ---------- */

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: editor */}
        <div className="lg:col-span-8 space-y-4">
          <h1 className="text-2xl font-semibold">Drafting Dashboard</h1>

          {/* Sector */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dash-sector" className="text-sm font-medium">
              Sector
            </label>
            <select
              id="dash-sector"
              value={sector}
              onChange={onSectorChange}
              className="w-full sm:w-80 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
            >
              {sectorOptions.length === 0 ? (
                <option value="general">General</option>
              ) : (
                sectorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              )}
            </select>
            <p className="text-xs text-zinc-500">
              Selected: <span className="text-zinc-700">{getSectorLabel(sector) || sector}</span>
            </p>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dash-title" className="text-sm font-medium">
              Title (optional)
            </label>
            <input
              id="dash-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Website Cookies Policy – ACME Ltd"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dash-content" className="text-sm font-medium">
              Drafting brief / content
            </label>
            <textarea
              id="dash-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or write your drafting brief here..."
              className="min-h-[280px] w-full rounded-md border border-zinc-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 font-mono"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <SaveDraftButton
              content={content}
              title={title}
              /* ✅ FIX: pass undefined (not null) when empty */
              sector={sector || undefined}
              onSaved={loadDrafts}
            />
            <span className="text-sm text-zinc-500">
              Saving stores to Supabase and updates the Drafts list on the right.
            </span>
          </div>
        </div>

        {/* Right: drafts sidebar */}
        <aside className="lg:col-span-4">
          <div className="rounded-xl border border-zinc-200 bg-white">
            <div className="px-4 py-3 border-b border-zinc-200">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Drafts</h2>
                <button
                  onClick={loadDrafts}
                  className="text-xs rounded-md border px-2 py-1 hover:bg-zinc-50"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-auto divide-y">
              {loadingDrafts && (
                <div className="p-4 text-sm text-zinc-500">Loading…</div>
              )}
              {errorDrafts && (
                <div className="p-4 text-sm text-red-600">Error: {errorDrafts}</div>
              )}
              {!loadingDrafts && !errorDrafts && drafts.length === 0 && (
                <div className="p-4 text-sm text-zinc-500">No drafts yet.</div>
              )}

              {drafts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => recallDraft(d.id)}
                  className="w-full text-left p-4 hover:bg-zinc-50"
                >
                  <div className="text-sm font-medium truncate">
                    {d.title || "Untitled"}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 line-clamp-2">
                    {(d.content || "").slice(0, 160) || "No content"}
                    {(d.content || "").length > 160 ? "…" : ""}
                  </div>
                  {d.sector && (
                    <div className="mt-2 inline-block text-[10px] rounded bg-zinc-100 px-2 py-0.5 text-zinc-700">
                      {getSectorLabel(d.sector) || d.sector}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
