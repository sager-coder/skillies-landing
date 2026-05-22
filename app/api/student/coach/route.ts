/**
 * POST /api/student/coach — Skillies KDP Coach chat endpoint.
 *
 * Streams an Anthropic Messages response back as SSE to the student
 * dashboard chat widget. The chat is exclusive to paying students: every
 * caller must be (a) logged in and (b) hold at least one row in
 * `enrollments`. Admins also pass. Anyone else gets a 403.
 *
 * Why this route exists
 * ─────────────────────
 * Students between live classes want answers fast. WhatsApp support is
 * great but high-latency. The in-dashboard coach gives them a Skillies-
 * voiced tutor that knows the workflow, refuses the wrong tools, and
 * routes them back to action — without consuming Ehsan's time.
 *
 * Why we proxy Claude (not call from the client)
 * ──────────────────────────────────────────────
 * The Anthropic API key must never ship to the browser. The system
 * prompt is also IP — it embeds the entire Skillies methodology — so
 * we keep it server-side. The client only sends the visible chat turns.
 *
 * Prompt caching
 * ──────────────
 * The system prompt is ~20KB. We mark it `cache_control: ephemeral` so
 * Anthropic caches it for 5 min between turns in the same conversation.
 * First message pays full price; every follow-up reads the cached
 * system block at ~10% the input cost.
 *
 * Gate chain (cheap → expensive):
 *   1. Logged-in?                        → 401
 *   2. Rate-limited (per user_id)?       → 429
 *   3. Body valid?                       → 400
 *   4. Enrolled in at least 1 course
 *      OR profiles.is_admin?             → 403
 *   5. Upstream Anthropic ok?            → 502
 */
import { type NextRequest } from "next/server";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { SKILLIES_KDP_COACH_PROMPT } from "@/lib/skillies-kdp-coach-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Model fallback chain. Sonnet 4.6 is the preferred tutor model, but
// Anthropic occasionally returns `overloaded_error` (HTTP 529) for a
// single model while others have capacity. We try these in order and
// use the first that yields a streamable response — so a Sonnet
// capacity blip transparently degrades to Opus, then Haiku, instead of
// dropping the student's reply. When Sonnet recovers it's used again.
const ANTHROPIC_MODEL_CHAIN = [
  "claude-sonnet-4-6",
  "claude-opus-4-6",
  "claude-haiku-4-5-20251001",
];
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// 30 messages per 5 min = generous for a real student session, tight
// enough that a runaway client loop or key-scraping bot trips the brake.
const MAX_PER_WINDOW = 30;
const WINDOW_SECONDS = 5 * 60;

// We cap the context we send upstream. The system prompt is large; we
// don't need infinite history to give a useful answer, and trimming
// keeps cost + latency predictable.
const MAX_TURNS = 20;
const MAX_USER_CHARS = 4000;

type ChatTurn = { role: "user" | "assistant"; content: string };

function jsonError(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  // ── 1. Auth ───────────────────────────────────────────────────────
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError(401, { error: "unauthenticated" });

  // ── 2. Rate-limit by user_id ──────────────────────────────────────
  const rl = rateLimit(`coach:${user.id}`, MAX_PER_WINDOW, WINDOW_SECONDS);
  if (!rl.ok) {
    return new Response(
      JSON.stringify({
        error: "rate-limited",
        retryAfterSeconds: rl.retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfterSeconds),
        },
      },
    );
  }

  // ── 3. Body parse + validate ──────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, { error: "bad_json" });
  }

  const messagesIn = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messagesIn) || messagesIn.length === 0) {
    return jsonError(400, { error: "missing_messages" });
  }

  // Coerce / trim / drop anything that doesn't fit the simple shape.
  const turns: ChatTurn[] = [];
  for (const raw of messagesIn) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as { role?: unknown; content?: unknown };
    if (m.role !== "user" && m.role !== "assistant") continue;
    if (typeof m.content !== "string") continue;
    const text = m.content.trim();
    if (!text) continue;
    turns.push({
      role: m.role,
      content: m.role === "user" ? text.slice(0, MAX_USER_CHARS) : text,
    });
  }
  if (turns.length === 0 || turns[turns.length - 1].role !== "user") {
    return jsonError(400, { error: "last_message_must_be_user" });
  }

  // Anthropic requires strictly alternating roles starting with `user`.
  // The client can occasionally produce two same-role turns in a row
  // (e.g. a voice transcript appended right after a typed message, or a
  // stale-closure race). Collapse consecutive same-role turns by merging
  // their text so we never send an invalid shape that Anthropic rejects.
  const collapsed: ChatTurn[] = [];
  for (const t of turns) {
    const last = collapsed[collapsed.length - 1];
    if (last && last.role === t.role) {
      last.content = `${last.content}\n\n${t.content}`;
    } else {
      collapsed.push({ ...t });
    }
  }
  // Drop any leading assistant turn so the first message is always `user`.
  while (collapsed.length && collapsed[0].role !== "user") collapsed.shift();

  // Keep the trailing window — that's what the model needs.
  const trimmed = collapsed.slice(-MAX_TURNS);
  // Re-collapse after the window slice (the slice could start on an
  // assistant turn) and guarantee we still lead with a user turn.
  while (trimmed.length && trimmed[0].role !== "user") trimmed.shift();
  if (trimmed.length === 0) {
    return jsonError(400, { error: "no_user_turn" });
  }

  // ── 4. Enrollment / admin gate ────────────────────────────────────
  const admin = createSupabaseAdminClient();
  const [{ count: enrollCount }, { data: profile }] = await Promise.all([
    admin
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    admin
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const isAdmin = !!profile?.is_admin;
  const hasEnrollment = (enrollCount ?? 0) > 0;
  if (!hasEnrollment && !isAdmin) {
    return jsonError(403, { error: "not_enrolled" });
  }

  // ── 5. Anthropic key ──────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[coach] ANTHROPIC_API_KEY not set");
    return jsonError(500, { error: "coach_not_configured" });
  }

  // ── 6. Call Anthropic with streaming ──────────────────────────────
  // Log the request shape (roles + sizes, not content) so a failure has
  // a breadcrumb trail next to the error event.
  console.log(
    "[coach] request:",
    trimmed.map((t) => `${t.role}:${t.content.length}`).join(","),
  );
  const requestBody = (model: string) =>
    JSON.stringify({
      model,
      max_tokens: 1024,
      stream: true,
      system: [
        {
          type: "text",
          text: SKILLIES_KDP_COACH_PROMPT,
          // Cache the huge methodology block. Cuts cost ~90% and
          // shaves latency on every follow-up in the same session.
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: trimmed.map((t) => ({ role: t.role, content: t.content })),
    });

  // Walk the model chain. For each model we open the stream and peek at
  // the first frames: if Anthropic returns a non-OK status (429/529/5xx)
  // or emits an `error` event before any text, we abandon that model and
  // try the next. The first model that produces real content wins, and
  // we hand its reader (plus the bytes we already peeked) to the
  // re-streaming stage below.
  let chosenModel = "";
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let prelude = ""; // bytes already pulled off `reader` during the peek
  const peekDecoder = new TextDecoder();

  for (const model of ANTHROPIC_MODEL_CHAIN) {
    let upstream: Response;
    try {
      upstream = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: requestBody(model),
      });
    } catch (err) {
      console.error("[coach]", model, "fetch failed:", err);
      continue;
    }

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => "");
      console.error(
        "[coach]",
        model,
        "non-ok",
        upstream.status,
        "·",
        errText.slice(0, 200),
        "→ trying next model",
      );
      continue;
    }

    // Peek: read frames until we see content (commit) or an error event
    // (fall back). Cap the peek so a slow/empty stream can't hang us.
    const r = upstream.body.getReader();
    let buf = "";
    let decided = false;
    let good = false;
    let peeks = 0;
    while (!decided && peeks < 50) {
      peeks++;
      const { value, done } = await r.read();
      if (done) break;
      buf += peekDecoder.decode(value, { stream: true });
      if (/event:\s*error/.test(buf) || /"type"\s*:\s*"error"/.test(buf)) {
        const m = buf.match(/"type"\s*:\s*"([a-z_]+_error)"/);
        console.error(
          "[coach]",
          model,
          "error event:",
          m?.[1] ?? "unknown",
          "→ trying next model",
        );
        try {
          await r.cancel();
        } catch {
          /* already closed */
        }
        decided = true; // fall back to next model
      } else if (
        buf.includes("content_block_delta") ||
        buf.includes("content_block_start") ||
        buf.includes('"type":"message_start"')
      ) {
        good = true;
        decided = true;
      }
    }

    if (good) {
      chosenModel = model;
      reader = r;
      prelude = buf;
      break;
    }
    // Not good → ensure the reader is released before the next attempt.
    try {
      await r.cancel();
    } catch {
      /* noop */
    }
  }

  if (!reader) {
    console.error("[coach] all models failed/overloaded");
    return jsonError(503, { error: "all_models_overloaded" });
  }
  console.log("[coach] using model:", chosenModel);

  // ── 7. Re-stream as `text/event-stream` of plain delta lines ──────
  // We translate Anthropic's verbose SSE into a tiny line protocol the
  // client can read with a ReadableStream + TextDecoder:
  //
  //   data: <chunk of assistant text>\n\n     ← repeated per delta
  //   event: done\ndata: ok\n\n               ← terminator
  //
  // Errors get `event: error\ndata: <msg>\n\n`. Anything else is
  // ignored — keeps the client parser trivial.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const committedReader = reader;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Seed the parse buffer with the frames we already pulled off the
      // reader during the model-selection peek, then continue reading.
      let buffer = prelude;

      const writeChunk = (text: string) => {
        // Encode as a single SSE data line (handle multi-line text by
        // splitting on newlines and prefixing each).
        const lines = text.split("\n").map((l) => `data: ${l}`).join("\n");
        controller.enqueue(encoder.encode(`${lines}\n\n`));
      };
      const writeEvent = (name: string, payload: string) => {
        controller.enqueue(encoder.encode(`event: ${name}\ndata: ${payload}\n\n`));
      };

      // Parse whatever complete \n\n-separated frames sit in `buffer`,
      // emit their translated output, and leave any partial trailing
      // frame in `buffer` for the next chunk. Returns nothing; mutates
      // the closed-over `buffer`.
      const drainFrames = () => {
        let sep = buffer.indexOf("\n\n");
        while (sep !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          sep = buffer.indexOf("\n\n");

          let eventName: string | null = null;
          const dataLines: string[] = [];
          for (const line of frame.split("\n")) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).trim());
            }
          }
          if (dataLines.length === 0) continue;
          const dataStr = dataLines.join("\n");

          if (eventName === "content_block_delta") {
            try {
              const parsed = JSON.parse(dataStr) as {
                delta?: { type?: string; text?: string };
              };
              if (parsed.delta?.type === "text_delta" && parsed.delta.text) {
                writeChunk(parsed.delta.text);
              }
            } catch {
              /* ignore unparseable frame */
            }
          } else if (eventName === "message_stop") {
            writeEvent("done", "ok");
          } else if (eventName === "error") {
            // Anthropic mid-stream error (overloaded_error, api_error,
            // etc.). Log it and forward the error TYPE so the widget can
            // show something more useful than a generic "connection
            // dropped". (Pre-stream overloads are handled earlier by the
            // model-fallback chain; this only fires if a model fails
            // AFTER we already committed to streaming it.)
            let errType = "upstream_stream_error";
            try {
              const parsed = JSON.parse(dataStr) as {
                error?: { type?: string; message?: string };
              };
              if (parsed.error?.type) errType = parsed.error.type;
              console.error(
                "[coach] anthropic stream error:",
                parsed.error?.type,
                "·",
                parsed.error?.message,
              );
            } catch {
              console.error(
                "[coach] anthropic stream error (raw):",
                dataStr.slice(0, 300),
              );
            }
            writeEvent("error", errType);
          }
          // Other events (message_start, ping, etc.) are ignored.
        }
      };

      try {
        // First flush the peeked prelude, then stream the rest.
        drainFrames();
        while (true) {
          const { value, done } = await committedReader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          drainFrames();
        }
      } catch (err) {
        console.error("[coach] stream relay failed", err);
        writeEvent("error", "relay_failed");
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      Connection: "keep-alive",
    },
  });
}
