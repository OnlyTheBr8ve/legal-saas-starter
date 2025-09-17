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
      "Draft a MUTUAL non-disclosure agreement under the laws of England & Wales. Include: definitions; purpose; obligations; permitted disclosures; exclusions; standard of care; term of confidentiality (3 years); return/destruction; remedies (injunct
