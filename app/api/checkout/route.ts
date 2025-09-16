// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: NextRequest) {
  try {
    // Read POSTed form fields from the pricing page
    const form = await req.formData();
    const plan = String(form.get("plan") || "");
    const email = String(form.get("email") || "").trim();

    if (!["monthly", "annual"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const STRIPE_SECRET_KEY = getRequiredEnv("STRIPE_SECRET_KEY");
    const PRICE_MONTHLY = getRequiredEnv("STRIPE_PRICE_MONTHLY");
    const PRICE_ANNUAL = getRequiredEnv("STRIPE_PRICE_ANNUAL");

    const priceId = plan === "monthly" ? PRICE_MONTHLY : PRICE_ANNUAL;

    // Initialize Stripe (omit explicit apiVersion to avoid TS mismatch issues)
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Where to send the user after checkout (existing pages)
    const origin = req.nextUrl.origin;
    const success_url = `${origin}/dashboard?upgrade=success`;
    const cancel_url = `${origin}/pricing?canceled=1`;

    // Create the Checkout Session for a subscription
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url,
      cancel_url,
      allow_promotion_codes: true,
      // This will send receipts and associate a Customer in Stripe
      customer_email: email,
      // Helpful later when you handle webhooks
      metadata: { plan, email },
      automatic_tax: { enabled: true },
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
