'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

type Draft = {
  id: string;
  title: string;
  content: string;
  sector: string | null;
  created_at?: string;
  updated_at?: string;
};

// Local sector options (no external import needed)
const SECTOR_OPTIONS: { value: string; label: string }[] = [
  { value: 'general', label: 'General / Any' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'retail', label: 'Retail' },
  { value: 'construction', label: 'Construction' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'hospitality', label: 'Hospitality' },
];

export default function DashboardClient() {
  // Sector
  const [sector, setSector] = useState<string>(SECTOR_OPTIONS[0]?.value ?? 'general');

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
        d.content?.toLowerCase
