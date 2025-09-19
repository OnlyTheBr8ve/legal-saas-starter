// lib/sector-config.ts

export type Toggle = {
  key: string;
  label: string;
  hint?: string;
};

export type SectorPack = {
  title: string;
  toggles: Toggle[];
  toClause: (answers: Record<string, boolean>) => string;
};

export const SECTOR_PACKS: Record<string, SectorPack> = {
  hospitality: {
    title: "Hospitality",
    toggles: [
      { key: "personal_licence", label: "Requires Personal Licence?", hint: "Premises/Designated Premises Supervisor duties" },
      { key: "age_restricted", label: "Handles age-restricted sales?" },
      { key: "food_hygiene", label: "Food hygiene & allergen training required?" },
      { key: "late_night", label: "Late-night trading / shift patterns apply?" },
      { key: "tips_tronc", label: "Tips/Tronc rules apply?" },
    ],
    toClause: (a) => {
      const bits: string[] = [];
      if (a.personal_licence) {
        bits.push(
          "- The role requires holding a valid Personal Licence and complying with all licensing laws. Loss or suspension may lead to redeployment, disciplinary review or termination where the role cannot be performed."
        );
      }
      if (a.age_restricted) {
        bits.push(
          "- The Employee must follow Challenge-25 (or local equivalent) and all age-restricted sales procedures; failure is a disciplinary matter and may be reportable."
        );
      }
      if (a.food_hygiene) {
        bits.push(
          "- The Employee must complete and maintain food-hygiene/allergen training and adhere to HACCP or equivalent procedures."
        );
      }
      if (a.late_night) {
        bits.push(
          "- Hours may include evenings, weekends and bank holidays on a rota basis with lawful premium arrangements where applicable."
        );
      }
      if (a.tips_tronc) {
        bits.push(
          "- Tips/Service charge: distribution is operated via a tronc or employer-administered scheme and may vary; no contractual entitlement is created."
        );
      }
      return bits.length ? `### Hospitality Requirements\n${bits.join("\n")}` : "";
    },
  },

  construction: {
    title: "Construction",
    toggles: [
      { key: "cscs", label: "CSCS/CPCS card required?" },
      { key: "qual_dependent", label: "Qualification-dependent role?" },
      { key: "ramss", label: "Must follow RAMS/Permit-to-Work?" },
      { key: "ppe", label: "Enhanced PPE obligations?" },
      { key: "drugs_alcohol", label: "Site drugs & alcohol testing applies?" },
    ],
    toClause: (a) => {
      const bits: string[] = [];
      if (a.cscs) bits.push("- Valid CSCS/CPCS (or equivalent) card must be held and presented on request; lapse may suspend site access.");
      if (a.qual_dependent) bits.push("- Employment is conditional on maintaining required trade qualifications and certifications.");
      if (a.ramss) bits.push("- Work must comply with approved Risk Assessments/Method Statements and any Permit-to-Work conditions.");
      if (a.ppe) bits.push("- PPE must be worn/maintained as directed; failure may lead to removal from site.");
      if (a.drugs_alcohol) bits.push("- The Employee is subject to random and for-cause drugs/alcohol testing per site policy.");
      return bits.length ? `### Construction Requirements\n${bits.join("\n")}` : "";
    },
  },

  retail: {
    title: "Retail",
    toggles: [
      { key: "cash_handling", label: "Cash handling & reconciliation?" },
      { key: "stock_loss", label: "Stock loss/shrink controls?" },
      { key: "age_sales", label: "Age-restricted sales (e.g., knives, solvents)?" },
      { key: "lone_working", label: "Lone working may occur?" },
    ],
    toClause: (a) => {
      const bits: string[] = [];
      if (a.cash_handling) bits.push("- Cash handling must follow till reconciliation and variance reporting procedures.");
      if (a.stock_loss) bits.push("- The Employee must follow stock-loss controls, keyholding and security policies.");
      if (a.age_sales) bits.push("- Age-restricted items must only be sold in accordance with law and store policy.");
      if (a.lone_working) bits.push("- Lone working duties may apply subject to risk assessment and safety procedures.");
      return bits.length ? `### Retail Requirements\n${bits.join("\n")}` : "";
    },
  },

  healthcare: {
    title: "Healthcare",
    toggles: [
      { key: "dbs", label: "DBS/Background checks required?" },
      { key: "registration", label: "Professional registration needed?" },
      { key: "immunisation", label: "Immunisations/fit testing required?" },
      { key: "confidentiality", label: "Enhanced confidentiality (patient data)?" },
    ],
    toClause: (a) => {
      const bits: string[] = [];
      if (a.dbs) bits.push("- Appointment is subject to satisfactory DBS (or local equivalent) and periodic re-checking.");
      if (a.registration) bits.push("- The Employee must maintain professional registration and CPD where applicable.");
      if (a.immunisation) bits.push("- Required immunisations/fit testing must be completed and maintained.");
      if (a.confidentiality) bits.push("- Patient data confidentiality and information governance obligations apply.");
      return bits.length ? `### Healthcare Requirements\n${bits.join("\n")}` : "";
    },
  },

  education: {
    title: "Education",
    toggles: [
      { key: "safeguarding", label: "Safeguarding training required?" },
      { key: "vetting", label: "Background/vetting required?" },
      { key: "term_time", label: "Term-time working pattern?" },
    ],
    toClause: (a) => {
      const bits: string[] = [];
      if (a.safeguarding) bits.push("- Safeguarding training and reporting duties apply per policy and law.");
      if (a.vetting) bits.push("- Role subject to enhanced vetting and barred-list checks where applicable.");
      if (a.term_time) bits.push("- Working pattern may be term-time only with pro-rated holiday/pay arrangements.");
      return bits.length ? `### Education Requirements\n${bits.join("\n")}` : "";
    },
  },

  logistics: {
    title: "Logistics",
    toggles: [
      { key: "driver_checks", label: "Driver licence & tachograph rules?" },
      { key: "manual_handling", label: "Manual-handling training?" },
      { key: "shift_nights", label: "Night shifts/24x7 operations?" },
    ],
    toClause: (a) => {
      const bits: string[] = [];
      if (a.driver_checks) bits.push("- Driver licence, CPC, tachograph/working time rules must be complied with.");
      if (a.manual_handling) bits.push("- Manual-handling training and safe lifting procedures are mandatory.");
      if (a.shift_nights) bits.push("- Shift patterns may include nights and weekends, subject to lawful limits and premiums.");
      return bits.length ? `### Logistics Requirements\n${bits.join("\n")}` : "";
    },
  },

  finance: {
    title: "Finance",
    toggles: [
      { key: "conduct_rules", label: "Conduct rules/fit & proper?" },
      { key: "kyd_aml", label: "KYC/AML responsibilities?" },
      { key: "market_conf", label: "Market-confidentiality & insider info?" },
    ],
    toClause: (a) => {
      const bits: string[] = [];
      if (a.conduct_rules) bits.push("- The Employee must meet applicable conduct/fit & proper standards and complete attestations.");
      if (a.kyd_aml) bits.push("- KYC/AML procedures must be followed and suspicious activity reported as required by law.");
      if (a.market_conf) bits.push("- Market-abuse, inside information and dealing restrictions apply.");
      return bits.length ? `### Finance Requirements\n${bits.join("\n")}` : "";
    },
  },
};

// Utility: turn selected sector + answers into a clause string
export function buildSectorClauses(sectorKey: string, answers: Record<string, boolean>): string {
  const pack = SECTOR_PACKS[sectorKey];
  if (!pack) return "";
  const clause = pack.toClause(answers);
  return clause ? `\n${clause}\n` : "";
}
