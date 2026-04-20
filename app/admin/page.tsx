import { redirect } from "next/navigation";
import {
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from "@/lib/supabase/server";
import LearnTopBar from "@/components/learn/LearnTopBar";
import AdminEnrollPanel from "@/components/admin/AdminEnrollPanel";
import AdminResetDevicePanel from "@/components/admin/AdminResetDevicePanel";
import AdminLessonsPanel from "@/components/admin/AdminLessonsPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  // Use service-role for the is_admin read. The row-level policy on
  // profiles can silently return null via the anon-key SSR client if
  // the auth cookie handshake is still mid-settle right after OTP
  // verify — which then ping-pongs Ehsan /admin → /learn. Admin
  // client bypasses RLS for this one read, while proxy.ts has already
  // confirmed the user is signed in.
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin, full_name, phone")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/learn");

  // Pull recent enrollments + recent profiles for context. Same story:
  // use the admin client so RLS doesn't hide rows for us.
  const { data: enrollments } = await admin
    .from("enrollments")
    .select("id, user_id, course_id, tier, enrolled_at, notes")
    .order("enrolled_at", { ascending: false })
    .limit(50);

  // Hydrate profiles for each user_id
  const userIds = Array.from(new Set((enrollments || []).map((e) => e.user_id)));
  const { data: profilesData } = userIds.length
    ? await admin
        .from("profiles")
        .select("id, phone, full_name, email")
        .in("id", userIds)
    : { data: [] };
  const profileMap = new Map((profilesData || []).map((p) => [p.id, p]));

  const enriched = (enrollments || []).map((e) => ({
    ...e,
    profile: profileMap.get(e.user_id) || null,
  }));

  return (
    <main style={{ minHeight: "100vh", background: "#FAF5EB" }}>
      <LearnTopBar />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 100px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
          }}
        >
          Admin · Skillies.AI
        </div>
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#1A1A1A",
            margin: "10px 0 8px",
          }}
        >
          Enrol students.
        </h1>
        <p style={{ fontSize: 15, color: "#6B7280", margin: "0 0 36px" }}>
          Type a phone number, pick a tier, click Enrol. The student gets access
          on their next login.
        </p>

        <AdminEnrollPanel />

        <div style={{ marginTop: 24 }}>
          <AdminLessonsPanel />
        </div>

        <div style={{ marginTop: 24 }}>
          <AdminResetDevicePanel />
        </div>

        <div style={{ marginTop: 56 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#9CA3AF",
              marginBottom: 18,
            }}
          >
            Recent enrollments · last 50
          </div>
          <div
            style={{
              background: "white",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#FAF5EB" }}>
                  {["Phone", "Name", "Course", "Tier", "When"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: "#9CA3AF",
                        borderBottom: "1px solid rgba(26,26,26,0.06)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enriched.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: 32, textAlign: "center", color: "#9CA3AF" }}
                    >
                      No enrollments yet. The first one will land here.
                    </td>
                  </tr>
                ) : (
                  enriched.map((e) => (
                    <tr key={e.id}>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#1A1A1A",
                          fontFamily: "ui-monospace, Menlo, monospace",
                          borderTop: "1px solid rgba(26,26,26,0.04)",
                        }}
                      >
                        {e.profile?.phone || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#1A1A1A",
                          borderTop: "1px solid rgba(26,26,26,0.04)",
                        }}
                      >
                        {e.profile?.full_name || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#1A1A1A",
                          borderTop: "1px solid rgba(26,26,26,0.04)",
                        }}
                      >
                        {e.course_id}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#C62828",
                          fontWeight: 700,
                          fontSize: 11,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          borderTop: "1px solid rgba(26,26,26,0.04)",
                        }}
                      >
                        {e.tier}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#6B7280",
                          fontFamily: "ui-monospace, Menlo, monospace",
                          fontSize: 12,
                          borderTop: "1px solid rgba(26,26,26,0.04)",
                        }}
                      >
                        {new Date(e.enrolled_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
