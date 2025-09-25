// app/dashboard/DashboardClient.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SaveDraftButton from "@/components/SaveDraftButton";
import DraftLibraryPanel from "@/components/DraftLibraryPanel";
import { SECTORS } from "@/lib/sector-config";

type Option = { value: string; label: string };

// Normalize SECTORS whether it's an array of {value,label} or a record map
function asOptions(input: any): Option[] {
  if (Array.isArray(input)) {
    return input.map((it: any) =>
      typeof it === "object" && it && "value" in it && "label" in it
        ? ({ value: String(it.value), label: String(it.label) } as Option)
        : ({ value: String(it), label: String(it) } as Option)
    );
  }
  if (input && typeof input === "object") {
    return Object.entries(input).map(([value, label]) => ({
      value,
      label: String(label),
    }));
  }
  return [];
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSector = searchParams.get("sector") || "";
  const initialTitle = searchParams.get("title") || "";
  const initialPrompt = searchParams.get("prompt") || "";

  const [sector, setSector] = useState<string>(initialSector);
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialPrompt);

  // keep URL in sync with selected sector for shareable links
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sector) params.set("sector", sector);
    else params.delete("sector");
    router.replace(`/dashboard?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sector]);

  const sectorOptions = useMemo(() => asOptions(SECTORS), []);
  const sectorLabel = useMemo(() => {
    const match =
      sectorOptions.find((o) => o.value === sector)?.label ?? (sector || "");
    return match;
  }, [sector, sectorOptions]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Pick a sector, draft content, and save to your library.
      </p>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Sector */}
          <div>
            <label className="block text-sm font-medium">Sector</label>
            <select
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-sm"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">— Select a sector —</option>
              {sectorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {sector && (
              <p className="mt-1 text-xs text-zinc-500">
                Selected: <span className="font-medium">{sectorLabel}</span>
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 text-sm"
              placeholder="e.g., Website Privacy Policy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium">Prompt</label>
            <textarea
              className="mt-1 h-60 w-full rounded-md border border-zinc-300 bg-white p-2 text-sm"
              placeholder="Describe what you want to generate…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <SaveDraftButton
              title={title}
              content={content}
              sector={sector || undefined}
            />
          </div>
        </div>

        {/* Right column: library */}
        <aside className="lg:col-span-1">
          <DraftLibraryPanel />
        </aside>
      </section>
    </main>
  );
}
