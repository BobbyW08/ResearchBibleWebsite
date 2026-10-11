"use client";

import type { ReactNode } from "react";

// NeonAuthUIProvider is wired here when visitor auth is configured.
// Auth is not required for launch — this is a passthrough until
// NEON_AUTH_BASE_URL is set and the sign-in flow is tested end-to-end.
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
