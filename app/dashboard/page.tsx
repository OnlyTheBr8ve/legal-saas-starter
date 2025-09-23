// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    try {
      const md = sessionStorage.getItem("lastContractMarkdown");
      if (md) setMarkdown(md);
    } catch {}
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {!markdown ? (
        <p className="opacity-70">
          No draft found. Generate one in the <a className="underline" href="/wizard">wizard</a>.
        </p>
      ) : (
        <>
          <div className="flex gap-2">
            <button
              className="rounded-md px-3 py-2 bg-white text-black"
              onClick={() => {
                navigator.clipboard.writeText(markdown).catch(() => {});
              }}
            >
              Copy Markdown
            </button>
            <button
              className="rounded-md px-3 py-2 border border-white/20"
              onClick={() => {
                sessionStorage.removeItem("lastContractMarkdown");
                setMarkdown("");
              }}
            >
              Clear Draft
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <textarea
              className="w-full h-[60vh] bg-black/20 border border-white/10 rounded-md p-3 font-mono text-sm"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
            <div className="w-full h-[60vh] bg-black/10 border border-white/10 rounded-md p-4 overflow-auto whitespace-pre-wrap text-sm">
              {markdown}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
