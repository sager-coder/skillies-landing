#!/usr/bin/env node
/**
 * scripts/lock-stream-videos.mjs
 *
 * Walks every video in our Cloudflare Stream account and flips
 *   requireSignedURLs : true
 *   allowedOrigins    : [...ALLOWED_ORIGINS]
 *
 * Once this runs successfully, the bare-UID iframe URL stops working
 * — every future playback must carry a freshly minted signed JWT from
 * /api/learn/stream-token. THIS IS THE STEP THAT TURNS THE HARDENING
 * ON IN PRODUCTION.
 *
 *   node scripts/lock-stream-videos.mjs           # run for real
 *   node scripts/lock-stream-videos.mjs --dry-run # list, don't write
 *
 * Idempotent — Cloudflare returns 200 on the POST even if the flags
 * are already in the requested state, so re-running is safe.
 *
 * Reads from .env.local:
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_API_TOKEN
 *
 * If you add a new video later, run this script again. We could also
 * set these flags at upload time in scripts/seed-kdp-course.mjs — TODO
 * if we ever automate course uploads beyond the initial KDP batch.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, "..", ".env.local");

// Minimal .env.local parser so we don't pull in dotenv just for this.
function loadEnv() {
  try {
    const raw = readFileSync(ENV_PATH, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      let v = m[2];
      // strip surrounding quotes if any
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!(m[1] in process.env)) process.env[m[1]] = v;
    }
  } catch {
    // .env.local not present — rely on process.env directly
  }
}
loadEnv();

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error(
    "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN. Set them in .env.local.",
  );
  process.exit(1);
}

// Origins the player iframe is allowed to load inside. Bare hostnames
// only — no protocol, no path. Add `localhost:3000` so local dev works
// without flipping the flags off. Add staging / preview domains as we
// stand them up.
const ALLOWED_ORIGINS = [
  "skillies.ai",
  "www.skillies.ai",
  "skillies-landing.vercel.app",
  "localhost:3000",
];

const DRY = process.argv.includes("--dry-run");

async function listAllVideos() {
  // Stream's list endpoint paginates by `start` (RFC3339 timestamp of
  // the last video's creation). Up to ~1000 returned per call. For
  // the volumes we deal with (single-digit dozens) a single call is
  // plenty, but the cursor logic is here for completeness.
  const out = [];
  let after = null;
  while (true) {
    const url = new URL(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`,
    );
    if (after) url.searchParams.set("start", after);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(
        `List failed: ${json.errors?.[0]?.message || res.status}`,
      );
    }
    const batch = json.result || [];
    out.push(...batch);
    if (batch.length < 1000) break;
    after = batch[batch.length - 1].created;
  }
  return out;
}

async function lockOne(uid, currentOrigins) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/${uid}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requireSignedURLs: true,
        // Merge: keep any origins the video already had (in case the
        // ops team added a custom one outside this script) and add
        // our standard list. Dedupe.
        allowedOrigins: Array.from(
          new Set([...(currentOrigins || []), ...ALLOWED_ORIGINS]),
        ),
      }),
    },
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) {
    throw new Error(
      `POST failed for ${uid}: ${json.errors?.[0]?.message || res.status}`,
    );
  }
}

async function main() {
  console.log(
    `Skillies · Stream lockdown ${DRY ? "(dry-run)" : "(WRITE MODE)"}`,
  );
  console.log("Origins:", ALLOWED_ORIGINS.join(", "));
  console.log("");

  const videos = await listAllVideos();
  console.log(`Found ${videos.length} videos.`);

  let touched = 0;
  let already = 0;
  for (const v of videos) {
    const uid = v.uid;
    const wasLocked = v.requireSignedURLs === true;
    const currentOrigins = v.allowedOrigins || [];
    const targetOrigins = Array.from(
      new Set([...currentOrigins, ...ALLOWED_ORIGINS]),
    );
    const originsAlreadyOk =
      targetOrigins.length === currentOrigins.length &&
      targetOrigins.every((o) => currentOrigins.includes(o));

    if (wasLocked && originsAlreadyOk) {
      already++;
      console.log(`  ✓ ${uid}  already locked (${v.meta?.name || "untitled"})`);
      continue;
    }

    if (DRY) {
      console.log(
        `  · ${uid}  WOULD update — signed=${wasLocked}→true, origins=${currentOrigins.length}→${targetOrigins.length}`,
      );
      continue;
    }

    try {
      await lockOne(uid, currentOrigins);
      touched++;
      console.log(`  ✓ ${uid}  locked (${v.meta?.name || "untitled"})`);
    } catch (err) {
      console.error(`  ✗ ${uid}  FAILED — ${err.message}`);
    }
  }

  console.log("");
  console.log(
    `Done. ${touched} updated · ${already} already locked · ${videos.length - touched - already} skipped / failed.`,
  );
  if (DRY) {
    console.log("Dry-run only — no changes written. Re-run without --dry-run.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
