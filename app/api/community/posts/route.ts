import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles, posts } from "@/lib/db/schema";
import { desc, eq, or } from "drizzle-orm";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const feed = await db
    .select()
    .from(posts)
    .where(or(eq(posts.audience, profile.userRole), eq(posts.audience, "all" as never)))
    .orderBy(desc(posts.createdAt))
    .limit(30);

  return NextResponse.json(feed);
}

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  const rawAudience = body?.audience;
  const audience =
    rawAudience === "parent" || rawAudience === "professional" ? rawAudience : "all";

  if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });
  if (content.length > 2000) return NextResponse.json({ error: "Content too long" }, { status: 400 });

  const [post] = await db
    .insert(posts)
    .values({ authorId: profile.id, content, audience })
    .returning();

  return NextResponse.json(post, { status: 201 });
}
