import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles, stripeOrders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getStripe } from "@/lib/stripe";
import { STRIPE_PRODUCTS } from "@/lib/stripe-products";

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const productKey = body?.productKey as string | undefined;

  if (!productKey || !(productKey in STRIPE_PRODUCTS)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const priceId = STRIPE_PRODUCTS[productKey];
  if (!priceId) {
    return NextResponse.json({ error: "Product not configured" }, { status: 500 });
  }

  const origin = request.headers.get("origin") ?? "https://bobby-washburn.com";

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/account?checkout=success`,
    cancel_url: `${origin}/courses`,
    metadata: {
      userId: session.user.id,
      profileId: profile.id,
      productKey,
    },
  });

  await db.insert(stripeOrders).values({
    userId: session.user.id,
    stripeSessionId: checkoutSession.id,
    priceId,
    productId: productKey,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
