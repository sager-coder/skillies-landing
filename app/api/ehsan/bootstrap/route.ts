/**
 * /api/ehsan/bootstrap — one-time founder-login setup (no terminal needed).
 *
 * Runs on Vercel where the real SUPABASE_SERVICE_ROLE_KEY exists, so it can
 * create the admin account that the local script couldn't. Visit once:
 *
 *   https://<your-site>/api/ehsan/bootstrap?token=skillies-ehsan-setup-2k9x7q
 *
 * Guarded by a token, refuses once the admin already exists (so it can't be
 * used to reset a live admin's password), and checks the migration ran first.
 * Safe to delete this file after setup.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { usernameToEmail } from "@/lib/staff-auth";

export const runtime = "nodejs";

const SETUP_TOKEN = "skillies-ehsan-setup-2k9x7q";
const USERNAME = "ehsan";
const PASSWORD = "123123123";
const FULL_NAME = "Ehsan";

function page(message: string, ok: boolean) {
  return new NextResponse(
    `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Setup</title></head>` +
      `<body style="font-family:system-ui,-apple-system,sans-serif;background:#0A0A0A;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px">` +
      `<div style="max-width:440px"><div style="font-size:44px;margin-bottom:12px">${ok ? "✅" : "⚠️"}</div>` +
      `<p style="font-size:16px;line-height:1.65;color:#e5e5e5">${message}</p>` +
      (ok ? `<a href="/ehsan" style="display:inline-block;margin-top:18px;background:#C62828;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">Go to /ehsan →</a>` : "") +
      `</div></body></html>`,
    { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("token") !== SETUP_TOKEN) {
    return new NextResponse("Not found", { status: 404 });
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>;
  try {
    admin = createSupabaseAdminClient();
  } catch {
    return page("Server isn't configured — the service-role key is missing in Vercel.", false);
  }

  // 1) Migration must have run (username column present).
  const colCheck = await admin.from("profiles").select("username").limit(1);
  if (colCheck.error) {
    return page(
      "Run <b>supabase/schema.sql</b> in the Supabase SQL Editor first, then reload this page.",
      false,
    );
  }

  // 2) Already set up? Don't reset an existing admin's password.
  const { data: existing } = await admin
    .from("profiles")
    .select("id, is_admin")
    .eq("username", USERNAME)
    .maybeSingle();
  if (existing?.is_admin) {
    return page("Admin login already exists. Sign in at /ehsan with username <b>Ehsan</b>.", true);
  }

  // 3) Create the auth user (or recover one created by a prior partial run).
  const email = usernameToEmail(USERNAME);
  let userId = existing?.id;
  if (!userId) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
    });
    if (created?.user) {
      userId = created.user.id;
    } else {
      // Email may already exist from an earlier attempt — find + reset it.
      let pageNum = 1;
      while (!userId) {
        const { data, error: listErr } = await admin.auth.admin.listUsers({ page: pageNum, perPage: 1000 });
        if (listErr) return page(`Couldn't create the login: ${error?.message || listErr.message}`, false);
        const found = data.users.find((u) => u.email === email);
        if (found) {
          userId = found.id;
          await admin.auth.admin.updateUserById(userId, { password: PASSWORD, email_confirm: true });
          break;
        }
        if (data.users.length < 1000) break;
        pageNum += 1;
      }
      if (!userId) return page(`Couldn't create the login: ${error?.message || "unknown error"}`, false);
    }
  }

  // 4) Flag the profile as admin with the username.
  const { error: upErr } = await admin.from("profiles").upsert(
    { id: userId, is_admin: true, username: USERNAME, full_name: FULL_NAME },
    { onConflict: "id" },
  );
  if (upErr) return page(`Couldn't finish setup: ${upErr.message}`, false);

  return page(
    "Admin login created! Sign in at /ehsan with username <b>Ehsan</b> and password <b>123123123</b>.",
    true,
  );
}
