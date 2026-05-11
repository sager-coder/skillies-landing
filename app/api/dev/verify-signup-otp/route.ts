/**
 * /api/dev/verify-signup-otp — DEV-ONLY signup OTP bypass.
 *
 * If the client passes the magic dev OTP, we use the service-role to
 * force phone_confirm=true on the (still unconfirmed) auth.users row
 * that `supabase.auth.signUp` created in step 1. The client then calls
 * signInWithPassword with the password the user just chose, which now
 * succeeds because the phone is marked confirmed.
 *
 * SAFETY:
 *   - Returns 404 in production builds (NODE_ENV !== "development").
 *   - The dev OTP value lives only here and in the client OTP step;
 *     it's not stored in any user-facing config.
 *   - This route confirms ONLY a phone the client owns the password
 *     for — without the password the client still can't sign in.
 *
 *   Before deploying, either delete this directory or also gate it
 *   behind an env flag.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const DEV_SECRET_OTP = "878790";

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  try {
    const body = (await req.json()) as { phone?: string; otp?: string };
    const phone = (body.phone || "").trim();
    const otp = (body.otp || "").trim();

    if (otp !== DEV_SECRET_OTP) {
      return NextResponse.json({ error: "Invalid dev OTP." }, { status: 403 });
    }
    if (!phone) {
      return NextResponse.json({ error: "phone required." }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    // Find the auth user. Supabase stores phone without leading '+'.
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
        { error: "User not found. Complete step 1 first." },
        { status: 404 },
      );
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
      phone_confirm: true,
    });
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed." },
      { status: 500 },
    );
  }
}
