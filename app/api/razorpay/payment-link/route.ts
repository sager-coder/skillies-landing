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
// `description` shows on the Razorpay-hosted payment page as the line
// item. Razorpay's merchant header on that page is account-level (currently
// the merchant is registered as "Pageboo"). Until that's renamed in the
// Razorpay dashboard, prefix every description with "SKILLIES.AI" so the
// visitor isn't confused about who they're paying.
const TIER_LABELS: Record<string, string> = {
  "workshop-early": "SKILLIES.AI · Workshop Early Bird (May 17, Malappuram)",
  "workshop-regular": "SKILLIES.AI · Workshop Regular (May 17, Malappuram)",
  "workshop-vip": "SKILLIES.AI · Workshop VIP (May 17, Malappuram)",
  "batch-enrolment": "SKILLIES.AI · Batch Upfront Enrolment",
  "test": "SKILLIES.AI · test charge",
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

  const amount = TIER_AMOUNTS_PAISE[tier];
  const description = TIER_LABELS[tier];

  const razor = new Razorpay({ key_id: keyId, key_secret: keySecret });

  // Razorpay's payment-link API requires a customer name + contact to
  // CREATE the link, but the visitor who actually pays fills in their
  // own details on the Razorpay-hosted page — the customer field on the
  // link is just a label. Default to the Skillies brand contact when
  // the agent hasn't collected the visitor's info, so the link can be
  // sent instantly with no friction. The Razorpay payment-capture
  // webhook records the real payer's contact at payment time.
  const SKILLIES_DEFAULT_CONTACT = "+918089941131";
  const SKILLIES_DEFAULT_NAME = "Skillies Visitor";
  const customerName = full_name || SKILLIES_DEFAULT_NAME;

  let contact: string;
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    contact =
      digits.length === 10 ? `+91${digits}` : phone.startsWith("+") ? phone : `+${digits}`;
  } else {
    contact = SKILLIES_DEFAULT_CONTACT;
  }

  try {
    // Razorpay expires links in 24h by default if `expire_by` is set; we
    // intentionally leave it open so a slow buyer can still pay.
    const link = await razor.paymentLink.create({
      amount,
      currency: "INR",
      accept_partial: false,
      description,
      customer: {
        name: customerName,
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
