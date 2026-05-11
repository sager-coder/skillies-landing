#!/usr/bin/env node
/**
 * One-shot: set a known password on the admin auth users so they can
 * sign in via the standard phone+password form. Idempotent — re-runs
 * just re-stamp the same password.
 *
 * Run: node scripts/set-admin-password.mjs
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

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SR) {
  console.error("Missing Supabase URL or service-role key in .env.local");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const admin = createClient(URL, SR, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ADMIN_PHONES = ["+919074244373", "+918714318352"];
const PASSWORD = "123123123";

// Build phone → user index once. Supabase stores phones without '+'.
const stripPlus = (p) => p.replace(/^\+/, "");
const userByPhone = new Map();
let page = 1;
while (true) {
  const { data, error } = await admin.auth.admin.listUsers({
    page,
    perPage: 1000,
  });
  if (error) throw error;
  for (const u of data.users) {
    if (u.phone) userByPhone.set(stripPlus(u.phone), u);
  }
  if (data.users.length < 1000) break;
  page += 1;
}
console.log(`(loaded ${userByPhone.size} auth users)`);

for (const phone of ADMIN_PHONES) {
  console.log(`→ ${phone}`);
  const user = userByPhone.get(stripPlus(phone));
  if (!user) {
    console.log(`   ✗ no auth.users row found — run scripts/make-admins.mjs first`);
    continue;
  }
  const { error } = await admin.auth.admin.updateUserById(user.id, {
    password: PASSWORD,
    phone_confirm: true,
  });
  if (error) {
    console.error(`   ✗ ${error.message}`);
    continue;
  }
  console.log(`   ✓ password set, phone_confirm=true (id=${user.id})`);
}

console.log(`\nDone. Sign in at /login with either admin phone + password "${PASSWORD}".`);
