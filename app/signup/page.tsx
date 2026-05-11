/**
 * /signup — primary entry point for new users.
 *
 * Two-step flow inside SignupForm:
 *   1. Form (name, email, phone, password) → Supabase signUp + OTP send
 *   2. OTP input → verifyOtp → session + profile sync → /student
 *
 * Anyone already signed in is bounced to their dashboard.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import SignupForm from "@/components/skillies-school/SignupForm";
import { Wordmark, Grain } from "@/components/design/Primitives";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign up · Skillies",
  description:
    "Create your Skillies account: name, email, WhatsApp number, password.",
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    // Already signed in — find the right landing.
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    redirect(profile?.is_admin ? "/admin" : "/student");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 85% 10%, rgba(198,40,40,0.18), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(201,162,78,0.16), transparent 60%), #FAF5EB",
        position: "relative",
        display: "grid",
        placeItems: "center",
        padding: "60px 24px",
      }}
    >
      <Grain opacity={0.06} />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          padding: 32,
          background: "white",
          borderRadius: 24,
          border: "1px solid rgba(26,26,26,0.08)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.10)",
        }}
      >
        <a href="/" style={{ textDecoration: "none" }}>
          <Wordmark size={20} />
        </a>
        <Suspense fallback={<FormFallback />}>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  );
}

function FormFallback() {
  return (
    <>
      <div style={{ marginTop: 28, height: 14 }} />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 56,
            background: "rgba(26,26,26,0.04)",
            borderRadius: 12,
            marginTop: 12,
          }}
        />
      ))}
      <div
        style={{
          height: 56,
          background: "rgba(26,26,26,0.04)",
          borderRadius: 999,
          marginTop: 18,
        }}
      />
    </>
  );
}
