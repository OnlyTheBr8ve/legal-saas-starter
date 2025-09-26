'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

// If you keep your sector constants elsewhere, adjust this import:
import { SECTORS } from '@/lib/templates'; // works whether SECTORS is an array of {value,label} or a map

type Draft = {
  id: string;
  title: string;
  content: string;
  sector: string | null;
  created_at?: string;
  updated_at?: string;
};

function normalizeSectorOptions(source: unknown): { value: string; label: string }[] {
  // Handles both: Array<{ value,label }> OR Record<string,string>
  if (Array.isArray(source)) {
    // @ts-ignore - be lenient, we just need value/label
    return source.map((s) => ({ value: String(s.value ?? s), label: String(s.label ?? s.value ?? s) }));
  }
  if (source && typeof source === 'object') {
    return Object.entries(source as Record<string, string>).map(([value, label]) => ({
      value,
      label: String(label || value),
    }));
  }
  // Fallback options so the UI isn't empty
  return [
    { value: 'general', label: 'General / Any' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'retail', label: 'Retail' },
    { value: 'construction', label: 'Construction' },
  ];
}

export default function DashboardClient() {
  // --- Sector ---
  const sectorOptions = useMemo(() => normalizeSectorOptions(SECTORS), []);
  const [sector, setSector] = useState<string>(sectorOptions[0]?.value ?? 'general');

  // --- Editor state ---
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  // --- Drafts state ---
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  // Load drafts from API
  const loadDrafts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/drafts', { method: 'GET', cache: 'no-store' });
      if (!res.ok) throw new Error(`GET /api/drafts failed: ${res.status}`);
      const data = (await res.json()) as { drafts: Draft[] } | Draft[];
      const list = Array.isArray(data) ? data : data.drafts;
      setDrafts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  // Filtered list
  const filteredDrafts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return drafts;
    return drafts.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.content?.toLowerCase().includes(q) ||
        (d.sector ?? '').toLowerCase().includes(q),
    );
  }, [drafts, search]);

  // Click a draft => recall into editor + sector
  const handleSelectDraft = useCallback(
    (d: Draft) => {
      setSelectedId(d.id);
      setTitle(d.title || '');
      setContent(d.content || '');
      if (d.sector) setSector(d.sector);
    },
    [setSelectedId, setTitle, setContent, setSector],
  );

  // Save => POST to /api/drafts, then refresh list and select the new/updated item
  const handleSave = useCallback(async () => {
    const body = { title: title?.trim() || 'Untitled draft', content: content || '', sector: sector || null };
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
    // Reload list and focus the saved row
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
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="— Choose a sector —" />
            </SelectTrigger>
            <SelectContent>
              {sectorOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quick pick chips (optional) */}
          <div className="flex flex-wrap gap-2">
            {sectorOptions.slice(0, 10).map((opt) => (
              <button
                key={opt.value}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  sector === opt.value
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
                onClick={() => setSector(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <Badge variant="secondary">{`Options: ${sectorOptions.length}`}</Badge>
            <Badge variant="outline">from SECTORS</Badge>
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
        <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input
            placeholder="Draft title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleSave} className="sm:w-40">
            Save draft
          </Button>
        </div>
        <Textarea
          placeholder="Write or paste text here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-64"
        />
        <div className="mt-2 text-right text-xs text-zinc-500">{content.length} characters</div>
      </section>

      {/* Drafts */}
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Input
            placeholder="Search drafts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button variant="secondary" onClick={loadDrafts}>
            {loading ? 'Loading…' : 'Reload'}
          </Button>
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
