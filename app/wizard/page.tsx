// app/wizard/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SECTOR_PACKS, buildSectorClauses } from "../../lib/sector-config";

type EmploymentType = "full-time" | "part-time" | "casual" | "fixed-term" | "contractor";
type PayType = "hourly" | "salary" | "day-rate" | "commission";

export default function WizardPage() {
  // Basic role fields
  const [roleTitle, setRoleTitle] = useState("Bar Staff");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("full-time");
  const [payType, setPayType] = useState<PayType>("hourly");
  const [payValue, setPayValue] = useState("11.50");
  const [currency, setCurrency] = useState("GBP");
  const [location, setLocation] = useState("UK");
  const [workingPattern, setWorkingPattern] = useState("variable shifts incl. weekends");
  const [probationMonths, setProbationMonths] = useState("3");
  const [noticePeriod, setNoticePeriod] = useState("2 weeks");
  const [extras, setExtras] = useState("Uniform provided; basic till operations; customer service focus.");

  // Sector + toggles
  const sectorKeys = useMemo(() => Object.keys(SECTOR_PACKS), []);
  const [sector, setSector] = useState(sectorKeys[0] ?? "hospitality");

  // Track answers for the active sector
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const activePack = SECTOR_PACKS[sector];

  function toggleAnswer(key: string) {
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Compose a tight prompt for the generator
  const prompt = useMemo(() => {
    const bits: string[] = [];

    bits.push(
      `Draft a clear, SME-friendly employment contract using UK/GB plain-English style where possible.`,
    );

    bits.push(
      `Role: ${roleTitle}. Employment type: ${employmentType}. Location/jurisdiction: ${location}.`,
    );

    bits.push(
      `Pay: ${payType} ${currency} ${payValue}. Working pattern: ${workingPattern}.`,
    );

    bits.push(
      `Probation: ${probationMonths} months. Notice period: ${noticePeriod}.`,
    );

    if (extras.trim()) {
      bits.push(`Extra context: ${extras.trim()}`);
    }

    // Sector clauses from selected toggles
    const sectorClause = buildSectorClauses(sector, answers);
    if (sectorClause) {
      bits.push(`Sector-specific requirements:\n${sectorClause}`);
    }

    // Output guidance
    bits.push(
      [
        "Output format:",
        "- Use markdown with H2 section headings (##).",
        "- Include definitions, duties, pay & hours, leave, probation, notice/termination, conduct, confidentiality, IP (if relevant), data protection, health & safety, and dispute/venue.",
        "- Insert placeholders like {{employee_name}}, {{start_date}}, {{work_address}} where employer will fill details.",
        "- Keep it concise and practical; avoid heavy legalese.",
        "- If a requirement is uncommon for the sector, add a short explanatory sentence.",
      ].join("\n"),
    );

    return bits.join("\n\n");
  }, [
    roleTitle,
    employmentType,
    payType,
    payValue,
    currency,
    location,
    workingPattern,
    probationMonths,
    noticePeriod,
    extras,
    sector,
    answers,
  ]);

  const encoded = encodeURIComponent(prompt);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl md:text-4xl font-extrabold">Contract Wizard</h1>
      <p className="text-white/70">
        Answer a few quick questions and we’ll prefill the AI brief for a tailored draft. You can
        edit anything later on the dashboard.
      </p>

      {/* Role basics */}
      <section className="rounded-2xl border border-white/10 p-5 md:p-6 space-y-5 bg-white/5">
        <h2 className="text-xl font-bold">Role basics</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-white/70">Role title</label>
            <input
              className="input"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g., Senior Bartender"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Employment type</label>
            <select
              className="input"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="casual">Casual / Zero-hours</option>
              <option value="fixed-term">Fixed-term</option>
              <option value="contractor">Contractor / Consultant</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Pay type</label>
            <select
              className="input"
              value={payType}
              onChange={(e) => setPayType(e.target.value as PayType)}
            >
              <option value="hourly">Hourly</option>
              <option value="salary">Salary</option>
              <option value="day-rate">Day rate</option>
              <option value="commission">Commission</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Amount</label>
              <input
                className="input"
                value={payValue}
                onChange={(e) => setPayValue(e.target.value)}
                placeholder="e.g., 12.25 or 30000"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-white/70">Currency</label>
              <select
                className="input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>GBP</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Location / Jurisdiction</label>
            <input
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., UK, US-CA, IE, AU-NSW"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Working pattern</label>
            <input
              className="input"
              value={workingPattern}
              onChange={(e) => setWorkingPattern(e.target.value)}
              placeholder="e.g., Mon–Fri, 9–5; or variable shifts incl. weekends"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Probation (months)</label>
            <input
              className="input"
              value={probationMonths}
              onChange={(e) => setProbationMonths(e.target.value)}
              placeholder="e.g., 3"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-white/70">Notice period</label>
            <input
              className="input"
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              placeholder="e.g., 2 weeks"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm text-white/70">Any extras to consider</label>
            <input
              className="input"
              value={extras}
              onChange={(e) => setExtras(e.target.value)}
              placeholder="e.g., Uniform, equipment, on-call rota, confidentiality specifics, etc."
            />
          </div>
        </div>
      </section>

      {/* Sector pack */}
      <section className="rounded-2xl border border-white/10 p-5 md:p-6 space-y-5 bg-white/5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Sector-specific prompts</h2>
          <select
            className="input w-56"
            value={sector}
            onChange={(e) => {
              setSector(e.target.value);
              setAnswers({}); // reset answers on sector change
            }}
          >
            {sectorKeys.map((k) => (
              <option key={k} value={k}>
                {SECTOR_PACKS[k].title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {activePack?.toggles.map((t) => {
            const checked = !!answers[t.key];
            return (
              <label
                key={t.key}
                className="flex items-start gap-3 rounded-xl border border-white/10 p-3 hover:bg-white/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={checked}
                  onChange={() => toggleAnswer(t.key)}
                />
                <span>
                  <span className="font-medium">{t.label}</span>
                  {t.hint ? <span className="block text-xs text-white/60">{t.hint}</span> : null}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Preview + actions */}
      <section className="rounded-2xl border border-white/10 p-5 md:p-6 space-y-4 bg-white/5">
        <h2 className="text-xl font-bold">AI brief preview</h2>
        <textarea className="input h-64 font-mono text-sm" value={prompt} readOnly />
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/dashboard?prompt=${encoded}`} className="btn">
            Open in Editor
          </Link>
          <span className="text-xs text-white/60">
            We’ll still show placeholders like <code className="px-1 rounded bg-white/10">
              {"{{employee_name}}"}
            </code>{" "}
            for details you’ll fill later.
          </span>
        </div>
      </section>
    </main>
  );
}
