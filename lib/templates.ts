// lib/templates.ts

export type TemplateDef = {
  slug: string;
  title: string;
  summary?: string;        // short description for cards/SEO
  guidance?: string;       // how to use / what to consider
  examplePrompt?: string;  // what we pass to the dashboard
  notes?: string[];        // bullets with tips, pitfalls, disclaimers
};

export const TEMPLATES: TemplateDef[] = [
  // =========================
  // EMPLOYMENT / HR
  // =========================
  {
    slug: "employment-contract-permanent",
    title: "Employment Contract (Permanent, Full-Time)",
    summary:
      "Core employment agreement for salaried staff: duties, pay, hours, holiday, probation, termination, IP, confidentiality.",
    guidance:
      "Confirm role title, location, working hours, salary/bonus, benefits, probation length, notice periods, restrictive covenants (if any), and jurisdiction. If sector-regulated, add sector-specific fitness-to-work, licensing, or vetting clauses.",
    examplePrompt: `You are a contract drafter. Draft a Permanent Full-Time Employment Contract.

Company: {{Company Name}}
Employee: {{Employee Name}}
Role: {{Role Title}}
Location: {{City/Country}} (governing law {{Jurisdiction}})
Salary: £{{Amount}} per annum, paid monthly
Hours: {{e.g., 40 hours per week}}; overtime policy: {{policy}}
Probation: {{e.g., 3 months}}
Notice: Employer {{e.g., 1 month}}, Employee {{e.g., 1 month}}
Holidays: {{e.g., 25 days plus public holidays}}
Benefits: {{list}}
Confidentiality: yes
IP assignment: yes
Restrictive covenants: {{none / non-solicit 6m / non-compete 3m (if appropriate)}}
Data protection: include employee privacy reference
Health & safety: standard duty of care
Policies: handbook incorporated by reference

Please produce:
1) A clean, readable contract (plain English, numbered clauses).
2) A short annex with role-specific duties.
3) A final checklist of assumptions and any missing inputs.`,
    notes: [
      "If you add restrictive covenants, ensure they’re necessary and proportionate.",
      "Localize holiday, notice, and statutory references to the chosen jurisdiction.",
    ],
  },
  {
    slug: "employment-contract-parttime",
    title: "Employment Contract (Part-Time)",
    summary:
      "Part-time variant of an employment agreement with pro-rated pay/benefits and flexible hours/availability.",
    guidance:
      "Clarify weekly hours range, minimum guaranteed hours (if any), scheduling notice, and pro-rated holiday/benefits.",
    examplePrompt: `Draft a Part-Time Employment Contract.

Company: {{Company}}
Employee: {{Name}}
Role: {{Role Title}}
Weekly hours: {{e.g., 20 hrs}}; scheduling notice {{e.g., 7 days}}
Pay: £{{rate}} per {{hour/week/month}}; pro-rated benefits
Location: {{Location}}; governing law: {{Jurisdiction}}
Key policies: attendance, flexible working, overtime eligibility

Include:
- Pro-rated holiday/benefits and how calculated
- Scheduling and shift changes
- Overtime approval and rate (if applicable)
- Confidentiality & IP
- Termination & notice
- Data protection clause`,
    notes: ["Check local rules on minimum guaranteed hours and zero-hours restrictions."],
  },
  {
    slug: "employment-contract-fixed-term",
    title: "Fixed-Term Employment Contract",
    summary:
      "Time-limited employment with objective justification, end date, and renewal rules.",
    guidance:
      "Add objective justification (project cover, maternity cover, seasonal peak). Clarify early termination rights and renewal limits.",
    examplePrompt: `Draft a Fixed-Term Employment Contract ending on {{End Date}} for role {{Role}} at {{Company}}.

Cover:
- Objective justification for fixed term
- Salary & benefits
- Early termination triggers and notice
- Renewal/extension terms
- Accrued holiday payout mechanics
- IP & confidentiality
- Data protection
Jurisdiction: {{Jurisdiction}}.`,
  },
  {
    slug: "employee-handbook-core",
    title: "Employee Handbook (Core Policies)",
    summary:
      "A modular handbook shell referencing core HR policies and how changes are communicated.",
    guidance:
      "Keep the handbook modular. Reference standalone policies (disciplinary, grievance, equal opportunities, H&S).",
    examplePrompt: `Create a concise Employee Handbook for {{Company}} containing:
- Introduction & scope
- Code of conduct
- Working hours & breaks
- Holidays & leave (sickness, parental)
- Equality, diversity & inclusion
- Anti-harassment
- Disciplinary & grievance overview (refer to full policies)
- Health & safety overview
- IT, email, acceptable use
- Data protection basics
- Changes & versioning

Tone: plain English. Include cross-references to standalone policies.`,
  },
  {
    slug: "offer-letter",
    title: "Offer Letter",
    summary:
      "Simple, friendly offer letter summarizing role, salary, start date, and conditions precedent.",
    guidance:
      "Make clear it’s not the full contract; include conditions (reference checks, right to work, etc.).",
    examplePrompt: `Draft an Offer Letter for {{Candidate Name}} for {{Role}} at {{Company}}.
Include summary of: salary, start date, location, hours, benefits highlights, and conditions (right to work, references). Friendly but clear. Attach or reference full contract.`,
  },
  {
    slug: "probation-confirmation",
    title: "Probation Confirmation Letter",
    summary:
      "Confirms successful completion of probation, next steps and any updated terms.",
    examplePrompt: `Draft a Probation Confirmation Letter for {{Employee}} at {{Company}} confirming probation passed on {{Date}}, summarising performance, objectives, notice period post-probation, and any benefits updates.`,
  },
  {
    slug: "probation-extension",
    title: "Probation Extension Letter",
    summary:
      "Extends probation with clear objectives, support, and review date.",
    examplePrompt: `Draft a Probation Extension Letter ({{Company}} → {{Employee}}) extending probation by {{X weeks}} until {{Date}}, stating reasons, objectives, review cadence, and support available.`,
  },
  {
    slug: "disciplinary-policy",
    title: "Disciplinary Policy",
    summary:
      "Fair process steps: informal → formal, warnings, hearings, appeal, gross misconduct.",
    examplePrompt: `Draft a Disciplinary Policy aligned with fair procedures. Include stages, representation, evidence, outcomes, appeal, and examples of misconduct vs gross misconduct. Localize to {{Jurisdiction}}.`,
  },
  {
    slug: "grievance-policy",
    title: "Grievance Policy",
    summary:
      "How employees raise concerns; timelines, confidentiality, investigations, outcomes, appeal.",
    examplePrompt: `Draft a Grievance Policy for {{Company}} with reporting routes, timeframes, investigation process, confidentiality, anti-victimisation, outcomes, and appeal. Localize to {{Jurisdiction}}.`,
  },

  // =========================
  // CONTRACTORS / FREELANCERS
  // =========================
  {
    slug: "contractor-agreement-services",
    title: "Independent Contractor Agreement (Services)",
    summary:
      "Clear SOW/Deliverables, milestones, day rate vs fixed fee, IP assignment or license, liability caps.",
    guidance:
      "If using IR35-style tests or worker classification rules, add representations. Separate SOW annex works well.",
    examplePrompt: `Draft an Independent Contractor Agreement.

Client: {{Company}}
Contractor: {{Name or Company}}
Services: {{scope}}
Commercials: {{day rate / fixed fee}}; milestones {{if any}}
Expenses: {{policy}}
IP: {{assignment or license}}
Term & termination: {{notice}}
Confidentiality & data protection
Liability cap: {{e.g., fees paid}}
Jurisdiction: {{Jurisdiction}}

Add an Annex A: Statement of Work with deliverables & acceptance.`,
  },
  {
    slug: "contractor-non-disclosure",
    title: "NDA (Mutual or One-Way)",
    summary:
      "Short NDA with definition of confidential info, exclusions, permitted use, term, return, injunctive relief.",
    examplePrompt: `Draft a {{Mutual/One-Way}} NDA between {{Party A}} and {{Party B}} for discussions about {{topic}}. Keep it 2–3 pages max. Include reasonable definition of confidential info, exclusions, residual knowledge (optional), injunctive relief, and governing law {{Jurisdiction}}.`,
  },
  {
    slug: "contractor-ip-assignment",
    title: "IP Assignment (Contractors)",
    summary:
      "Assignment of created IP with moral rights waiver and assistance clause.",
    examplePrompt: `Draft an IP Assignment from {{Contractor}} to {{Company}} covering all deliverables (past & future) under {{SOW/Agreement}}. Include moral rights waiver where allowed, further-assurance clause, and carve-outs for pre-existing tools.`,
  },

  // =========================
  // WEBSITE / SAAS / COMMERCIAL
  // =========================
  {
    slug: "website-terms",
    title: "Website Terms of Use",
    summary:
      "Basic website terms: acceptable use, content rules, disclaimers, liability caps, governing law.",
    examplePrompt: `Draft Website Terms of Use for {{Site/Brand}}. Audience: consumers/general public. Include acceptable use, user content rules, DMCA/notice-and-takedown placeholder, IP ownership, warranties/limitations, governing law {{Jurisdiction}}.`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary:
      "Transparent policy covering what data you collect, why, lawful basis, retention, sharing, rights, and contact.",
    guidance:
      "Make sure it matches your actual data flows (marketing tools, analytics, processors, cross-border transfers).",
    examplePrompt: `Draft a GDPR/UK-GDPR compatible Privacy Policy for {{Company/Site}}. Cover:
- Categories of personal data collected (including from forms, cookies/analytics)
- Purposes & lawful bases
- Sharing (processors/sub-processors)
- International transfers (SCCs/UK IDTA if relevant)
- Retention periods (by category)
- Your rights & contact details
- DPO/representative (if applicable)
- Complaints route (ICO or local authority)`,
    notes: ["Keep your Record of Processing Activities in sync with this policy."],
  },
  {
    slug: "cookies-policy",
    title: "Cookies Policy",
    summary:
      "Explain cookie categories, consent, preferences, and a dynamic list pattern.",
    examplePrompt: `Draft a Cookies Policy for {{Site}} referencing a Consent Management Platform. Include categories (strictly necessary, performance, functionality, targeting), consent withdrawal, browser settings, and a dynamic list placeholder.`,
  },
  {
    slug: "saas-master-subscription-agreement",
    title: "SaaS Master Subscription Agreement (MSA)",
    summary:
      "Commercial SaaS terms: subscription scope, service levels, support, data processing, uptime, liability caps.",
    guidance:
      "Reference a DPA; clarify uptime SLA measurements, credits mechanism, data export on exit, and security standards.",
    examplePrompt: `Draft a SaaS MSA.

Provider: {{Company}}
Customer: {{Customer}}
Services: {{product name/summary}}
Fees: {{pricing model}}
SLA: uptime {{e.g., 99.9%}}; credits
Support: {{hours/tiers}}
Security: {{ISO27001/SOC2 if applicable}}
Data processing: see DPA; sub-processors allowed with notice
IP & licensing: subscription only
Liability: {{cap, e.g., 12 months fees}}; carve-outs (IP infringement, data breach negligence)
Term & termination; data export on termination
Jurisdiction: {{Jurisdiction}}`,
  },
  {
    slug: "order-form",
    title: "Order Form / Statement of Work",
    summary:
      "Commercial front sheet for pricing, terms references, and bespoke items.",
    examplePrompt: `Draft an Order Form referencing the {{SaaS MSA}} with:
- Customer/Provider details
- Term, start date
- Plan/Seats/Usage limits
- Fees & billing cycle
- Professional services (optional SOW)
- Special terms or overrides
- Signatures`,
  },
  {
    slug: "professional-services-sow",
    title: "Professional Services SOW (Consulting)",
    summary:
      "Scope, deliverables, timeline, assumptions, acceptance criteria, and sign-off.",
    examplePrompt: `Create a consulting SOW (Annex) for {{Project}} including scope, deliverables, client responsibilities, assumptions, timeline, acceptance criteria, change control, and fees (T&M or fixed).`,
  },
  {
    slug: "support-sla",
    title: "Support & Uptime SLA",
    summary:
      "Response/Resolution targets by severity, uptime target, maintenance windows, and service credits.",
    examplePrompt: `Draft a Support & Uptime SLA tied to the {{SaaS MSA}}. Include:
- Uptime target {{e.g., 99.9%}}
- Maintenance windows/notice
- Incident severity levels & response/resolution targets
- Service credits calculation & claim process
- Exclusions`,
  },
  {
    slug: "dpa-processor",
    title: "Data Processing Addendum (Processor)",
    summary:
      "GDPR/UK-GDPR Art. 28 processor terms: instructions, confidentiality, security, sub-processors, assistance, deletion/return.",
    examplePrompt: `Draft a GDPR/UK-GDPR Processor DPA for {{Provider}} (processor) to {{Customer}} (controller).
Include: processing details schedule; security measures; sub-processor conditions; assistance with rights requests; audits under controls; breach notification; deletion/return on termination; international transfers clauses with SCCs/IDTA references.`,
  },
  {
    slug: "subprocessor-notice",
    title: "Sub-Processor Notification",
    summary:
      "Template notice for adding/removing sub-processors with objection window.",
    examplePrompt: `Draft a sub-processor change notice email template with summary of new vendor, services, data types, location, and objection window (e.g., 30 days).`,
  },
  {
    slug: "data-breach-notification-internal",
    title: "Data Breach: Internal Playbook & Notification",
    summary:
      "Manager’s playbook + customer notification outline for incidents.",
    examplePrompt: `Create an internal data incident playbook for {{Company}} AND a customer notification template, including: classification, containment, assessment, regulatory notification tests, and customer comms skeleton. Localize references to {{Jurisdiction}} regulator.`,
  },

  // =========================
  // IP / COMMERCIAL
  // =========================
  {
    slug: "ip-assignment-employee",
    title: "IP Assignment (Employees)",
    summary:
      "Confirms IP created in the course of employment is owned by employer; includes further assurances.",
    examplePrompt: `Draft an Employee IP Assignment/Confirmation for {{Company}} with moral rights waiver (where allowed), further-assurances, and carve-outs for pre-existing works.`,
  },
  {
    slug: "mutual-non-solicit",
    title: "Mutual Non-Solicit",
    summary:
      "Each party agrees not to poach the other's staff/customers for a limited period.",
    examplePrompt: `Draft a mutual non-solicit clause/letter (standalone) with a {{6–12 months}} duration, reasonable scope, and jurisdiction {{Jurisdiction}}.`,
  },
  {
    slug: "referral-agreement",
    title: "Referral / Introducer Agreement",
    summary:
      "Defines referral process, commission, attribution windows, exclusions, and termination.",
    examplePrompt: `Draft a Referral Agreement. Include referral process, qualification, commission %, payment timing, attribution window (e.g., 90 days), disclosure/marketing rules, data sharing compliance, and termination.`,
  },

  // =========================
  // PROCUREMENT / SUPPLY
  // =========================
  {
    slug: "msa-procurement-buyer",
    title: "Buyer-side MSA (Procurement)",
    summary:
      "General goods/services terms with strong buyer protections, audits, and security addendum.",
    examplePrompt: `Draft a Buyer-side MSA for {{Company}} purchasing services. Include SLAs, acceptance & remedies, audits, security/DPA, pricing controls, termination for convenience, and liability structure.`,
  },
  {
    slug: "vendor-code-of-conduct",
    title: "Vendor Code of Conduct",
    summary:
      "ESG, anti-bribery, labor standards, data protection, and compliance expectations for suppliers.",
    examplePrompt: `Draft a Vendor Code of Conduct that covers ethical sourcing, anti-corruption, sanctions/export controls, labor standards, environmental expectations, data protection & security, and audit/cooperation clauses.`,
  },

  // =========================
  // FINANCE / INVESTOR DOCS (LIGHTWEIGHT)
  // =========================
  {
    slug: "saft-lite",
    title: "SAFT (Lite Outline)",
    summary:
      "Lightweight outline for a SAFT; **for illustration**. Not legal advice.",
    examplePrompt: `Draft a short-form SAFT outline for {{Project}} with disclaimers, vesting/lockups, milestones, and risk factors. Include bold disclaimer this is illustrative only.`,
    notes: ["Flag for counsel review. Crypto regs vary widely."],
  },
  {
    slug: "nda-investor",
    title: "NDA (Investor-side Friendly)",
    summary:
      "Investor-friendly NDA with market-standard carve-outs and no deal lock-in.",
    examplePrompt: `Draft an investor-friendly NDA referencing standard exceptions and no restriction on investing in similar companies. Keep it short.`,
  },

  // =========================
  // REAL ESTATE / FACILITIES
  // =========================
  {
    slug: "office-licence-to-occupy",
    title: "Licence to Occupy (Office Space)",
    summary:
      "Short-term, non-exclusive space licence vs a full lease; services, hours, termination.",
    examplePrompt: `Draft a short Licence to Occupy for {{Address}}, license fee {{£X/month}}, shared facilities, services hours, termination (short notice), no security of tenure. Jurisdiction {{Jurisdiction}}.`,
},

  // =========================
  // HEALTH & SAFETY / RISK
  // =========================
  {
    slug: "health-and-safety-policy",
    title: "Health & Safety Policy",
    summary:
      "General policy with responsibilities, risk assessment approach, incident reporting, and training.",
    examplePrompt: `Draft a Health & Safety Policy for {{Company}} that sets responsibilities (employer/employee), risk assessments, incident reporting, PPE, training, and consultation.`,
  },
  {
    slug: "lone-working-policy",
    title: "Lone Working Policy",
    summary:
      "Risk controls for staff working alone/offsite; comms, check-ins, escalation.",
    examplePrompt: `Draft a Lone Working Policy including risk identification, controls, check-in procedures, escalation, and incident reporting.`,
  },

  // =========================
  // MARKETING / CREATIVE
  // =========================
  {
    slug: "marketing-services-agreement",
    title: "Marketing Services Agreement",
    summary:
      "Creative services scope, approvals, content ownership/licensing, moral rights, brand guidelines.",
    examplePrompt: `Draft a Marketing Services Agreement covering scope, deliverables, approval rounds, content IP ownership (or license), brand guideline compliance, usage rights, and credits.`,
  },
  {
    slug: "ugc-release",
    title: "UGC Content Release",
    summary:
      "Permission to reuse user-generated content; usage, attribution, revocation, and moral rights.",
    examplePrompt: `Draft a UGC Release allowing {{Company}} to use {{Creator}} content (channels, territories, duration), with attribution rules, revocation mechanics, and moral rights treatment.`,
  },

  // =========================
  // EDUCATION / TRAINING
  // =========================
  {
    slug: "training-services-agreement",
    title: "Training Services Agreement",
    summary:
      "Onsite/remote training scope, materials license, cancellations, learner data, and certification.",
    examplePrompt: `Draft a Training Services Agreement for {{Company}} delivering {{Topic}} training. Include materials license (limited), cancellations policy, learner data protection, and certification statement.`,
  },
  {
    slug: "internship-agreement",
    title: "Internship Agreement (Paid/Unpaid)",
    summary:
      "Defines educational purpose, supervision, pay (if any), duration, and IP/Confidentiality.",
    examplePrompt: `Draft an Internship Agreement clarifying educational objectives, supervision, duration, paid/unpaid status (ensure legal compliance), IP/confidentiality, and termination.`,
    notes: ["Check local rules on unpaid internships and minimum wage."],
  },
];

export const TEMPLATES_BY_SLUG: Record<string, TemplateDef> = Object.fromEntries(
  TEMPLATES.map((t) => [t.slug, t])
);
