// app/api/account/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY || "";
const stripe = secret ? new Stripe(secret) : null;

export async function GET(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured. Missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    // Find customer by email (test or live depending on your key)
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({ pro: false, reason: "no_customer" });
    }

    // Look for an active subscription
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
      expand: ["data.items.data.price.product"],
    });

    const sub = subs.data[0];
    if (!sub) {
      return NextResponse.json({
        pro: false,
        customerId: customer.id,
        reason: "no_active_subscription",
      });
    }

    const priceId = sub.items.data[0]?.price?.id || "";
    let plan: "monthly" | "annual" | "unknown" = "unknown";
    if (priceId === process.env.STRIPE_PRICE_MONTHLY) plan = "monthly";
    else if (priceId === process.env.STRIPE_PRICE_ANNUAL) plan = "annual";

    return NextResponse.json({
      pro: true,
      plan,
      customerId: customer.id,
      priceId,
      currentPeriodEnd: sub.current_period_end,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "unexpected error" },
      { status: 500 }
    );
  }
}
