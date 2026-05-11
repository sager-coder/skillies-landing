/**
 * /student/profile — small profile editor for the student.
 *
 * They can edit full_name + email. Phone is the login key (and the
 * device-binding handle), so we render it read-only.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import TopNav from "@/components/design/TopNav";
import StudentProfileForm from "@/components/skillies-school/StudentProfileForm";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Profile · Skillies School" };

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/student/profile");

  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name, full_name, phone, email, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <TopNav />
      <section
        style={{
          maxWidth: 600,
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <Link
          href="/student"
          style={{
            display: "inline-flex",
            gap: 6,
            fontSize: 13,
            color: "#6B7280",
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          ← Back to dashboard
        </Link>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
          }}
        >
          Profile settings
        </div>
        <h1
          style={{
            margin: "10px 0 24px",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(34px, 5vw, 48px)",
            letterSpacing: "-0.02em",
            color: "#1A1A1A",
            lineHeight: 1.05,
          }}
        >
          Your account
        </h1>

        <StudentProfileForm
          initial={{
            first_name: profile?.first_name ?? "",
            last_name: profile?.last_name ?? "",
            full_name: profile?.full_name ?? "",
            email: profile?.email ?? "",
            phone: profile?.phone ?? "",
          }}
        />
      </section>
    </main>
  );
}
