'use client';

import React, { useRef, useState } from 'react';

export default function Editor({ initial }: { initial?: string }) {
  const [template, setTemplate] = useState(initial ?? '');

  const defaultVars = { employer_name: 'Example Ltd', employee_name: 'Jordan Doe' };
  const [variables, setVariables] = useState<string>(JSON.stringify(defaultVars, null, 2));

  const [instructions, setInstructions] = useState<string>('Adjust tone to plain English and UK SME norms.');
  const [jurisdiction, setJurisdiction] = useState<string>('UK');

  const [result, setResult] = useState<string>('');
  const resultRef = useRef<HTMLTextAreaElement>(null);
  const [busy, setBusy] = useState<boolean>(false);

  async function generate() {
    setBusy(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, variables, instructions, jurisdiction }),
      });
      const text = await res.text();
      setResult(text);
    } finally {
      setBusy(false);
    }
  }

  async function rewriteSelection() {
    const el = resultRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (end <= start) {
      alert('Select some text in the result panel first.');
      return;
    }

    const excerpt = result.slice(start, end);
    const CONTEXT_CHARS = 600;
    const ctxStart = Math.max(0, start - CONTEXT_CHARS);
    const ctxEnd = Math.min(result.length, end + CONTEXT_CHARS);
    const context = result.slice(ctxStart, ctxEnd);

    setBusy(true);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ excerpt, context, jurisdiction }),
      });
      const newText = await res.text();
      if (res.ok && newText) {
        const updated = result.slice(0, start) + newText + result.slice(end);
        setResult(updated);
        // Restore caret just after the rewritten text
        requestAnimationFrame(() => {
          if (resultRef.current) {
            const pos = start + newText.length;
            resultRef.current.selectionStart = resultRef.current.selectionEnd = pos;
            resultRef.current.focus();
          }
        });
      } else {
        alert(newText || 'Rewrite failed');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <label className="block text-sm text-white/70">Template (Markdown or plain text)</label>
        <textarea
          className="input h-64"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Paste a base template here..."
        />

        <label className="block text-sm text-white/70">Variables (JSON)</label>
        <textarea
          className="input h-40"
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="input"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            placeholder="Jurisdiction e.g., UK, US-CA, US-NY"
          />
          <input
            className="input"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Additional instructions"
          />
        </div>

        <button className="btn disabled:opacity-60" onClick={generate} disabled={busy}>
          {busy ? 'Working…' : 'Generate with AI'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm text-white/70">Result</label>
          <button
            className="px-3 py-1 rounded-xl border border-white/15 text-sm"
            onClick={rewriteSelection}
            disabled={busy}
            title="Select text in the result and click to rewrite only that part."
          >
            Rewrite selection (AI)
          </button>
        </div>

        <textarea
          ref={resultRef}
          className="input h-96"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
        <p className="text-xs text-white/60">
          Disclaimer: Outputs are AI-generated and for informational purposes only; not legal advice.
          Seek a qualified professional for your situation.
        </p>
      </div>
    </div>
  );
}
