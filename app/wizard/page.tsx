"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SECTORS } from "@/lib/sector-config";

export default function WizardPage() {
  const router = useRouter();
  const [sector, setSector] = useState(SECTORS[0].key);
  const [role, setRole] = useState("");
  const [employmentType, setEmploymentType] = useState("full-time");
  const [location, setLocation] = useState("UK");
  const [pay, setPay] = useState("");
  const [workingPattern, setWorkingPattern] = useState("");
  const [probation, setProbation] = useState("");
  const [notice, setNotice] = useState("");

  const cfg = useMemo(
    () => SECTORS.find((s) => s.key === sector)!,
    [sector]
  );
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const buildPrompt = () => {
    const bullets: string[] = [
      `Role: ${role || "—"}`,
      `Employment type: ${employmentType}`,
      `Location/jurisdiction: ${location}`,
      pay && `Pay: ${pay}`,
      workingPattern && `Working pattern: ${workingPattern}`,
      probation && `Probation: ${probation}`,
      notice && `Notice period: ${notice}`,
    ].filter(Boolean) as string[];

    // Sector‑specific injections
    cfg.followUps.forEach((f) => {
      if (toggles[f.id]) bullets.push(f.injectWhenTrue);
    });

    return (
      `Create a ${location} employment contract.` + "\n" +
      bullets.map((b) => `- ${b}`).join("\n") +
      "\nMake it plain‑English and SME‑friendly. Add standard clauses: duties, hours, holidays, sick pay, confidentiality, data protection, IP, probation, termination, and governing law. Include sector‑specific items you infer from the details above."
    );
  };

  const handleGenerate = () => {
    const prompt = buildPrompt();
    const qs = new URLSearchParams({ prompt }).toString();
    router.push(`/dashboard?${qs}`);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Contract Wizard</h1>
      <p className="text-white/70">
        Answer a few questions and we’ll prefill the Dashboard prompt for you.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block space-y-2">
          <span className="text-sm text-white/70">Sector</span>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          >
            {SECTORS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-white/70">Employment type</span>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          >
            <option>full-time</option>
            <option>part-time</option>
            <option>zero-hours</option>
            <option>fixed-term</option>
          </select>
        </label>

        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm text-white/70">Role</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Senior Barista"
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-white/70">Location / jurisdiction</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="UK"
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-white/70">Pay</span>
          <input
            value={pay}
            onChange={(e) => setPay(e.target.value)}
            placeholder="salary £29,000 or £14/hour"
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          />
        </label>

        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm text-white/70">Working pattern</span>
          <input
            value={workingPattern}
            onChange={(e) => setWorkingPattern(e.target.value)}
            placeholder="e.g., 40 hours, rota incl. weekends"
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-white/70">Probation</span>
          <input
            value={probation}
            onChange={(e) => setProbation(e.target.value)}
            placeholder="e.g., 3 months"
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-white/70">Notice period</span>
          <input
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            placeholder="e.g., 2 weeks"
            className="w-full rounded-md bg-black/30 border border-white/10 p-2"
          />
        </label>
      </div>

      <div className="rounded-md bg-black/20 border border-white/10 p-4">
        <h3 className="font-semibold mb-2">{cfg.label} considerations</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {cfg.followUps.map((f) => (
            <label key={f.id} className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={!!toggles[f.id]}
                onChange={(e) =>
                  setToggles((t) => ({ ...t, [f.id]: e.target.checked }))
                }
              />
              <span>
                {f.label}
                {f.help ? (
                  <span className="block text-xs text-white/60">{f.help}</span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Prefill dashboard
        </button>
      </div>
    </main>
  );
}
