"use client";

import * as React from "react";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SECTORS } from "@/lib/sector-config";
import SaveDraftButton from "@/components/SaveDraftButton";

type SectorOption = { value: string; label: string };

function toTitleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeSectors(input: unknown): SectorOption[] {
  // 1) Already [{ value, label }]
  if (Array.isArray(input)) {
    const arr = input as any[];
    if (arr.length === 0) return [];
    const first = arr[0];
    if (first && typeof first === "object" && "value" in first && "label" in first) {
      return arr as SectorOption[];
    }
    // 2) Array of strings
    if (typeof first === "string") {
      return (arr as string[]).map((v) => ({ value: v, label: toTitleCase(v) }));
    }
  }
  // 3) Record<string, string>
  if (input && typeof input === "object") {
    const entries = Object.entries(input as Record<string, string>);
    return entries.map(([value, label]) => ({
      value,
      label: label ?? toTitleCase(value),
    }));
  }
  return [];
}

export default function DashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sectorOptions = useMemo(() => normalizeSectors(SECTORS), []);
  const firstOption = sectorOptions[0]?.value ?? "";

  const initialSector = searchParams.get("sector") ?? "";
  const [sector, setSector] = useState<string>(initialSector || firstOption);
  const [content, setContent] = useState<string>("");

  // seed URL if empty
  useEffect(() => {
    if (!initialSector && firstOption) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sector", firstOption);
      router.replace(`${pathname}?${params.toString()}`);
      setSector(firstOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstOption]);

  const updateUrl = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("sector", next);
      else params.delete("sector");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const onSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSector(val);
    updateUrl(val);
  };

  return (
    <main className="p-6 space-y-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Choose a sector to tailor templates, prompts and saved drafts.
        </p>
      </header>

      {/* Sector selector (native) */}
      <section className="space-y-2">
        <label className="block text-sm font-medium">Sector</label>
        <select
          value={sector}
          onChange={onSectorChange}
          className="w-full sm:w-80 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
        >
          {sectorOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* Simple content area */}
      <section className="space-y-2">
        <label className="block text-sm font-medium">Draft content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type or paste your draft here…"
          className="min-h-[200px] w-full rounded-md border border-zinc-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
        />
      </section>

      {/* Save with sector */}
      <div>
        <SaveDraftButton content={content} sector={sector} />
      </div>
    </main>
  );
}
