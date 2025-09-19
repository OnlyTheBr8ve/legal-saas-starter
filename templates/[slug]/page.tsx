// templates/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMPLATES, TEMPLATES_BY_SLUG } from "@/lib/templates";

// Ensure Next knows the param shape
type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const t = TEMPLATES_BY_SLUG[params.slug];
  if (!t) return {};
  return {
    title: `${t.title} — Free Template`,
    description: t.excerpt,
  };
}

export default function TemplatePage({ params }: { params: Params }) {
  const t = TEMPLATES_BY_SLUG[params.slug];
  if (!t) return notFound();

  // Optional: prefill Dashboard's ?prompt= param
  const prefill = encodeURIComponent(
    [
      `Template: ${t.title}`,
      `Jurisdiction: UK`,
      `Purpose: ${t.excerpt}`,
      ``,
      `Please generate a professional first draft with headings, numbered clauses,`,
      `placeholders in {{double_curly}}, and a short cover summary.`,
    ].join("\n")
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
     
