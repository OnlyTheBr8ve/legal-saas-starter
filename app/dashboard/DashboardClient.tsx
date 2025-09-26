// /app/dashboard/DashboardClient.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SECTORS, getSectorLabel } from '@/lib/sector-config';
import SaveDraftButton from '@/components/SaveDraftButton';

type DraftRow = {
  id: string;
  title: string | null;
  content: string;
  sector: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function DashboardClient() {
  // UI state
  const [sector, setSector] = useState<string>('general');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // Drafts (from Supabase via /api/drafts)
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [errorDrafts, setErrorDrafts] = useState<string | null>(null);

  // Build options for the select
  const sectorOptions = useMemo(() => SECTORS, []);

  const loadDrafts = useCallback(async () => {
    setLoadingDrafts(true);
    setErrorDrafts(null);
    try {
      const res = await fetch('/api/drafts', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`GET /api/drafts failed: ${res.status}`);
      }
      const json = await res.json();
      const rows: DraftRow[] = Array.isArray(json?.data) ? json.data : (json?.drafts ?? []);
      setDrafts(rows);
    } catch (err: any) {
      setErrorDrafts(err?.message ?? 'Failed to load drafts');
    } finally {
      setLoadingDrafts(false);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const onClickDraft = useCallback((d: DraftRow) => {
    setTitle(d.title ?? '');
    setContent(d.content ?? '');
    if (d.sector) setSector(d.sector);
  }, []);

  return (
    <div className="mx-auto max-w-6xl gap-6 p-6 grid grid-cols-1 md:grid-cols-3">
      {/* Editor column */}
      <div className="md:col-span-2 flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Draft your document</h1>

        {/* Sector select */}
        <label className="text-sm text-zinc-400" htmlFor="sector">
          Sector
        </label>
        <select
          id="sector"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="" disabled>
            Choose a sector
          </option>
          {sectorOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Title */}
        <label className="text-sm text-zinc-400" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 p-2"
          placeholder="e.g. Master Service Agreement for ACME Ltd"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Content */}
        <label className="text-sm text-zinc-400" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          className="min-h-[300px] w-full rounded-md border border-zinc-700 bg-zinc-900 p-3"
          placeholder="Start writing, or paste text to save as a draft…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <SaveDraftButton
            // IMPORTANT: SaveDraftButton requires content (string)
            content={content}
            title={title}
            sector={sector || null}
            onSaved={loadDrafts} // refresh the right panel after saving
          />
          <span className="text-sm text-zinc-500">
            Sector: <span className="text-zinc-300">{getSectorLabel(sector)}</span>
          </span>
        </div>
      </div>

      {/* Draft library column */}
      <aside className="md:col-span-1">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950">
          <div className="border-b border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Recent drafts</h2>
              <button
                onClick={loadDrafts}
                className="text-sm text-zinc-400 hover:text-zinc-200"
              >
                Refresh
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Click a draft to load it into the editor.
            </p>
          </div>

          <div className="max-h-[480px] overflow-auto p-2">
            {loadingDrafts && (
              <div className="p-3 text-sm text-zinc-400">Loading…</div>
            )}
            {errorDrafts && (
              <div className="p-3 text-sm text-red-400">{errorDrafts}</div>
            )}
            {!loadingDrafts && drafts.length === 0 && !errorDrafts && (
              <div className="p-3 text-sm text-zinc-500">No drafts yet.</div>
            )}

            <ul className="space-y-2">
              {drafts.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => onClickDraft(d)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-left hover:bg-zinc-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {d.title || 'Untitled'}
                      </span>
                      {d.sector && (
                        <span className="text-xs text-zinc-400">
                          {getSectorLabel(d.sector)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                      {d.content || '—'}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
