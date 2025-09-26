'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SECTORS } from '@/lib/templates'; // array or map is fine

type Draft = {
  id: string;
  title: string;
  content: string;
  sector: string | null;
  created_at?: string;
  updated_at?: string;
};

function normalizeSectorOptions(source: unknown): { value: string; label: string }[] {
  if (Array.isArray(source)) {
    // @ts-ignore — accept either strings or {value,label}
    return source.map((s) => ({
      value: String(s.value ?? s),
      label: String(s.label ?? s.value ?? s),
    }));
  }
  if (source && typeof source === 'object') {
    return Object.entries(source as Record<string, string>).map(([value, label]) => ({
      value,
      label: String(label || value),
    }));
  }
  return [
    { value: 'general', label: 'General / Any' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'retail', label: 'Retail' },
    { value: 'construction', label: 'Construction' },
  ];
}

export default function DashboardClient() {
  // Sector
  const sectorOptions = useMemo(() => normalizeSectorOptions(SECTORS), []);
  const [sector, setSector] = useState<string>(sectorOptions[0]?.value ?? 'general');

  // Editor
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Drafts
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadDrafts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/drafts', { method: 'GET', cache: 'no-store' });
      if (!res.ok) throw new Error(`GET /api/drafts failed: ${res.status}`);
      const data = (await res.json()) as { drafts: Draft[] } | Draft[];
      const list = Array.isArray(data) ? data : data.drafts;
      setDrafts(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const filteredDrafts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return drafts;
    return drafts.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.content?.toLowerCase().includes(q) ||
        (d.sector ?? '').toLowerCase().includes(q)
    );
  }, [drafts, search]);

  const handleSelectDraft = useCallback((d: Draft) => {
    setSelectedId(d.id);
    setTitle(d.title || '');
    setContent(d.content || '');
    if (d.sector) setSector(d.sector);
  }, []);

  const handleSave = useCallback(async () => {
    const body = {
      title: title?.trim() || 'Untitled draft',
      content: content || '',
      sector: sector || null,
    };
    const res = await fetch('/api/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error('Failed to save draft', await res.text());
      alert('Failed to save draft');
      return;
    }
    const saved = (await res.json()) as Draft;
    await loadDrafts();
    setSelectedId(saved.id);
    alert(`Saved “${saved.title}”`);
  }, [title, content, sector, loadDrafts]);

  return (
    <div className="space-y-6">
      {/* Sector */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <label className="mb-2 block text-sm text-zinc-400">Sector</label>
        <div className="flex flex-col gap-3">
          <select
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            {sectorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {sectorOptions.slice(0, 10).map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`rounded-full px-3 py-1 text-sm transition ${
                  sector === opt.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
                onClick={() => setSector(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="rounded border border-zinc-700 bg-zinc-800/60 px-2 py-0.5">{`Options: ${sectorOptions.length}`}</span>
            <span className="rounded border border-zinc-700 bg-zinc-800/60 px-2 py-0.5">from SECTORS</span>
            <span>
              Selected:{' '}
              <span className="text-zinc-200">
                {sectorOptions.find((s) => s.value === sector)?.label ?? sector}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Editor */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <h3 className="mb-3 text-sm font-medium text-zinc-300">Editor</h3>
        <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Draft title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Save draft
          </button>
        </div>

        <textarea
          className="h-64 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
          placeholder="Write or paste text here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-2 text-right text-xs text-zinc-500">{content.length} characters</div>
      </section>

      {/* Drafts */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="mb-3 flex items-center gap-2">
          <input
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Search drafts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={loadDrafts}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
          >
            {loading ? 'Loading…' : 'Reload'}
          </button>
        </div>

        {filteredDrafts.length === 0 ? (
          <p className="py-6 text-sm text-zinc-500">No drafts yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {filteredDrafts.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => handleSelectDraft(d)}
                  className={`w-full cursor-pointer px-3 py-3 text-left transition hover:bg-zinc-800/60 ${
                    selectedId === d.id ? 'bg-zinc-800/80' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-zinc-100">
                        {d.title || 'Untitled'}
                        {d.sector ? (
                          <span className="ml-2 align-middle text-xs text-zinc-400">• {d.sector}</span>
                        ) : null}
                      </div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-zinc-400">
                        {d.content?.slice(0, 140) || 'No preview'}
                      </div>
                    </div>
                    <div className="shrink-0 text-[11px] text-zinc-500">
                      {d.updated_at?.slice(0, 10) || d.created_at?.slice(0, 10) || ''}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
