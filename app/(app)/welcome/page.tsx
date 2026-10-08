import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import RoleSelector from "./role-selector";

export const metadata: Metadata = {
  title: "Welcome",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const existing = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    redirect("/community");
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">
          <h1 className="font-heading text-3xl font-medium tracking-tight">
            I&apos;m here as...
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            This helps us show you the right content and community.
          </p>
          <RoleSelector />
        </div>
      </main>
      <Footer />
    </div>
  );
}
