import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";

export type SessionUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
};

export type VisitorProfile = {
  id: string;
  userId: string;
  userRole: "parent" | "professional";
  displayName: string;
  bio?: string;
  status?: string;
};

/**
 * Enforces authentication. Redirects to /sign-in with a returnTo param when
 * the user is not signed in or their email is unverified.
 * Returns the session user — never null.
 */
export async function requireSession(returnTo?: string): Promise<SessionUser> {
  let session = null;
  try {
    const result = await auth.getSession();
    session = result?.data ?? null;
  } catch {
    // Auth service unreachable — treat as unauthenticated
  }

  if (!session?.user) {
    redirect(returnTo ? `/sign-in?returnTo=${encodeURIComponent(returnTo)}` : "/sign-in");
  }

  // Enforce email verification before access to gated features
  if (!(session.user as SessionUser).emailVerified) {
    redirect("/sign-in?error=unverified");
  }

  return session.user as SessionUser;
}

/**
 * Enforces authentication + a complete visitor profile. Redirects to /welcome
 * when the profile is missing, and to /sign-in?error=suspended when suspended.
 * Returns [user, profile] — never null.
 */
export async function requireProfile(
  returnTo?: string
): Promise<[SessionUser, VisitorProfile]> {
  const user = await requireSession(returnTo);
  const payload = await getPayloadClient();

  const { docs } = await payload.find({
    collection: "visitor-profiles",
    where: { userId: { equals: user.id } },
    limit: 1,
  });

  if (!docs[0]) {
    redirect("/welcome");
  }

  const profile = docs[0] as unknown as VisitorProfile;

  if (profile.status === "suspended") {
    redirect("/sign-in?error=suspended");
  }

  return [user, profile];
}
