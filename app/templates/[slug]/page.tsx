// app/templates/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TEMPLATES } from "@/lib/templates";

// Keep ISR simple & valid (must be number or false)
export const revalidate = 0;

type Params = { slug: string };

function getTemplateBySlug(slug: string) {
  // Avoid type issues by treating the data as generic objects
  const list = (TEMPLATES as any[]) || [];
  return list.find((t) => t?.slug === slug) as any | undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const tpl = getTemplateBySlug(params.slug);
  if (!tpl) return {};
  return {
    title: `${tpl.title} — Template`,
    description: `Generate a ${tpl.title} using the template.`,
  };
}

export default function TemplatePage({ params }: { params: Params }) {
  const tpl = getTemplateBySlug(params.slug);
  if (!tpl) notFound();

  const prompt: string = tpl?.examplePrompt ?? "";
  const dashboardUrl = `/dashboard?prompt=${encodeURIComponent(prompt)}`;
  const wizardUrl = `/wizard?type=${encodeURIComponent(String(tpl?.slug ?? ""))}`;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{tpl.title}</h1>

      {prompt && (
        <section className="rounded-md bg-black/20 border border-white/10 p-4 whitespace-pre-wrap">
          <h3 className="font-semibold mb-2">Example prompt</h3>
          <p className="text-white/80">{prompt}</p>
        </section>
      )}

      <div className="flex gap-3">
        <Link
          href={dashboardUrl}
          className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/15"
        >
          Open in Dashboard
        </Link>
        <Link
          href={wizardUrl}
          className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/15"
        >
          Start with Wizard
        </Link>
      </div>
    </main>
  );
}
