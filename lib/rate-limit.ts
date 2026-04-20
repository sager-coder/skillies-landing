/**
 * Dead-simple in-memory rate limiter — one Map per function instance.
 *
 * Not distributed: Vercel runs many function instances, so an attacker
 * could spread load across them. That's fine for the threat we actually
 * care about here (casual SMS-pumping scripts running a few r/s from a
 * single IP). If abuse scales up, swap this file out for Upstash/Vercel
 * KV — the export surface is intentionally tiny.
 */

type Entry = { count: number; resetAt: number };

const hits = new Map<string, Entry>();

// Occasionally sweep expired keys so a long-running instance doesn't
// accumulate millions of stale entries.
let lastSweep = 0;
function maybeSweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of hits) {
    if (v.resetAt < now) hits.delete(k);
  }
}

export function rateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): { ok: boolean; retryAfterSeconds: number; remaining: number } {
  const now = Date.now();
  maybeSweep(now);
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { ok: true, retryAfterSeconds: 0, remaining: max - 1 };
  }
  if (entry.count >= max) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      remaining: 0,
    };
  }
  entry.count++;
  return { ok: true, retryAfterSeconds: 0, remaining: max - entry.count };
}
