"use client";

import { useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import MarkdownPreview from "@/components/MarkdownPreview";

function toTitle(s: string) {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function DashboardClient() {
  const params = useSearchParams();
  const prompt = params.get("prompt") || "";
  const sector = params.get("sector") || "";
  const role = params.get("role") || "";
  const seniority = params.get("seniority") || "";
  const docRef = useRef<HTMLDivElement>(null);

  // Example: shape a nicer heading + meta block for any generated text you already produce
  const header = useMemo(() => {
    const parts = [
      role && toTitle(role),
      seniority && toTitle(seniority),
      sector && toTitle(sector),
    ].filter(Boolean);

    const title = parts.length ? `${parts.join(" · ")} — Employment Agreement` : "Employment Agreement";
    const subtitle = prompt ? `Draft tailored to: “${prompt}”` : undefined;
    return { title, subtitle };
  }, [prompt, sector, role, seniority]);

  const onCopy = async () => {
    const text = docRef.current?.innerText || "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const onDownload = () => {
    // Simple “download as .txt”. If you want PDF later, we can add print-to-PDF styling.
    const text = docRef.current?.innerText || "";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (header.title || "document").replace(/[^\w.-]+/g, "_") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // You already generate markdown content elsewhere.
  // If the generated content arrives via query (or state), inject it here.
  // For demo, we compose a minimal scaffold around your current output:
  const generatedMarkdown =
    (typeof window !== "undefined" && sessionStorage.getItem("lastContractMarkdown")) ||
    `# ${header.title}

${header.subtitle ? `*${header.subtitle}*\n\n` : ""}

## Parties
- Employer: **[Insert legal name]**
- Employee: **[Insert employee name]**

## Role & Scope
Describe the core duties and KPIs here…

## Pay & Hours
- Salary: **[Insert]**
- Hours: **[Insert]**

## Sector-specific clauses
> Add the clauses your wizard captures (licenses, cards, safeguarding, etc.).

## Termination & Review
Standard termination grounds + performance review triggers…

---

*This is a generated draft. Get legal advice before signing.*`;

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{header.title}</h1>
        {header.subtitle && (
          <p className="text-sm text-white/70">{header.subtitle}</p>
        )}
      </header>

      <div className="flex gap-2">
        <button
          onClick={onCopy}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
        >
          Copy
        </button>
        <button
          onClick={onDownload}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
        >
          Download .txt
        </button>
      </div>

      <div
        ref={docRef}
        className="prose prose-invert max-w-none prose-headings:mt-6 prose-headings:mb-3 prose-p:my-3 prose-li:my-1 prose-hr:border-white/10"
      >
        <MarkdownPreview markdown={generatedMarkdown} />
      </div>
    </main>
  );
}
