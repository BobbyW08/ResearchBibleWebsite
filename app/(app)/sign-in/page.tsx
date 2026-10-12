import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthView } from "@neondatabase/auth-ui";
import { auth } from "@/lib/auth/server";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;

  let session = null;
  try {
    const result = await auth.getSession();
    session = result.data;
  } catch {
    // auth not configured — render sign-in UI anyway
  }

  if (session?.user) {
    // Only allow internal paths to prevent open redirect attacks.
    // A valid returnTo starts with "/" and never with "//" (which browsers treat as protocol-relative).
    const safe =
      typeof returnTo === "string" &&
      returnTo.startsWith("/") &&
      !returnTo.startsWith("//")
        ? returnTo
        : "/community";
    redirect(safe);
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <AuthView path="sign-in" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
