import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export default function TemplatesIndexPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-4xl font-extrabold">Legal Templates (UK)</h1>
      <p className="text-white/70">
        Pick a template to generate a draft instantly. Edit, export, and e‑sign.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {TEMPLATES.map((t) => (
          <Link
            key={t.slug}
            href={`/templates/${t.slug}`}
            className="block rounded-xl border border-white/10 bg-black/20 p-6 hover:bg-black/30 transition"
          >
            <h2 className="text-xl font-semibold">{t.title}</h2>
            <p className="text-white/70 mt-2">{t.summary}</p>
            <span className="inline-block mt-4 text-indigo-300">Open template →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
