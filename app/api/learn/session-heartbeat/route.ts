/**
 * POST /api/learn/session-heartbeat — single-active-session enforcement.
 *
 * The player generates a `sessionId` (crypto.randomUUID()) once per
 * tab, stashes it in sessionStorage, and pings this route every 30s
 * while a video is open. We:
 *
 *   1. Upsert the (user_id, session_id) row into video_sessions with
 *      a fresh last_seen_at.
 *   2. If we see ANY other still-live session for the same user (i.e.
 *      ended_at IS NULL and session_id != ours), end them all
 *      (`ended_at = now()`, `ended_reason = 'kicked-newer'`).
 *   3. If our OWN session was already ended (a later tab kicked us),
 *      return `{ kicked: true }` so the client can pause playback and
 *      show a "you're watching from another window" banner.
 *
 * Heartbeats are cheap — two indexed writes per ping. The next mint of
 * a stream-token will still work after a kick, because tokens aren't
 * tied to sessions (a kicked user could refresh and re-claim). That's
 * intentional: the goal is to stop credential-sharing (one account
 * streamed to two viewers simultaneously), not to lock people out.
 *
 * Pre-migration: if `video_sessions` doesn't exist (42P01), every
 * heartbeat is a no-op success. The feature degrades cleanly.
 */
import { NextResponse, type NextRequest } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A session is considered "live" if we've heard from it within this
// window. Anything older is assumed dead (tab closed, network drop) and
// won't kick a newer session.
const LIVE_WINDOW_SECONDS = 90;

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let sessionId: string | undefined;
  let lessonId: string | undefined;
  try {
    const body = await req.json();
    sessionId =
      typeof body?.sessionId === "string" ? body.sessionId : undefined;
    lessonId = typeof body?.lessonId === "string" ? body.lessonId : undefined;
  } catch {
    /* ignored — sessionId undefined → 400 */
  }
  if (!sessionId) {
    return NextResponse.json({ error: "missing-sessionId" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const nowIso = new Date().toISOString();
  const liveCutoffIso = new Date(
    Date.now() - LIVE_WINDOW_SECONDS * 1000,
  ).toISOString();

  // 1. Upsert our own session row. If the table doesn't exist yet,
  //    short-circuit to success so the player keeps working.
  try {
    const { error: upsertErr } = await admin
      .from("video_sessions")
      .upsert(
        {
          user_id: user.id,
          session_id: sessionId,
          lesson_id: lessonId ?? null,
          last_seen_at: nowIso,
        },
        { onConflict: "session_id" },
      );
    if (upsertErr) {
      if (upsertErr.code === "42P01") {
        return NextResponse.json({ kicked: false, ok: true });
      }
      console.warn("[heartbeat] upsert failed", upsertErr.message);
    }
  } catch (err) {
    console.warn("[heartbeat] upsert threw", err);
    return NextResponse.json({ kicked: false, ok: true });
  }

  // 2. Has our row already been ended (kicked) by a newer session?
  const { data: ours } = await admin
    .from("video_sessions")
    .select("ended_at")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (ours && (ours as { ended_at?: string | null }).ended_at) {
    return NextResponse.json({ kicked: true });
  }

  // 3. Kick any OTHER live sessions for this user.
  //    A session is live if ended_at IS NULL and last_seen_at >= cutoff.
  const { data: others } = await admin
    .from("video_sessions")
    .select("session_id")
    .eq("user_id", user.id)
    .is("ended_at", null)
    .gte("last_seen_at", liveCutoffIso)
    .neq("session_id", sessionId);

  const otherIds = (others || []).map(
    (r) => (r as { session_id: string }).session_id,
  );
  if (otherIds.length > 0) {
    await admin
      .from("video_sessions")
      .update({ ended_at: nowIso, ended_reason: "kicked-newer" })
      .in("session_id", otherIds);
  }

  return NextResponse.json({ kicked: false, ok: true });
}
