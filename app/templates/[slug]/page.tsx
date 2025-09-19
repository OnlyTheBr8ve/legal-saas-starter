import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export default function TemplateDetail({ params }: Params) {
  const tpl = TEMPLATES.find((t) => t.slug === params.slug);
  if (!tpl) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{tpl.title}</h1>
      <p className="text-white/70">{tpl.summary}</p>

      <div className="rounded-md bg-black/20 border border-white/10 p-4">
        <h3 className="font-semibold mb-2">Example prompt</h3>
        <pre className="whitespace-pre-wrap text-sm text-white/90">{tpl.examplePrompt}</pre>
      </div>

      <div className="flex gap-3">
        <Link
          className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500"
          href={`/dashboard?prompt=${encodeURIComponent(tpl.examplePrompt)}`}
        >
          Use in Dashboard
        </Link>
        <Link className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20" href="/templates">
          Back to templates
        </Link>
      </div>
    </main>
  );
}
