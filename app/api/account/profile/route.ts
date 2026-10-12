import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";

export async function PATCH(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : null;
  const bio = typeof body?.bio === "string" ? body.bio.trim() : null;

  if (!displayName) return NextResponse.json({ error: "Display name is required" }, { status: 400 });
  if (displayName.length > 80) return NextResponse.json({ error: "Display name too long" }, { status: 400 });
  if (bio !== null && bio.length > 400) return NextResponse.json({ error: "Bio too long" }, { status: 400 });

  const payload = await getPayloadClient();

  const { docs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: session.user.id } },
    limit: 1,
  });

  if (!docs[0]) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  await payload.update({
    collection: "visitor-profiles",
    id: docs[0].id as string,
    data: { displayName, bio: bio ?? "" },
  });

  return NextResponse.json({ ok: true });
}
