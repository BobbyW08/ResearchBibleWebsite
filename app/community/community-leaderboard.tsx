import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function CommunityLeaderboard({
  role,
  currentUserId,
}: {
  role: string;
  currentUserId: string;
}) {
  const top = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      level: profiles.level,
      totalPoints: profiles.totalPoints,
    })
    .from(profiles)
    .where(eq(profiles.userRole, role as "parent" | "professional"))
    .orderBy(desc(profiles.totalPoints))
    .limit(10);

  return (
    <div className="rounded-lg border border-border bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Leaderboard
      </p>
      {top.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">No participants yet.</p>
      )}
      <ol className="mt-3 flex flex-col gap-2">
        {top.map((member, i) => (
          <li
            key={member.id}
            className={`flex items-center justify-between gap-2 text-sm ${member.id === currentUserId ? "font-semibold text-foreground" : "text-muted-foreground"}`}
          >
            <span className="flex items-center gap-2">
              <span className="w-5 text-center font-mono text-xs">{i + 1}</span>
              <span className="truncate max-w-[130px]">
                {member.displayName || "Anonymous"}
              </span>
            </span>
            <span className="shrink-0 text-xs">Lv {member.level} · {member.totalPoints}pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
