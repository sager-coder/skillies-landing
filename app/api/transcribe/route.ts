/**
 * POST /api/transcribe
 *
 * Server-side voice-note transcription via ElevenLabs Scribe. Used by
 * BOTH the prospect demo widget (DemoBrandedChat) and the main public
 * Skillies widget (SkilliesChatWidget on skillies.ai).
 *
 * Auth model · two-tier:
 *   - Visitors with a `demo_auth_*` cookie (i.e., they've entered the
 *     access code on a private prospect demo) bypass the rate limiter.
 *     Demo evaluators can record as many takes as they want.
 *   - Everyone else (the public main-site chat) is rate-limited per IP
 *     · 30 requests / hour. Generous for legitimate use, tight enough
 *     to discourage anyone scripting our STT for free.
 *
 * Returns `{ transcript, language? }`. Transcript may be empty (silence
 * or unintelligible audio) · the client treats that as a failed send
 * and surfaces a system message.
 */
import { NextResponse, type NextRequest } from "next/server";

import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 30s for the request → ElevenLabs Scribe → response.
export const maxDuration = 30;

// Per-IP cap for the public path. Demo-cookie callers bypass.
const PUBLIC_MAX_PER_HOUR = 30;
const PUBLIC_WINDOW_SECONDS = 60 * 60;

function hasDemoCookie(req: NextRequest): boolean {
  return req.cookies
    .getAll()
    .some(
      (c) => c.name.startsWith("demo_auth_") && c.value && c.value.length > 16,
    );
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const first = fwd.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "stt_not_configured" },
      { status: 503 },
    );
  }

  const isDemoUser = hasDemoCookie(req);
  if (!isDemoUser) {
    const ip = clientIp(req);
    const { ok, retryAfterSeconds } = rateLimit(
      `transcribe:${ip}`,
      PUBLIC_MAX_PER_HOUR,
      PUBLIC_WINDOW_SECONDS,
    );
    if (!ok) {
      return NextResponse.json(
        { error: "rate_limited", retryAfterSeconds },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        },
      );
    }
  }

  let incoming: FormData;
  try {
    incoming = await req.formData();
  } catch {
    return NextResponse.json({ error: "bad_form" }, { status: 400 });
  }

  const file = incoming.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "empty_file" }, { status: 400 });
  }
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  const upstream = new FormData();
  upstream.append("file", file, "voice-note");
  upstream.append("model_id", "scribe_v1");

  let res: Response;
  try {
    res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: upstream,
    });
  } catch {
    return NextResponse.json(
      { error: "stt_network_error" },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return NextResponse.json(
      {
        error: "stt_failed",
        status: res.status,
        detail: body.slice(0, 400),
      },
      { status: 502 },
    );
  }

  let data: { text?: string; language_code?: string } = {};
  try {
    data = (await res.json()) as { text?: string; language_code?: string };
  } catch {
    return NextResponse.json({ error: "stt_bad_json" }, { status: 502 });
  }

  return NextResponse.json({
    transcript: (data.text ?? "").trim(),
    language: data.language_code ?? null,
  });
}
