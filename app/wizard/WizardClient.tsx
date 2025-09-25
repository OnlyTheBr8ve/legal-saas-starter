"use client";

import * as React from "react";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SECTORS } from "@/lib/sector-config";

type SectorOption = { value: string; label: string };

function toTitleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeSectors(input: unknown): SectorOption[] {
  if (Array.isArray(input)) {
    const arr = input as any[];
    if (arr.length === 0) return [];
    const first = arr[0];
    if (first && typeof first === "object" && "value" in first && "label" in first) {
      return arr as SectorOption[];
    }
    if (typeof first === "string") {
      return (arr as string[]).map((v) => ({ value: v, label: toTitleCase(v) }));
    }
  }
  if (input && typeof input === "object") {
    const entries = Object.entries(input as Record<string, string>);
    return entries.map(([value, label]) => ({
      value,
      label: label ?? toTitleCase(value),
    }));
  }
  return [];
}

export default function WizardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sectorOptions = useMemo(() => normalizeSectors(SECTORS), []);
  const firstOption = sectorOptions[0]?.value ?? "";

  const initialSector = searchParams.get("sector") ?? "";
  const [sector, setSector] = useState<string>(initialSector || firstOption);

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
        <h1 className="text-2xl font-semibold">Document Wizard</h1>
        <p className="text-sm text-zinc-500">
          Answer a few questions and we’ll tailor the draft for your sector.
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

      {/* Your existing wizard Q&A UI goes below. Use `sector` to branch prompts/questions. */}
      <section className="space-y-4">
        <div className="text-sm text-zinc-500">
          (Wizard questions render here; they can now reliably read the{" "}
          <code>sector</code> value and stay in sync with the URL.)
        </div>
      </section>
    </main>
  );
}
