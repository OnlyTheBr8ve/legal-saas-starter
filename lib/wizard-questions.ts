// lib/wizard-questions.ts

export type WizardField =
  | {
      name: string;
      label: string;
      type: "text";
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: string[];
    }
  | {
      name: string;
      label: string;
      type: "date";
      placeholder?: string;
    }
  | {
      name: string;
      label: string;
      type: "number";
      placeholder?: string;
    };

export type TemplateQuestions = Record<string, WizardField[]>;

/**
 * Add more templates here by slug.
 * Slugs should match your /templates/[slug] pages.
 */
export const TEMPLATE_QUESTIONS: TemplateQuestions = {
  // Example: Cookies Policy
  "cookies-policy": [
    { name: "websiteName", label: "Website / App Name", type: "text", placeholder: "Acme Widgets" },
    { name: "websiteUrl", label: "Website URL", type: "text", placeholder: "https://example.com" },
    {
      name: "dataTypes",
      label: "Personal data collected",
      type: "textarea",
      placeholder: "e.g., IP address, device info, usage analytics, preferences…",
    },
    {
      name: "cookieTypes",
      label: "Cookie categories in use",
      type: "textarea",
      placeholder: "e.g., strictly necessary, performance/analytics, functionality, advertising…",
    },
    {
      name: "thirdParties",
      label: "Third-party services",
      type: "textarea",
      placeholder: "e.g., Google Analytics, Meta Pixel, Hotjar… (include links if you want)",
    },
    {
      name: "retention",
      label: "Cookie/data retention period",
      type: "text",
      placeholder: "e.g., session only; 13 months; 24 months…",
    },
    { name: "contactEmail", label: "Contact email for privacy requests", type: "text", placeholder: "privacy@example.com" },
    {
      name: "jurisdiction",
      label: "Primary legal jurisdiction",
      type: "select",
      options: ["UK", "EU", "US (Federal)", "US (California)", "Other"],
    },
  ],

  // Example: Employment Contract
  "employment-contract": [
    { name: "roleTitle", label: "Role Title", type: "text", placeholder: "Software Engineer" },
    { name: "location", label: "Work Location", type: "text", placeholder: "London, UK (hybrid)" },
    { name: "salary", label: "Salary / Compensation", type: "text", placeholder: "£60,000 + bonus" },
    { name: "startDate", label: "Start Date", type: "date" },
    {
      name: "probation",
      label: "Probation Period",
      type: "select",
      options: ["None", "1 month", "3 months", "6 months"],
    },
    {
      name: "ipOwnership",
      label: "IP/Confidentiality emphasis",
      type: "select",
      options: ["Standard", "Strict", "Light"],
    },
    {
      name: "terminationNotice",
      label: "Termination Notice",
      type: "text",
      placeholder: "e.g., 1 month (either party) after probation",
    },
  ],
};
