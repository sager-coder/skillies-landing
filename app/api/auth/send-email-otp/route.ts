import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Body = { email?: string };

function clientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const fwd = req.headers.get("x-forwarded-for") || "";
  const first = fwd.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "unknown";
}

function humanize(seconds: number): string {
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const mins = Math.ceil(seconds / 60);
  return `${mins} minute${mins === 1 ? "" : "s"}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email-OTP send gateway for the sitewide tool sign-in at /signin.
 *
 * /login is the student sign-in (phone + password, upstream-owned). This
 * route powers the parallel sign-in for tool users — niche finder,
 * dropshipping finder, anything that doesn't need course/device binding.
 * Emails go out via Supabase Auth → custom SMTP (Resend, mail.skillies.ai).
 *
 * Per-IP + per-email rate limits stop scripts from running up Resend
 * bill or hitting Supabase auth caps.
 *
 * Budget:
 *   - 3 codes per 5 minutes per IP
 *   - 3 codes per 1 hour per email
 *   - 15 codes per 1 hour per IP (cross-email burst)
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json(
      { error: "Enter a valid email address (e.g. you@domain.com)." },
      { status: 400 },
    );
  }

  const ip = clientIp(req);

  const ipBurst = rateLimit(`otp-email:ip-burst:${ip}`, 3, 300);
  if (!ipBurst.ok) {
    return NextResponse.json(
      {
        error: `Too many codes from your network. Try again in ${humanize(ipBurst.retryAfterSeconds)}.`,
      },
      { status: 429, headers: { "retry-after": String(ipBurst.retryAfterSeconds) } },
    );
  }

  const ipHour = rateLimit(`otp-email:ip-hour:${ip}`, 15, 3600);
  if (!ipHour.ok) {
    return NextResponse.json(
      {
        error: `Too many codes from your network in the last hour. Try again in ${humanize(ipHour.retryAfterSeconds)}.`,
      },
      { status: 429, headers: { "retry-after": String(ipHour.retryAfterSeconds) } },
    );
  }

  const emailHour = rateLimit(`otp-email:email:${email}`, 3, 3600);
  if (!emailHour.ok) {
    return NextResponse.json(
      {
        error: `This inbox has received too many codes recently. Wait ${humanize(emailHour.retryAfterSeconds)} before trying again.`,
      },
      { status: 429, headers: { "retry-after": String(emailHour.retryAfterSeconds) } },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json(
      { error: "Auth is not configured yet." },
      { status: 503 },
    );
  }

  const supabase = createClient(url, anon);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email });
}
