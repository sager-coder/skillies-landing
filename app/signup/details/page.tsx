/**
 * /signup/details — "complete your profile" step after first OTP login.
 *
 * The login/verify route redirects here when a freshly-signed-in user
 * has missing first_name or email. Once they save, we send them on to
 * the page they were originally going to (`?next=...`).
 *
 * Phone is the login key and read-only here — they can't change it on
 * this screen (would require re-OTP).
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import SignupDetailsForm from "@/components/skillies-school/SignupDetailsForm";
import { Wordmark, Grain } from "@/components/design/Primitives";

export const metadata: Metadata = {
  title: "Complete your profile · Skillies",
};

export const dynamic = "force-dynamic";

type Params = { searchParams: Promise<{ next?: string }> };

export default async function SignupDetailsPage({ searchParams }: Params) {
  const { next: rawNext } = await searchParams;
  const next = sanitizeNext(rawNext);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/signup/details?next=" + next)}`);

  // Use admin client to dodge the post-OTP RLS race (same trade-off
  // documented on /admin/page.tsx — we still gate on auth above).
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name, full_name, email, phone")
    .eq("id", user.id)
    .maybeSingle();

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

        <div
          style={{
            marginTop: 28,
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
          }}
        >
          Almost there
        </div>
        <h1
          style={{
            margin: "10px 0 6px",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(32px, 5vw, 46px)",
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
            lineHeight: 1.05,
          }}
        >
          Tell us who{" "}
          <em style={{ color: "#C62828" }}>you are.</em>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: "0 0 24px",
            lineHeight: 1.6,
          }}
        >
          We use this on your dashboard, in admin emails, and when Ehsan
          confirms course access on WhatsApp.
        </p>

        <SignupDetailsForm
          initial={{
            first_name: profile?.first_name ?? "",
            last_name: profile?.last_name ?? "",
            email: profile?.email ?? "",
            phone: profile?.phone ?? "",
            // If full_name exists but first/last don't, try to split.
            full_name: profile?.full_name ?? "",
          }}
          next={next}
        />
      </div>
    </main>
  );
}

/**
 * Whitelist `next` to only same-origin paths to prevent open redirect.
 */
function sanitizeNext(raw: string | undefined): string {
  if (!raw) return "/student";
  if (!raw.startsWith("/")) return "/student";
  if (raw.startsWith("//")) return "/student";
  return raw;
}
