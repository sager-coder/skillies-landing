/**
 * /api/dev/admin-login — DEV-ONLY admin bypass.
 *
 * Purpose: skip OTP entirely for a small allowlist of admin phones
 * during local development. The server uses the service-role key to
 * set a known password on the admin's auth user, then returns it so
 * the client can call signInWithPassword({phone, password}) and
 * complete the auth flow exactly like any other user.
 *
 * SAFETY:
 *   - Returns 404 in production builds (NODE_ENV !== "development").
 *     Even if the route is somehow reachable, the allowlist gate stops
 *     anyone outside the two admin phones from using it.
 *   - The "password" returned is a hardcoded dev string. It's set on
 *     real auth.users rows in production Supabase, so before deploying
 *     this branch to prod, rotate those passwords (or disable phone
 *     password sign-in for those users) — otherwise anyone who reads
 *     this source file can sign in as admin in prod.
 *
 *     Mitigations a future commit could add:
 *     - Use a per-request random password and only return it once.
 *     - Move the allowlist + password out to env vars.
 *     - Lock the entire route behind an env flag like DEV_ADMIN_LOGIN=1
 *       that's never set in prod.
 *
 *   - Allowlist is also enforced server-side so a malicious client
 *     can't substitute another phone.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ADMIN_PHONES = ["+919074244373", "+918714318352"];
const DEV_PASSWORD = "123123123";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  try {
    const body = (await req.json()) as { phone?: string };
    const phone = (body.phone || "").trim();
    if (!ADMIN_PHONES.includes(phone)) {
      return NextResponse.json(
        { error: "Phone not in admin allowlist." },
        { status: 403 },
      );
    }

    const admin = createSupabaseAdminClient();

    // Find the auth.users row matching this phone. Supabase stores
    // phone without the leading '+'; we strip it for the comparison
    // but auth.admin.updateUserById uses the internal id anyway.
    const stripPlus = phone.replace(/^\+/, "");
    let userId: string | null = null;
    let page = 1;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage: 1000,
      });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      const match = data.users.find((u) => u.phone === stripPlus);
      if (match) {
        userId = match.id;
        break;
      }
      if (data.users.length < 1000) break;
      page += 1;
    }
    if (!userId) {
      return NextResponse.json(
        { error: "Admin auth user not found." },
        { status: 404 },
      );
    }

    // Idempotent: set the password AND force-confirm the phone.
    // The pre-existing admin auth users were created without
    // phone_confirmed_at, so signInWithPassword would reject them
    // with "Phone not confirmed". Setting phone_confirm here is the
    // admin-API equivalent of a user completing the SMS OTP step.
    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
      password: DEV_PASSWORD,
      phone_confirm: true,
    });
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, password: DEV_PASSWORD });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed." },
      { status: 500 },
    );
  }
}
