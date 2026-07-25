import fs from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

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
  const session = data;

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
      { error: `Cannot approve a review with status "${review.status}"` },
      409,
    );
  }

  // --- Write MDX ---
  const mdxPath = path.join(process.cwd(), "content", "docs", `${review.topic}.mdx`);
  try {
    await fs.writeFile(mdxPath, review.generatedMdx, "utf-8");
  } catch (err) {
    return jsonResponse(
      {
        error: `Failed to write MDX: ${err instanceof Error ? err.message : String(err)}`,
      },
      500,
    );
  }

  // --- Write JSON ---
  const jsonPath = path.join(process.cwd(), "content", "data", `${review.topic}.json`);
  try {
    await fs.writeFile(jsonPath, `${review.generatedJson}\n`, "utf-8");
  } catch (err) {
    return jsonResponse(
      {
        error: `Failed to write JSON: ${err instanceof Error ? err.message : String(err)}`,
      },
      500,
    );
  }

  // --- Update database row ---
  const now = new Date();
  await db
    .update(pendingReviews)
    .set({
      status: "published",
      approvedAt: now,
      approvedBy: session.user.id,
      publishedAt: now,
    })
    .where(eq(pendingReviews.id, id));

  // --- Bust Next.js cache ---
  revalidatePath(`/docs/${review.topic}`);
  revalidatePath(`/dashboard/${review.topic}`);

  // --- Send confirmation email ---
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL ?? "robwashburn8@gmail.com";

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000";
      await resend.emails.send({
        from: "Research Bible <noreply@resend.dev>",
        to: notifyEmail,
        subject: `[Research Bible] ${review.topic.toUpperCase()} published`,
        html: `
          <p>The <strong>${review.topic}</strong> research bible update has been approved and published.</p>
          <p>
            <a href="${siteUrl}/docs/${review.topic}" style="
              display:inline-block;
              padding:10px 20px;
              background:#1B3A5C;
              color:#F5F3EC;
              border-radius:6px;
              text-decoration:none;
              font-weight:600;
            ">View Live Page</a>
          </p>
        `.trim(),
      });
    } catch {
      // Non-fatal
    }
  }

  return jsonResponse({ success: true, topic: review.topic, publishedAt: now }, 200);
}
