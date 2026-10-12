/**
 * Simple in-memory rate limiter using a sliding window.
 * Resets on server restart; sufficient for single-instance deploys.
 * For multi-instance or persistent limits, replace with Redis (BLOCKED-ON-BOBBY: Redis dependency approval).
 */

type WindowEntry = { count: number; resetAt: number };

const windows = new Map<string, WindowEntry>();

// Prune stale entries periodically to prevent memory growth
let lastPruneAt = Date.now();
function pruneIfNeeded() {
  const now = Date.now();
  if (now - lastPruneAt < 60_000) return;
  lastPruneAt = now;
  for (const [key, entry] of windows.entries()) {
    if (entry.resetAt < now) windows.delete(key);
  }
}

export type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number };

/**
 * @param key      Unique identifier (e.g. userId or IP)
 * @param max      Maximum requests per window
 * @param windowMs Window size in milliseconds
 */
export function checkRateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  pruneIfNeeded();
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || entry.resetAt < now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}
