"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SECTORS, SECTOR_QUESTIONS } from "@/lib/sector-config";
import SaveDraftButton from "@/components/SaveDraftButton";

// ---- Helper: normalize SECTORS to options ----
type Option = { value: string; label: string };
function toOptions(input: unknown): Option[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return (input as any[])
      .filter((o) => o && typeof o.value === "string")
      .map((o) => ({ value: o.value as string, label: String(o.label ?? o.value) }));
  }
  if (typeof input === "object") {
    return Object.entries(input as Record<string, any>).map(([k, v]) => {
      const label = typeof v === "string" ? v : v?.label ?? k;
      return { value: k, label: String(label) };
    });
  }
  return [];
}
const sectorOptions = toOptions(SECTORS);

// ---- Helper: normalize SECTOR_QUESTIONS to a safe map<string, {id, q}[]> ----
type QA = { id: string; q: string };
function getQuestionsFor(sec: string | null | undefined): QA[] {
  const raw = (SECTOR_QUESTIONS as any) ?? {};
  const arr: any[] =
    (sec && (raw[sec] as any[])) ||
    (raw["general"] as any[]) ||
    [];
  return (Array.isArray(arr) ? arr : []).map((item, i) => {
    if (typeof item === "string") return { id: `${i}`, q: item };
    if (item && typeof item.question === "string") return { id: `${i}`, q: item.question };
    if (item && typeof item.q === "string") return { id: `${i}`, q: item.q };
    return { id: `${i}`, q: String(item) };
  });
}

export default function WizardClient() {
  const params = useSearchParams();
  const initialSector = params?.get("sector") ?? params?.get("type") ?? "";
  const [sector, setSector] = useState<string>(initialSector);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const urlSector = params?.get("sector") ?? params?.get("type") ?? "";
    setSector((prev) => (prev || urlSector ? (prev || urlSector) : ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const questions = useMemo(() => getQuestionsFor(sector), [sector]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      {/* Sector picker */}
      <section>
        <label className="block text-sm text-zinc-400 mb-1">Sector</label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none"
        >
          <option value="">— Choose a sector —</option>
          {sectorOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </section>

      {/* Questions */}
      <section className="mt-6 space-y-4">
        {questions.length === 0 ? (
          <p className="text-sm text-zinc-400">No sector questions. You can still draft below.</p>
        ) : (
          questions.map((qa) => (
            <div key={qa.id}>
              <label className="block text-sm text-zinc-300 mb-1">{qa.q}</label>
              <input
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none"
                value={answers[qa.id] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [qa.id]: e.target.value }))
                }
                placeholder="Type your answer…"
              />
            </div>
          ))
        )}
      </section>

      {/* Draft editor */}
      <section className="mt-6">
        <label className="block text-sm text-zinc-300 mb-1">Draft</label>
        <textarea
          className="h-56 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Your generated or manually written draft…"
        />
        <div className="mt-3 flex gap-3">
          {/* Hook into your generate handler if you have one */}
          <button
            type="button"
            className="rounded-md bg-zinc-800 px-3 py-2 text-sm"
            onClick={() => {
              const blocks = Object.values(answers)
                .filter(Boolean)
                .map((a) => `- ${a}`)
                .join("\n");
              setContent((c) => (c ? `${c}\n\n${blocks}` : blocks));
            }}
          >
            Insert answers
          </button>

          <SaveDraftButton sector={sector} content={content} />
        </div>
      </section>
    </main>
  );
}
