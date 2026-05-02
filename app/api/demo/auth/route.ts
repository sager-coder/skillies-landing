/**
 * POST /api/demo/auth
 *
 * Two transports — same logic, different responses:
 *
 *   1. application/json (the JS-fetch path used by PasswordGate when JS is on)
 *      Body: { slug, password }
 *      Success → 200 {ok:true} + Set-Cookie. JS reloads the page client-side.
 *      Failure → 401/404/503 with a small JSON {error}. JS shows inline error.
 *
 *   2. application/x-www-form-urlencoded / multipart/form-data
 *      (the HTML-form path used as a no-JS fallback. CRITICALLY · this is the
 *      path that works in WhatsApp's in-app browser, where `fetch()` set-cookie
 *      followed by `window.location.reload()` sometimes drops the cookie.
 *      A native HTML form POST + 303 redirect lets the BROWSER handle the
 *      cookie + navigate, which works in every WebView.)
 *      Form fields: slug, password
 *      Success → 303 redirect to /demo/<slug> + Set-Cookie
 *      Failure → 303 redirect to /demo/<slug>?demo_error=<reason>
 *
 * Cookie is httpOnly + Secure + SameSite=Lax + slug-scoped, valid 7 days.
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

const VALID_SLUGS = new Set(["venture-navigator", "agasthyam"]);

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  const isForm =
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");

  // ─── Parse · either JSON or form-encoded ──────────────────────────────
  let slug = "";
  let password = "";

  if (isForm) {
    const form = await req.formData();
    slug = String(form.get("slug") ?? "").trim();
    password = String(form.get("password") ?? "").trim();
  } else {
    let body: { slug?: string; password?: string };
    try {
      body = (await req.json()) as { slug?: string; password?: string };
    } catch {
      return NextResponse.json(
        { ok: false, error: "bad_json" },
        { status: 400 },
      );
    }
    slug = (body.slug ?? "").trim();
    password = (body.password ?? "").trim();
  }

  // ─── Validation ──────────────────────────────────────────────────────
  if (!VALID_SLUGS.has(slug)) {
    return errorResponse(req, isForm, slug, "unknown_slug", 404);
  }
  if (!password) {
    return errorResponse(req, isForm, slug, "missing_password", 400);
  }

  const expected = passwordForSlug(slug);
  if (!expected) {
    return errorResponse(req, isForm, slug, "demo_not_configured", 503);
  }

  if (!constantTimeEquals(password, expected)) {
    // Slow brute force attempts (not a substitute for rate limiting).
    await new Promise((r) => setTimeout(r, 600));
    return errorResponse(req, isForm, slug, "wrong_password", 401);
  }

  // ─── Success ─────────────────────────────────────────────────────────
  const token = makeToken(slug);
  const cookieOptions = {
    name: cookieNameFor(slug),
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: true,
    path: "/",
    maxAge: DEMO_COOKIE_TTL_SECONDS,
  };

  if (isForm) {
    // Form path · 303 redirect to the demo page + cookie. The browser
    // handles the redirect natively, so the cookie WILL be sent on the
    // next GET — no JS-reload race.
    const url = new URL(`/demo/${slug}`, req.url);
    const res = NextResponse.redirect(url, { status: 303 });
    res.cookies.set(cookieOptions);
    return res;
  }
  // JSON path · status 200 + cookie. JS calls reload() on receive.
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieOptions);
  return res;
}

// Build the right error response for the request mode (form vs JSON).
function errorResponse(
  req: NextRequest,
  isForm: boolean,
  slug: string,
  errorCode: string,
  status: number,
) {
  if (isForm && VALID_SLUGS.has(slug)) {
    // Form path · redirect back to the gate with a query param so the
    // page can show an inline error. Don't redirect to an unknown slug
    // (could be probing); 404 directly.
    const url = new URL(`/demo/${slug}?demo_error=${errorCode}`, req.url);
    return NextResponse.redirect(url, { status: 303 });
  }
  return NextResponse.json({ ok: false, error: errorCode }, { status });
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
