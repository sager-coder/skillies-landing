import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

type Body = {
  phone?: string;
  full_name?: string;
  email?: string;
  course?: string;
  tier?:
    | "founding"
    | "standard"
    | "pro"
    | "workshop-early"
    | "workshop-regular"
    | "workshop-vip";
  amount?: number; // paise; allows a ₹1 test override without shipping new tier pricing
};

// Source of truth for what each tier costs, in paise.
// Kept server-side so the client can't request a discount by tampering with the payload.
const TIER_AMOUNTS_PAISE: Record<string, number> = {
  founding: 4_500_000,   // ₹45,000 — closed Batch 001 (historical, don't reuse)
  standard: 3_500_000,   // ₹35,000 — 50-day cohort (current public price)
  pro: 17_500_000,       // ₹1,75,000 — founding-price mentorship (WhatsApp-gated, usually sent manually)
  "workshop-early": 99_900,    // ₹999 — Calicut workshop early bird (first 50)
  "workshop-regular": 199_900, // ₹1,999 — Calicut workshop regular (next 75)
  "workshop-vip": 299_900,     // ₹2,999 — Calicut workshop VIP (last 25: front row + signed book + post-event WhatsApp)
};
const VALID_TIERS = Object.keys(TIER_AMOUNTS_PAISE);

export async function POST(req: Request) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay is not configured yet." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const phone = (body.phone || "").trim();
  const full_name = (body.full_name || "").trim();
  const email = (body.email || "").trim();
  const course = (body.course || "kdp-mastery").trim();
  const tier = body.tier || "standard";

  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "A valid phone number is required." },
      { status: 400 },
    );
  }
  if (!full_name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!VALID_TIERS.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
  }

  // Allow a ₹1 override for end-to-end testing, only when explicitly passed as 100 paise.
  // Everything else snaps to the server-side tier price — the client can't "ask for" a discount.
  const amount =
    body.amount === 100 ? 100 : TIER_AMOUNTS_PAISE[tier];

  const razor = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razor.orders.create({
      amount,
      currency: "INR",
      receipt: `skl_${course.slice(0, 18)}_${Date.now()}`.slice(0, 40),
      notes: {
        course,
        tier,
        phone,
        full_name,
        email,
        source: "skillies.ai",
      },
    });
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (e: unknown) {
    // Razorpay's SDK throws plain objects, not Error instances. Pull the
    // actual reason out so the UI and logs aren't stuck on "Failed to
    // create order."
    const anyErr = e as {
      message?: string;
      error?: { description?: string; code?: string; reason?: string };
      statusCode?: number;
    };
    const msg =
      anyErr?.error?.description ||
      anyErr?.error?.reason ||
      anyErr?.message ||
      "Failed to create order.";
    console.error("[rzp create-order] failed", {
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
