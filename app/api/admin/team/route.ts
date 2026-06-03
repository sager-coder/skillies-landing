/**
 * /api/admin/team
 *   GET  → list the founder's team members (profiles.is_team_member)
 *   POST → add a teammate with a username + password login. Creates a
 *          Supabase email+password account behind a synthetic email
 *          (see lib/staff-auth.ts) and flags the profile as a team member.
 *
 * Admin-only.
 */
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-guards";
import { personName } from "@/lib/ticket-queries";
import {
  normalizeUsername,
  usernameToEmail,
  MIN_PASSWORD_LENGTH,
} from "@/lib/staff-auth";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, full_name, first_name, last_name, phone, email, username")
    .eq("is_team_member", true)
    .order("full_name", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const team = (data || []).map((p) => ({
    id: p.id,
    name: personName(p),
    username: p.username || null,
  }));
  return NextResponse.json({ team });
}

type Body = { name?: string; username?: string; password?: string };

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  try {
    const body = (await req.json()) as Body;
    const name = (body.name || "").trim();
    const username = normalizeUsername(body.username || "");
    const password = body.password || "";

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!username) {
      return NextResponse.json(
        { error: "Username is required (letters, numbers, . _ - only)." },
        { status: 400 },
      );
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
        { status: 400 },
      );
    }

    const admin = createSupabaseAdminClient();

    // Username must be unique.
    const { data: existing } = await admin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "That username is taken — pick another." },
        { status: 409 },
      );
    }

    const email = usernameToEmail(username);
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
    if (createErr || !created.user) {
      const msg = /registered|exists/i.test(createErr?.message || "")
        ? "That username is taken — pick another."
        : createErr?.message || "Failed to create login.";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const { error: upErr } = await admin.from("profiles").upsert(
      {
        id: created.user.id,
        is_team_member: true,
        full_name: name,
        username,
      },
      { onConflict: "id" },
    );
    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: created.user.id, name, username });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
