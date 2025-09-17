// app/templates/page.tsx
import Link from 'next/link';

const templates = [
  {
    slug: 'uk-employment-contract',
    title: 'UK Employment Contract (Hospitality)',
    blurb: 'Employer/employee terms, pay, hours, probation, termination.',
  },
  {
    slug: 'uk-nda',
    title: 'UK Non-Disclosure Agreement (NDA)',
    blurb: 'Mutual NDA for sharing confidential info with partners.',
  },
  {
    slug: 'uk-freelancer-agreement',
    title: 'UK Freelancer / Contractor Agreement',
    blurb: 'Scope, IP, payment milestones, confidentiality.',
  },
  {
    slug: 'uk-privacy-policy',
    title: 'UK Website Privacy Policy',
    blurb: 'Plain-English GDPR compliant privacy statement.',
  },
  {
    slug: 'uk-employee-handbook',
    title: 'UK Employee Handbook (Starter)',
    blurb: 'Conduct, leave, grievance, data protection.',
  },
];

export const metadata = {
  title: 'Legal Templates (UK) — ClauseCraft',
  description:
    'Free AI-assisted legal templates for SMEs in the UK. Employment contracts, NDAs, freelancer agreements and more.',
};

export default function TemplatesIndex() {
  return (
    <main className="space-y-6">
      <h1 className="text-4xl font-extrabold">Legal Templates (UK)</h1>
      <p className="text-white/70">
        Pick a template to generate a draft instantly. Edit, export, and e-sign.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((t) => (
          <Link
            key={t.slug}
            href={`/templates/${t.slug}`}
            className="block rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10"
          >
            <h2 className="text-lg font-semibold">{t.title}</h2>
            <p className="text-white/70 text-sm mt-1">{t.blurb}</p>
            <span className="inline-block mt-3 text-sm text-indigo-300">
              Open template →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
