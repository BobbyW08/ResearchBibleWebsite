import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { pendingReviews } from "@/lib/db/schema";

export const runtime = "nodejs";

function jsonResponse(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { data } = await auth.getSession();
  if (!data?.user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const { id } = await params;

  const [review] = await db
    .select()
    .from(pendingReviews)
    .where(eq(pendingReviews.id, id))
    .limit(1);

  if (!review) {
    return jsonResponse({ error: "Review not found" }, 404);
  }
  if (review.status !== "pending_review") {
    return jsonResponse(
      { error: `Cannot reject a review with status "${review.status}"` },
      409,
    );
  }

  await db
    .update(pendingReviews)
    .set({ status: "rejected" })
    .where(eq(pendingReviews.id, id));

  return jsonResponse({ success: true, topic: review.topic }, 200);
}
