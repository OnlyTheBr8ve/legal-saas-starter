// /lib/sector-config.ts
export type SectorOption = { value: string; label: string };

// Single source of truth for sector options
export const SECTORS: SectorOption[] = [
  { value: "general", label: "General / Other" },
  { value: "saas", label: "SaaS" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "fintech", label: "FinTech" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "real_estate", label: "Real Estate" },
  { value: "hospitality", label: "Hospitality" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "energy", label: "Energy" },
  { value: "transportation", label: "Transportation" },
  { value: "government", label: "Government" },
  { value: "nonprofit", label: "Non-profit" },
  { value: "entertainment", label: "Entertainment" },
  { value: "gaming", label: "Gaming" },
  { value: "web3", label: "Web3 / Crypto" },
  { value: "marketplace", label: "Marketplace" },
  { value: "agency", label: "Agency / Services" },
  { value: "legal", label: "Legal" },
  { value: "hr", label: "HR / People" },
  { value: "marketing", label: "Marketing / Ads" },
  { value: "security", label: "Security" },
  { value: "ai", label: "AI / ML" },
  { value: "biotech", label: "Biotech" },
  { value: "retail", label: "Retail" },
  { value: "logistics", label: "Logistics" },
  { value: "travel", label: "Travel" },
  { value: "food_bev", label: "Food & Beverage" },
  { value: "sports", label: "Sports" },
  { value: "media", label: "Media" },
  { value: "fashion", label: "Fashion" },
];

export function getSectorLabel(v?: string) {
  if (!v) return "";
  return SECTORS.find(s => s.value === v)?.label ?? v;
}
