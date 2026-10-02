"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function HeaderAuthButton() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return null;

  if (!session?.user) {
    return (
      <Link
        href="/sign-in"
        className="hidden lg:inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition"
      >
        Sign in
      </Link>
    );
  }

  const initial = (session.user.name ?? session.user.email ?? "?")[0].toUpperCase();

  return (
    <div className="hidden lg:flex items-center gap-3">
      <Link
        href="/account"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initial}
        </span>
        Account
      </Link>
      <button
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
        }}
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
      >
        Sign out
      </button>
    </div>
  );
}
