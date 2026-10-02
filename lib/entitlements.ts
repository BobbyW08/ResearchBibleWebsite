import { db } from "@/lib/db";
import { entitlements } from "@/lib/db/schema";
import { and, eq, or, isNull, gt } from "drizzle-orm";

export async function userHasEntitlement(
  userId: string,
  productId: string
): Promise<boolean> {
  const rows = await db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userId, userId),
        eq(entitlements.productId, productId),
        or(
          isNull(entitlements.expiresAt),
          gt(entitlements.expiresAt, new Date())
        )
      )
    )
    .limit(1);
  return rows.length > 0;
}
