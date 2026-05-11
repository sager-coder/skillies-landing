/**
 * /api/admin/courses
 *
 *   GET  → list all courses (admin only; includes drafts)
 *   POST → create a new course
 *
 * Both gated on the caller having `is_admin = true` on their profile.
 * Writes go through the service-role client to bypass RLS — same
 * pattern as the other /api/admin routes.
 */
import { NextResponse } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in.", status: 401 } as const;
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return { error: "Admin only.", status: 403 } as const;
  return { user } as const;
}

export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("courses")
    .select(
      "id, title, description, short_description, mentor_name, duration_label, thumbnail_url, total_lessons, status, is_published, sort_order, created_at",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Hydrate each course with its enrollment count (server-side aggregation
  // is heavier than the worth — we just count in JS over a fetched list).
  const courseIds = (data || []).map((c) => c.id);
  let countsByCourse: Record<string, number> = {};
  if (courseIds.length) {
    const { data: enrolls } = await admin
      .from("enrollments")
      .select("course_id")
      .in("course_id", courseIds);
    countsByCourse = (enrolls || []).reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.course_id] = (acc[row.course_id] || 0) + 1;
        return acc;
      },
      {},
    );
  }

  const courses = (data || []).map((c) => ({
    ...c,
    enrolled_count: countsByCourse[c.id] || 0,
  }));
  return NextResponse.json({ courses });
}

type CreateBody = {
  id?: string;
  title?: string;
  description?: string;
  short_description?: string;
  mentor_name?: string;
  duration_label?: string;
  thumbnail_url?: string;
  total_lessons?: number;
  status?: "live" | "drafting" | "recording" | "planned";
  is_published?: boolean;
  sort_order?: number;
};

const VALID_STATUSES = ["live", "drafting", "recording", "planned"] as const;

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  try {
    const body = (await req.json()) as CreateBody;
    const id = (body.id || "").trim().toLowerCase();
    const title = (body.title || "").trim();
    if (!id || !title) {
      return NextResponse.json(
        { error: "id and title are required." },
        { status: 400 },
      );
    }
    if (!/^[a-z0-9][a-z0-9-]{1,60}$/.test(id)) {
      return NextResponse.json(
        {
          error:
            "id must be 2-61 chars, lowercase letters/numbers/hyphens (e.g. 'kdp-mastery').",
        },
        { status: 400 },
      );
    }
    const status = body.status && VALID_STATUSES.includes(body.status) ? body.status : "live";

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("courses")
      .insert({
        id,
        title,
        description: body.description?.trim() || null,
        short_description: body.short_description?.trim() || null,
        mentor_name: body.mentor_name?.trim() || null,
        duration_label: body.duration_label?.trim() || null,
        thumbnail_url: body.thumbnail_url?.trim() || null,
        total_lessons:
          typeof body.total_lessons === "number" && body.total_lessons > 0
            ? body.total_lessons
            : null,
        status,
        is_published: body.is_published ?? true,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ course: data });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed." },
      { status: 500 },
    );
  }
}
