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
  const { data: session } = await auth.getSession();
  const { returnTo } = await searchParams;

  if (session?.user) {
    redirect(returnTo ?? "/community");
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
