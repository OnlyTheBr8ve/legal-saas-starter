'use client';

import { useState } from 'react';

export default function WizardPage() {
  // Form state
  const [employer, setEmployer] = useState('Example Ltd');
  const [employee, setEmployee] = useState('Jordan Doe');
  const [role, setRole] = useState('Bar Staff');
  const [startDate, setStartDate] = useState('2025-10-01');
  const [jurisdiction, setJurisdiction] = useState('UK');
  const [pay, setPay] = useState('£12.50 per hour, paid weekly');
  const [hours, setHours] = useState('20–30 hours per week, rota-based');
  const [detail, setDetail] = useState<'basic' | 'comprehensive'>('comprehensive');

  // Instruction scaffold: model guidance
  const baseInstructions =
    'Write a clean, well-structured employment contract in Markdown with clear H1/H2/H3 headings, numbered clauses, and bullet points where helpful. Use plain English suitable for SMEs. Keep it practical, not academic. Ensure it suits the jurisdiction provided. Include a signature section.';

  const [instructions, setInstructions] = useState(baseInstructions);

  // Result + UI state
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Stronger, pro-grade base template (placeholders get filled server-side BEFORE AI rewrite)
  const baseTemplate = `# Employment Agreement

This Employment Agreement (“Agreement”) is made between **{{employer_name}}** (“Employer”) and **{{employee_name}}** (“Employee”) for the role of **{{job_title}}**, starting on **{{start_date}}**.

> **Summary (non-binding)**  
> This agreement sets out the terms of employment, including role, pay, hours, policies, and termination procedures. It is intended for **{{jurisdiction}}** and written for small/medium businesses in clear, practical language.

## 1. Role & Start
- Job Title: **{{job_title}}**
- Start Date: **{{start_date}}**
- Location: As directed by the Employer within reasonable travel distance (including on-site and/or remote as applicable).
- Reporting to: As designated by the Employer.

## 2. Pay & Hours
- Pay: **{{pay}}**
- Hours: **{{hours}}**
- Overtime & Premiums: As required by applicable law and Employer policy.
- Deductions: Any lawful deductions (tax, NI, etc.) will be made where applicable.

## 3. Duties & Performance
- The Employee will perform the usual duties of **{{job_title}}** and any reasonable additional duties.
- The Employee will act with reasonable care, skill, and diligence.

## 4. Place of Work & Mobility
- Primary place of work to be reasonably designated by the Employer.
- Mobility: The Employee may be required to work at other sites on reasonable notice.

## 5. Probation (if applicable)
- Probationary period: 3 months (or as adjusted by law).  
- During probation, performance and suitability will be assessed. Notice periods may be shorter during this time.

## 6. Holidays & Time Off
- Minimum holiday entitlement complies with local law.  
- Holiday scheduling requires Employer approval.

## 7. Sickness & Absence
- Follow Employer absence reporting procedure.  
- Statutory sick pay (SSP) applies where required by law.

## 8. Conduct & Policies
- The Employee agrees to follow lawful Employer policies, including health & safety, equality, and data protection.

## 9. Confidentiality & Data
- The Employee must keep confidential all non-public information of the Employer and its customers, during and after employment.
- Personal data will be handled per applicable data protection law.

## 10. Intellectual Property
- Work products created in the course of employment belong to the Employer to the extent permitted by law.

## 11. Conflict of Interest & Secondary Work
- The Employee must not undertake conflicting work or activities without prior written consent.

## 12. Notice & Termination
- Notice: Each party provides notice in line with law and Employer policy (or payment in lieu where lawful).  
- Gross misconduct may result in summary dismissal in line with policy and law.

## 13. Post-Employment
- Return of property: All Employer property must be returned on or before the last day.  
- Continuing obligations: Confidentiality and IP provisions continue after employment ends.

## 14. Governing Law & Jurisdiction
- This Agreement is governed by **{{jurisdiction}}** law.  
- Venue: Courts or tribunals with jurisdiction in **{{jurisdiction}}**.

---

## Signatures

**Employer**  
Name: __________________________  
Title: __________________________  
Signature: ______________________  
Date: ___________________________

**Employee**  
Name: **{{employee_name}}**  
Signature: ______________________  
Date: ___________________________
`;

  function effectiveInstructions() {
    const levelNote =
      detail === 'comprehensive'
        ? 'Ensure a full professional contract (12–18 sections), with complete clauses and practical defaults. Avoid filler; be precise.'
        : 'Keep the document concise but complete (8–10 sections), still professional and ready to use.';

    // Add jurisdiction hint so the model leans the right way.
    const jHint =
      jurisdiction.toUpperCase().startsWith('UK')
        ? 'Follow UK norms (e.g., statutory holidays, SSP, plain English). Avoid US-specific concepts unless universal.'
        : 'Follow the norms of the specified jurisdiction and avoid irrelevant foreign concepts.';

    return `${baseInstructions} ${levelNote} ${jHint}${instructions && instructions !== baseInstructions ? `\n\nAdditional user instructions: ${instructions}` : ''}`;
  }

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
        jurisdiction,
        pay,
        hours,
      };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: baseTemplate,
          variables,                 // server does {{...}} replacement first
          instructions: effectiveInstructions(),
          jurisdiction,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed: ${res.status}`);
      }

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
          Fill the form, click generate. The output is structured in Markdown (ready to copy or export later).
        </p>
      </div>

      <form onSubmit={handleGenerate} className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: form */}
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
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
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
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

          <div className="grid sm:grid-cols-2 gap-4">
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
              <label className="block text-sm text-white/70 mb-1">Detail Level</label>
              <select
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
                value={detail}
                onChange={(e) => setDetail(e.target.value as 'basic' | 'comprehensive')}
              >
                <option value="basic">Basic (shorter)</option>
                <option value="comprehensive">Comprehensive (recommended)</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Salary/Pay</label>
              <input
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                placeholder="£12.50 per hour, paid weekly"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Hours</label>
              <input
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="20–30 hours/week, rota-based"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Extra Instructions (optional)</label>
            <input
              className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={baseInstructions}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-white text-zinc-900 font-medium px-4 py-2 hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate Contract'}
          </button>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <p className="text-xs text-white/60">
            Disclaimer: Outputs are AI-generated and for informational purposes only; not legal advice.
          </p>
        </div>

        {/* RIGHT: result */}
        <div className="space-y-3">
          <label className="block text-sm text-white/70">Result (Markdown)</label>
          <textarea
            className="w-full h-[36rem] rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 font-mono text-sm"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
