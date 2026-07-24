"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export async function setAccountType(formData: FormData) {
  const { data } = await auth.getSession();
  if (!data?.session || !data.user) redirect("/auth/sign-in");
  const { user } = data;

  const accountType = formData.get("accountType");
  if (accountType !== "parent" && accountType !== "practitioner") {
    throw new Error("Select an account type.");
  }

  await db
    .insert(profiles)
    .values({ userId: user.id, accountType })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: { accountType },
    });

  redirect("/account");
}
