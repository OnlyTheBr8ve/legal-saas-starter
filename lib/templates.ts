// Central catalogue of contract templates.
// Pure data only (no JSX). Safe to import from server or client files.

export type TemplateDef = {
  slug: string;
  title: string;
  summary: string;
  sectors: Array<
    | "general"
    | "hospitality"
    | "construction"
    | "healthcare"
    | "retail"
    | "technology"
  >;
  examplePrompt: string;
};

export const TEMPLATES: TemplateDef[] = [
  {
    slug: "employment-contract",
    title: "Employment Contract (Permanent)",
    summary:
      "Standard permanent employment agreement covering duties, compensation, hours, leave, IP, confidentiality, and termination.",
    sectors: ["general", "hospitality", "construction", "retail", "technology", "healthcare"],
    examplePrompt:
      "Draft a permanent employment contract for a Front-of-House Supervisor at a mid-size restaurant group in Manchester, UK. 40 hours/week, rota-based shifts, National Living Wage + tronc, 28 days holiday, 6-month probation, confidentiality, IP assignment, and garden-leave on termination. Include hospitality-specific hygiene and customer safety duties."
  },
  {
    slug: "fixed-term-contract",
    title: "Fixed-Term Employment Contract",
    summary:
      "Employment agreement for a fixed period, including early termination and notice handling.",
    sectors: ["general", "technology", "retail", "hospitality", "construction"],
    examplePrompt:
      "Draft a fixed-term employment contract for a Project Coordinator (6 months) supporting a retail store refit programme. Include clear deliverables, weekly hours, overtime rules, confidentiality, and IP assignment."
  },
  {
    slug: "contractor-agreement",
    title: "Independent Contractor Agreement",
    summary:
      "Engagement of a self-employed contractor with scope, milestones, IP assignment, confidentiality, and liability.",
    sectors: ["technology", "construction", "general", "retail"],
    examplePrompt:
      "Create a contractor agreement for a freelance React developer building an internal dashboard for a logistics SME. Include SOW attachment, milestone payments, IP assignment on payment, confidentiality, data protection, and limitation of liability."
  },
  {
    slug: "consultancy-agreement",
    title: "Consultancy Agreement",
    summary:
      "Professional services terms for consultants: scope, fees, deliverables, IP/licensing, and non-solicit.",
    sectors: ["technology", "general", "retail", "healthcare"],
    examplePrompt:
      "Write a consultancy agreement for a data analyst advising a healthcare clinic on KPI dashboards. Include confidentiality for patient data (no PHI), 30-day notice, and non-solicitation of employees for 12 months."
  },
  {
    slug: "nda-mutual",
    title: "Mutual NDA",
    summary:
      "Two-way confidentiality agreement for exploratory discussions and diligence.",
    sectors: ["general", "technology", "retail", "construction", "hospitality", "healthcare"],
    examplePrompt:
      "Draft a mutual NDA for two SMEs discussing a potential software integration. Include 2-year confidentiality, standard exclusions, and return-or-destroy obligations."
  },
  {
    slug: "nda-one-way",
    title: "One-Way NDA",
    summary:
      "Discloser-friendly confidentiality agreement for sharing sensitive materials.",
    sectors: ["general", "technology"],
    examplePrompt:
      "Prepare a one-way NDA where a startup shares prototype designs with a marketing agency. Include 3-year confidentiality, no reverse engineering, and equitable relief."
  },
  {
    slug: "saas-subscription",
    title: "SaaS Subscription Agreement",
    summary:
      "SaaS terms: licence, support/SLA, uptime, data processing, security, and termination.",
    sectors: ["technology", "retail", "healthcare", "general"],
    examplePrompt:
      "Create a SaaS subscription agreement for an HR tool used by 200 seats, UK law, 99.9% uptime target, Tier-2 email support, DPA with sub-processors disclosure, and 30-day termination for convenience."
  },
  {
    slug: "services-msa",
    title: "Services Master Services Agreement (MSA)",
    summary:
      "Master terms with project-specific SOWs, change control, IP, data protection, liability.",
    sectors: ["technology", "construction", "general"],
    examplePrompt:
      "Draft an MSA for a construction consultancy delivering site inspections and reports under SOWs. Include change control, acceptance criteria, liability cap = fees, and safety compliance."
  },
  {
    slug: "retainer-agreement",
    title: "Retainer Agreement",
    summary:
      "Ongoing retained services with monthly allocation, rollover rules, and priority support.",
    sectors: ["technology", "general", "retail"],
    examplePrompt:
      "Write a retainer agreement for a digital agency providing 20 hours/month for an e-commerce brand. Include rollover up to 10 hours, priority response in 1 business day, and IP assignment on payment."
  },
  {
    slug: "employment-zero-hours",
    title: "Zero-Hours Contract",
    summary:
      "Casual work with no guaranteed hours; scheduling, acceptance, pay, and rights.",
    sectors: ["hospitality", "retail", "general"],
    examplePrompt:
      "Draft a zero-hours contract for bar staff in a hospitality group. Include tronc/tips handling, opt-out of pension initially, right to decline shifts, and hygiene/safety obligations."
  },
  {
    slug: "subcontractor-agreement",
    title: "Subcontractor Agreement",
    summary:
      "Flow-downs from prime contract, scope, site rules, insurance, safety, and IP.",
    sectors: ["construction", "technology"],
    examplePrompt:
      "Create a subcontractor agreement for electrical works on a commercial fit-out. Include method statements, CSCS/competency requirements, RAMS, and insurance minimums."
  },
  {
    slug: "data-processing-addendum",
    title: "Data Processing Addendum (DPA)",
    summary:
      "GDPR-aligned processor terms: purposes, security, sub-processors, breach notice, SCCs.",
    sectors: ["technology", "healthcare", "retail", "general"],
    examplePrompt:
      "Draft a DPA for a UK SaaS vendor processing customer contact data, with sub-processors listed and 72-hour breach notice."
  },
  {
    slug: "affiliate-agreement",
    title: "Affiliate / Referral Agreement",
    summary:
      "Referrals, commission structure, attribution, restrictions, and termination.",
    sectors: ["technology", "retail", "general"],
    examplePrompt:
      "Write an affiliate agreement for a SaaS company paying 20% of net subscription revenue for 12 months, with cookie attribution (90 days) and compliance obligations."
  },
  {
    slug: "distribution-agreement",
    title: "Distribution Agreement",
    summary:
      "Territory, exclusivity, purchase terms, branding, and performance targets.",
    sectors: ["retail", "general"],
    examplePrompt:
      "Draft a non-exclusive UK distribution agreement for a consumer electronics brand. Include MAP policy reference, warranty handling, and quarterly targets."
  },
  {
    slug: "ip-assignment",
    title: "IP Assignment Agreement",
    summary:
      "Transfer of ownership in specified IP with warranties and moral rights waiver.",
    sectors: ["technology", "general"],
    examplePrompt:
      "Create an IP assignment agreement transferring all rights in a codebase from a freelancer to an SME upon final payment. Include moral rights waiver and escrow handover."
  },
  {
    slug: "mutual-non-solicit",
    title: "Mutual Non-Solicitation",
    summary:
      "Mutual promise not to poach staff or contractors for a defined period.",
    sectors: ["general", "technology", "retail", "construction", "hospitality"],
    examplePrompt:
      "Draft a mutual non-solicitation agreement between two SMEs collaborating on a project, 12-month restriction, reasonable carve-outs."
  }
];

// Helpful lookup map by slug
export const TEMPLATES_BY_SLUG: Record<string, TemplateDef> = Object.fromEntries(
  TEMPLATES.map((t) => [t.slug, t])
);
