/**
 * Lightweight password gate for prospect-specific demo URLs.
 *
 * Each prospect gets:
 *   - A slug (e.g. "venture-navigator")
 *   - A shared password set in env: DEMO_<SLUG>_PASSWORD (uppercased, dashes→underscores)
 *   - A cookie `demo_auth_<slug>` set after successful password entry,
 *     valid for 7 days.
 *
 * Token format: `<expiresAt>.<hmac>` where hmac is sha256 of `<slug>.<expiresAt>`
 * signed with DEMO_AUTH_SECRET. Tokens are tied to the slug · cookie set
 * for one prospect cannot be replayed against another.
 *
 * No database, no JWT lib. Runs anywhere Node crypto runs.
 */
import crypto from "node:crypto";

const COOKIE_NAME_PREFIX = "demo_auth_";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const s = process.env.DEMO_AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "DEMO_AUTH_SECRET not set (or too short). Generate with `openssl rand -hex 32` and add to Vercel env.",
    );
  }
  return s;
}

/**
 * Returns the configured password for a given prospect slug, or null if
 * no password is configured (which means the page should 404 rather than
 * accept anything).
 */
export function passwordForSlug(slug: string): string | null {
  const envKey = `DEMO_${slug.toUpperCase().replace(/-/g, "_")}_PASSWORD`;
  const value = process.env[envKey];
  if (!value || value.length < 4) return null;
  return value;
}

export function cookieNameFor(slug: string): string {
  return COOKIE_NAME_PREFIX + slug;
}

export function makeToken(slug: string): string {
  const expiresAt = Date.now() + TTL_MS;
  const payload = `${slug}.${expiresAt}`;
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${expiresAt}.${sig}`;
}

export function verifyToken(slug: string, token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expiresAtStr, sig] = parts;
  if (!expiresAtStr || !sig) return false;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt)) return false;
  if (Date.now() > expiresAt) return false;
  const payload = `${slug}.${expiresAt}`;
  let expected: string;
  try {
    expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");
  } catch {
    return false;
  }
  if (sig.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

export const DEMO_COOKIE_TTL_SECONDS = Math.floor(TTL_MS / 1000);
