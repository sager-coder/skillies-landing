import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = { phone?: string };

/**
 * Admin-only: clear a student's bound device. The next time they sign
 * in on *any* device, that device becomes the new bound one. Use when
 * a student lost their phone, switched to a new one, or has a real
 * reason to move.
 */
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { data: caller } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!caller?.is_admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const raw = (body.phone || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) {
    return NextResponse.json({ error: "Valid phone required." }, { status: 400 });
  }
  const e164 = digits.startsWith("91") ? `+${digits}` : `+91${digits}`;

  const admin = createSupabaseAdminClient();
  const { data: target } = await admin
    .from("profiles")
    .select("id, full_name")
    .eq("phone", e164)
    .maybeSingle();
  if (!target) {
    return NextResponse.json(
      { error: `No student found with phone ${e164}.` },
      { status: 404 },
    );
  }

  const { error: updErr } = await admin
    .from("profiles")
    .update({ bound_device_id: null, device_bound_at: null })
    .eq("id", target.id);
  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    phone: e164,
    name: target.full_name || null,
  });
}
