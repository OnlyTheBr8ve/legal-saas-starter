// lib/templates.ts
export type Template = {
  slug: string;
  title: string;
  excerpt: string;
  audience?: string;
  prompt: string; // what we’ll prefill into the Dashboard
};

export const TEMPLATES: Record<string, Template> = {
  "uk-employment-contract": {
    slug: "uk-employment-contract",
    title: "UK Employment Contract (Hospitality)",
    excerpt:
      "Employer/employee terms, pay, hours, probation, holidays, conduct and termination for hospitality roles.",
    prompt:
      "Draft a UK law employment contract for a full-time hospitality worker. Include: job title and duties; place of work; hours (shift work); pay (£ per hour); overtime; probation (3 months); holidays (statutory + bank holidays); sickness; uniform; confidentiality; data protection; social media; health & safety; disciplinary and grievance; notice; termination; governing law (England & Wales); signatures."
  },
  "uk-nda": {
    slug: "uk-nda",
    title: "UK Non-Disclosure Agreement (Mutual)",
    excerpt:
      "Mutual NDA for sharing confidential info between two parties operating in the UK.",
    prompt:
      "Draft a MUTUAL non-disclosure agreement under the laws of England & Wales. Include: definitions; purpose; obligations; permitted disclosures; exclusions; standard of care; term of confidentiality (3 years); return/destruction; remedies (injunctive relief); no license; governing law and jurisdiction (England & Wales); counterparts; signature blocks for both parties."
  },
  "uk-freelancer-agreement": {
    slug: "uk-freelancer-agreement",
    title: "UK Freelancer / Contractor Agreement",
    excerpt:
      "Scope, deliverables, IP assignment, milestones, payment terms, and termination for contractors.",
    prompt:
      "Draft a UK freelancer services agreement between a company (Client) and an independent contractor (Supplier). Include: scope and deliverables; milestones; fees and expenses; invoicing; late payment; independent contractor status; IP assignment to Client; moral rights waiver; confidentiality; data protection; warranties; liability cap; indemnities; term and termination (for convenience and for cause); governing law (England & Wales); signatures."
  },
  "uk-privacy-policy": {
    slug: "uk-privacy-policy",
    title: "UK Website Privacy Policy (GDPR)",
    excerpt:
      "Plain-English GDPR-compliant privacy policy for a UK website or SaaS.",
    prompt:
      "Write a UK GDPR and PECR compliant website privacy policy for a SaaS. Include: controller details; what data we collect; lawful bases; cookies/analytics; how we use data; sharing; international transfers; retention; security; your rights; how to contact us; complaints to ICO; changes to policy."
  },
  "uk-employee-handbook": {
    slug: "uk-employee-handbook",
    title: "UK Employee Handbook (Starter)",
    excerpt:
      "Starter handbook: conduct, equality, leave, absence, IT, data protection, health & safety.",
    prompt:
      "Create a concise UK employee handbook (starter) with sections: values; equal opportunities; anti-harassment; code of conduct; working time and breaks; leave and holiday; sickness absence; expenses; remote/hybrid working; IT and acceptable use; social media; confidentiality and data protection; health & safety; disciplinary and grievance summary."
  }
};
