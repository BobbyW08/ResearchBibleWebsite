import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getPayloadClient } from "@/lib/payload-client";
import Header from "@/components/marketing/header";
import Footer from "@/components/marketing/footer";
import RoleSelector from "./role-selector";

export const metadata: Metadata = {
  title: "Welcome",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  let session = null;
  try {
    const result = await auth.getSession();
    session = result.data;
  } catch {
    redirect("/sign-in");
  }

  if (!session?.user) {
    redirect("/sign-in");
  }

  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "visitor-profiles",
      where: { userId: { equals: session.user.id } },
      limit: 1,
    });
    if (docs.length > 0) redirect("/community");
  } catch {
    // Payload not yet available — treat as no profile
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
