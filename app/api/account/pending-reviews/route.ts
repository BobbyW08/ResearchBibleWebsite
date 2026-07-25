import { desc } from "drizzle-orm";

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

export async function GET(_request: Request): Promise<Response> {
  const { data } = await auth.getSession();
  if (!data?.user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const reviews = await db
    .select()
    .from(pendingReviews)
    .orderBy(desc(pendingReviews.createdAt));

  return jsonResponse(reviews, 200);
}
