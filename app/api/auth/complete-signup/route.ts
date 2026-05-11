/**
 * /api/auth/complete-signup
 *
 * Called by the signup flow IMMEDIATELY after the new user has a valid
 * session (real OTP or dev bypass). Writes first_name / last_name /
 * full_name / email into their profile row using the service-role so
 * RLS can't drop the update and a fresh-session cookie race can't
 * silently fail it.
 *
 * Auth model:
 *   - Caller must already be signed in (we verify via the server-side
 *     Supabase client which reads the session cookie).
 *   - Service-role is then used to write — bypassing RLS — but only to
 *     the profile row that matches the caller's user.id. So a malicious
 *     client can't overwrite someone else's profile.
 */
import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

const NAME_MAX = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not signed in." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as Body;
    const first = (body.first_name || "").trim().slice(0, NAME_MAX);
    const last = (body.last_name || "").trim().slice(0, NAME_MAX);
    const email = (body.email || "").trim();

    if (!first) {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 },
      );
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 },
      );
    }

    // Service-role: bypass RLS, but scope to this user's id only.
    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("profiles")
      .update({
        first_name: first,
        last_name: last || null,
        full_name: [first, last].filter(Boolean).join(" "),
        email,
      })
      .eq("id", user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed." },
      { status: 500 },
    );
  }
}
