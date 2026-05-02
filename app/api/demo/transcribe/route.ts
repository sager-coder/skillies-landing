/**
 * POST /api/demo/transcribe
 *
 * Accepts a multipart/form-data audio Blob (under field `file`) and returns
 * `{ transcript, language? }` after running it through ElevenLabs Speech-to-
 * Text. Used by the chat widget's voice-note recorder · the user records
 * locally, we transcribe server-side (so the API key stays on the server),
 * the widget then sends the transcript to the Convai agent.
 *
 * Auth · gated by the presence of any `demo_auth_*` cookie. Anyone who
 * already entered a valid demo access code can transcribe; without that
 * cookie, this endpoint refuses. Prevents the demo from becoming a free
 * STT API for the world.
 */
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 30s max for the request; keeps the user from blocking forever on a
// stuck upstream call.
export const maxDuration = 30;

function isAuthorized(req: NextRequest): boolean {
  const all = req.cookies.getAll();
  return all.some(
    (c) => c.name.startsWith("demo_auth_") && c.value && c.value.length > 16,
  );
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 },
    );
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "stt_not_configured" },
      { status: 503 },
    );
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

  // Forward to ElevenLabs Scribe (their STT). Field name is `file`,
  // model_id is required · `scribe_v1` is the production model with
  // multilingual support (incl. Malayalam, Tamil, etc).
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
