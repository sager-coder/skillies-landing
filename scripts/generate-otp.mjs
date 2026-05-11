#!/usr/bin/env node
/**
 * Dev-only OTP generator. Bypasses the SMS provider entirely for
 * testing — uses Supabase admin.generateLink to mint a phone OTP and
 * prints the 6-digit code to the terminal.
 *
 * Use exactly the same way as a real OTP: paste it into /login/verify.
 *
 * Run: node scripts/generate-otp.mjs +91XXXXXXXXXX
 *
 * Production guard: this script only loads when run from the CLI; it
 * doesn't ship in the build. The 6-digit code is still single-use and
 * short-lived (~ 1 hour per Supabase Auth defaults), so worst-case is
 * the same as any other OTP leak.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SR) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const phone = process.argv[2];
if (!phone || !/^\+\d{8,15}$/.test(phone)) {
  console.error("Usage: node scripts/generate-otp.mjs +91XXXXXXXXXX");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const admin = createClient(URL, SR, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// generateLink with type 'sms' returns an OTP token plus the actual
// 6-digit code (Supabase Auth exposes it as `email_otp` or `otp`
// depending on version). We extract whichever field is populated.
const { data, error } = await admin.auth.admin.generateLink({
  type: "sms",
  phone,
});
if (error) {
  console.error(`generateLink failed: ${error.message}`);
  process.exit(1);
}

// The 6-digit OTP comes back via different keys across versions.
// Inspect the response and pick the first string field that looks like
// a 6-digit numeric token. As a fallback, print the entire payload so
// the operator can extract whatever Supabase returned.
const payload = data?.properties || data || {};
const otp =
  payload.otp ||
  payload.email_otp ||
  payload.token ||
  payload.email_otp_token ||
  null;

console.log(`\n→ Phone: ${phone}`);
console.log(`→ User ID: ${data?.user?.id || "?"}`);
console.log("");
if (otp && /^\d{6}$/.test(otp)) {
  console.log(`  6-digit OTP:  ${otp}`);
} else {
  console.log("  Could not find a clean 6-digit OTP in the response.");
  console.log("  Raw response (look for a numeric 6-digit string):");
  console.log("  " + JSON.stringify(data, null, 2).split("\n").join("\n  "));
}
console.log("");
console.log("Enter it at: http://localhost:3001/login/verify?phone=" +
  encodeURIComponent(phone) + "&next=/admin");
