import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMPLATES, TEMPLATES_BY_SLUG } from "@/lib/templates";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }) {
  const t = TEMPLATES_BY_SLUG[params.slug];
  if (!t) return {};
  return {
    title: `${t.title} — Template`,
    description: t.summary ?? "",
  };
}

export default function TemplateDetailPage({ params }: { params: Params }) {
  const tpl = TEMPLATES_BY_SLUG[params.slug];
  if (!tpl) return notFound();

  const example = tpl.examplePrompt ?? "";
  const dashHref = `/dashboard?prompt=${encodeURIComponent(example)}`;

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      <div className="grid gap-6 md:grid-cols-[260px,1fr]">
        {/* Sidebar list */}
        <aside className="rounded-lg border border-white/10 bg-black/30 p-3 h-max sticky top-6">
          <h2 className="text-sm font-semibold px-2 py-1">All templates</h2>
          <nav className="mt-2 space-y-1">
            {TEMPLATES.map((t) => (
              <Link
                key={t.slug}
                href={`/templates/${t.slug}`}
                className={`block rounded-md px-2 py-1 text-sm hover:bg-white/5 ${
                  t.slug === params.slug ? "bg-white/10" : ""
                }`}
              >
                {t.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <section className="rounded-lg border border-white/10 bg-black/30">
          <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{tpl.title}</h1>
              {tpl.summary && (
                <p className="text-sm text-white/70 mt-1">{tpl.summary}</p>
              )}
            </div>

            <div className="flex gap-2">
              {example && (
                <>
                  <button
                    onClick={() => navigator.clipboard.writeText(example)}
                    className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                  >
                    Copy prompt
                  </button>
                  <Link
                    href={dashHref}
                    className="rounded-md border border-white/15 bg-white px-3 py-2 text-sm text-black hover:opacity-90"
                  >
                    Open in Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="p-4 space-y-6">
            {tpl.guidance && (
              <div>
                <h3 className="font-semibold mb-2">How to use</h3>
                <div className="prose prose-invert max-w-none text-sm leading-6">
                  <p className="whitespace-pre-wrap">{tpl.guidance}</p>
                </div>
              </div>
            )}

            {tpl.examplePrompt && (
              <div>
                <h3 className="font-semibold mb-2">Example prompt</h3>
                <pre className="whitespace-pre-wrap rounded-md bg-black/40 border border-white/10 p-3 text-sm leading-6">
                  {tpl.examplePrompt}
                </pre>
              </div>
            )}

            {tpl.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  {tpl.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
