/**
 * POST /api/livekit/token
 *
 * Mints a short-lived LiveKit access token for a browser to join a voice
 * room with the Skillies AI. Public — no auth — but rate-limited so it can't
 * be used to spawn thousands of rooms.
 *
 * Returned token grants:
 *   - publish audio (the visitor speaks)
 *   - subscribe to other participants (hears the agent)
 *   - join one specific room only; cannot create others
 *
 * Voice agent worker (ehsan_voice/livekit_agent/agent.py) is registered as a
 * LiveKit Agents dispatcher against the same server, so the moment a visitor
 * joins, the worker spawns and joins the same room.
 *
 * Request body: {} — no fields required for Phase 1.
 *
 * Response:
 *   { token: string, url: string, room: string, identity: string }
 *
 * Env required:
 *   LIVEKIT_API_KEY, LIVEKIT_API_SECRET — generated when LiveKit server is set up.
 *   NEXT_PUBLIC_LIVEKIT_URL              — wss://voice.skillies.ai
 */
import { NextResponse, type NextRequest } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { rateLimit } from "@/lib/rate-limit";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PER_MINUTE = 8;
const WINDOW_SECONDS = 60;
const TOKEN_TTL_S = 10 * 60;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const first = fwd.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limited = rateLimit(`lk-token:${ip}`, MAX_PER_MINUTE, WINDOW_SECONDS);
  if (!limited.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!apiKey || !apiSecret || !livekitUrl) {
    return NextResponse.json({ error: "livekit_not_configured" }, { status: 503 });
  }

  const room = `talk-${randomUUID().slice(0, 8)}`;
  const identity = `visitor-${randomUUID().slice(0, 8)}`;

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    ttl: TOKEN_TTL_S,
  });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: false,
  });
  const token = await at.toJwt();

  return NextResponse.json({ token, url: livekitUrl, room, identity });
}
