"use client";

import { useRouter } from "next/navigation";
import { createAuthClient } from "@neondatabase/auth";

const authClient = createAuthClient(process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL!);
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
