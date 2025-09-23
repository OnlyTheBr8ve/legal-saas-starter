// components/LaunchFromTemplate.tsx
"use client";

import { useMemo, useState } from "react";
import { SECTORS, SECTOR_QUESTIONS, type SectorKey } from "@/lib/sector-config";

type Props = {
  title: string;
  basePrompt: string;
};

export default function LaunchFromTemplate({ title, basePrompt }: Props) {
  const [sector, setSector] = useState<SectorKey | "">("");
  const sectorNote = useMemo(() => {
    if (!sector) return "";
    const prompts = SECTOR_QUESTIONS[sector]?.map((q) => `- ${q.question}`).join("\n") ?? "";
    return prompts
      ? `\n\nSector: ${SECTORS[sector]}\nBefore drafting, also consider:\n${prompts}\n`
      : `\n\nSector: ${SECTORS[sector]}\n`;
  }, [sector]);

  const finalPrompt = useMemo(() => `${basePrompt}${sectorNote}`, [basePrompt, sectorNote]);

  const dashHref = `/dashboard?prompt=${encodeURIComponent(finalPrompt)}&sector=${encodeURIComponent(
    sector || ""
  )}`;

  return (
    <div className="rounded-md bg-black/30 border border-white/10 p-4 space-y-3">
      <h3 className="font-semibold">Generate from sector (optional)</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value as SectorKey | "")}
          className="px-3 py-2 rounded-md bg-black/20 border border-white/10"
          aria-label="Select sector"
        >
          <option value="">No sector</option>
          {Object.entries(SECTORS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <a
          href={dashHref}
          className="px-4 py-2 rounded-md bg-white text-black font-medium border border-white/10 inline-flex items-center justify-center"
        >
          Open in Dashboard
        </a>
      </div>

      <details className="text-sm text-white/70">
        <summary className="cursor-pointer">See the prompt we’ll send</summary>
        <pre className="whitespace-pre-wrap mt-2">{finalPrompt}</pre>
      </details>
    </div>
  );
}
