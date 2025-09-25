"use client";

import * as React from "react";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SECTORS } from "@/lib/sector-config";
import SaveDraftButton from "@/components/SaveDraftButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // if you don't have this, swap for a <textarea>

type SectorOption = { value: string; label: string };

function toTitleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeSectors(input: unknown): SectorOption[] {
  // Shape 1: Array of { value, label }
  if (Array.isArray(input)) {
    const arr = input as any[];
    if (arr.length === 0) return [];
    const first = arr[0];
    if (first && typeof first === "object" && "value" in first && "label" in first) {
      return arr as SectorOption[];
    }
    // Shape 2: Array of strings
    if (typeof first === "string") {
      return (arr as string[]).map((v) => ({ value: v, label: toTitleCase(v) }));
    }
  }

  // Shape 3: Record<string, string>
  if (input && typeof input === "object") {
    const entries = Object.entries(input as Record<string, string>);
    return entries.map(([value, label]) => ({
      value,
      label: label ?? toTitleCase(value),
    }));
  }

  // Fallback: no sectors
  return [];
}

export default function DashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Normalize sector options from whatever SECTORS shape you have
  const sectorOptions = useMemo(() => normalizeSectors(SECTORS), []);
  const firstOption = sectorOptions[0]?.value ?? "";

  // Read initial sector from the URL
  const initialSector = searchParams.get("sector") ?? "";

  const [sector, setSector] = useState<string>(initialSector || firstOption);
  const [content, setContent] = useState<string>(""); // your editor’s content can populate this

  // Ensure URL always mirrors local state (and vice versa)
  useEffect(() => {
    // If URL had nothing and we have options, seed it
    if (!initialSector && firstOption) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sector", firstOption);
      router.replace(`${pathname}?${params.toString()}`);
      setSector(firstOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstOption]); // run once when options resolve

  const updateUrl = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("sector", next);
      else params.delete("sector");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const onSectorChange = (val: string) => {
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

      {/* Sector selector */}
      <section className="space-y-2">
        <label className="block text-sm font-medium">Sector</label>
        <Select value={sector} onValueChange={onSectorChange}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue placeholder="Select a sector" />
          </SelectTrigger>
          <SelectContent>
            {sectorOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Simple content editor area (replace with your rich editor if you have one) */}
      <section className="space-y-2">
        <label className="block text-sm font-medium">Draft content</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type or paste your draft here…"
          className="min-h-[200px]"
        />
      </section>

      {/* Save button — passes sector through to the API */}
      <div>
        <SaveDraftButton content={content} sector={sector} />
      </div>
    </main>
  );
}
