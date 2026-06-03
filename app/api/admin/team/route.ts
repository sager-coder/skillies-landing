/**
 * /api/admin/team
 *   GET  → list the founder's team members (profiles.is_team_member)
 *   POST → add a teammate: create a pre-confirmed auth user (so they
 *          can sign in via OTP) and flag them as a team member.
 *
 * Admin-only. Mirrors /api/admin/enroll's create-user pattern.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-guards";
import { personName } from "@/lib/ticket-queries";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, full_name, first_name, last_name, phone, email")
    .eq("is_team_member", true)
    .order("full_name", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const team = (data || []).map((p) => ({
    id: p.id,
    name: personName(p),
    phone: p.phone,
    email: p.email,
  }));
  return NextResponse.json({ team });
}

type Body = { name?: string; phone?: string; email?: string };

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  try {
    const body = (await req.json()) as Body;
    const name = (body.name || "").trim();
    let phone = (body.phone || "").trim();
    const email = (body.email || "").trim().toLowerCase();

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!phone && !email) {
      return NextResponse.json(
        { error: "Add a phone or email so they can log in." },
        { status: 400 },
      );
    }

    // Normalise phone to E.164. Default country code +91 (matches the
    // Add-user form elsewhere in the admin UI).
    if (phone) {
      const digits = phone.replace(/\D/g, "");
      phone = phone.startsWith("+")
        ? `+${digits}`
        : digits.startsWith("91")
          ? `+${digits}`
          : `+91${digits}`;
    }

    const admin = createSupabaseAdminClient();

    // Reuse an existing profile if this person already signed up.
    let userId: string | undefined;
    if (phone) {
      const { data } = await admin
        .from("profiles")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();
      userId = data?.id;
    }
    if (!userId && email) {
      const { data } = await admin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      userId = data?.id;
    }

    if (!userId) {
      const { data: created, error: createErr } =
        await admin.auth.admin.createUser(
          phone
            ? { phone, phone_confirm: true }
            : { email, email_confirm: true },
        );
      if (createErr || !created.user) {
        return NextResponse.json(
          { error: createErr?.message || "Failed to create user." },
          { status: 500 },
        );
      }
      userId = created.user.id;
    }

    const { error: upErr } = await admin.from("profiles").upsert(
      {
        id: userId,
        is_team_member: true,
        full_name: name,
        ...(phone ? { phone } : {}),
        ...(email ? { email } : {}),
      },
      { onConflict: "id" },
    );
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: userId, name });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
