import { NextRequest, NextResponse } from "next/server";

// Edge-compatible middleware. Full session validation happens server-side on
// the protected pages; this gates unauthenticated requests before they reach
// the React tree. Neon Auth sets __Secure-neon-auth.session_token in
// production (HTTPS) and neon-auth.session_token in local dev (HTTP).
const SESSION_COOKIES = [
  "__Secure-neon-auth.session_token",
  "neon-auth.session_token",
];

export default function middleware(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) =>
    request.cookies.has(name)
  );

  if (!hasSession) {
    const url = request.nextUrl.clone();
    const returnTo = encodeURIComponent(request.nextUrl.pathname);
    url.pathname = "/sign-in";
    url.search = `?returnTo=${returnTo}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/community/:path*", "/courses/:path*"],
};
