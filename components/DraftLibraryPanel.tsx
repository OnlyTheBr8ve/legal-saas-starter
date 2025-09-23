"use client";

import { useEffect, useMemo, useState } from "react";

type Draft = {
  id: string;
  title: string;
  content: string;
  sector?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

const STORAGE_KEY = "drafts:v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

function loadDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  return safeParse<Draft[]>(localStorage.getItem(STORAGE_KEY), []);
}

function saveDrafts(drafts: Draft[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function formatWhen(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function DraftLibraryPanel() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Initial load (and cross-tab sync)
  useEffect(() => {
    setDrafts(loadDrafts());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setDrafts(loadDrafts());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Derived
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return drafts;
    return drafts.filter((d) => {
      const hay = `${d.title} ${d.content} ${d.sector ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [drafts, query]);

  const selected = useMemo(
    () => drafts.find((d) => d.id === selectedId) ?? null,
    [drafts, selectedId]
  );

  // Actions
  const onReload = () => setDrafts(loadDrafts());

  const onDelete = (id: string) => {
    const next = drafts.filter((d) => d.id !== id);
    saveDrafts(next);
    setDrafts(next);
    if (selectedId === id) setSelectedId(null);
    if (renameId === id) {
      setRenameId(null);
      setRenameValue("");
    }
  };

  const onClearAll = () => {
    if (!confirm("Delete all drafts? This cannot be undone.")) return;
    saveDrafts([]);
    setDrafts([]);
    setSelectedId(null);
    setRenameId(null);
    setRenameValue("");
  };

  const startRename = (id: string, current: string) => {
    setRenameId(id);
    setRenameValue(current);
  };

  const commitRename = () => {
    if (!renameId) return;
    const next = drafts.map((d) =>
      d.id === renameId ? { ...d, title: renameValue || "Untitled", updatedAt: new Date().toISOString() } : d
    );
    saveDrafts(next);
    setDrafts(next);
    setRenameId(null);
    setRenameValue("");
  };

  const cancelRename = () => {
    setRenameId(null);
    setRenameValue("");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Draft content copied to clipboard.");
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Draft content copied to clipboard.");
    }
  };

  const importFromJSON = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) throw new Error("JSON must be an array of drafts");
      // Very light validation
      const normalized: Draft[] = parsed
        .map((x) => ({
          id: String(x.id ?? crypto.randomUUID()),
          title: String(x.title ?? "Untitled"),
          content: String(x.content ?? ""),
          sector: x.sector ? String(x.sector) : undefined,
          createdAt: x.createdAt ? String(x.createdAt) : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
        .slice(0, 1000); // guardrail
      saveDrafts(normalized);
      setDrafts(normalized);
      alert(`Imported ${normalized.length} draft(s).`);
    } catch (e: any) {
      alert(`Import failed: ${e?.message ?? "Invalid JSON"}`);
    }
  };

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(drafts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drafts-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left: list */}
      <section className="md:col-span-1 rounded-lg border border-white/10 bg-black/20 p-4">
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Search drafts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search drafts"
          />
          <button
            className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm hover:bg-black/40"
            onClick={onReload}
            type="button"
          >
            Reload
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-white/60">{filtered.length} draft(s)</span>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs hover:bg-black/40"
              type="button"
              onClick={exportToJSON}
            >
              Export
            </button>
            <label className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs hover:bg-black/40 cursor-pointer">
              Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const txt = await f.text();
                  importFromJSON(txt);
                  e.currentTarget.value = "";
                }}
              />
            </label>
            <button
              className="rounded-md border border-rose-500/30 text-rose-300 bg-rose-900/20 px-2 py-1 text-xs hover:bg-rose-900/30"
              type="button"
              onClick={onClearAll}
            >
              Clear all
            </button>
          </div>
        </div>

        <ul className="mt-3 divide-y divide-white/5 max-h-[60vh] overflow-auto">
          {filtered.map((d) => {
            const isSelected = d.id === selectedId;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(d.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-white/5 ${
                    isSelected ? "bg-white/10" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {renameId === d.id ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename();
                              if (e.key === "Escape") cancelRename();
                            }}
                            className="rounded-sm bg-black/40 px-2 py-1 border border-white/10"
                          />
                        ) : (
                          d.title || "Untitled"
                        )}
                      </div>
                      <div className="text-xs text-white/60">
                        {d.sector ? `${d.sector} • ` : ""}
                        Updated {formatWhen(d.updatedAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renameId === d.id ? (
                        <>
                          <button
                            className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                            onClick={commitRename}
                            type="button"
                          >
                            Save
                          </button>
                          <button
                            className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                            onClick={cancelRename}
                            type="button"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="rounded border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(d.id, d.title || "");
                            }}
                            type="button"
                          >
                            Rename
                          </button>
                          <button
                            className="rounded border border-rose-500/30 text-rose-300 bg-rose-900/20 px-2 py-1 text-xs hover:bg-rose-900/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(d.id);
                            }}
                            type="button"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-sm text-white/60">No drafts yet.</li>
          )}
        </ul>
      </section>

      {/* Right: details */}
      <section className="md:col-span-2 rounded-lg border border-white/10 bg-black/20 p-4 min-h-[300px]">
        {!selected ? (
          <div className="text-white/70">Select a draft on the left to preview.</div>
        ) : (
          <div className="space-y-4">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{selected.title || "Untitled"}</h2>
                <p className="text-xs text-white/60">
                  {selected.sector ? `${selected.sector} • ` : ""}
                  Created {formatWhen(selected.createdAt)} • Updated {formatWhen(selected.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm hover:bg-black/40"
                  onClick={() => copyToClipboard(selected.content)}
                  type="button"
                >
                  Copy content
                </button>
              </div>
            </header>

            <div className="rounded-md border border-white/10 bg-black/30 p-3 max-h-[60vh] overflow-auto whitespace-pre-wrap text-sm">
              {selected.content || <span className="text-white/50">No content.</span>}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
