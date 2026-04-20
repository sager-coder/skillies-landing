import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Body = { phone?: string };

function clientIp(req: Request): string {
  // Cloudflare proxy (orange cloud) sets this; prefer it because it's the
  // real client IP before CF added its own node to the hop chain.
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

/**
 * OTP-send gateway. The /login page hits this instead of calling
 * supabase.auth.signInWithOtp directly, so we can enforce per-IP and
 * per-phone rate limits in front of Twilio. Stops drive-by SMS pumping
 * from racking up the Twilio bill.
 *
 * Budget:
 *   - 3 OTPs per 5 minutes per IP       (IP-level abuse)
 *   - 3 OTPs per 1 hour per phone       (targeted number harassment)
 *   - 15 OTPs per 1 hour per IP         (broader burst across numbers)
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const raw = (body.phone || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) {
    return NextResponse.json(
      { error: "Enter a valid phone number with country code (e.g. 91…)." },
      { status: 400 },
    );
  }
  const e164 = digits.startsWith("91") ? `+${digits}` : `+91${digits}`;

  const ip = clientIp(req);

  const ipBurst = rateLimit(`otp:ip-burst:${ip}`, 3, 300);
  if (!ipBurst.ok) {
    return NextResponse.json(
      {
        error: `Too many codes from your network. Try again in ${humanize(ipBurst.retryAfterSeconds)}.`,
      },
      { status: 429, headers: { "retry-after": String(ipBurst.retryAfterSeconds) } },
    );
  }

  const ipHour = rateLimit(`otp:ip-hour:${ip}`, 15, 3600);
  if (!ipHour.ok) {
    return NextResponse.json(
      {
        error: `Too many codes from your network in the last hour. Try again in ${humanize(ipHour.retryAfterSeconds)}.`,
      },
      { status: 429, headers: { "retry-after": String(ipHour.retryAfterSeconds) } },
    );
  }

  const phoneHour = rateLimit(`otp:phone:${e164}`, 3, 3600);
  if (!phoneHour.ok) {
    return NextResponse.json(
      {
        error: `This number has received too many codes recently. Wait ${humanize(phoneHour.retryAfterSeconds)} before trying again.`,
      },
      { status: 429, headers: { "retry-after": String(phoneHour.retryAfterSeconds) } },
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
    phone: e164,
    options: { channel: "sms" },
  });
  if (error) {
    // Surface friendly copy for the 'SMS provider not configured' case,
    // pass through anything else as-is.
    const msg = error.message.toLowerCase().includes("sms provider")
      ? "SMS provider not configured yet. WhatsApp Ehsan to get manual access while we activate."
      : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ ok: true, phone: e164 });
}
