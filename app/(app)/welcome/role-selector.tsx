"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelector() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function selectRole(role: "parent" | "professional") {
    setLoading(role);
    setError(null);
    try {
      const res = await fetch("/api/auth/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError((json as { error?: string }).error ?? "Something went wrong.");
        setLoading(null);
        return;
      }
      router.push("/community");
    } catch {
      setError("Something went wrong.");
      setLoading(null);
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
      <button
        onClick={() => selectRole("parent")}
        disabled={loading !== null}
        className="flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-background p-8 text-left transition hover:border-primary hover:bg-primary/5 disabled:opacity-60 sm:w-56"
      >
        <span className="font-heading text-xl font-semibold text-foreground">A Parent</span>
        <span className="text-sm text-muted-foreground">
          Looking for peer support, parenting resources, and community.
        </span>
        {loading === "parent" && (
          <span className="text-xs text-primary">Setting up your account...</span>
        )}
      </button>
      <button
        onClick={() => selectRole("professional")}
        disabled={loading !== null}
        className="flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-background p-8 text-left transition hover:border-primary hover:bg-primary/5 disabled:opacity-60 sm:w-56"
      >
        <span className="font-heading text-xl font-semibold text-foreground">A Professional</span>
        <span className="text-sm text-muted-foreground">
          A clinician, researcher, case manager, or practitioner.
        </span>
        {loading === "professional" && (
          <span className="text-xs text-primary">Setting up your account...</span>
        )}
      </button>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
