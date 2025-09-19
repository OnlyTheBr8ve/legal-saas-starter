export type TemplateDef = {
  slug: string;
  title: string;
  summary: string;
  sectors?: string[];
  examplePrompt: string;
};

export const TEMPLATES: TemplateDef[] = [
  {
    slug: "uk-employment-contract",
    title: "UK Employment Contract (Hospitality)",
    summary:
      "Employer/employee terms tailored for hospitality. Includes pay, hours, probation, uniform, tips/tronc and licensing considerations.",
    sectors: ["Hospitality", "Retail"],
    examplePrompt:
      "Draft a UK employment contract for a full‑time Bar Supervisor in London. Salary £30,000, 40 hours, rota incl. weekends, probation 3 months, notice 2 weeks. Requires Personal Licence; loss of licence triggers review. Uniform provided; tronc/tips handled via PAYE. Include GDPR and health & safety clauses."
  },
  {
    slug: "uk-nda",
    title: "UK Mutual NDA",
    summary:
      "Mutual confidentiality agreement for two parties sharing information, with sensible carve‑outs and reasonable injunctive relief.",
    sectors: ["Tech", "Finance", "Healthcare", "Construction"],
    examplePrompt:
      "Write a UK mutual NDA between Acme Ltd and Beta Ltd covering product roadmaps and pricing. 2‑year term, English law, London courts. Add standard carve‑outs and return/destruction on request."
  },
  {
    slug: "uk-freelancer-agreement",
    title: "UK Freelancer / Contractor Agreement",
    summary:
      "Independent contractor terms with clear scope, deliverables, IP assignment, confidentiality and payment milestones.",
    sectors: ["Tech", "Creative", "Marketing"],
    examplePrompt:
      "Create a UK contractor agreement for a React developer (self‑employed). Day rate £450, 3 days/week for 3 months, IP assigned to client, invoices monthly Net‑30, confidentiality and data protection included."
  },
  {
    slug: "uk-privacy-policy",
    title: "UK Website Privacy Policy",
    summary:
      "Plain‑English, GDPR‑aligned privacy policy for a UK SME website collecting basic analytics and contact form submissions.",
    sectors: ["All"],
    examplePrompt:
      "Draft a UK GDPR privacy policy for a small ecommerce site collecting name, email, address and analytics. Includes lawful bases, retention, rights, and contact details."
  },
  {
    slug: "uk-employee-handbook",
    title: "UK Employee Handbook (Starter)",
    summary:
      "Starter handbook covering conduct, hours, leave, grievance & disciplinary, equal opportunities, H&S and data protection.",
    sectors: ["All"],
    examplePrompt:
      "Create a concise UK Employee Handbook for a 15‑person company. Include conduct, working time, leave, sickness, equal opportunities, grievance & disciplinary (ACAS‑aligned), H&S, and data protection."
  }
];

export const TEMPLATES_BY_SLUG: Record<string, TemplateDef> = Object.fromEntries(
  TEMPLATES.map((t) => [t.slug, t])
);
