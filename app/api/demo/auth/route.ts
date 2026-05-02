/**
 * POST /api/demo/auth
 *
 * Body: { slug: string, password: string }
 *
 * Verifies the password against the env-configured password for that slug
 * (DEMO_<SLUG>_PASSWORD). On match, sets the demo_auth_<slug> cookie and
 * returns 200. On miss, returns 401 with a small delay to slow brute force.
 *
 * Tied to a specific prospect slug · a successful entry on one slug does
 * not unlock other prospect demos.
 */
import { NextResponse, type NextRequest } from "next/server";

import {
  cookieNameFor,
  DEMO_COOKIE_TTL_SECONDS,
  makeToken,
  passwordForSlug,
} from "@/lib/demo-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_SLUGS = new Set(["venture-navigator"]);

export async function POST(req: NextRequest) {
  let body: { slug?: string; password?: string };
  try {
    body = (await req.json()) as { slug?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const slug = (body.slug ?? "").trim();
  const password = (body.password ?? "").trim();

  if (!VALID_SLUGS.has(slug)) {
    return NextResponse.json({ ok: false, error: "unknown_slug" }, { status: 404 });
  }
  if (!password) {
    return NextResponse.json({ ok: false, error: "missing_password" }, { status: 400 });
  }

  const expected = passwordForSlug(slug);
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "demo_not_configured" },
      { status: 503 },
    );
  }

  if (!constantTimeEquals(password, expected)) {
    // Small delay to slow brute-force attempts. Not a substitute for rate
    // limiting · just makes a scripted attack obvious.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "wrong_password" }, { status: 401 });
  }

  const token = makeToken(slug);
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: cookieNameFor(slug),
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: DEMO_COOKIE_TTL_SECONDS,
  });
  return res;
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
