import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  phone?: string;
  full_name?: string;
  course?: string;
  tier?: "founding" | "standard" | "pro";
};

export async function POST(req: Request) {
  try {
    // 1. Verify caller is an authenticated admin
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Admin only." }, { status: 403 });
    }

    // 2. Parse payload
    const body = (await req.json()) as Body;
    const phone = (body.phone || "").trim();
    const full_name = (body.full_name || "").trim() || null;
    const course = (body.course || "").trim();
    const tier = body.tier || "standard";
    if (!phone || !course) {
      return NextResponse.json(
        { error: "Phone and course are required." },
        { status: 400 },
      );
    }
    if (!["founding", "standard", "pro"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    // 3. Use service-role client to find or create the user by phone
    const admin = createSupabaseAdminClient();

    // Look up profile by phone first
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    let userId = existingProfile?.id as string | undefined;

    if (!userId) {
      // Create a new auth user with this phone
      const { data: created, error: createErr } =
        await admin.auth.admin.createUser({
          phone,
          phone_confirm: true, // pre-confirmed; student can log in without OTP round-trip
        });
      if (createErr || !created.user) {
        return NextResponse.json(
          { error: createErr?.message || "Failed to create user." },
          { status: 500 },
        );
      }
      userId = created.user.id;

      // Insert profile (the trigger may also have, but we ensure fields)
      await admin
        .from("profiles")
        .upsert(
          {
            id: userId,
            phone,
            full_name,
          },
          { onConflict: "id" },
        );
    } else if (full_name) {
      // If profile exists and we have a name, patch it
      await admin
        .from("profiles")
        .update({ full_name })
        .eq("id", userId);
    }

    // 4. Upsert enrollment
    const { error: enrollErr } = await admin
      .from("enrollments")
      .upsert(
        {
          user_id: userId,
          course_id: course,
          tier,
          enrolled_by: user.id,
        },
        { onConflict: "user_id,course_id" },
      );
    if (enrollErr) {
      return NextResponse.json({ error: enrollErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      user_id: userId,
      phone,
      course,
      tier,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
