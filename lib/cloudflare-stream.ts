/**
 * Cloudflare Stream — server-only signing + lockdown helpers.
 *
 * What this gives us
 * ──────────────────
 * 1. `getSignedStreamToken({ videoUid, ttlSeconds })`
 *    Mints a short-lived signed JWT for a single video via Cloudflare's
 *    POST /stream/{uid}/token endpoint. The endpoint does the RSA
 *    signing for us — no need to ship a private key. The returned token
 *    is what replaces `<videoUid>` in player URLs:
 *      https://customer-<code>.cloudflarestream.com/<token>/iframe
 *      https://customer-<code>.cloudflarestream.com/<token>/manifest/video.m3u8
 *
 * 2. `lockDownStreamVideo({ videoUid, allowedOrigins })`
 *    Flips `requireSignedURLs: true` and pins the embedding origins.
 *    Once flipped, the bare UID URL stops working — every playback
 *    request must carry a fresh signed token. This is the single most
 *    important call in the hardening pass; without it the signed-URL
 *    plumbing is theatre.
 *
 * Why the hosted token endpoint (not local RS256 signing)
 * ───────────────────────────────────────────────────────
 * Cloudflare's docs show two paths:
 *   (a) Generate a signing key once, store the RSA private PEM in env,
 *       sign tokens locally with `jose` / `jsonwebtoken`. Zero per-token
 *       network cost; needs a secret in our infra.
 *   (b) POST to /stream/{uid}/token with our API token. One HTTP hop
 *       per token; no extra secret to store.
 *
 * We picked (b). At our traffic (low double-digit concurrent students,
 * a token cached for 1h on the client) the round-trip is invisible, and
 * keeping the signing key inside Cloudflare reduces the blast radius if
 * our deploy env ever leaks. Migrate to (a) if we ever need >1k
 * tokens/min — see Cloudflare's "Generate signed URLs" doc.
 *
 * What the token payload encodes
 * ──────────────────────────────
 *   - `exp`: expiry (unix seconds). We default to 1h.
 *   - `downloadable: false`: even with a Stream "downloads" feature
 *     enabled later, this token won't unlock it.
 *   - `accessRules` (optional): allowlist countries or IP ranges. We
 *     don't use this today but the plumbing's in place if Ehsan ever
 *     wants to geo-lock leaks (e.g. allow IN only).
 *
 * DRM note
 * ────────
 * Cloudflare Stream ships HLS with AES-128 envelope encryption by
 * default — that already prevents the simple "grab the .m3u8 / .mp4
 * URL and curl it" attack once requireSignedURLs is on. Hardware DRM
 * (Widevine L1 / FairPlay / PlayReady) is a separate paid feature you
 * enable per video at upload time; once enabled, screen recording on
 * supported browsers gets blocked by the OS protected media path.
 * Talk to Cloudflare sales to flip it on, then re-upload videos with
 * `creator.options.drm = true`. The signed-token machinery here works
 * for both paths.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

function requireCloudflareEnv(): { accountId: string; apiToken: string } {
  if (!ACCOUNT_ID || !API_TOKEN) {
    throw new Error(
      "Cloudflare Stream env vars missing. Set CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN.",
    );
  }
  return { accountId: ACCOUNT_ID, apiToken: API_TOKEN };
}

/** Shape of one entry in Cloudflare's accessRules array. */
export type StreamAccessRule =
  | { type: "any"; action: "allow" | "block" }
  | {
      type: "ip.geoip.country";
      action: "allow" | "block";
      country: string[];
    }
  | { type: "ip.src"; action: "allow" | "block"; ip: string[] };

/**
 * Ask Cloudflare to mint a signed JWT for `videoUid`. Returns the raw
 * token string + the absolute expiry (ms epoch) so callers can schedule
 * refresh ahead of time.
 *
 * Token TTL defaults to 1 hour. Don't go longer — a leaked token in the
 * wrong hands is equivalent to a leaked playback URL until it expires.
 */
export async function getSignedStreamToken({
  videoUid,
  ttlSeconds = 3600,
  accessRules,
}: {
  videoUid: string;
  ttlSeconds?: number;
  accessRules?: StreamAccessRule[];
}): Promise<{ token: string; expiresAt: number }> {
  const { accountId, apiToken } = requireCloudflareEnv();

  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body: Record<string, unknown> = {
    exp,
    // Even if the video was uploaded with `requireSignedURLs: false`
    // and downloads enabled, this token won't unlock downloads.
    downloadable: false,
  };
  if (accessRules && accessRules.length > 0) {
    body.accessRules = accessRules;
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${encodeURIComponent(videoUid)}/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Don't let the runtime cache this — every token must be fresh
      // for its own `exp` so we can't have one student's token leak
      // out of the edge cache to a different request.
      cache: "no-store",
    },
  );

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    result?: { token?: string };
    errors?: Array<{ code?: number; message?: string }>;
  };

  if (!res.ok || !json.success || !json.result?.token) {
    const msg = json.errors?.[0]?.message || `HTTP ${res.status}`;
    throw new Error(`Cloudflare Stream token mint failed: ${msg}`);
  }

  return { token: json.result.token, expiresAt: exp * 1000 };
}

/**
 * Flip `requireSignedURLs: true` and pin `allowedOrigins` on a single
 * video. Idempotent — safe to call against an already-locked video.
 *
 * `allowedOrigins` is the production hardening: Cloudflare will refuse
 * to serve the player iframe to any other domain (no
 * https://attacker.example wrapping our content). Use bare hostnames,
 * no protocol, no path:
 *   ["skillies.ai", "www.skillies.ai", "localhost:3000"]
 */
export async function lockDownStreamVideo({
  videoUid,
  allowedOrigins,
}: {
  videoUid: string;
  allowedOrigins: string[];
}): Promise<void> {
  const { accountId, apiToken } = requireCloudflareEnv();

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${encodeURIComponent(videoUid)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requireSignedURLs: true,
        allowedOrigins,
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `Cloudflare Stream lockdown failed (${res.status}): ${txt.slice(0, 200)}`,
    );
  }
}

/**
 * Client-side helper for assembling the iframe URL once the route
 * handler has handed back a signed token. Lives here so the customer
 * code env var has exactly one read site.
 */
export function buildSignedIframeUrl(token: string): string {
  const code = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE;
  if (!code) {
    throw new Error(
      "NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE missing. Set it from the Cloudflare Stream → Settings → 'Customer Subdomain' value.",
    );
  }
  // Stream's signed-URL convention: the token literally replaces the
  // UID segment in the player path.
  return `https://customer-${code}.cloudflarestream.com/${token}/iframe?preload=metadata`;
}
