import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RazorpayPayment = {
  id: string;
  amount: number;
  status: string;
  notes?: Record<string, string>;
  email?: string;
  contact?: string;
};

type RazorpayEventBody = {
  event: string;
  payload?: {
    payment?: { entity?: RazorpayPayment };
  };
};

/**
 * Razorpay webhook — auto-enrols a student the moment a payment is captured.
 * Verifies the X-Razorpay-Signature header against our shared webhook secret
 * before trusting any body fields.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 503 },
    );
  }

  // Razorpay signs the raw body, so we must not re-parse JSON before verifying.
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");

  const ok =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!ok) {
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  let body: RazorpayEventBody;
  try {
    body = JSON.parse(raw) as RazorpayEventBody;
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }

  // We only act on captured payments. Everything else (authorized, failed, refunded)
  // we ACK with 200 so Razorpay stops retrying, but we don't enrol.
  if (body.event !== "payment.captured") {
    return NextResponse.json({ ok: true, ignored: body.event });
  }

  const payment = body.payload?.payment?.entity;
  if (!payment) {
    return NextResponse.json(
      { error: "No payment in payload." },
      { status: 400 },
    );
  }

  const notes = payment.notes || {};
  const phoneRaw = (notes.phone || payment.contact || "").trim();
  const full_name = (notes.full_name || "").trim() || null;
  const email = (notes.email || payment.email || "").trim() || null;
  const course = (notes.course || "").trim();
  const tier = (notes.tier || "").trim();

  // Workshop tiers don't map to a course; they're a physical event. ACK and
  // let Ehsan see the standard Razorpay email notification. No /learn access
  // gets granted.
  if (tier.startsWith("workshop")) {
    console.log("[rzp webhook] workshop seat paid", {
      payment_id: payment.id,
      phone: phoneRaw,
      full_name,
      email,
      tier,
      amount: payment.amount,
    });
    return NextResponse.json({ ok: true, kind: "workshop" });
  }

  if (!phoneRaw || !course || !["founding", "standard", "pro"].includes(tier)) {
    // Payment is real, but our metadata is missing — accept & log so the retry
    // doesn't hammer us, but surface enough info for manual follow-up.
    console.error("[rzp webhook] payment captured with incomplete notes", {
      payment_id: payment.id,
      notes,
    });
    return NextResponse.json({ ok: true, enrolled: false });
  }

  // Normalise phone to E.164 (+91…) so it matches however the user signs in.
  const digits = phoneRaw.replace(/\D/g, "");
  const phone = digits.startsWith("91") ? `+${digits}` : `+91${digits}`;

  const admin = createSupabaseAdminClient();

  // Find or create the auth user by phone.
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();
  let userId = existingProfile?.id as string | undefined;

  if (!userId) {
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        phone,
        phone_confirm: true,
        ...(email ? { email, email_confirm: true } : {}),
      });
    if (createErr || !created.user) {
      console.error("[rzp webhook] failed to create auth user", createErr);
      return NextResponse.json(
        { error: createErr?.message || "User create failed." },
        { status: 500 },
      );
    }
    userId = created.user.id;
    await admin
      .from("profiles")
      .upsert(
        { id: userId, phone, full_name, email },
        { onConflict: "id" },
      );
  } else if (full_name || email) {
    await admin
      .from("profiles")
      .update({
        ...(full_name ? { full_name } : {}),
        ...(email ? { email } : {}),
      })
      .eq("id", userId);
  }

  const { error: enrollErr } = await admin
    .from("enrollments")
    .upsert(
      {
        user_id: userId,
        course_id: course,
        tier,
        notes: `razorpay:${payment.id} · ₹${(payment.amount / 100).toFixed(0)}`,
      },
      { onConflict: "user_id,course_id" },
    );
  if (enrollErr) {
    console.error("[rzp webhook] enroll upsert failed", enrollErr);
    return NextResponse.json({ error: enrollErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, enrolled: true, phone, course, tier });
}
