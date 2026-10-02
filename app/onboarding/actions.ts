"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { profilesV1 } from "@/lib/db/schema";

export async function setAccountType(formData: FormData) {
  const { data } = await auth.getSession();
  if (!data?.session || !data.user) redirect("/auth/sign-in");
  const { user } = data;

  const accountType = formData.get("accountType");
  if (accountType !== "parent" && accountType !== "practitioner") {
    throw new Error("Select an account type.");
  }

  await db
    .insert(profilesV1)
    .values({ userId: user.id, accountType })
    .onConflictDoUpdate({
      target: profilesV1.userId,
      set: { accountType },
    });

  redirect("/account");
}
