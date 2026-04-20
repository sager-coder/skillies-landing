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

  // One-device-per-account enforcement. Runs on /learn and /admin for
  // any signed-in user. The httpOnly `skillies_device` cookie is issued
  // by /api/auth/claim-device right after OTP verify. If it's missing or
  // doesn't match profiles.bound_device_id, this device isn't the one
  // the student bound — redirect to /login?locked=1. Users whose
  // bound_device_id is still null (legacy / brand-new) fall through.
  if (user && (path.startsWith("/learn") || path.startsWith("/admin"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("bound_device_id, is_admin")
      .eq("id", user.id)
      .single();

    if (profile?.bound_device_id) {
      const cookie = req.cookies.get("skillies_device")?.value;
      if (!cookie || cookie !== profile.bound_device_id) {
        const lockUrl = new URL("/login", req.url);
        lockUrl.searchParams.set("locked", "1");
        return NextResponse.redirect(lockUrl);
      }
    }

    // is_admin check for /admin
    if (path.startsWith("/admin") && !profile?.is_admin) {
      return NextResponse.redirect(new URL("/learn", req.url));
    }
  }

  // Already-logged-in users hitting /login → bounce to /learn
  if (path === "/login" && user) {
    const next = req.nextUrl.searchParams.get("next") || "/learn";
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
