import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Named in one place so proxy.ts + claim-device + reset-device agree.
export const DEVICE_COOKIE = "skillies_device";

type Body = { deviceId?: string };

/**
 * Device-claim — currently a NO-OP (one-device-per-account enforcement
 * is disabled; see proxy.ts for the related stub).
 *
 * The endpoint still:
 *   - verifies the caller is signed in (cheap, server-side cookie read)
 *   - validates the deviceId shape (defends against junk client state)
 *   - sets the `skillies_device` cookie so the client side keeps the
 *     same persistent device id across sessions
 *
 * It does NOT:
 *   - write `bound_device_id` / `device_bound_at` in profiles
 *   - 403 on a device mismatch
 *
 * To re-enable enforcement, restore the admin-DB read + bound_device_id
 * comparison block from git history and uncomment the proxy.ts check.
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
  if (!/^[a-zA-Z0-9-]{20,60}$/.test(deviceId)) {
    return NextResponse.json({ error: "Invalid device id." }, { status: 400 });
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
