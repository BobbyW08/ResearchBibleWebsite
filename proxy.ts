import { NextRequest, NextResponse } from "next/server";

// Edge-compatible middleware (Next.js 16 uses proxy.ts, not middleware.ts).
// Full session validation happens server-side on the protected pages; this
// just gates unauthenticated requests before they reach the React tree.
// Better Auth's default cookie names — both HTTP and Secure variants.
const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export default function middleware(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) =>
    request.cookies.has(name)
  );

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/onboarding/:path*"],
};
