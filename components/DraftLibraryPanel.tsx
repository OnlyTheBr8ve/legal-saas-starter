"use client";

import { useEffect, useMemo, useState } from "react";

export type DraftItem = {
  id: string;
  title: string;
  content: string;
  sector?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  /** Called when the user picks a draft in the list */
  onPick?: (d: DraftItem) => void;
  /** Optional filter by sector (so the list only shows current sector’s drafts) */
  sector?: string;
};

const STORAGE_KEY = "drafts_v1";

function readLocalDrafts(): DraftItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (d) => d && typeof d.id === "string" && typeof d.title === "string"
    );
  } catch {
    return [];
  }
}

export default function DraftLibraryPanel({ onPick, sector }: Props) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);

  const reload = () => setItems(readLocalDrafts());

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    let res = items;
    if (sector) res = res.filter((d) => (d.sector || "") === sector);
    if (q.trim()) {
      const needle = q.toLowerCase();
      res = res.filter(
        (d) =>
          d.title.toLowerCase().includes(needle) ||
          d.content.toLowerCase().includes(needle)
      );
    }
    // newest first
    return res.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0).getTime() -
        new Date(a.updatedAt || a.createdAt || 0).getTime()
    );
  }, [items, q, sector]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search drafts…"
          className="w-full rounded-md bg-zinc-900/60 px-3 py-2 text-sm outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
        />
        <button
          onClick={reload}
          className="rounded-md bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
        >
          Reload
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-400">No drafts yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-800 rounded-md border border-zinc-800">
          {filtered.map((d) => (
            <li
              key={d.id}
              className="cursor-pointer px-4 py-3 hover:bg-zinc-900"
              onClick={() => onPick?.(d)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{d.title || "Untitled"}</span>
                {d.sector ? (
                  <span className="text-xs text-zinc-500">{d.sector}</span>
                ) : null}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                {d.content || "—"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
