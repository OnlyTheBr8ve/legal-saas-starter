// app/templates/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";

type Params = { slug: string };

export function generateStaticParams() {
  return TEMPLATES.map((t: any) => ({ slug: t.slug }));
}

export default function TemplateDetail({ params }: { params: Params }) {
  const tpl: any = TEMPLATES.find((t: any) => t.slug === params.slug);
  if (!tpl) return notFound();

  const desc = tpl?.description ?? tpl?.summary ?? tpl?.subtitle ?? "";
  const examplePrompt =
    tpl?.examplePrompt ?? tpl?.prompt ?? `Draft a document titled "${tpl.title}".`;

  const dashboardHref = examplePrompt
    ? `/dashboard?prompt=${encodeURIComponent(examplePrompt)}`
    : "/dashboard";
  const wizardHref = `/wizard?type=${encodeURIComponent(tpl.slug)}`;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/templates" className="text-sm text-zinc-400 hover:text-zinc-200">
        ← Back to templates
      </Link>

      <h1 className="mt-3 text-3xl font-semibold">{tpl.title}</h1>
      {desc ? <p className="mt-2 text-zinc-400">{desc}</p> : null}

      <div className="mt-6 flex gap-3">
        <Link
          href={dashboardHref}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Start in Dashboard
        </Link>
        <Link
          href={wizardHref}
          className="rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-900"
        >
          Open in Wizard
        </Link>
      </div>

      <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="mb-2 text-lg font-medium">Example prompt</h2>
        <pre className="whitespace-pre-wrap text-sm text-zinc-300">
          {examplePrompt}
        </pre>
      </section>
    </main>
  );
}
