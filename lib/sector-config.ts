// lib/sector-config.ts

export type SectorKey =
  | "general"
  | "hospitality"
  | "construction"
  | "healthcare"
  | "professional_services"
  | "retail"
  | "transport"
  | "it_digital"
  | "education"
  | "finance_legal"
  | "manufacturing"
  | "creative_media"
  | "charity_public";

export type SectorOption = { key: SectorKey; label: string };
export type SectorQuestion = { key: string; label: string };
export type SectorQuestionsMap = Record<SectorKey, SectorQuestion[]>;

/** Dropdown options for the Wizard */
export const SECTORS: SectorOption[] = [
  { key: "general", label: "General / Any" },
  { key: "hospitality", label: "Hospitality" },
  { key: "construction", label: "Construction" },
  { key: "healthcare", label: "Healthcare & Care" },
  { key: "professional_services", label: "Professional Services" },
  { key: "retail", label: "Retail" },
  { key: "transport", label: "Transport & Logistics" },
  { key: "it_digital", label: "IT / Digital" },
  { key: "education", label: "Education" },
  { key: "finance_legal", label: "Finance & Legal" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "creative_media", label: "Creative & Media" },
  { key: "charity_public", label: "Charity / Public Sector" },
];

/** Sector-specific “tick box” prompts */
export const SECTOR_QUESTIONS: SectorQuestionsMap = {
  general: [
    { key: "probation_period", label: "Include a probation period" },
    { key: "ip_confidentiality", label: "Extra confidentiality & IP assignment" },
    { key: "overtime_policy", label: "Overtime & TOIL policy" },
    { key: "dbs_check", label: "DBS/background checks" },
  ],
  hospitality: [
    { key: "personal_license", label: "Personal licence requirement (alcohol)" },
    { key: "age_restricted_sales", label: "Age-restricted sales (Challenge 25)" },
    { key: "tips_tronc", label: "Tips / tronc policy" },
    { key: "food_hygiene", label: "Food hygiene Level 2+" },
    { key: "late_night_hours", label: "Late-night working clauses" },
  ],
  construction: [
    { key: "cscs_required", label: "CSCS card requirement" },
    { key: "site_safety", label: "Site safety PPE & RAMS adherence" },
    { key: "driving_plant", label: "Driving/plant licences (e.g. CPCS/NPORS)" },
    { key: "drug_alcohol", label: "Drug & alcohol testing policy" },
    { key: "security_clearance", label: "Security clearance (where applicable)" },
  ],
  healthcare: [
    { key: "nmc_gmc_hcpc", label: "Registration (NMC/GMC/HCPC) maintained" },
    { key: "vaccinations", label: "Vaccination & infection control" },
    { key: "shift_patterns", label: "Shifts & on-call clauses" },
    { key: "safeguarding", label: "Safeguarding duties & training" },
    { key: "confidentiality_igsoc", label: "Enhanced confidentiality / IG (UK)" },
  ],
  professional_services: [
    { key: "client_conflicts", label: "Conflicts of interest & client intake" },
    { key: "billable_hours", label: "Billable hours/targets" },
    { key: "regulator_code", label: "Regulator code (SRA/ACCA/ICAEW etc.)" },
    { key: "post_termination_restrict", label: "Post-termination restrictions" },
  ],
  retail: [
    { key: "till_cash", label: "Till/cash handling accountability" },
    { key: "stock_loss", label: "Stock loss & search policy" },
    { key: "age_restricted_sales", label: "Age-restricted sales duties" },
    { key: "weekend_evening", label: "Weekend/evening rota clauses" },
  ],
  transport: [
    { key: "driver_cpc", label: "Driver CPC & licence requirements" },
    { key: "tachograph", label: "Tachograph/working time compliance" },
    { key: "drug_alcohol", label: "Drug & alcohol testing policy" },
    { key: "load_security", label: "Load security & H&S duties" },
  ],
  it_digital: [
    { key: "ip_assignment", label: "Clear IP assignment (code/design)" },
    { key: "open_source_policy", label: "Open-source usage policy" },
    { key: "remote_security", label: "Remote work & security controls" },
    { key: "on_call", label: "On-call/incident response rotation" },
  ],
  education: [
    { key: "dbs_enhanced", label: "Enhanced DBS & safeguarding" },
    { key: "duty_of_care", label: "Duty of care & reporting" },
    { key: "term_time", label: "Term-time only arrangements" },
    { key: "professional_conduct", label: "Professional conduct/online policy" },
  ],
  finance_legal: [
    { key: "regulatory_clearance", label: "Regulatory approvals (FCA, etc.)" },
    { key: "fit_proper", label: "Fit & proper / SMCR where relevant" },
    { key: "client_money", label: "Client money handling restrictions" },
    { key: "insider_info", label: "Inside information & MAR" },
  ],
  manufacturing: [
    { key: "machine_safety", label: "Machine safety & permits" },
    { key: "shifts_nights", label: "Shift/night premiums" },
    { key: "quality_control", label: "Quality control/ISO obligations" },
    { key: "ppe_training", label: "PPE & mandatory training" },
  ],
  creative_media: [
    { key: "portfolio_ip", label: "Portfolio usage & moral rights" },
    { key: "release_forms", label: "Model/location release forms" },
    { key: "confidentiality_embargo", label: "Confidentiality/embargo clauses" },
    { key: "ooh_events", label: "Out-of-hours events/press" },
  ],
  charity_public: [
    { key: "safeguarding", label: "Safeguarding & DBS (where relevant)" },
    { key: "fundraising_rules", label: "Fundraising & Gift Aid rules" },
    { key: "political_neutrality", label: "Political neutrality/comms" },
    { key: "data_protection", label: "Data protection & FOI awareness" },
  ],
};

/** Helper: label from key */
export function sectorLabel(key: SectorKey): string {
  return SECTORS.find((s) => s.key === key)?.label ?? "General / Any";
}
