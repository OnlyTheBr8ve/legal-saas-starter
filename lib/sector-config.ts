// Sector-specific toggles and snippets to enrich prompts.

export type SectorKey =
  | "general"
  | "hospitality"
  | "construction"
  | "healthcare"
  | "retail"
  | "technology";

export type SectorToggle = {
  id: string;
  label: string;
  description?: string;
  clauseSnippet: string;
};

export const SECTOR_CONFIG: Record<
  SectorKey,
  { name: string; toggles: SectorToggle[] }
> = {
  general: {
    name: "General",
    toggles: [
      {
        id: "probation",
        label: "Include probation period",
        clauseSnippet:
          "Include a 3–6 month probation with simplified termination and performance review checkpoints."
      },
      {
        id: "ip-confidentiality",
        label: "Strong IP & confidentiality",
        clauseSnippet:
          "Reinforce confidentiality and full assignment of IP to the company, with survival post-termination."
      }
    ]
  },
  hospitality: {
    name: "Hospitality",
    toggles: [
      {
        id: "personal-licence",
        label: "Personal licence required",
        clauseSnippet:
          "Add a clause that employment is conditional on holding a valid Personal Licence; loss or suspension triggers review or reassignment."
      },
      {
        id: "food-safety",
        label: "Food hygiene & safety",
        clauseSnippet:
          "Include mandatory adherence to food hygiene standards (HACCP), temperature logs, allergen procedures, and customer safety."
      },
      {
        id: "tronc-tips",
        label: "Tronc / tips handling",
        clauseSnippet:
          "Describe tronc distribution rules, transparency, and that tips are not guaranteed compensation."
      }
    ]
  },
  construction: {
    name: "Construction",
    toggles: [
      {
        id: "cscs",
        label: "CSCS / Competency required",
        clauseSnippet:
          "Require valid CSCS card (or equivalent competency), with duty to maintain and present on request."
      },
      {
        id: "rams",
        label: "RAMS & site rules",
        clauseSnippet:
          "Contractor must provide RAMS, comply with site inductions, PPE rules, and report near-misses promptly."
      },
      {
        id: "insurance",
        label: "Insurance minimums",
        clauseSnippet:
          "Set minimum insurance levels (e.g., £5m Public Liability, £2m Professional Indemnity) with certificates on request."
      }
    ]
  },
  healthcare: {
    name: "Healthcare",
    toggles: [
      {
        id: "patient-data",
        label: "Patient data handling",
        clauseSnippet:
          "Strictly prohibit access to identifiable patient data unless necessary; include confidentiality and audit consent."
      },
      {
        id: "training",
        label: "Mandatory training",
        clauseSnippet:
          "Require safeguarding, infection control, and clinical governance training with records retained."
      }
    ]
  },
  retail: {
    name: "Retail",
    toggles: [
      {
        id: "till-security",
        label: "Till & stock security",
        clauseSnippet:
          "Define cash handling protocols, voids/refunds approval, and stock loss reporting to reduce shrink."
      },
      {
        id: "uniform-brand",
        label: "Uniform & brand standards",
        clauseSnippet:
          "Specify uniform policy, personal presentation, and brand interaction standards for customer experience."
      }
    ]
  },
  technology: {
    name: "Technology",
    toggles: [
      {
        id: "security",
        label: "Security & access controls",
        clauseSnippet:
          "Mandate MFA, least-privilege access, secure coding practices, and immediate revocation on termination."
      },
      {
        id: "dpa",
        label: "Attach DPA if needed",
        clauseSnippet:
          "If processing personal data, include a GDPR-aligned DPA with sub-processor disclosure and 72-hour breach notice."
      }
    ]
  }
};
