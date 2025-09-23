// app/templates/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMPLATES, TEMPLATES_BY_SLUG, type TemplateDef } from "@/lib/templates";
import LaunchFromTemplate from "@/components/LaunchFromTemplate";

type Params = { slug: string };

export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const t = TEMPLATES_BY_SLUG[params.slug];
  if (!t) return {};
  return {
    title: `${t.title} — Free Template`,
    description: t.summary ?? undefined,
  };
}

export default function TemplateDetail({ params }: { params: Params }) {
  const tpl: TemplateDef | undefined = TEMPLATES_BY_SLUG[params.slug];
  if (!tpl) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <Link href="/templates" className="text-white/70 hover:text-white">
        ← Back to Templates
      </Link>

      <h1 className="text-3xl font-bold">{tpl.title}</h1>
      {tpl.summary && <p className="text-white/70">{tpl.summary}</p>}

      <div className="rounded-md bg-black/20 border border-white/10 p-4 space-y-3">
        <h3 className="font-semibold">Guidance</h3>
        <p className="text-white/80">
          {tpl.guidance ?? "Use this template as a starting point and customize to your facts and jurisdiction."}
        </p>
        {tpl.notes && tpl.notes.length > 0 && (
          <ul className="list-disc pl-6 text-white/70 space-y-1">
            {tpl.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}
      </div>

      {tpl.examplePrompt && (
        <div className="rounded-md bg-black/20 border border-white/10 p-4">
          <h3 className="font-semibold mb-2">Example prompt</h3>
          <pre className="whitespace-pre-wrap text-sm">{tpl.examplePrompt}</pre>
          <div className="mt-3 flex gap-3">
            <Link
              href={`/dashboard?prompt=${encodeURIComponent(tpl.examplePrompt)}`}
              className="px-4 py-2 rounded-md bg-white text-black font-medium border border-white/10"
            >
              Open in Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* New: sector-aware launcher */}
      <LaunchFromTemplate
        title={tpl.title}
        basePrompt={tpl.examplePrompt ?? `Draft a document titled "${tpl.title}" for my business.`}
      />
    </main>
  );
}
