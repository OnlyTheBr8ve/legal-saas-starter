"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// --- Local helpers (no external deps) -----------------------------

const LS_KEY = "dashboard:draft:v1";

function mergePromptFromQuery(base: string, param: string | null) {
  if (!param) return base;
  // If there’s already content, append neatly
  if (base && base.trim().length > 0) {
    return `${base.trim()}\n\n---\n# Extra context\n${param}`;
  }
  return param;
}

// really-lightweight markdown-ish preview (no external packages).
// supports: #/## headers, **bold**, *italics*, [link](url), new lines.
function basicMarkdownToHtml(src: string) {
  let s = src
    // escape basic HTML to avoid injection
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // headers
  s = s.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  s = s.replace(/^## (.*)$/gm, "<h2>$1</h2>");
  s = s.replace(/^# (.*)$/gm, "<h1>$1</h1>");
  // bold + italics
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // links
  s = s.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="underline">$1</a>`);
  // paragraphs / line breaks
  s = s.replace(/\n{2,}/g, "</p><p>");
  s = s.replace(/\n/g, "<br/>");
  return `<p>${s}</p>`;
}

function download(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- Page ---------------------------------------------------------

export default function DashboardPage() {
  const search = useSearchParams();
  const promptFromQuery = search.get("prompt");

  const [text, setText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  // Load once from localStorage, merge ?prompt= if present
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    const initial = mergePromptFromQuery(stored ?? "", promptFromQuery);
    setText(initial ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only once on mount

  // Debounced autosave
  useEffect(() => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      localStorage.setItem(LS_KEY, text);
      setSaved(true);
      setTimeout(() => setSaved(false), 800);
    }, 400);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [text]);

  const html = useMemo(() => basicMarkdownToHtml(text || ""), [text]);

  function handleCopy() {
    navigator.clipboard.writeText(text || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-white/60">Draft, preview, and export your documents.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/wizard"
            className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Start Wizard
          </Link>
          <button
            onClick={handleCopy}
            className="inline-flex items-center rounded-md border border-white/15 bg-white px-3 py-2 text-sm text-black hover:opacity-90"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => download("contract.md", text, "text/markdown;charset=utf-8")}
            className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Download .md
          </button>
          <button
            onClick={() => download("contract.txt", text, "text/plain;charset=utf-8")}
            className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Download .txt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        {/* Editor */}
        <section className="rounded-lg border border-white/10 bg-black/30">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h2 className="text-sm font-semibold">Editor</h2>
            <span className="text-xs text-white/50">{saved ? "Saved" : "Saving…"}</span>
          </div>
          <textarea
            className="min-h-[60vh] w-full resize-none bg-transparent p-4 outline-none"
            placeholder={`Write or paste your draft here…

Tips:
- Use # Headings, **bold**, *italics*
- Paste in the role/sector context from the wizard
- Keep private data safe`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </section>

        {/* Preview */}
        <section className="rounded-lg border border-white/10 bg-black/30">
          <div className="border-b border-white/10 px-4 py-3">
            <h2 className="text-sm font-semibold">Preview</h2>
          </div>
          <div className="prose prose-invert max-w-none px-4 py-4 text-sm leading-6">
            {/* basic HTML preview */}
            <div
              className="space-y-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-2 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
