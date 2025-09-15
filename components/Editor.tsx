
'use client';

import { useState } from 'react';

export default function Editor({ initial }: { initial?: string }) {
  const [template, setTemplate] = useState(initial ?? '');
  const [variables, setVariables] = useState('{
  "employer_name": "Example Ltd",
  "employee_name": "Jordan Doe"
}');
  const [instructions, setInstructions] = useState('Adjust tone to plain English and UK SME norms.');
  const [jurisdiction, setJurisdiction] = useState('UK');

  const [result, setResult] = useState('');

  async function generate() {
    setResult('Working...');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template, variables, instructions, jurisdiction }),
    });
    const text = await res.text();
    setResult(text);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <label className="block text-sm text-white/70">Template (Markdown or plain text)</label>
        <textarea className="input h-64" value={template} onChange={e => setTemplate(e.target.value)} placeholder="Paste a base template here..." />
        <label className="block text-sm text-white/70">Variables (JSON)</label>
        <textarea className="input h-40" value={variables} onChange={e => setVariables(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <input className="input" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} placeholder="Jurisdiction e.g., UK, US-CA, US-NY" />
          <input className="input" value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Additional instructions" />
        </div>
        <button className="btn" onClick={generate}>Generate with AI</button>
      </div>
      <div className="space-y-3">
        <label className="block text-sm text-white/70">Result</label>
        <textarea className="input h-96" value={result} onChange={e => setResult(e.target.value)} />
        <p className="text-xs text-white/60">
          Disclaimer: Outputs are AI‑generated and for informational purposes only; not legal advice. Seek a qualified professional for your situation.
        </p>
      </div>
    </div>
  );
}
