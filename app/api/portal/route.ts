// app/api/portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function createPortalUrl(email: string, origin: string) {
  const stripe = new Stripe(need("STRIPE_SECRET_KEY"));
  // Find the Stripe Customer by email (created during Checkout)
  const list = await stripe.customers.list({ email, limit: 1 });
  const customer = list.data[0];
  if (!customer) {
    return NextResponse.json(
      { error: `No Stripe customer found for ${email}.` },
      { status: 404 }
    );
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${origin}/dashboard`,
  });
  return NextResponse.redirect(session.url, 303);
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim();
  if (!email) {
    return NextResponse.json(
      { error: "Provide ?email=you@example.com" },
      { status: 400 }
    );
  }
  return createPortalUrl(email, req.nextUrl.origin);
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const email = String(form?.get("email") || "").trim();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  return createPortalUrl(email, req.nextUrl.origin);
}
