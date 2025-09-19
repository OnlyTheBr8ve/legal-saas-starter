// lib/sector-config.ts
export type Sector =
  | 'Hospitality'
  | 'Construction'
  | 'Legal Services'
  | 'Healthcare'
  | 'Retail'
  | 'Technology'
  | 'Transportation & Logistics'
  | 'Education / Childcare'
  | 'Security'
  | 'Manufacturing / Warehouse'
  | 'Finance / Fintech'
  | 'Other';

export type ToggleKey =
  | 'personal_licence'
  | 'age_restricted'
  | 'allergens'
  | 'tronc'
  | 'late_night'
  | 'cscs'
  | 'work_at_height'
  | 'hot_works'
  | 'confined_space'
  | 'ppe_facefit'
  | 'practising_certificate'
  | 'client_money'
  | 'advocacy'
  | 'legal_aid_children'
  | 'dbs_check'
  | 'vaccinations'
  | 'sharps'
  | 'on_call_night'
  | 'cash_handling'
  | 'controlled_goods'
  | 'byod'
  | 'on_call_tech'
  | 'prod_data'
  | 'oss'
  | 'cpc_tacho'
  | 'dangerous_goods'
  | 'enhanced_dbs'
  | 'safeguarding'
  | 'school_trips'
  | 'sia_badge'
  | 'physical_intervention'
  | 'flt_licence'
  | 'loto'
  | 'fca_regulated'
  | 'client_money_fin';

export type SectorQuestion = {
  key: ToggleKey;
  label: string;
  help?: string;
  // optional: some toggles only make sense with certain patterns (e.g., night work)
  dependsOnPattern?: ('Night work' | 'Shift / Rota' | 'On-site' | 'Hybrid' | 'Remote')[];
};

export type SectorPack = {
  sector: Sector;
  baseClauses: string[]; // always include
  questions: SectorQuestion[]; // render as checkboxes
  clauseByToggle: Partial<Record<ToggleKey, string[]>>; // clauses to add if checked
};

// Utility to bullet a clause array as Markdown
export function bullet(clauses: string[]) {
  return clauses.map((c) => `- ${c}`).join('\n');
}

export const SECTOR_PACKS: SectorPack[] = [
  {
    sector: 'Hospitality',
    baseClauses: [
      'Customer service standards and expected conduct.',
      'Food hygiene standards; allergen awareness; cross-contamination avoidance.',
      'Uniform & personal appearance; health & safety in bar/restaurant environments.',
      'Incident reporting: spills, breakages, aggression, ID challenges.',
    ],
    questions: [
      { key: 'personal_licence', label: 'Personal Licence required?', help: 'E.g., Designated Premises Supervisor / alcohol licence' },
      { key: 'age_restricted', label: 'Handles age-restricted sales (alcohol)?', help: 'Challenge 25 / refusals log' },
      { key: 'allergens', label: 'Allergen training required?' },
      { key: 'tronc', label: 'Takes part in tips/tronc?' },
      { key: 'late_night', label: 'Regular late-night work?', dependsOnPattern: ['Night work', 'Shift / Rota'] },
    ],
    clauseByToggle: {
      personal_licence: [
        'Holding and maintaining a valid Personal Licence (or equivalent) is a condition of this role; any suspension or revocation must be reported immediately and may impact continued employment or duties.',
      ],
      age_restricted: [
        'The Employee must follow Challenge 25/age-verification; refusals must be recorded; sales must be refused where ID is unsatisfactory.',
      ],
      allergens: [
        'The Employee must follow allergen controls, including correct labelling, segregation, and cross-contamination prevention; incidents must be escalated immediately.',
      ],
      tronc: ['Tips/tronc are distributed in line with the Employer’s tronc policy; card/cash tips handling and reconciliation must follow procedures.'],
      late_night: ['Lone-working/late-night safety protocols must be followed; incidents must be reported without delay.'],
    },
  },
  {
    sector: 'Construction',
    baseClauses: [
      'Compliance with site inductions, method statements, and risk assessments.',
      'Mandatory PPE usage; equipment must be used in accordance with training.',
      'Stop-work authority where work cannot be performed safely.',
    ],
    questions: [
      { key: 'cscs', label: 'CSCS/Trade card required?' },
      { key: 'work_at_height', label: 'Works at height?' },
      { key: 'hot_works', label: 'Hot works involved?' },
      { key: 'confined_space', label: 'Confined space tasks?' },
      { key: 'ppe_facefit', label: 'Face-fit/PPE mandatory?' },
    ],
    clauseByToggle: {
      cscs: ['Holding and maintaining a valid CSCS or appropriate trade card is a condition of this role; any lapse must be reported immediately.'],
      work_at_height: ['Working at height requires suitable training, equipment, and controls in line with risk assessments; fall protection must be used.'],
      hot_works: ['Hot works require permit-to-work and fire watch procedures; extinguishers must be available and inspected.'],
      confined_space: ['Confined space work requires permit, atmospheric testing, rescue plan, and competent supervision.'],
      ppe_facefit: ['Where RPE is required, face-fit testing must be passed and maintained; PPE must be worn and maintained as specified.'],
    },
  },
  {
    sector: 'Legal Services',
    baseClauses: [
      'Conflicts, confidentiality and client care duties; records and secure file handling.',
      'Accurate time recording and billing; professional supervision as applicable.',
    ],
    questions: [
      { key: 'practising_certificate', label: 'Practising certificate required?' },
      { key: 'client_money', label: 'Handles client money/accounts?' },
      { key: 'advocacy', label: 'Advocacy / court attendance?' },
      { key: 'legal_aid_children', label: 'Legal aid / children matters?' },
    ],
    clauseByToggle: {
      practising_certificate: ['Maintaining a current practising certificate/registration is a condition of this role; failure to maintain may affect duties or employment.'],
      client_money: ['Client money must be handled per accounts rules; breaches must be reported immediately; records must be complete and accurate.'],
      advocacy: ['Advocacy requires courtroom etiquette, confidentiality, and compliance with court directions and timetables.'],
      legal_aid_children: ['Legal aid cases must follow LAA requirements; children matters require heightened safeguarding and reporting obligations.'],
    },
  },
  {
    sector: 'Healthcare',
    baseClauses: [
      'Confidentiality of patient information and compliance with data protection.',
      'Infection prevention & control; incident reporting and escalation.',
    ],
    questions: [
      { key: 'dbs_check', label: 'DBS/Background check required?' },
      { key: 'vaccinations', label: 'Vaccinations required (e.g., Hep B, Flu)?' },
      { key: 'sharps', label: 'Sharps handling?' },
      { key: 'on_call_night', label: 'On-call or night work?' },
    ],
    clauseByToggle: {
      dbs_check: ['Employment may be conditional on a satisfactory DBS/background check; updates must be maintained as required.'],
      vaccinations: ['The Employee must meet vaccination requirements reasonably set by the Employer or the law for the role.'],
      sharps: ['Sharps must be used and disposed of per policy; needlestick injuries must be escalated and recorded.'],
      on_call_night: ['On-call/night duties must follow rest, handover and escalation protocols; fatigue risk must be managed.'],
    },
  },
  {
    sector: 'Retail',
    baseClauses: [
      'Customer service standards; complaints escalation; stock and presentation.',
      'Manual handling and in-store safety procedures.',
    ],
    questions: [
      { key: 'age_restricted', label: 'Sells age-restricted items?' },
      { key: 'cash_handling', label: 'Cash handling/till work?' },
      { key: 'controlled_goods', label: 'High-value/controlled goods?' },
      { key: 'on_call_night', label: 'Night work?' },
    ],
    clauseByToggle: {
      age_restricted: ['Age-verification required; refusals recorded; zero tolerance for unlawful sales.'],
      cash_handling: ['Cash handling must follow reconciliation and variance reporting procedures.'],
      controlled_goods: ['Loss-prevention, CCTV, and secure storage procedures must be followed.'],
      on_call_night: ['Lone-working/night safety measures; supervisor contact and incident reporting.'],
    },
  },
  {
    sector: 'Technology',
    baseClauses: [
      'Information security and acceptable use; access only on a need-to-know basis.',
      'Confidentiality, IP assignment, and proper handling of customer data.',
    ],
    questions: [
      { key: 'on_call_tech', label: 'On-call / incident response?' },
      { key: 'byod', label: 'BYOD (personal devices) permitted?' },
      { key: 'prod_data', label: 'Access to production data?' },
      { key: 'oss', label: 'Open-source contributions part of the role?' },
    ],
    clauseByToggle: {
      on_call_tech: ['On-call rota participation, response times, and escalation procedures as specified by policy.'],
      byod: ['BYOD requires MDM/endpoint controls, encryption, and prompt reporting of loss/theft.'],
      prod_data: ['Production data access must be logged; secrets must be stored in approved secret managers; exports restricted.'],
      oss: ['Open-source contributions must follow Employer’s approval process and licensing policy; IP assignment applies.'],
    },
  },
  {
    sector: 'Transportation & Logistics',
    baseClauses: ['Fitness for duty; safe driving and loading/unloading practices; incident reporting.'],
    questions: [
      { key: 'cpc_tacho', label: 'CPC / tachograph obligations?' },
      { key: 'dangerous_goods', label: 'Dangerous goods (ADR) involved?' },
      { key: 'on_call_night', label: 'Night/out-of-hours work?' },
    ],
    clauseByToggle: {
      cpc_tacho: ['Driver CPC must be maintained; tachograph usage and legal hours must be followed and records kept.'],
      dangerous_goods: ['ADR training/permits required; segregation, documentation, and emergency procedures apply.'],
      on_call_night: ['Night working rules and rest breaks per law and policy.'],
    },
  },
  {
    sector: 'Education / Childcare',
    baseClauses: ['Safeguarding duties; reporting concerns; supervision ratios and conduct.'],
    questions: [
      { key: 'enhanced_dbs', label: 'Enhanced DBS required?' },
      { key: 'safeguarding', label: 'Safeguarding training required?' },
      { key: 'school_trips', label: 'Off-site trips/residentials?' },
    ],
    clauseByToggle: {
      enhanced_dbs: ['Employment may be conditional on Enhanced DBS; updates required per policy.'],
      safeguarding: ['Safeguarding training must be completed and refreshed; immediate reporting of concerns.'],
      school_trips: ['Risk assessments, parental consents, and trip supervision procedures must be followed.'],
    },
  },
  {
    sector: 'Security',
    baseClauses: ['Professional conduct; incident reporting; confidentiality; health & safety.'],
    questions: [
      { key: 'sia_badge', label: 'SIA licence required?' },
      { key: 'physical_intervention', label: 'Physical intervention/restraint possible?' },
      { key: 'on_call_night', label: 'Night work?' },
    ],
    clauseByToggle: {
      sia_badge: ['Maintaining a valid SIA badge is a condition; loss/suspension must be reported immediately.'],
      physical_intervention: ['Use-of-force/restraint policy must be followed; only trained staff may use approved techniques; reporting required.'],
      on_call_night: ['Night work/lone-working procedures and comms checks.'],
    },
  },
  {
    sector: 'Manufacturing / Warehouse',
    baseClauses: ['Machine safety; manual handling; incident/near-miss reporting.'],
    questions: [
      { key: 'flt_licence', label: 'Forklift/plant licence needed?' },
      { key: 'loto', label: 'Lockout/Tagout required?' },
      { key: 'on_call_night', label: 'Night/shift work?' },
    ],
    clauseByToggle: {
      flt_licence: ['Valid FLT/plant licence and refresher training required; unsafe operation is prohibited.'],
      loto: ['LOTO procedures must be followed during maintenance/servicing; zero-energy verification required.'],
      on_call_night: ['Shift handover procedures; fatigue risk management; supervisor escalation.'],
    },
  },
  {
    sector: 'Finance / Fintech',
    baseClauses: ['Confidentiality, data protection, and recordkeeping; conduct expectations.'],
    questions: [
      { key: 'fca_regulated', label: 'FCA-regulated activities?' },
      { key: 'client_money_fin', label: 'Handles client money/assets?' },
      { key: 'on_call_night', label: 'Out-of-hours incidents (e.g., trading ops)?' },
    ],
    clauseByToggle: {
      fca_regulated: ['Conduct rules, market integrity, and reporting obligations apply; training and attestations may be required.'],
      client_money_fin: ['Client money/assets must be handled per applicable rules; reconciliation and segregation are mandatory.'],
      on_call_night: ['After-hours escalation and supervision as defined by policy.'],
    },
  },
  {
    sector: 'Other',
    baseClauses: [
      'Role-specific duties tailored to the job and industry.',
      'Applicable regulatory/compliance obligations.',
      'Risk and safety practices relevant to the work environment.',
    ],
    questions: [],
    clauseByToggle: {},
  },
];

export function getSectorPack(sector: Sector): SectorPack {
  return SECTOR_PACKS.find((p) => p.sector === sector) || SECTOR_PACKS[SECTOR_PACKS.length - 1];
}
