// lib/templates.ts

export type TemplateDef = {
  slug: string;
  title: string;
  excerpt: string;
};

export const TEMPLATES: TemplateDef[] = [
  {
    slug: "uk-employment-contract",
    title: "UK Employment Contract (Hospitality)",
    excerpt:
      "Employer/employee terms, pay, hours, probation, termination. Hospitality-focused version.",
  },
  {
    slug: "uk-nda",
    title: "UK Non-Disclosure Agreement (Mutual)",
    excerpt:
      "Mutual NDA for sharing confidential information with partners and vendors.",
  },
  {
    slug: "uk-freelancer-agreement",
    title: "UK Freelancer / Contractor Agreement",
    excerpt:
      "Scope of work, IP assignment, milestones, confidentiality, payment terms.",
  },
  {
    slug: "uk-privacy-policy",
    title: "UK Website Privacy Policy",
    excerpt:
      "Plain-English GDPR-compliant privacy statement for a typical UK SME website.",
  },
  {
    slug: "uk-employee-handbook",
    title: "UK Employee Handbook (Starter)",
    excerpt:
      "Conduct, leave, grievance, data protection, health & safety — starter pack.",
  },
];

// String-keyed lookup to avoid TS ‘index expression not of type number’ errors
export const TEMPLATES_BY_SLUG: Record<string, TemplateDef> = Object.fromEntries(
  TEMPLATES.map((t) => [t.slug, t])
);
