// app/dashboard/page.tsx
"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const searchParams = useSearchParams();

  // Prefill from the URL
  const prefillPrompt = searchParams.get("prompt") ?? "";
  const templateSlug = searchParams.get("template") ?? "";

  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Only prefill once on first load
  useEffect(() => {
    if (prefillPrompt && !prompt) setPrompt(prefillPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillPrompt]);

  const disabled = useMemo(
    () => loading || prompt.trim().length === 0,
    [loading, prompt]
  );

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const maybeText = await res.text().catch(() => "");
        throw new Error(
          maybeText || `Generation failed (${res.status} ${res.statusText})`
        );
      }

      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        const text =
          data.output ??
          data.text ??
          data.result ??
          JSON.stringify(data, null, 2);
        setOutput(String(text));
      } else {
        const text = await res.text();
        setOutput(text);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setPrompt("");
    setOutput("");
    setError(null);
    setCopied(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  function handleDownload() {
    const blob = new Blob([output || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    // Use templateSlug in filename if present
    const base = templateSlug ? `clausecraft-${templateSlug}` : "clausecraft-document";
    a.href = url;
    a.download = `${base}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-white/70">
          Describe the document you want. Or start from one of the templates and
          tweak it here.
        </p>

        {templateSlug ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
            <span className="opacity-70">Template:</span>
            <span className="font-medium">{templateSlug}</span>
          </div>
        ) : null}
      </div>

      <section className="space-y-3">
        <label className="block text-sm font-medium opacity-80">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Draft a UK mutual NDA covering definitions, purpose, obligations, exclusions, term (3 years), governing law (England & Wales)…"
          className="w-full min-h-[180px] rounded-xl bg-white/5 border border-white/10 p-4 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            disabled={disabled}
            className="inline-flex items-center rounded-xl bg-violet-500 px-5 py-3 font-semibold hover:bg-violet-400 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
          <button
            onClick={handleClear}
            type="button"
            className="inline-flex items-center rounded-xl border border-white/15 px-5 py-3 hover:bg-white/5"
          >
            Clear
          </button>
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium opacity-80">
            Output
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!output}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              disabled={!output}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              Download .txt
            </button>
          </div>
        </div>

        <textarea
          readOnly
          value={output}
          placeholder="Your generated document will appear here…"
          className="w-full min-h-[320px] rounded-xl bg-white/5 border border-white/10 p-4 font-mono text-sm"
        />
      </section>
    </main>
  );
}
