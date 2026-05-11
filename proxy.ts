/**
 * Next.js 16 proxy · runs on every request to refresh Supabase
 * cookies and gate /learn and /admin behind login.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // If Supabase isn't configured yet, skip auth — site stays in
  // pre-launch / under-construction mode.
  if (!url || !anonKey) {
    return res;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(toSet) {
        for (const { name, value, options } of toSet) {
          res.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const path = req.nextUrl.pathname;

  // Protect /learn
  if (path.startsWith("/learn") && !user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  // Protect /admin against unauthenticated users. The admin-vs-student
  // authorization (is_admin check) lives on /admin/page.tsx itself,
  // server-side — keeping it there avoids RLS / Edge read subtleties
  // that can silently return a falsy is_admin and ping-pong admins to
  // /learn even when their profile row has is_admin = true.
  if (path.startsWith("/admin") && !user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  // ── One-device-per-account enforcement is DISABLED ─────────────────
  // The DB columns (`profiles.bound_device_id`, `device_bound_at`) and
  // the `/api/auth/claim-device` endpoint still exist, but the middleware
  // no longer redirects to /login?locked=1 on a device mismatch. Flip
  // this feature back on by uncommenting the block in git history.
  // ───────────────────────────────────────────────────────────────────

  // Already-logged-in users hitting /login → bounce to their dashboard.
  // Admins default to /admin, everyone else to /student. /learn is a
  // dynamic route with no index page, so we never use it as default.
  if (path === "/login" && user) {
    let next = req.nextUrl.searchParams.get("next");
    if (!next) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();
      next = profile?.is_admin ? "/admin" : "/student";
    }
    return NextResponse.redirect(new URL(next, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/learn/:path*",
    "/admin/:path*",
    "/login",
  ],
};
