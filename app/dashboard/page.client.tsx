"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Client() {
  const params = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const p = params.get("prompt");
    if (p) setPrompt(p);
  }, [params]);

  async function handleGenerate() {
    setOutput("Generating…");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const text = await res.text();
      setOutput(text);
    } catch (e: any) {
      setOutput(`Error: ${e?.message || "failed to generate"}`);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-white/70">
        Describe the document you want. Or start from a template and tweak it here.
      </p>

      <label className="block space-y-2">
        <span className="text-sm text-white/70">Prompt</span>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={10}
          className="w-full rounded-md bg-black/30 border border-white/10 p-3"
        />
      </label>

      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Generate
        </button>
        <button
          onClick={() => setPrompt("")}
          className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5"
        >
          Clear
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <pre className="whitespace-pre-wrap rounded-md bg-black/20 border border-white/10 p-4 text-white/80">
{output}
        </pre>
      </div>
    </main>
  );
}
