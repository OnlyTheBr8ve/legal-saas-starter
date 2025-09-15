'use client';

import { useState } from 'react';

export default function Editor({ initial }: { initial?: string }) {
  const [template, setTemplate] = useState(initial ?? '');

  // Use an object + stringify to avoid multiline string issues
  const defaultVars = {
    employer_name: "Example Ltd",
    employee_name: "Jordan Doe"
  };
  const [variables, setVariables] = useState(JSON.stringify(defaultVars, null, 2));

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
        <textarea
          className="input h-64"

