// app/dashboard/DashboardClient.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SECTORS } from "@/lib/sector-config";

// Extremely defensive normalizer so this works no matter how SECTORS is shaped.
function normalizeSectors(input: unknown): { value: string; label: string }[] {
  // 1) Array of { value, label }
  if (Array.isArray(input)) {
    const arr = input as any[];
    if (arr.length && typeof arr[0] === "object" && arr[0]) {
      const first = arr[0] as any;
      if ("value" in first && "label" in first) {
        return arr.map((x) => ({ value: String(x.value), label: String(x.label) }));
      }
      // Array of strings
      if (typeof first === "string") {
        return (arr as string[]).map((s) => ({ value: s, label: s }));
      }
    }
  }

  // 2) Record<string, string | {label:string}>
  if (input && typeof input === "object") {
    return Object.entries(input as Record<string, any>).map(([k, v]) => {
      const label = v && typeof v === "object" && "label" in v ? v.label : v;
      return { value: k, label: String(label ?? k) };
    });
  }

  // 3) Fallback
  return [{ value: "general", label: "General" }];
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
  const [sector, setSector] = useState<string>(""); // empty means “not chosen”
  const [content, setContent] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [filter, setFilter] = useState("");

  const sectorOptions = useMemo(() => normalizeSectors(SECTORS), []);

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
      // Keep the content so you can keep editing; clear if you prefer:
      // setContent("");
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left column: sector + editor + actions */}
      <div className="space-y-4">
        {/* Sector selector (native <select> so it always works) */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <label className="block text-sm font-medium text-zinc-300">Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-900 p-2 text-zinc-100"
          >
            <option value="">— Choose a sector —</option>
            {sectorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Text editor */}
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
              {content.length.toLocaleString()} characters
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
      </div>

      {/* Right column: drafts list / preview */}
      <div className="space-y-4">
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

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-sm text-zinc-400">
            Tip: open a new tab to <code>/api/drafts</code> to see the raw JSON
            the app is reading/writing.
          </p>
        </div>
      </div>
    </div>
  );
}
