/**
 * /student/profile — account settings page.
 *
 * Layout: public TopNav + cream-background main (matches the rest of
 * the consumer site). Form uses the polished admin-ui primitives.
 *
 * Editable: first/last name, email. Phone is the login key and shown
 * read-only — email Ehsan to rotate it. Save goes through
 * /api/auth/complete-signup which uses service-role to dodge RLS.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import TopNav from "@/components/design/TopNav";
import Card from "@/components/admin-ui/Card";
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
          maxWidth: 920,
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        <Link
          href="/student"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#525252",
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          ← Back to dashboard
        </Link>

        <h2
          style={{
            margin: 0,
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#0A0A0A",
            lineHeight: 1.1,
          }}
        >
          Your account
        </h2>
        <p
          style={{
            margin: "8px 0 32px",
            fontSize: 15,
            color: "#525252",
            lineHeight: 1.55,
            maxWidth: "60ch",
          }}
        >
          Edit how Skillies addresses you and where we send course
          updates. Your login phone is fixed — email Ehsan to change it.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 320px)",
            gap: 16,
            alignItems: "start",
          }}
          className="profile-grid"
        >
          <Card padding={28}>
            <StudentProfileForm
              initial={{
                first_name: profile?.first_name ?? "",
                last_name: profile?.last_name ?? "",
                full_name: profile?.full_name ?? "",
                email: profile?.email ?? "",
                phone: profile?.phone ?? "",
              }}
            />
          </Card>

          <Card padding={20}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#A3A3A3",
              }}
            >
              Account
            </div>
            <Row label="Member since" value={fmtDate(profile?.created_at)} />
            <Row label="Phone (login)" value={profile?.phone ?? "—"} mono />
            <Row label="Email" value={profile?.email || "—"} />
          </Card>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .profile-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </main>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: 14,
        paddingTop: 14,
        borderTop: "1px solid rgba(17,24,39,0.06)",
      }}
    >
      <div style={{ fontSize: 11, color: "#A3A3A3", marginBottom: 4 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#0A0A0A",
          fontWeight: 500,
          fontFamily: mono ? "ui-monospace, Menlo, monospace" : undefined,
          wordBreak: "break-all",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function fmtDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}
