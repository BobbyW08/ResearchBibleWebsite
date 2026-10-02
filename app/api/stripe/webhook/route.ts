import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { entitlements, stripeOrders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, productKey } = session.metadata ?? {};

    if (!userId || !productKey) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    await db
      .update(stripeOrders)
      .set({ status: "complete" })
      .where(eq(stripeOrders.stripeSessionId, session.id));

    await db
      .insert(entitlements)
      .values({ userId, productId: productKey })
      .onConflictDoNothing();
  }

  return NextResponse.json({ received: true });
}
