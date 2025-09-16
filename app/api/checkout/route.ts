// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: NextRequest) {
  try {
    // Read form fields from /pricing
    const form = await req.formData();
    const plan = String(form.get("plan") || "monthly").toLowerCase();
    const email = String(form.get("email") || "").trim();

    if (!["monthly", "annual"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const STRIPE_SECRET_KEY = need("STRIPE_SECRET_KEY");
    const PRICE_MONTHLY = need("STRIPE_PRICE_MONTHLY");
    const PRICE_ANNUAL = need("STRIPE_PRICE_ANNUAL");
    const priceId = plan === "annual" ? PRICE_ANNUAL : PRICE_MONTHLY;

    // Initialize Stripe (no explicit apiVersion to avoid TS mismatch)
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Solid origin on Vercel
    const origin = req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      metadata: { plan, email },
      success_url: `${origin}/dashboard?upgraded=1`,
      cancel_url: `${origin}/dashboard?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "No checkout URL from Stripe" }, { status: 500 });
    }

    // 303 redirect per Stripe docs
    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
