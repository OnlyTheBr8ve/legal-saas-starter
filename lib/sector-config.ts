// lib/sector-config.ts

export type Toggle = {
  key: string;
  label: string;
  hint?: string;
};

export type SectorPack = {
  title: string;
  toggles: Toggle[];
  builder: (answers: Record<string, boolean>) => string;
};

export const SECTOR_PACKS: Record<string, SectorPack> = {
  hospitality: {
    title: "Hospitality",
    toggles: [
      { key: "personal_license", label: "Requires personal alcohol license?", hint: "e.g., Designated Premises Supervisor (UK)" },
      { key: "food_hygiene", label: "Food hygiene level required?", hint: "e.g., Level 2 Certificate" },
      { key: "late_hours", label: "Late hours / night work expected?" },
      { key: "cash_handling", label: "Cash handling / till responsibility?" },
      { key: "tips_tronc", label: "Tips/tronc scheme applies?" },
    ],
    builder: (a) => {
      const lines: string[] = [];
      if (a.personal_license)
        lines.push(
          "- Role requires maintaining a valid personal alcohol license; loss or suspension may affect suitability and can trigger review or reassignment."
        );
      if (a.food_hygiene)
        lines.push(
          "- Employee must hold and maintain an appropriate food hygiene certificate (e.g., Level 2) and follow food safety procedures."
        );
      if (a.late_hours)
        lines.push(
          "- Hours may include evenings/late nights/weekends; comply with working time/rest break rules and safe travel policies."
        );
      if (a.cash_handling)
        lines.push(
          "- Cash/till responsibilities include reconciliation, shrinkage reporting, and adherence to fraud/theft policies."
        );
      if (a.tips_tronc)
        lines.push(
          "- Tips/tronc distribution follows venue policy and applicable law; not guaranteed income and may vary by shift."
        );
      return lines.join("\n");
    },
  },

  construction: {
    title: "Construction",
    toggles: [
      { key: "cscs", label: "CSCS / site card required?" },
      { key: "ppe", label: "PPE provided/required and safety briefings?" },
      { key: "vehicle_use", label: "Company vehicle/driver policy applies?" },
      { key: "high_risk", label: "High-risk tasks (work at height, confined spaces)?" },
      { key: "drug_alcohol", label: "Drug & alcohol testing policy?" },
    ],
    builder: (a) => {
      const out: string[] = [];
      if (a.cscs) out.push("- Employment is conditional on holding and maintaining valid CSCS (or local equivalent).");
      if (a.ppe) out.push("- Employer provides mandatory PPE; employee must wear and maintain PPE and attend toolbox talks.");
      if (a.vehicle_use) out.push("- Vehicle/driver policy covers licensing, telematics, fines, and safe driving expectations.");
      if (a.high_risk) out.push("- High-risk permits and method statements (RAMS) must be followed; refusal may be disciplinary.");
      if (a.drug_alcohol) out.push("- Pre-employment and random drug & alcohol testing may apply; failure may lead to dismissal.");
      return out.join("\n");
    },
  },

  retail: {
    title: "Retail",
    toggles: [
      { key: "keyholder", label: "Keyholder / opening & closing?" },
      { key: "stock_loss", label: "Stock loss / shrinkage responsibilities?" },
      { key: "commission", label: "Commission or incentives?" },
      { key: "weekend_rota", label: "Weekend rota required?" },
    ],
    builder: (a) => {
      const out: string[] = [];
      if (a.keyholder) out.push("- Keyholder duties include store security, opening/closing, and alarm response.");
      if (a.stock_loss) out.push("- Follow stock control procedures; report discrepancies; cooperate with audits/CCTV policies.");
      if (a.commission) out.push("- Commission/incentives are discretionary, may change, and are subject to clawback if targets misreported.");
      if (a.weekend_rota) out.push("- Participation in weekend/holiday rotas required with fair scheduling practices.");
      return out.join("\n");
    },
  },

  healthcare: {
    title: "Healthcare",
    toggles: [
      { key: "dbs_checks", label: "Background/DBS checks required?" },
      { key: "registration", label: "Professional registration required (e.g., NMC/HCPC)?" },
      { key: "vaccinations", label: "Mandatory vaccinations/fit testing?" },
      { key: "on_call", label: "On-call / out-of-hours rota?" },
      { key: "patient_data", label: "Strict patient data & confidentiality terms?" },
    ],
    builder: (a) => {
      const out: string[] = [];
      if (a.dbs_checks) out.push("- Employment subject to satisfactory background/DBS checks and periodic renewals.");
      if (a.registration) out.push("- Maintain professional registration/CPD; loss/suspension may affect role suitability.");
      if (a.vaccinations) out.push("- Comply with occupational health guidance incl. required vaccinations and mask fit testing.");
      if (a.on_call) out.push("- On-call rota participation with reasonable response times; separate on-call allowance if applicable.");
      if (a.patient_data) out.push("- Patient data handled per law and policy; strict confidentiality and access controls apply.");
      return out.join("\n");
    },
  },

  it_software: {
    title: "IT / Software",
    toggles: [
      { key: "ip_assignment", label: "IP assignment & inventions clause?" },
      { key: "oss_policy", label: "Open-source contribution policy?" },
      { key: "security_clearance", label: "Security clearance/background checks?" },
      { key: "on_call_sre", label: "On-call (SRE/production support)?" },
      { key: "equipment_remote", label: "Remote equipment/infosec rules?" },
    ],
    builder: (a) => {
      const out: string[] = [];
      if (a.ip_assignment) out.push("- Work product IP assigned to employer; moral rights waived where lawful; limited personal portfolio rights.");
      if (a.oss_policy) out.push("- Open-source contributions must follow company approval and license compliance.");
      if (a.security_clearance) out.push("- Role may require background/security clearance and periodic re-checks.");
      if (a.on_call_sre) out.push("- Participation in on-call with documented escalation, paging etiquette, and stipend if applicable.");
      if (a.equipment_remote) out.push("- Use company equipment, MFA, and device encryption; follow remote work and data handling rules.");
      return out.join("\n");
    },
  },
};

/** Build sector-specific clause text from selected answers */
export function buildSectorClauses(sectorKey: string, answers: Record<string, boolean>): string {
  const pack = SECTOR_PACKS[sectorKey];
  if (!pack) return "";
  const txt = pack.builder(answers);
  return txt.trim();
}
