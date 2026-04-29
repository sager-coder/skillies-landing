import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

// Same source-of-truth as create-order/route.ts. Kept duplicated rather than
// extracted because shared lib code drifts when only one consumer changes; if
// a third consumer appears, lift this out then.
const TIER_AMOUNTS_PAISE: Record<string, number> = {
  "workshop-early": 199_900,    // ₹1,999 — Workshop Early Bird
  "workshop-regular": 249_900,  // ₹2,499 — Workshop Regular
  "workshop-vip": 249_900,      // ₹2,499 — alias
  "batch-enrolment": 5_000_000, // ₹50,000 — Batch upfront
  "test": 100,                  // ₹1 — used for end-to-end testing only
};
const TIER_LABELS: Record<string, string> = {
  "workshop-early": "Skillies Workshop · Early Bird",
  "workshop-regular": "Skillies Workshop · Regular",
  "workshop-vip": "Skillies Workshop · VIP",
  "batch-enrolment": "Skillies Batch · Upfront Enrolment",
  "test": "Skillies test charge",
};

type Body = {
  tier?: keyof typeof TIER_AMOUNTS_PAISE;
  full_name?: string;
  phone?: string;
  email?: string;
  source?: string; // e.g. "voice-chat"
};

export async function POST(req: Request) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay is not configured." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const tier = body.tier as string;
  const full_name = (body.full_name || "").trim();
  const phone = (body.phone || "").trim();
  const email = (body.email || "").trim();

  if (!tier || !(tier in TIER_AMOUNTS_PAISE)) {
    return NextResponse.json(
      { error: `Invalid tier. Use one of: ${Object.keys(TIER_AMOUNTS_PAISE).join(", ")}` },
      { status: 400 },
    );
  }
  if (!full_name) {
    return NextResponse.json({ error: "full_name is required." }, { status: 400 });
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ error: "A valid phone is required." }, { status: 400 });
  }

  const amount = TIER_AMOUNTS_PAISE[tier];
  const description = TIER_LABELS[tier];

  const razor = new Razorpay({ key_id: keyId, key_secret: keySecret });

  // Razorpay requires E.164-ish phone. Accept whatever the agent passes
  // and normalise: digits-only, prefix +91 if it looks like a 10-digit
  // Indian mobile. Anything else, send as-is and let Razorpay reject.
  const digits = phone.replace(/\D/g, "");
  const contact =
    digits.length === 10 ? `+91${digits}` : phone.startsWith("+") ? phone : `+${digits}`;

  try {
    // Razorpay expires links in 24h by default if `expire_by` is set; we
    // intentionally leave it open so a slow buyer can still pay.
    const link = await razor.paymentLink.create({
      amount,
      currency: "INR",
      accept_partial: false,
      description,
      customer: {
        name: full_name,
        contact,
        ...(email ? { email } : {}),
      },
      // Don't double-notify — the agent already shared the link in chat,
      // and our SMS budget is finite. Set true if you want Razorpay to
      // SMS/email the buyer themselves.
      notify: { sms: false, email: false },
      reminder_enable: true,
      notes: {
        source: body.source || "voice-chat",
        tier,
        site: "skillies.ai",
      },
    });

    return NextResponse.json({
      id: link.id,
      short_url: link.short_url,
      amount,
      amount_inr: amount / 100,
      tier,
      description,
    });
  } catch (e: unknown) {
    const anyErr = e as {
      message?: string;
      error?: { description?: string; code?: string; reason?: string };
      statusCode?: number;
    };
    const msg =
      anyErr?.error?.description ||
      anyErr?.error?.reason ||
      anyErr?.message ||
      "Failed to create payment link.";
    console.error("[rzp payment-link] failed", {
      statusCode: anyErr?.statusCode,
      code: anyErr?.error?.code,
      description: anyErr?.error?.description,
      reason: anyErr?.error?.reason,
      tier,
      amount,
    });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
