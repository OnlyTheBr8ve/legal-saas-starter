// app/api/env-check/route.ts
export const runtime = "nodejs";

function mask(v?: string | null) {
  if (!v) return null;
  if (v.length <= 8) return v.replace(/./g, "•");
  return v.slice(0, 6) + "…" + v.slice(-4);
}

export async function GET() {
  const data = {
    STRIPE_SECRET_KEY_present: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_SECRET_KEY_preview: mask(process.env.STRIPE_SECRET_KEY || null),
    STRIPE_PRICE_MONTHLY_present: !!process.env.STRIPE_PRICE_MONTHLY,
    STRIPE_PRICE_MONTHLY_preview: mask(process.env.STRIPE_PRICE_MONTHLY || null),
    STRIPE_PRICE_ANNUAL_present: !!process.env.STRIPE_PRICE_ANNUAL,
    STRIPE_PRICE_ANNUAL_preview: mask(process.env.STRIPE_PRICE_ANNUAL || null),
    vercel_env: process.env.VERCEL_ENV || null,
  };
  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
