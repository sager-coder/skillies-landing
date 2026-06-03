#!/usr/bin/env node
/**
 * One-time bootstrap: create (or reset) the founder's admin login for
 * the secret /ehsan dashboard — username + password.
 *
 * EDIT the three constants below, then run:
 *   node scripts/set-ehsan-login.mjs
 *
 * Idempotent: re-running just resets the password. After this, you log
 * in at /ehsan and can add employees from there (no script needed).
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from
 * .env.local (project root).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ─── Founder admin login (preset — just run the script once) ──────────
// You can change the password later from Supabase, or re-run this.
const USERNAME = "Ehsan";       // login username (case-insensitive)
const PASSWORD = "123123123";   // login password
const FULL_NAME = "Ehsan";      // shown in the dashboard
// ─────────────────────────────────────────────────────────────────────

// Must match lib/staff-auth.ts
const STAFF_EMAIL_DOMAIN = "staff.skillies.ai";
const normalizeUsername = (u) =>
  (u || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
const username = normalizeUsername(USERNAME);
const email = `${username}@${STAFF_EMAIL_DOMAIN}`;

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
if (PASSWORD === "change-this-now" || PASSWORD.length < 6) {
  console.error("Set a real PASSWORD (min 6 chars) at the top of this script first.");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const admin = createClient(URL, SR, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log(`→ Setting up admin login: username "${username}" (${email})`);

// Try to create; if the account already exists, find it and reset password.
let userId;
const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email,
  password: PASSWORD,
  email_confirm: true,
});
if (created?.user) {
  userId = created.user.id;
  console.log("   ✓ created new auth user");
} else {
  console.log(`   (create failed: ${createErr?.message}) — looking up existing…`);
  let page = 1;
  while (!userId) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find((u) => u.email === email);
    if (found) {
      userId = found.id;
      const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
        password: PASSWORD,
        email_confirm: true,
      });
      if (updErr) throw updErr;
      console.log("   ✓ reset password on existing user");
      break;
    }
    if (data.users.length < 1000) break;
    page += 1;
  }
}
if (!userId) {
  console.error("   ✗ could not create or find the user.");
  process.exit(1);
}

const { error: upErr } = await admin.from("profiles").upsert(
  { id: userId, is_admin: true, username, full_name: FULL_NAME },
  { onConflict: "id" },
);
if (upErr) throw upErr;

console.log("   ✓ profile flagged is_admin + username set");
console.log("");
console.log("Done! Log in at /ehsan with:");
console.log(`   username: ${username}`);
console.log(`   password: (the one you set)`);
