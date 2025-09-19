import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";

export const metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-4xl font-extrabold">Legal Templates</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {TEMPLATES.map((t) => (
          <div key={t.slug} className="rounded-xl border border-white/10 p-5 bg-black/20">
            <h2 className="text-xl font-semibold">{t.title}</h2>
            <p className="text-white/70 mt-1">{t.summary}</p>
            <div className="mt-4">
              <Link
                className="text-violet-300 hover:text-violet-200"
                href={`/templates/${t.slug}`}
              >
                Open template →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
