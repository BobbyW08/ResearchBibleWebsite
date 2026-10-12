import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  const profile = profileDocs[0] ?? null;
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { docs: feed } = await payload.find({
    collection: "posts",
    where: {
      or: [
        { audience: { equals: profile.userRole } },
        { audience: { equals: "all" } },
      ],
    },
    sort: "-createdAt",
    limit: 30,
  });

  return NextResponse.json(feed);
}

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await getPayloadClient();

  const { docs: profileDocs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });
  const profile = profileDocs[0] ?? null;
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  const rawAudience = body?.audience;
  const audience =
    rawAudience === "parent" || rawAudience === "professional" ? rawAudience : "all";

  if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });
  if (content.length > 2000) return NextResponse.json({ error: "Content too long" }, { status: 400 });

  const post = await payload.create({
    collection: "posts",
    data: { author: profile.id as string, content, audience },
  });

  return NextResponse.json(post, { status: 201 });
}
