#!/usr/bin/env node
/**
 * After upload-course.mjs completes, this script:
 *   1. Reads scripts/course-uploads.json (label → uid mapping)
 *   2. Cross-references scripts/course-files.json (label → day, title)
 *   3. Fetches Cloudflare Stream metadata for the first UID, extracts
 *      the customer-code subdomain, writes NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE
 *      into .env.local
 *   4. Upserts 7 rows into the public.lessons table on Supabase
 *
 * Idempotent on (course_id, day) — re-runs update existing rows.
 *
 * Run: node scripts/insert-lessons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Env loader
const envPath = path.join(projectRoot, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!ACCOUNT_ID || !CF_TOKEN || !SB_URL || !SR) {
  console.error("Missing one of CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const filesPath = path.join(__dirname, "course-files.json");
const uploadsPath = path.join(__dirname, "course-uploads.json");
if (!fs.existsSync(filesPath) || !fs.existsSync(uploadsPath)) {
  console.error("Missing course-files.json or course-uploads.json (run upload-course.mjs first).");
  process.exit(1);
}

const files = JSON.parse(fs.readFileSync(filesPath, "utf8"));
const uploads = JSON.parse(fs.readFileSync(uploadsPath, "utf8"));

// The running upload script (which we already started) writes UIDs
// with a "?tusv2=true" suffix from the upload URL. Strip any query
// string so the IDs match what Cloudflare's Stream API expects.
for (const v of Object.values(uploads)) {
  if (typeof v.uid === "string") v.uid = v.uid.split("?")[0];
}
fs.writeFileSync(uploadsPath, JSON.stringify(uploads, null, 2));

// 1. Customer code via Cloudflare API
//    GET /accounts/{ACCOUNT_ID}/stream/{UID} → result.playback.hls
//    looks like https://customer-XXXXXXXX.cloudflarestream.com/UID/manifest/video.m3u8
const firstUid = Object.values(uploads)[0]?.uid;
if (!firstUid) {
  console.error("No uploads found yet — run upload-course.mjs first.");
  process.exit(1);
}
const detailRes = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/${firstUid}`,
  { headers: { Authorization: `Bearer ${CF_TOKEN}` } },
);
const detailJson = await detailRes.json();
if (!detailJson.success) {
  console.error("Failed to read stream metadata:", detailJson);
  process.exit(1);
}
const hls = detailJson.result?.playback?.hls || "";
const customerMatch = hls.match(/https:\/\/(customer-[^.]+)\.cloudflarestream\.com/);
const customerCode = customerMatch ? customerMatch[1].replace(/^customer-/, "") : null;
if (!customerCode) {
  console.error("Couldn't extract customer code from playback URL:", hls);
  process.exit(1);
}
console.log(`Stream customer code: ${customerCode}`);

// Write to .env.local
let envContent = fs.readFileSync(envPath, "utf8");
if (envContent.includes("NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE=")) {
  envContent = envContent.replace(
    /^NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE=.*$/m,
    `NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE=${customerCode}`,
  );
} else {
  envContent = envContent.trimEnd() + `\nNEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE=${customerCode}\n`;
}
fs.writeFileSync(envPath, envContent);
console.log("Wrote NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE to .env.local");

// 2. Insert/upsert lessons via Supabase
const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(SB_URL, SR, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let inserted = 0;
let skipped = 0;
for (const f of files) {
  const up = uploads[f.label];
  if (!up?.uid) {
    console.log(`-- skip day ${f.day} (${f.title}): not uploaded yet`);
    skipped += 1;
    continue;
  }
  const { error } = await supabase
    .from("lessons")
    .upsert(
      {
        course_id: "kdp-mastery",
        day: f.day,
        title: f.title,
        video_id: up.uid,
        is_published: true,
      },
      { onConflict: "course_id,day" },
    );
  if (error) {
    console.error(`✗ day ${f.day}: ${error.message}`);
    continue;
  }
  console.log(`✓ day ${f.day}  "${f.title}"  uid=${up.uid}`);
  inserted += 1;
}

console.log(`\nDone. ${inserted} lessons upserted, ${skipped} skipped.`);
console.log(`Restart 'npm run dev' so NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE picks up.`);
