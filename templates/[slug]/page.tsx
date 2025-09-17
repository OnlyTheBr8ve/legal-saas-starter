// app/templates/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { TEMPLATES } from "@/lib/templates";

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const t = TEMPLATES[params.slug];
  if (!t) return {};
  const title = `${t.title} — Free Template`;
  const description = t.excerpt;
  const url = `/templates/${t.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article"
    }
  };
}

export default function TemplatePage({ params }: { params: Params }) {
  const t = TEMPLATES[params.slug];
  if (!t) return notFound();

  const prefillHref = `/dashboard?prompt=${encodeURIComponent(t.prompt)}&template=${encodeURIComponent(t.slug)}`;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold">{t.title}</h1>
        <p className="text-white/70">{t.excerpt}</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-xl font-semibold">What you’ll get</h2>
        <ul className="list-disc ml-6 space-y-1 text-white/80">
          <li>Structured, editable draft in seconds</li>
          <li>Export / copy and continue editing</li>
          <li>Works with the free plan (short docs)</li>
        </ul>
        <div className="flex gap-3 pt-2">
          <Link
            href={prefillHref}
            className="inline-flex items-center rounded-xl bg-violet-500 px-5 py-3 font-semibold hover:bg-violet-400"
          >
            Generate this document
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center rounded-xl border border-white/15 px-5 py-3 hover:bg-white/5"
          >
            Back to templates
          </Link>
        </div>
      </div>

      <section className="prose prose-invert max-w-none">
        <h2>How it works</h2>
        <ol>
          <li>Click <b>Generate this document</b>.</li>
          <li>The dashboard opens with a pre-filled prompt.</li>
          <li>Review, tweak anything, and export.</li>
        </ol>
      </section>
    </main>
  );
}
