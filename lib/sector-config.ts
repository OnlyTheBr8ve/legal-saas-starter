export type FollowUp = {
  id: string;
  label: string;
  help?: string;
  injectWhenTrue: string;
};

export type SectorConfig = {
  key: string;
  label: string;
  followUps: FollowUp[];
};

export const SECTORS: SectorConfig[] = [
  {
    key: "hospitality",
    label: "Hospitality",
    followUps: [
      {
        id: "personalLicence",
        label: "Requires Personal Licence?",
        help: "Premises alcohol authorisation responsibilities.",
        injectWhenTrue:
          "This role requires holding a Personal Licence. Loss, suspension, or revocation of the licence will constitute grounds for review and possible reassignment or termination, subject to fair process."
      },
      {
        id: "tronc",
        label: "Tips/Tronc applies?",
        injectWhenTrue:
          "Tips/tronc are distributed under a fair allocation policy and processed via PAYE where applicable. They are not guaranteed income."
      },
      {
        id: "unsocial",
        label: "Unsocial hours?",
        injectWhenTrue:
          "Rota includes evenings/weekends/bank holidays. Premium rates/time off in lieu may apply in line with policy."
      }
    ]
  },
  {
    key: "construction",
    label: "Construction",
    followUps: [
      {
        id: "cscs",
        label: "CSCS card required?",
        injectWhenTrue:
          "The worker must hold and maintain a valid CSCS card for the role at all times and comply with site safety rules."
      },
      {
        id: "safetyCritical",
        label: "Safety‑critical duties?",
        injectWhenTrue:
          "Medical fitness and PPE compliance are mandatory. Breach of site safety may be treated as gross misconduct."
      }
    ]
  },
  {
    key: "healthcare",
    label: "Healthcare",
    followUps: [
      {
        id: "dbs",
        label: "Enhanced DBS check required?",
        injectWhenTrue:
          "Appointment is conditional on an enhanced DBS check and ongoing safeguarding compliance."
      },
      {
        id: "registration",
        label: "Professional registration needed?",
        help: "e.g., NMC, HCPC or GMC",
        injectWhenTrue:
          "The role requires valid professional registration; lapse or suspension must be notified immediately and may affect employment."
      }
    ]
  },
  {
    key: "retail",
    label: "Retail",
    followUps: [
      {
        id: "cashHandling",
        label: "Cash handling?",
        injectWhenTrue:
          "Cash handling and reconciliation responsibilities apply; shrinkage policy and CCTV monitoring disclosed."
      }
    ]
  },
  {
    key: "tech",
    label: "Tech",
    followUps: [
      {
        id: "ipAssignment",
        label: "IP assignment required?",
        injectWhenTrue:
          "All IP created in the course of duties is assigned to the employer; moral rights waived to the extent permitted by law."
      },
      {
        id: "remoteFirst",
        label: "Remote‑first role?",
        injectWhenTrue:
          "Remote‑first; employee must maintain secure workspace, follow infosec policy, and be reachable during core hours."
      }
    ]
  }
];
