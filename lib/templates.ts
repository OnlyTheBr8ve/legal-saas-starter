export type Template = {
  slug: string;
  title: string;
  summary: string;
  examplePrompt: string;
};

export const TEMPLATES: Template[] = [
  {
    slug: "uk-employment-contract",
    title: "UK Employment Contract",
    summary: "Permanent employee agreement with key terms schedule.",
    examplePrompt:
      "Role: Bar Supervisor. Full-time. Location: Manchester, UK. Pay: £28,000 + tips. Hours: 40/wk incl. evenings/weekends. Personal licence holder preferred. Probation 3 months.",
  },
  {
    slug: "uk-nda",
    title: "UK Mutual NDA",
    summary: "Mutual confidentiality agreement for exploring cooperation.",
    examplePrompt:
      "Parties: ClauseCraft Ltd and VendorCo. Purpose: evaluating software partnership. Term: 3 years. Jurisdiction: England and Wales.",
  },
  {
    slug: "uk-freelancer-agreement",
    title: "UK Freelancer / Contractor",
    summary: "SOW-based engagement with IP assignment and IR35-friendly terms.",
    examplePrompt:
      "Service: Frontend dev on Next.js. Fees: £400/day. Term: 3 months. Deliverables: marketing site build. Location: remote UK.",
  },
];
