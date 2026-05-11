/**
 * /admin/* layout — applies to every page under /admin.
 *
 * Responsibilities:
 *   - Auth check: must be signed in AND `is_admin` on the profile. The
 *     proxy middleware already gates anon users; this layer enforces
 *     is_admin server-side so non-admins can't reach any subpage by
 *     typing the URL.
 *   - Renders the fixed sidebar + sticky top bar shell. The actual page
 *     content slots into the right of the sidebar with consistent
 *     padding.
 */
import { redirect } from "next/navigation";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import Sidebar from "@/components/admin-ui/Sidebar";
import TopBar from "@/components/admin-ui/TopBar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  // Use service-role to read is_admin — same trade-off the rest of
  // /admin code already makes, dodging a known RLS race right after
  // OTP that can return falsy is_admin and bounce admins out.
  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/skillies-school");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
        color: "#0A0A0A",
      }}
    >
      <Sidebar />
      <div
        style={{
          marginLeft: 240, // matches Sidebar width
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <TopBar />
        <main
          style={{
            flex: 1,
            padding: "32px",
            maxWidth: 1280,
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
