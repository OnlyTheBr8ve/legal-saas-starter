// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { siteUrl } from '../lib/site';

const templateSlugs = [
  'uk-employment-contract',
  'uk-nda',
  'uk-freelancer-agreement',
  'uk-privacy-policy',
  'uk-employee-handbook',
];

const basePaths = ['', 'pricing', 'account', 'templates'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const urlFor = (p: string) => (p ? `${siteUrl}/${p}` : siteUrl);

  return [
    ...basePaths.map((p) => ({ url: urlFor(p), lastModified: now })),
    ...templateSlugs.map((slug) => ({
      url: `${siteUrl}/templates/${slug}`,
      lastModified: now,
    })),
  ];
}
