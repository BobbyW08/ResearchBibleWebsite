import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { setAccountType } from "./actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { data } = await auth.getSession();
  if (!data?.session || !data.user) redirect("/auth/sign-in");
  const { user } = data;

  const existing = await db
    .select({ userId: profiles.userId })
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (existing.length > 0) redirect("/account");

  return (
    <main className="container flex grow flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium">One quick thing</CardTitle>
          <CardDescription>
            Which best describes you? This shapes what the dashboard shows you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form action={setAccountType} className="flex flex-col gap-3">
            <Button
              type="submit"
              name="accountType"
              value="parent"
              variant="outline"
              className="h-auto flex-col items-start gap-1 p-4 text-left"
            >
              <span className="font-medium">Parent</span>
              <span className="text-xs text-muted-foreground">
                {"I'm looking for guidance for my own kid."}
              </span>
            </Button>
            <Button
              type="submit"
              name="accountType"
              value="practitioner"
              variant="outline"
              className="h-auto flex-col items-start gap-1 p-4 text-left"
            >
              <span className="font-medium">Practitioner</span>
              <span className="text-xs text-muted-foreground">
                I work with families professionally.
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
