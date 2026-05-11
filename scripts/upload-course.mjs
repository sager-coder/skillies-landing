#!/usr/bin/env node
/**
 * Upload course videos to Cloudflare Stream via TUS (resumable upload).
 *
 * - Reads CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN from .env.local
 * - Uploads each file in scripts/course-files.json sequentially
 * - Captures the Stream UID returned by Cloudflare
 * - Writes results to scripts/course-uploads.json so we can resume on
 *   crash and so the lesson-inserter script can pick up the UIDs
 *
 * Run:  node scripts/upload-course.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Lazy .env.local loader
const envPath = path.join(projectRoot, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
if (!ACCOUNT_ID || !API_TOKEN) {
  console.error("Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in .env.local");
  process.exit(1);
}

const inputPath = path.join(__dirname, "course-files.json");
const outputPath = path.join(__dirname, "course-uploads.json");
if (!fs.existsSync(inputPath)) {
  console.error(`Missing input list: ${inputPath}`);
  process.exit(1);
}

const FILES = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const existing = fs.existsSync(outputPath)
  ? JSON.parse(fs.readFileSync(outputPath, "utf8"))
  : {};

const { Upload } = await import("tus-js-client");

const endpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`;

/** Format bytes → human */
const fmt = (b) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

for (const item of FILES) {
  const { localPath, label } = item;
  if (existing[label]?.uid) {
    console.log(`✓ ${label}  already uploaded (uid=${existing[label].uid})`);
    continue;
  }
  if (!fs.existsSync(localPath)) {
    console.error(`✗ ${label}  missing file: ${localPath}`);
    continue;
  }
  const size = fs.statSync(localPath).size;
  console.log(`\n→ ${label}  ${fmt(size)}  (${path.basename(localPath)})`);

  const uid = await new Promise((resolve, reject) => {
    let lastLogged = 0;
    const stream = fs.createReadStream(localPath);
    const upload = new Upload(stream, {
      endpoint,
      retryDelays: [0, 2000, 5000, 10_000, 30_000],
      chunkSize: 50 * 1024 * 1024, // 50 MiB per chunk
      uploadSize: size,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      metadata: {
        name: label,
        filename: path.basename(localPath),
        filetype: "video/mp4",
      },
      onError: (err) => reject(err),
      onProgress: (bytes, total) => {
        const pct = total > 0 ? (bytes / total) * 100 : 0;
        // Log every ~5% to keep the output clean
        if (pct - lastLogged >= 5 || pct === 100) {
          lastLogged = pct;
          process.stdout.write(`   ${pct.toFixed(0)}%  (${fmt(bytes)} / ${fmt(total)})\n`);
        }
      },
      onSuccess: () => {
        // Cloudflare returns the new media id in stream-media-id header
        // (lower-cased here because the lib exposes it that way). Fall
        // back to parsing the upload URL, stripping any query string —
        // CF appends ?tusv2=true to the URL which is NOT part of the
        // UID.
        const headers = upload._currentSubChunk?.responseHeaders || {};
        const raw =
          headers["stream-media-id"] ||
          (upload.url || "").split("/").pop() ||
          "";
        const id = raw.split("?")[0] || null;
        resolve(id);
      },
    });
    upload.start();
  }).catch((err) => {
    console.error(`✗ ${label}  upload failed: ${err.message || err}`);
    return null;
  });

  if (uid) {
    existing[label] = { uid, size, localPath };
    fs.writeFileSync(outputPath, JSON.stringify(existing, null, 2));
    console.log(`✓ ${label}  uid=${uid}`);
  }
}

console.log("\nDone. UIDs written to scripts/course-uploads.json");
