// app/api/stripe/webhook/route.ts
import { NextRequest } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY || "";
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const sig = req.headers.get("stripe-signature");

  if (!secret || !endpointSecret || !sig) {
    return new Response("Missing Stripe env or signature", { status: 400 });
  }

  // ✅ Use the API version your types expect
  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

  // Read raw body for signature verification
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Optional: you can fetch the full session if needed:
        // const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ["customer"] });
        // TODO: mark user as pro in your DB using session.customer, session.customer_email, etc.
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        // TODO: upsert subscription status in your DB (active/canceled, current_period_end, etc.)
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        // TODO: mark user as free in your DB
        break;
      }
      default:
        // No-op for events we don't handle yet
        break;
    }
    return new Response("ok", { status: 200 });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return new Response("Webhook handler error", { status: 500 });
  }
}

export async function GET() {
  return new Response("Stripe webhook endpoint", { status: 200 });
}
