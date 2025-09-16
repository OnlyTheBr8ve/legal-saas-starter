// app/api/portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email")?.trim();
    const debug = req.nextUrl.searchParams.get("debug");
    if (!email) return err("Provide ?email=you@example.com");

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return err("Missing STRIPE_SECRET_KEY on Vercel.", 500);

    const stripe = new Stripe(secret);

    // Find the Stripe customer created during Checkout
    const list = await stripe.customers.list({ email, limit: 1 });
    const customer = list.data[0];
    if (!customer) return err(`No Stripe customer found for ${email}.`, 404);

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${req.nextUrl.origin}/dashboard`,
    });

    // Debug mode returns JSON instead of redirecting
    if (debug) {
      return NextResponse.json({
        customerId: customer.id,
        portalUrl: session.url,
      });
    }

    return NextResponse.redirect(session.url, 303);
  } catch (e: any) {
    console.error("portal error:", e);
    return err(e?.message || "Unknown error", 500);
  }
}

export async function POST(req: NextRequest) {
  // Allow simple <form> POST with an email field
  const form = await req.formData().catch(() => null);
  const email = String(form?.get("email") || "").trim();
  if (!email) return err("Email required");

  // Reuse the GET logic
  const url = new URL(req.url);
  url.searchParams.set("email", email);
  return GET(new NextRequest(url));
}
