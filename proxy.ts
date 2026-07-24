import { auth } from "@/lib/auth/server";

// Only account management requires a session — the marketing site, docs,
// and dashboard stay public. Widen the matcher here as gated content ships.
export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  matcher: ["/account/:path*", "/onboarding/:path*"],
};
