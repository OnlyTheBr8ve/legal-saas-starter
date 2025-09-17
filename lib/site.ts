// lib/site.ts
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://legal-saas-starter.vercel.app'
).replace(/\/$/, '');
