import Link from "next/link";
import type { Metadata } from "next";
import { TEMPLATES, TEMPLATES_BY_SLUG, type TemplateDef } from "@/lib/templates";

// Ensure Next knows the param shape
type Params = { slug: string };a

export async function generateMetadata({
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const tpl = TEMPLATES_BY_SLUG[params.slug];
  if (!tpl) return {};
  return {
    title: `${tpl.title} — Template`,
    description: tpl.summary
  };
}

export default function TemplateDetailPage({ params }: { params: Params }) {
  const tpl: TemplateDef | undefined = TEMPLATES_BY_SLUG[params.slug];
  if (!tpl) {
    // Not found – let Next handle the 404
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold">Template not found</h1>
        <p className="text-white/70 mt-2">
          We couldn’t find that template.{" "}
          <Link href="/templates" className="underline">
            Back to Templates
          </Link>
        </p>
      </main>
    );
  }

  const dashboardUrl = `/dashboard?prompt=${encodeURIComponent(tpl.examplePrompt)}`;
  const wizardUrl = `/wizard?type=${encodeURIComponent(tpl.slug)}`;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <Link href="/templates" className="text-white/70 hover:underline text-sm">
        ← Back to Templates
      </Link>

      <h1 className="text-3xl font-bold">{tpl.title}</h1>
      <p className="text-white/70">{tpl.summary}</p>

      <div className="flex flex-wrap gap-2">
        {tpl.sectors.map((s) => (
          <span key={s} className="text-xs rounded bg-white/10 px-2 py-0.5 border border-white/10">
            {s}
          </span>
        ))}
      </div>

      <div className="rounded-md bg-black/20 border border-white/10 p-4">
        <h3 className="font-semibold mb-2">Example prompt</h3>
        <pre className="whitespace-pre-wrap text-sm text-white/80">{tpl.examplePrompt}</pre>
      </div>

      <div className="flex gap-3">
        <Link
          href={dashboardUrl}
          className="rounded-md px-4 py-2 bg-white text-black font-medium hover:opacity-90"
        >
          Use in Dashboard
        </Link>
        <Link
          href={wizardUrl}
          className="rounded-md px-4 py-2 border border-white/20 hover:border-white/40"
        >
          Try the Wizard
        </Link>
      </div>
    </main>
  );
}
