import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export const metadata = {
  title: "Templates",
  description: "Browse ready-made legal templates you can customise in the dashboard."
};

export default function TemplatesIndexPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-4xl font-extrabold">Legal Templates</h1>
      <p className="text-white/70">
        Pick a template to see details and launch it with a prefilled prompt.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((t) => (
          <Link
            key={t.slug}
            href={`/templates/${t.slug}`}
            className="block rounded-lg border border-white/10 bg-black/20 p-4 hover:border-white/20 transition"
          >
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-white/70 mt-1 line-clamp-3">{t.summary}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {t.sectors.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-xs rounded bg-white/10 px-2 py-0.5 border border-white/10"
                >
                  {s}
                </span>
              ))}
              {t.sectors.length > 3 && (
                <span className="text-xs text-white/60">+{t.sectors.length - 3} more</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
