#!/usr/bin/env node
/**
 * Diagnostic: send a phone OTP and verify it with 123456 using the
 * Supabase JS client directly. If the test-phone config is applied,
 * verify() will succeed. If not, we'll see exactly why.
 *
 * Run: node scripts/diagnose-otp.mjs +919074244373
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
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL || !ANON) {
  console.error("Missing Supabase URL or anon key in .env.local");
  process.exit(1);
}

const phone = process.argv[2] || "+919074244373";
const otp = process.argv[3] || "123456";

const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(URL, ANON, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log(`\n→ Send OTP to ${phone}`);
const send = await supabase.auth.signInWithOtp({ phone });
if (send.error) {
  console.error(`   ✗ signInWithOtp error: ${send.error.message}`);
  console.error(`     status: ${send.error.status}`);
  process.exit(1);
}
console.log(`   ✓ signInWithOtp ok`);

console.log(`\n→ Verify OTP ${otp} for ${phone}`);
const verify = await supabase.auth.verifyOtp({
  phone,
  token: otp,
  type: "sms",
});
if (verify.error) {
  console.error(`   ✗ verifyOtp error: ${verify.error.message}`);
  console.error(`     status: ${verify.error.status}`);
  console.error(`\nThis means the test-phone config isn't applied. Check`);
  console.error(`Supabase Dashboard → Authentication → Sign In / Providers →`);
  console.error(`Phone → "Test Phone Numbers and OTPs" field.`);
  console.error(`Expected format: 919074244373=123456 (no '+' prefix).`);
  process.exit(1);
}
console.log(`   ✓ verifyOtp ok`);
console.log(`   user.id = ${verify.data.user?.id}`);
console.log(`   session = ${verify.data.session ? "present" : "missing"}`);
console.log("\nTest-phone bypass is working.");
