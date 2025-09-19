'use client';

import { useState } from 'react';

export default function WizardPage() {
  const [employer, setEmployer] = useState('Example Ltd');
  const [employee, setEmployee] = useState('Jordan Doe');
  const [role, setRole] = useState('Bar Staff');
  const [startDate, setStartDate] = useState('2025-10-01');
  const [jurisdiction, setJurisdiction] = useState('UK');
  const [instructions, setInstructions] = useState('Plain English. UK SME norms.');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // A friendly base template with {{placeholders}} for our server to fill BEFORE AI.
  const baseTemplate = `# Employment Agreement

This Employment Agreement is made between **{{employer_name}}** ("Employer") and **{{employee_name}}** ("Employee") for the role of **{{job_title}}**, starting on **{{start_date}}**.

## Key Terms
- Employment starts: {{start_date}}
- Job title: {{job_title}}
- Employer: {{employer_name}}
- Employee: {{employee_name}}

## Duties
Employee will perform the usual duties of {{job_title}} to a reasonable standard. Additional duties may be assigned as needed.

## Pay & Hours
Specify pay, hours, and breaks here.

## Policies
Employee agrees to follow all lawful policies and procedures of the Employer.

## Termination
Either party may end this agreement in line with applicable law and required notice.

---

> This output is for information only and is not legal advice. Consider getting professional advice for your situation.`;

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const variables = {
        employer_name: employer,
        employee_name: employee,
        job_title: role,
        start_date: startDate,
      };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: baseTemplate,
          variables,               // <- server replaces {{...}} first
          instructions,            // <- AI gets this + filled text
          jurisdiction,            // <- e.g. UK, US-CA, etc
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed: ${res.status}`);
      }

      // Headers give us cache status if your route.ts sets X-Cache.
      const cache = res.headers.get('X-Cache') || 'MISS';
      const text = await res.text();
      setResult(`<!-- Cache: ${cache} -->\n${text}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Contract Wizard</h1>
        <p className="text-white/70 mt-1">
          Fill the form, click generate. No JSON needed.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Employer</label>
            <input
              className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Employee</label>
            <input
              className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/70 mb-1">Job Title</label>
              <input
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/70 mb-1">Jurisdiction</label>
              <input
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
                placeholder="UK, US-CA, US-NY…"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Style/Instructions</label>
              <input
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-white text-zinc-900 font-medium px-4 py-2 hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <p className="text-xs text-white/60">
            Disclaimer: Outputs are AI-generated and for informational purposes only; not legal advice.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-white/70">Result</label>
          <textarea
            className="w-full h-[32rem] rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 font-mono text-sm"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
