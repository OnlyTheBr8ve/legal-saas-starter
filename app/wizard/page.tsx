'use client';

import { useMemo, useState } from 'react';
import {
  Sector,
  SECTOR_PACKS,
  getSectorPack,
  bullet,
  ToggleKey,
} from '@/lib/sector-config';

type Detail = 'basic' | 'comprehensive';
type EmpType = 'Full-time' | 'Part-time' | 'Zero-hours' | 'Fixed-term' | 'Casual';
type WorkingPattern = 'On-site' | 'Hybrid' | 'Remote' | 'Shift / Rota' | 'Night work';

export default function WizardPage() {
  // Identity
  const [employer, setEmployer] = useState('Example Ltd');
  const [employee, setEmployee] = useState('Jordan Doe');
  const [role, setRole] = useState('Bar Staff');
  const [startDate, setStartDate] = useState('2025-10-01');
  const [jurisdiction, setJurisdiction] = useState('UK');

  // Pay / Hours
  const [pay, setPay] = useState('£12.50 per hour, paid weekly');
  const [hours, setHours] = useState('20–30 hours per week, rota-based');

  // Specificity
  const [sector, setSector] = useState<Sector>('Hospitality');
  const [seniority, setSeniority] = useState('Staff');
  const [employmentType, setEmploymentType] = useState<EmpType>('Part-time');
  const [pattern, setPattern] = useState<WorkingPattern>('Shift / Rota');
  const [detail, setDetail] = useState<Detail>('comprehensive');
  const [notes, setNotes] = useState('');

  // Dynamic sector toggles
  const pack = useMemo(() => getSectorPack(sector), [sector]);
  const [answers, setAnswers] = useState<Record<ToggleKey, boolean>>({} as any);

  function toggleAnswer(key: ToggleKey, next?: boolean) {
    setAnswers((prev) => ({ ...prev, [key]: next ?? !prev[key] }));
  }

  // Build sector-specific “must include” bullets
  const sectorMustInclude = useMemo(() => {
    const base = pack.baseClauses.length
      ? `**Sector-specific base requirements (include all):**\n${bullet(pack.baseClauses)}\n`
      : '';

    const selectedKeys = Object.entries(answers)
      .filter(([k, v]) => v)
      .map(([k]) => k as ToggleKey);

    const extraClauses: string[] = [];
    for (const key of selectedKeys) {
      const add = pack.clauseByToggle[key];
      if (add && add.length) extraClauses.push(...add);
    }

    const extra = extraClauses.length
      ? `\n**Selected conditions (must be reflected as binding clauses):**\n${bullet(extraClauses)}\n`
      : '';

    return `${base}${extra}`.trim();
  }, [pack, answers]);

  // Instructions
  const baseInstructions =
    'Write a well-structured employment contract in Markdown (H1/H2/H3, numbered clauses, bullets). Plain English for SMEs. Include signature blocks. Avoid generic boilerplate; be specific to the role and sector.';

  function composeInstructions() {
    const levelNote =
      detail === 'comprehensive'
        ? 'Produce a comprehensive contract with 12–18 sections. Tailor everything to the role, sector, seniority, and working pattern.'
        : 'Produce a concise but complete contract with ~8–10 sections, still tailored to the role and sector.';

    const jHint =
      jurisdiction.toUpperCase().startsWith('UK')
        ? 'Follow UK norms (statutory holidays, SSP, plain English). Avoid US-only concepts.'
        : 'Follow norms applicable to the named jurisdiction and avoid irrelevant foreign concepts.';

    const roleDirectives = `
**Role-specific requirements:**
- Add "Role-Specific Duties" (≥8 bullets) tailored to "${role}" in ${sector} at ${seniority} level.
- Add "Regulatory & Compliance" that actually applies in ${sector} within ${jurisdiction}.
- Add "Risk, Safety & Conduct" reflecting hazards for ${pattern} work and this sector.
- Adapt working time, breaks, and overtime to ${employmentType} / ${pattern}.
${sectorMustInclude ? `\n${sectorMustInclude}\n` : ''}
${notes ? `\n**Additional context from user:** ${notes}\n` : ''}`.trim();

    return `${baseInstructions}\n${levelNote}\n${jHint}\n\n${roleDirectives}`;
  }

  // Base template with variables
  const baseTemplate = `# Employment Agreement

This Employment Agreement (“Agreement”) is made between **{{employer_name}}** (“Employer”) and **{{employee_name}}** (“Employee”) for the role of **{{job_title}}**, starting on **{{start_date}}**.

> **Summary (non-binding)**  
> This agreement sets out the terms of employment, including role, pay, hours, policies, and termination procedures. It is intended for **{{jurisdiction}}** and written for small/medium businesses in clear, practical language.

## 1. Role & Start
- Job Title: **{{job_title}}** (**{{seniority}}**, **{{employment_type}}**)
- Start Date: **{{start_date}}**
- Working Pattern: **{{working_pattern}}**
- Location: As directed by the Employer within reasonable travel distance (including on-site and/or remote as applicable).
- Reporting to: As designated by the Employer.

## 2. Pay & Hours
- Pay: **{{pay}}**
- Hours: **{{hours}}**
- Overtime/Breaks: In line with law and Employer policy for **{{employment_type}}** and **{{working_pattern}}**.
- Deductions: Lawful deductions (e.g., tax/NI) where applicable.

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
- Statutory sick pay (SSP) or equivalent applies where required by law.

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

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
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
        seniority,
        employment_type: employmentType,
        working_pattern: pattern,
        sector,
      };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: baseTemplate,
          variables,
          instructions: composeInstructions(),
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
    } catch (e: any) {
      setErr(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  // Pattern-aware rendering (some toggles only make sense on certain patterns)
  function shouldShowToggle(dep?: SectorQuestion['dependsOnPattern']) {
    if (!dep || dep.length === 0) return true;
    return dep.includes(pattern);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Contract Wizard</h1>
        <p className="text-white/70 mt-1">
          Pick a sector, answer smart prompts, and generate a contract tailored to the role and working pattern.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="grid xl:grid-cols-2 gap-8">
        {/* LEFT: form */}
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Employer</label>
              <input className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={employer} onChange={(e) => setEmployer(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Employee</label>
              <input className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={employee} onChange={(e) => setEmployee(e.target.value)} required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Job Title</label>
              <input className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Family Solicitor" required />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Start Date</label>
              <input type="date" className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Jurisdiction</label>
              <input className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} placeholder="UK, US-CA, US-NY…" required />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Sector</label>
              <select
                className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2"
                value={sector}
                onChange={(e) => {
                  setSector(e.target.value as Sector);
                  setAnswers({} as any);
                }}
              >
                {SECTOR_PACKS.map((p) => (
                  <option key={p.sector} value={p.sector}>
                    {p.sector}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Seniority</label>
              <select className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={seniority} onChange={(e) => setSeniority(e.target.value)}>
                <option>Junior</option>
                <option>Staff</option>
                <option>Senior</option>
                <option>Manager</option>
                <option>Director</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Employment Type</label>
              <select className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmpType)}>
                {(['Full-time', 'Part-time', 'Zero-hours', 'Fixed-term', 'Casual'] as EmpType[]).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Working Pattern</label>
              <select className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={pattern} onChange={(e) => setPattern(e.target.value as WorkingPattern)}>
                {(['On-site', 'Hybrid', 'Remote', 'Shift / Rota', 'Night work'] as WorkingPattern[]).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Smart, sector-specific prompts */}
          {pack.questions.length > 0 && (
            <div className="rounded-xl border border-white/10 p-4 space-y-3 bg-zinc-900/40">
              <div className="text-sm font-semibold">Sector considerations</div>
              {pack.questions.map((q) =>
                shouldShowToggle(q.dependsOnPattern) ? (
                  <label key={q.key} className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={!!answers[q.key]}
                      onChange={(e) => toggleAnswer(q.key, e.target.checked)}
                    />
                    <span>
                      {q.label}
                      {q.help && <span className="text-white/60"> — {q.help}</span>}
                    </span>
                  </label>
                ) : null
              )}
              <p className="text-xs text-white/50">
                These toggles add binding clauses to the contract (e.g., licence or training as a condition).
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Salary/Pay</label>
              <input className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={pay} onChange={(e) => setPay(e.target.value)} placeholder="£XX,XXX per year / £X.XX per hour" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Hours</label>
              <input className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g., 37.5 hours/week; rota-based" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Detail Level</label>
              <select className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={detail} onChange={(e) => setDetail(e.target.value as Detail)}>
                <option value="basic">Basic (shorter)</option>
                <option value="comprehensive">Comprehensive (recommended)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Regulatory/Notes (optional)</label>
              <input className="w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any extra context, client standards, union policy, etc." />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-white text-zinc-900 font-medium px-4 py-2 hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate Contract'}
          </button>

          {err && <p className="text-sm text-red-400">{err}</p>}
          <p className="text-xs text-white/60">Disclaimer: Outputs are AI-generated and for informational purposes only; not legal advice.</p>
        </div>

        {/* RIGHT: result */}
        <div className="space-y-3">
          <label className="block text-sm text-white/70">Result (Markdown)</label>
          <textarea
            className="w-full h-[36rem] rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 font-mono text-sm"
            value={result}
            onChange={(e) => setResult(e.target.value)}
          />
          <p className="text-xs text-white/50">
            Tip: The more specific you are (toggles + notes), the more tailored the contract will be.
          </p>
        </div>
      </form>
    </div>
  );
}

// local helper for type
type SectorQuestion = ReturnType<typeof getSectorPack>['questions'][number];
