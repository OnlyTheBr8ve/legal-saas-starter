import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMPLATES_BY_SLUG } from "@/lib/templates";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }) {
  const tpl = TEMPLATES_BY_SLUG[params.slug];
  if (!tpl) return {};
  return {
    title: `${tpl.title} — Free Template`,
    description: tpl.summary,
  };
}

export default function TemplateDetailPage({ params }: { params: Params }) {
  const tpl = TEMPLATES_BY_SLUG[params.slug];
  if (!tpl) notFound();

  const search = new URLSearchParams({ prompt: tpl.examplePrompt }).toString();
  const toDashboard = `/dashboard?${search}`;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{tpl.title}</h1>
      <p className="text-white/70">{tpl.summary}</p>

      <div className="rounded-md bg-black/20 border border-white/10 p-4">
        <h3 className="font-semibold mb-2">Example prompt</h3>
        <pre className="whitespace-pre-wrap text-sm text-white/80">{tpl.examplePrompt}</pre>
      </div>

      <div className="flex gap-3">
        <Link
          href={toDashboard}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Use in Dashboard
        </Link>
        <Link
          href="/templates"
          className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5"
        >
          Back to templates
        </Link>
      </div>
    </main>
  );
}
