import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

// Named in one place so proxy.ts + claim-device + reset-device agree.
export const DEVICE_COOKIE = "skillies_device";

type Body = { deviceId?: string };

/**
 * Claim-or-match the current user's device.
 *
 * Called once from /login/verify after a successful OTP. The client
 * generates (or re-reads from localStorage) a UUID, posts it here, and:
 *
 *   - If the profile has no bound device yet → we stamp this one on it
 *     (first login, first device is the bound one, forever).
 *   - If the profile's bound device === this one → nothing changes in
 *     the DB, we just (re)issue the httpOnly cookie so the proxy can
 *     verify on every later request.
 *   - If they differ → 403 locked. The client then signs out so the
 *     attacker/second-device session doesn't stay alive.
 *
 * Admins can clear `bound_device_id` via /api/admin/reset-device to
 * give a student a legitimate second chance (new phone, lost device).
 */
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const deviceId = (body.deviceId || "").trim();
  // crypto.randomUUID() is 36 chars with dashes; allow 20–60 so we aren't
  // brittle to a slightly different generator later.
  if (!/^[a-zA-Z0-9-]{20,60}$/.test(deviceId)) {
    return NextResponse.json({ error: "Invalid device id." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("bound_device_id, is_admin")
    .eq("id", user.id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Admins are exempt — they can log in from any device without stamping
  // a binding. We still issue the cookie so the browser has one, but we
  // don't write `bound_device_id`, so the proxy never locks them out.
  if (!profile?.is_admin) {
    if (!profile?.bound_device_id) {
      const { error: updErr } = await admin
        .from("profiles")
        .update({
          bound_device_id: deviceId,
          device_bound_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (updErr) {
        return NextResponse.json({ error: updErr.message }, { status: 500 });
      }
    } else if (profile.bound_device_id !== deviceId) {
      return NextResponse.json(
        {
          error: "locked",
          message:
            "This account is locked to another device. WhatsApp Ehsan if you genuinely need a reset.",
        },
        { status: 403 },
      );
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEVICE_COOKIE, deviceId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180, // 180 days
  });
  return res;
}
