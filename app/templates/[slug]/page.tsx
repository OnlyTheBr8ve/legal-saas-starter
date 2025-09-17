// app/templates/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteUrl } from '../../../lib/site';

type TemplateDef = {
  title: string;
  description: string;
  bullets: string[];
  ctaTemplateQuery?: string; // if you want to deep-link a template later
};

const templates: Record<string, TemplateDef> = {
  'uk-employment-contract': {
    title: 'UK Employment Contract (Hospitality)',
    description:
      'Employer/employee agreement for UK hospitality roles: pay, hours, probation, holidays, termination, and data protection.',
    bullets: [
      'Employer & employee details',
      'Job title, hours & location',
      'Pay, overtime & holidays',
      'Probation & termination',
      'GDPR / data protection',
    ],
  },
  'uk-nda': {
    title: 'UK Non-Disclosure Agreement (Mutual)',
    description:
      'Mutual NDA suitable for early-stage discussions with partners, suppliers, or contractors in the UK.',
    bullets: [
      'Definition of Confidential Information',
      'Permitted disclosures & exclusions',
      'Term & survival',
      'Return/destruction of information',
      'Governing law (England & Wales)',
    ],
  },
  'uk-freelancer-agreement': {
    title: 'UK Freelancer / Contractor Agreement',
    description:
      'Set out scope, deliverables, fees, IP ownership, and confidentiality with UK freelancers.',
    bullets: [
      'Scope & statement of work',
      'Payment terms & milestones',
      'IP assignment & moral rights',
      'Confidentiality & data protection',
      'Indemnities & liability caps',
    ],
  },
  'uk-privacy-policy': {
    title: 'UK Website Privacy Policy',
    description:
      'Plain-English, GDPR-friendly privacy policy for UK websites collecting analytics or contact form data.',
    bullets: [
      'What data is collected & why',
      'Cookies & analytics',
      'Legal bases (GDPR)',
      'Data retention & rights',
      'Contact details for requests',
    ],
  },
  'uk-employee-handbook': {
    title: 'UK Employee Handbook (Starter)',
    description:
      'Starter handbook covering conduct, leave, grievance, and data protection for small teams in the UK.',
    bullets: [
      'Code of conduct & equal opportunities',
      'Working time & leave',
      'Sickness & reporting',
      'Grievance & disciplinary',
      'Data protection & security',
    ],
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(templates).map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const t = templates[params.slug];
  if (!t) return {};
  const url = `${siteUrl}/templates/${params.slug}`;
  return {
    title: `${t.title} — Free Template`,
    description: t.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${t.title} — Free Template`,
      description: t.description,
      url,
      type: 'article',
    },
  };
}

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const t = templates[params.slug];
  if (!t) return <main><p>Not found.</p></main>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: t.title,
    description: t.description,
    url: `${siteUrl}/templates/${params.slug}`,
    inLanguage: 'en-GB',
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: 'ClauseCraft' },
    publisher: { '@type': 'Organization', name: 'ClauseCraft' },
  };

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-extrabold">{t.title}</h1>
      <p className="text-white/70 max-w-2xl">{t.description}</p>

      <ul className="list-disc pl-6 space-y-2 text-white/90">
        {t.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-600"
        >
          Generate this document
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg border border-white/20 px-4 py-2 font-medium hover:bg-white/10"
        >
          See Pro features
        </Link>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
