"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { SECTORS, SECTOR_QUESTIONS } from "@/lib/sector-config";

// ---- helpers ----
function resolveSectorLabel(sector: string | null | undefined): string {
  if (!sector) return "";
  if (Array.isArray(SECTORS)) {
    const found = (SECTORS as Array<Record<string, unknown>>).find((o) => {
      const key =
        (o.value as string | undefined) ??
        (o.id as string | undefined) ??
        (o.slug as string | undefined);
      return key === sector;
    });
    const label =
      (found?.label as string | undefined) ??
      (found?.name as string | undefined);
    return label ?? sector;
  } else if (typeof SECTORS === "object" && SECTORS !== null) {
    const label = (SECTORS as Record<string, unknown>)[sector];
    if (typeof label === "string") return label;
    if (label && typeof label === "object") {
      const l =
        (label as Record<string, unknown>).label ??
        (label as Record<string, unknown>).name;
      if (typeof l === "string") return l;
    }
    return sector;
  }
  return sector;
}

function normalizeQuestions(sector: string | undefined): string[] {
  if (!sector) return [];
  const map = (SECTOR_QUESTIONS ?? {}) as Record<string, unknown>;
  const bucket = map[sector];
  if (!Array.isArray(bucket)) return [];
  return (bucket as Array<Record<string, unknown>>)
    .map((q) => {
      const text =
        (q.label as string | undefined) ??
        (q.name as string | undefined) ??
        (q.question as string | undefined) ??
        "";
      return text.toString().trim();
    })
    .filter((s) => s.length > 0);
}
// ---- end helpers ----

type Props = {
  sector?: string;
  role?: string;
  location?: string;
  /** Optional descriptive title from the template page */
  title?: string;
  /** Optional example/base prompt text from the template page */
  basePrompt?: string;
  /** Optional extra intro text */
  intro?: string;
};

export default function LaunchFromTemplate({
  sector,
  role,
  location,
  title,
  basePrompt,
  intro = "",
}: Props) {
  const sectorLabel = useMemo(() => resolveSectorLabel(sector ?? ""), [sector]);
  const prompts = useMemo(() => normalizeQuestions(sector), [sector]);

  const sectorNote = useMemo(() => {
    if (!sector) return "";
    const header = `\n\nSector: ${sectorLabel || sector}\n`;
    if (prompts.length === 0) return header;
    const bullets = prompts.map((p) => `- ${p}`).join("\n");
    return `${header}Before drafting, also consider:\n${bullets}\n`;
  }, [sector, sectorLabel, prompts]);

  const brief = useMemo(() => {
    const lines: string[] = ["# Role Brief"];
    if (title?.trim()) lines.push(`Template: ${title.trim()}`);
    if (role) lines.push(`Role: ${role}`);
    if (location) lines.push(`Location: ${location}`);
    if (intro?.trim()) lines.push("", intro.trim());
    if (basePrompt?.trim()) lines.push("", "## Base prompt", basePrompt.trim());
    if (sectorNote) lines.push(sectorNote);
    return lines.join("\n");
  }, [title, role, location, intro, basePrompt, sectorNote]);

  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-4 space-y-3">
      <h3 className="text-lg font-semibold">Launch with this template</h3>
      <p className="text-sm text-white/70">
        We’ll prefill the dashboard with a sector-tailored brief. You can edit
        anything before generating.
      </p>

      <pre className="whitespace-pre-wrap text-sm bg-black/40 p-3 rounded border border-white/10 max-h-64 overflow-auto">
        {brief}
      </pre>

      <div className="flex gap-3">
        <Link
          href={{
            pathname: "/dashboard",
            query: {
              sector: sector ?? "",
              role: role ?? "",
              location: location ?? "",
              brief,
            },
          }}
          className="inline-flex items-center rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/15"
        >
          Open in Dashboard
        </Link>
      </div>
    </div>
  );
}
