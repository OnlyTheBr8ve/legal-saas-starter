// app/templates/page.tsx
import Link from "next/link";
import { TEMPLATES, type TemplateDef } from "@/lib/templates";

type CategoryKey =
  | "employment"
  | "contractors"
  | "website"
  | "saas"
  | "data"
  | "ip"
  | "procurement"
  | "finance"
  | "real-estate"
  | "hse"
  | "marketing"
  | "education"
  | "all";

const CATEGORIES: { key: CategoryKey; label: string; match: (t: TemplateDef) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "employment", label: "Employment/HR", match: (t) => hasAny(t.slug, ["employment", "probation", "handbook", "offer"]) },
  { key: "contractors", label: "Contractors/Freelancers", match: (t) => hasAny(t.slug, ["contractor", "ip-assignment", "non-disclosure"]) },
  { key: "website", label: "Website Docs", match: (t) => hasAny(t.slug, ["website-terms", "cookies-policy", "privacy-policy"]) },
  { key: "saas", label: "SaaS & Commercial", match: (t) => hasAny(t.slug, ["saas", "order-form", "professional-services", "support-sla"]) },
  { key: "data", label: "Data Protection", match: (t) => hasAny(t.slug, ["dpa", "subprocessor", "data-breach"]) },
  { key: "ip", label: "IP & Referrals", match: (t) => hasAny(t.slug, ["ip-", "referral", "mutual-non-solicit"]) },
  { key: "procurement", label: "Procurement/Supply", match: (t) => hasAny(t.slug, ["msa-procurement", "vendor-code"]) },
  { key: "finance", label: "Finance/Investor", match: (t) => hasAny(t.slug, ["saft", "investor"]) },
  { key: "real-estate", label: "Real Estate/Facilities", match: (t) => hasAny(t.slug, ["office-licence", "cleaning-services"]) },
  { key: "hse", label: "Health & Safety", match: (t) => hasAny(t.slug, ["health-and-safety", "lone-working"]) },
  { key: "marketing", label: "Marketing/Creative", match: (t) => hasAny(t.slug, ["marketing-services", "ugc"]) },
  { key: "education", label: "Education/Training", match: (t) => hasAny(t.slug, ["training-services", "internship"]) },
];

function hasAny(slug: string, needles: string[]) {
  return needles.some((n) => slug.includes(n));
}

function filterTemplates(q: string, cat: CategoryKey) {
  const qNorm = q.trim().toLowerCase();
  const byCat = CATEGORIES.find((c) => c.key === cat) ?? CATEGORIES[0];
  return TEMPLATES.filter((t) => {
    const inCat = byCat.match(t);
    const inQuery =
      !qNorm ||
      t.title.toLowerCase().includes(qNorm) ||
      (t.summary ?? "").toLowerCase().includes(qNorm) ||
      t.slug.toLowerCase().includes(qNorm);
    return inCat && inQuery;
  });
}

export default function TemplatesIndex({
  searchParams,
}: {
  searchParams?: { q?: string; cat?: CategoryKey };
}) {
  const q = searchParams?.q ?? "";
  const cat = (searchParams?.cat ?? "all") as CategoryKey;
  const items = filterTemplates(q, cat);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">Legal Templates</h1>
          <p className="text-white/70">Search across {TEMPLATES.length} ready-to-use templates.</p>
        </div>

        <form method="get" className="flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search templates…"
            className="px-3 py-2 rounded-md bg-black/30 border border-white/10 w-64"
            aria-label="Search templates"
          />
          <select
            name="cat"
            defaultValue={cat}
            className="px-3 py-2 rounded-md bg-black/30 border border-white/10"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-white text-black font-medium border border-white/10"
          >
            Apply
          </button>
        </form>
      </header>

      {items.length === 0 ? (
        <div className="border border-white/10 rounded-md p-6 bg-black/20">
          <p className="text-white/80">No templates match your filters.</p>
          <p className="text-white/60 text-sm mt-2">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <Link
              key={t.slug}
              href={`/templates/${t.slug}`}
              className="block rounded-lg border border-white/10 bg-black/20 hover:bg-black/30 transition-colors p-5"
            >
              <h3 className="font-semibold text-lg">{t.title}</h3>
              {t.summary && <p className="text-white/70 text-sm mt-2 line-clamp-3">{t.summary}</p>}
              <p className="text-white/50 text-xs mt-3">/{t.slug}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
