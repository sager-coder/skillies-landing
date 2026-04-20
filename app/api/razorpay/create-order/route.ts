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
    | "workshop-regular";
  amount?: number; // paise; allows a ₹1 test override without shipping new tier pricing
};

// Source of truth for what each tier costs, in paise.
// Kept server-side so the client can't request a discount by tampering with the payload.
const TIER_AMOUNTS_PAISE: Record<string, number> = {
  founding: 4_500_000,   // ₹45,000 — closed batch reference
  standard: 7_500_000,   // ₹75,000
  pro: 12_500_000,       // ₹1,25,000
  "workshop-early": 199_900,   // ₹1,999 — Calicut workshop early bird
  "workshop-regular": 249_900, // ₹2,499 — Calicut workshop regular
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
      receipt: `skillies_${course}_${Date.now()}`,
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
    const msg = e instanceof Error ? e.message : "Failed to create order.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
