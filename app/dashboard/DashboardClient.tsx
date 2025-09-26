"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SECTORS } from "@/lib/sector-config"; // ok if empty; we fall back

/** Built-in fallback so the selector ALWAYS has options */
const BUILTIN_SECTORS = [
  { value: "general", label: "General" },
  { value: "saas", label: "SaaS / Software" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "media", label: "Media" },
] as const;

type Option = { value: string; label: string };

function normalizeSectors(input: unknown): Option[] {
  try {
    if (Array.isArray(input)) {
      const arr = input as any[];
      if (arr.length > 0) {
        const first = arr[0];
        if (first && typeof first === "object" && "value" in first && "label" in first) {
          return arr.map((x) => ({ value: String(x.value), label: String(x.label) }));
        }
        if (typeof first === "string") {
          return (arr as string[]).map((s) => ({ value: s, label: s }));
        }
      }
    }
    if (input && typeof input === "object") {
      return Object.entries(input as Record<string, any>).map(([k, v]) => {
        const label = v && typeof v === "object" && "label" in v ? (v as any).label : v;
        return { value: k, label: String(label ?? k) };
      });
    }
  } catch {}
  return [];
}

type DraftRow = {
  id: string;
  title: string | null;
  content: string;
  sector: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default function DashboardClient() {
  const [sector, setSector] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [filter, setFilter] = useState("");

  const normalized = useMemo(() => normalizeSectors(SECTORS), []);
  const sectorOptions: Option[] = normalized.length > 0 ? normalized : [...BUILTIN_SECTORS];
  const usingFallback = normalized.length === 0;

  // DEBUG: prove which options the page has
  useEffect(() => {
    console.log("[Dashboard] sectorOptions", sectorOptions);
  }, [sectorOptions]);

  // Pick the first option on mount if none selected
  useEffect(() => {
    if (!sector && sectorOptions.length > 0) {
      setSector(sectorOptions[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectorOptions.length]);

  const loadDrafts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/drafts", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as DraftRow[];
      setDrafts(json);
    } catch (e) {
      console.error("Failed to load drafts:", e);
      alert("Could not load drafts. Check /api/drafts and env vars.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDrafts();
  }, [loadDrafts]);

  const onSave = useCallback(async () => {
    if (!content.trim()) {
      alert("Write something in the editor before saving.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: content.slice(0, 80) || "Untitled",
        content,
        sector: sector || null,
      };
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      await loadDrafts();
      alert("Draft saved!");
    } catch (e) {
      console.error("Save failed:", e);
      alert("Save failed. Open DevTools → Network to see the error.");
    } finally {
      setSaving(false);
    }
  }, [content, sector, loadDrafts]);

  const filteredDrafts = useMemo(() => {
    if (!filter.trim()) return drafts;
    const q = filter.toLowerCase();
    return drafts.filter(
      (d) =>
        (d.title ?? "").toLowerCase().includes(q) ||
        (d.content ?? "").toLowerCase().includes(q) ||
        (d.sector ?? "").toLowerCase().includes(q)
    );
  }, [drafts, filter]);

  return (
    <div className="space-y-6">
      {/* VERSION BADGE so you can see the new file is live */}
      <div className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
        Dashboard v2 • options: <b>{sectorOptions.length}</b>{" "}
        {usingFallback ? (
          <span className="ml-2 rounded bg-amber-600/20 px-2 py-0.5 text-amber-300">
            fallback
          </span>
        ) : (
          <span className="ml-2 rounded bg-emerald-600/20 px-2 py-0.5 text-emerald-300">
            from SECTORS
          </span>
        )}{" "}
        • selected: <b>{sector || "(none)"}</b>
      </div>

      {/* Sector picker */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
        <label className="block text-sm font-medium text-zinc-300">Sector</label>

        <div className="relative mt-2">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="z-50 w-full rounded-md border border-zinc-700 bg-zinc-900 p-2 text-zinc-100 outline-none"
            style={{ position: "relative", pointerEvents: "auto" }}
          >
            {sectorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Chip picker – works even if dropdown is blocked by CSS */}
        <div className="mt-3 flex flex-wrap gap-2">
          {sectorOptions.map((opt) => {
            const active = opt.value === sector;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSector(opt.value)}
                className={
                  "rounded-full px-3 py-1 text-xs transition " +
                  (active
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700")
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drafts + editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <label className="block text-sm font-medium text-zinc-300">Editor</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Type your draft here…"
            className="mt-2 w-full resize-y rounded-md border border-zinc-700 bg-zinc-900 p-3 font-mono text-zinc-100"
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              {content.length.toLocaleString()} characters • sector: {sector || "—"}
            </div>
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <div className="mb-3 flex items-center gap-2">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search drafts…"
              className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 p-2 text-zinc-100"
            />
            <button
              onClick={() => void loadDrafts()}
              className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            >
              {loading ? "Loading…" : "Reload"}
            </button>
          </div>

          {filteredDrafts.length === 0 ? (
            <p className="text-zinc-400">No drafts yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {filteredDrafts.map((d) => (
                <li key={d.id} className="py-3">
                  <div className="text-sm font-medium text-zinc-100">
                    {d.title || "Untitled"}{" "}
                    <span className="text-xs text-zinc-500">
                      {d.sector ? `• ${d.sector}` : ""}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-2 whitespace-pre-wrap text-xs text-zinc-400">
                    {d.content}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
