import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type Body = {
  course_id?: string;
  day?: number;
  title?: string;
  description?: string;
  video_id?: string;
  duration_seconds?: number;
  is_published?: boolean;
};

async function adminClientOrError() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { err: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) {
    return { err: NextResponse.json({ error: "Admin only." }, { status: 403 }) };
  }
  return { admin: createSupabaseAdminClient() };
}

// Insert a new lesson (or update day's existing one via upsert on course_id + day).
export async function POST(req: Request) {
  const { admin, err } = await adminClientOrError();
  if (err) return err;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const course_id = (body.course_id || "").trim();
  const day = Number(body.day);
  const title = (body.title || "").trim();
  const description = (body.description || "").trim() || null;
  const video_id = (body.video_id || "").trim() || null;
  const duration_seconds =
    typeof body.duration_seconds === "number" ? body.duration_seconds : null;
  const is_published = Boolean(body.is_published);

  if (!course_id) {
    return NextResponse.json({ error: "course_id required." }, { status: 400 });
  }
  if (!Number.isInteger(day) || day < 1) {
    return NextResponse.json({ error: "day must be a positive integer." }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "title required." }, { status: 400 });
  }

  const { data, error } = await admin!
    .from("lessons")
    .upsert(
      {
        course_id,
        day,
        title,
        description,
        video_id,
        duration_seconds,
        is_published,
      },
      { onConflict: "course_id,day" },
    )
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, lesson: data });
}

// List lessons for a course (for the admin table).
export async function GET(req: Request) {
  const { admin, err } = await adminClientOrError();
  if (err) return err;
  const { searchParams } = new URL(req.url);
  const course_id = (searchParams.get("course_id") || "").trim();
  if (!course_id) {
    return NextResponse.json({ error: "course_id required." }, { status: 400 });
  }
  const { data, error } = await admin!
    .from("lessons")
    .select("id, course_id, day, title, description, video_id, duration_seconds, is_published, created_at")
    .eq("course_id", course_id)
    .order("day", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, lessons: data || [] });
}

// Patch one lesson (toggle publish, change video id, etc.)
export async function PATCH(req: Request) {
  const { admin, err } = await adminClientOrError();
  if (err) return err;
  let body: Body & { id?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const id = (body.id || "").trim();
  if (!id) {
    return NextResponse.json({ error: "id required." }, { status: 400 });
  }
  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.description === "string") updates.description = body.description.trim() || null;
  if (typeof body.video_id === "string") updates.video_id = body.video_id.trim() || null;
  if (typeof body.duration_seconds === "number") updates.duration_seconds = body.duration_seconds;
  if (typeof body.is_published === "boolean") updates.is_published = body.is_published;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }
  const { data, error } = await admin!
    .from("lessons")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, lesson: data });
}
