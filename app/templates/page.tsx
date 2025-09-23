import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export const metadata = {
  title: "Templates",
  description: "Browse starter templates and send them straight to your dashboard.",
};

export default function TemplatesIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Templates</h1>
        <p className="text-sm text-white/60">
          Pick a starting point, review the guidance, and open it in your dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {TEMPLATES.map((t) => (
          <Link
            key={t.slug}
            href={`/templates/${t.slug}`}
            className="block rounded-lg border border-white/10 bg-black/30 p-4 hover:bg-black/20"
          >
            <h2 className="text-lg font-semibold">{t.title}</h2>
            {t.summary && (
              <p className="text-sm text-white/70 mt-1 line-clamp-3">{t.summary}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
