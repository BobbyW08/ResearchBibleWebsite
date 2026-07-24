"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth/client";

// Social login / organizations are intentionally not enabled here — the
// bundled better-auth version behind @neondatabase/auth currently carries
// known CVEs specific to OAuth/OIDC flows. Email/password only until a
// patched release lands. See CLAUDE.md "Auth & Data Layer" for the tracking
// note.
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      redirectTo="/onboarding"
      defaultTheme="dark"
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
