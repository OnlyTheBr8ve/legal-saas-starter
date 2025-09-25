// app/templates/page.tsx
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export const metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">Templates</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {TEMPLATES.map((tpl: any) => {
          const desc =
            tpl?.description ?? tpl?.summary ?? tpl?.subtitle ?? "";
          return (
            <Link
              key={tpl.slug}
              href={`/templates/${tpl.slug}`}
              className="block rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              <h2 className="text-xl font-medium">{tpl.title}</h2>
              {desc ? (
                <p className="mt-2 text-sm text-zinc-400">{desc}</p>
              ) : null}
              <span className="mt-4 inline-block text-sm text-blue-400">
                Open →
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
