// app/api/checkout/route.ts
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

function getOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin) return origin;
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const plan = (form?.get("plan")?.toString() ?? "monthly").toLowerCase();

  const secret = process.env.STRIPE_SECRET_KEY;
  const priceMonthly = process.env.STRIPE_PRICE_MONTHLY;
  const priceAnnual = process.env.STRIPE_PRICE_ANNUAL;

  // Not configured yet? Show a friendly message so the button still "works".
  if (!secret || !priceMonthly || !priceAnnual) {
    return new Response(
      "Stripe not configured yet. Add STRIPE_SECRET_KEY, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_ANNUAL in Vercel → Settings → Environment Variables, then redeploy.",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const origin = getOrigin(req);
  const price = plan === "annual" ? priceAnnual : priceMonthly;

  // Create a Checkout Session via Stripe's HTTP API (no extra dependency)
  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    success_url: `${origin}/dashboard?upgrade=success`,
    cancel_url: `${origin}/pricing?canceled=1`,
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(`Stripe error: ${text}`, { status: 500 });
  }

  const data = await res.json();
  const url = (data as any)?.url as string | undefined;
  if (!url) return new Response("Stripe error: missing session url", { status: 500 });

  return Response.redirect(url, 303);
}

export async function GET() {
  return new Response("Method not allowed", { status: 405 });
}
