#!/usr/bin/env node
/**
 * One-shot bootstrap: grant is_admin=true to a fixed set of phone
 * numbers. Idempotent — re-runs are no-ops.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from
 * .env.local (project root). For each target phone:
 *   1. Look up the profile by phone.
 *   2. If none, create the auth user (phone_confirm: true) so the
 *      account exists and can sign in via OTP without a pre-existing
 *      session.
 *   3. UPDATE profiles SET is_admin = true for that user.
 *
 * Run: node scripts/make-admins.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Tiny .env.local loader (the project already does this via Next.js
// at runtime; we just need it for this CLI script).
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

const { createClient } = await import("@supabase/supabase-js");
const admin = createClient(URL, SR, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const PHONES = ["+919074244373", "+918714318352"];

/**
 * Supabase auth.admin has no direct "find user by phone" API. listUsers()
 * is paginated; fetch all pages once and build a phone → user map.
 * Phones in auth.users are stored without the leading '+', so normalize.
 */
const stripPlus = (p) => p.replace(/^\+/, "");
async function buildPhoneIndex() {
  const map = new Map();
  let page = 1;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;
    for (const u of data.users) {
      if (u.phone) map.set(stripPlus(u.phone), u);
    }
    if (data.users.length < 1000) break;
    page += 1;
  }
  return map;
}

const phoneIndex = await buildPhoneIndex();
console.log(`(loaded ${phoneIndex.size} auth users)`);

for (const phone of PHONES) {
  console.log(`→ ${phone}`);
  // 1. profile lookup by phone
  let { data: profile } = await admin
    .from("profiles")
    .select("id, is_admin")
    .eq("phone", phone)
    .maybeSingle();

  // 2. if no profile, find the matching auth user (by phone, since auth
  //    user exists per the earlier "already registered" error) and
  //    insert a profile row with is_admin = true.
  if (!profile) {
    const authUser = phoneIndex.get(stripPlus(phone));
    if (!authUser) {
      // Truly nothing — create the auth user, then the profile.
      const { data: created, error: createErr } =
        await admin.auth.admin.createUser({ phone, phone_confirm: true });
      if (createErr) {
        console.error(`   ✗ createUser failed: ${createErr.message}`);
        continue;
      }
      console.log(`   + created auth.users row (id=${created.user.id})`);
      const { data: inserted, error: insErr } = await admin
        .from("profiles")
        .upsert(
          { id: created.user.id, phone, is_admin: true },
          { onConflict: "id" },
        )
        .select()
        .single();
      if (insErr) {
        console.error(`   ✗ profile upsert failed: ${insErr.message}`);
        continue;
      }
      profile = inserted;
      console.log(`   + upserted profile (id=${profile.id})`);
    } else {
      console.log(`   = auth user exists (id=${authUser.id}); upserting profile`);
      const { data: inserted, error: insErr } = await admin
        .from("profiles")
        .upsert(
          { id: authUser.id, phone, is_admin: true },
          { onConflict: "id" },
        )
        .select()
        .single();
      if (insErr) {
        console.error(`   ✗ profile upsert failed: ${insErr.message}`);
        continue;
      }
      profile = inserted;
      console.log(`   + upserted profile (id=${profile.id}, is_admin=${profile.is_admin})`);
    }
  } else {
    console.log(`   = profile already exists (id=${profile.id}, is_admin=${profile.is_admin})`);
  }

  // 3. ensure is_admin = true
  if (!profile.is_admin) {
    const { error: updErr } = await admin
      .from("profiles")
      .update({ is_admin: true })
      .eq("id", profile.id);
    if (updErr) {
      console.error(`   ✗ is_admin update failed: ${updErr.message}`);
      continue;
    }
    console.log(`   ↑ is_admin → true`);
  } else {
    console.log(`   ✓ is_admin already true — nothing to do`);
  }
}

console.log("Done.");
