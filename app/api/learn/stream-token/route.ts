/**
 * POST /api/learn/stream-token  — mint a short-lived signed Cloudflare
 * Stream playback token for one lesson.
 *
 * Gate chain (order matters — cheapest checks first):
 *   1. Logged-in?           → 401
 *   2. Rate-limited?        → 429 (per user_id)
 *   3. Lesson exists + has a Stream UID?  → 404
 *   4. Lesson published OR caller is admin?  → 403
 *   5. Caller enrolled in lesson's course OR admin?  → 403
 *   6. Caller's `profiles.blocked` flag set?  → 403
 *
 * Only after all of those does the route call Cloudflare to mint a
 * token. We log every mint into `video_access_log` for forensics — if
 * a leak hits Telegram, the IP/UA/timestamp/lesson trail is right
 * there next to the user_id whose watermark was burned in.
 *
 * Why we don't trust the client-passed videoId
 * ────────────────────────────────────────────
 * The client only sends `lessonId`. We resolve `videoId` server-side
 * from `lessons.video_id`. A compromised client can't grab a token for
 * a lesson the user isn't entitled to.
 */
import { NextResponse, type NextRequest } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { getSignedStreamToken } from "@/lib/cloudflare-stream";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN_TTL_SECONDS = 60 * 60; // 1 hour — long enough to watch a lesson, short enough to limit blast radius if leaked.

export async function POST(req: NextRequest) {
  // ── 1. Authenticated session ─────────────────────────────────────
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // ── 2. Rate-limit by user_id ─────────────────────────────────────
  // 30 mints per user per 5 min covers normal browsing (every page
  // load, every token refresh) with margin. Beyond that → token-scraper.
  const rl = rateLimit(`stream-token:${user.id}`, 30, 300);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate-limited" },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds) },
      },
    );
  }

  // ── 3. Body parse ────────────────────────────────────────────────
  let lessonId: string | undefined;
  let sessionId: string | undefined;
  try {
    const body = await req.json();
    lessonId = typeof body?.lessonId === "string" ? body.lessonId : undefined;
    sessionId =
      typeof body?.sessionId === "string" ? body.sessionId : undefined;
  } catch {
    /* fall through; lessonId undefined → 400 below */
  }
  if (!lessonId) {
    return NextResponse.json({ error: "missing-lessonId" }, { status: 400 });
  }

  // ── 4. Resolve lesson + verify enrollment (service-role: bypass RLS) ──
  const admin = createSupabaseAdminClient();

  const [{ data: lesson }, { data: profile }] = await Promise.all([
    admin
      .from("lessons")
      .select("id, course_id, video_id, is_published")
      .eq("id", lessonId)
      .maybeSingle(),
    admin
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  if (!lesson) {
    return NextResponse.json({ error: "lesson-not-found" }, { status: 404 });
  }
  if (!lesson.video_id) {
    return NextResponse.json({ error: "no-video" }, { status: 404 });
  }

  const isAdmin = !!profile?.is_admin;

  if (!lesson.is_published && !isAdmin) {
    return NextResponse.json({ error: "not-published" }, { status: 403 });
  }

  if (!isAdmin) {
    const { data: enrolment } = await admin
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", lesson.course_id)
      .maybeSingle();
    if (!enrolment) {
      return NextResponse.json({ error: "not-enrolled" }, { status: 403 });
    }
  }

  // Check the soft-block flag. Try/catch swallows the case where the
  // `blocked` column hasn't been migrated yet — same graceful fallback
  // as /api/admin/students.
  try {
    const { data: block } = await admin
      .from("profiles")
      .select("blocked")
      .eq("id", user.id)
      .maybeSingle();
    if (block && (block as { blocked?: boolean }).blocked === true) {
      return NextResponse.json({ error: "blocked" }, { status: 403 });
    }
  } catch {
    /* `blocked` column missing pre-migration — treat as not blocked */
  }

  // ── 5. Mint the token ────────────────────────────────────────────
  let token: string;
  let expiresAt: number;
  try {
    const out = await getSignedStreamToken({
      videoUid: lesson.video_id,
      ttlSeconds: TOKEN_TTL_SECONDS,
    });
    token = out.token;
    expiresAt = out.expiresAt;
  } catch (err) {
    console.error("[stream-token] mint failed", err);
    return NextResponse.json({ error: "mint-failed" }, { status: 502 });
  }

  // ── 6. Fire-and-forget audit log ─────────────────────────────────
  // Don't await — if logging is slow or the table is missing
  // pre-migration the student should still get their token.
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
  const ua = req.headers.get("user-agent")?.slice(0, 500) || null;

  admin
    .from("video_access_log")
    .insert({
      user_id: user.id,
      lesson_id: lesson.id,
      course_id: lesson.course_id,
      session_id: sessionId ?? null,
      ip,
      user_agent: ua,
    })
    .then(({ error }) => {
      if (error && error.code !== "42P01") {
        // 42P01 = table missing (pre-migration). Anything else logs.
        console.warn("[stream-token] audit insert failed", error.message);
      }
    });

  return NextResponse.json(
    { token, expiresAt },
    {
      headers: {
        // Belt + braces — even if some upstream cache misreads our
        // `cache: "no-store"` on the CF fetch, nothing here is cacheable.
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );
}
