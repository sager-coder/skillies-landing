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

  // One-device-per-account enforcement. Only on /learn — /admin has its
  // own server-side gate and admins are exempt from the lock anyway.
  if (user && path.startsWith("/learn")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("bound_device_id, is_admin")
      .eq("id", user.id)
      .single();

    if (profile?.bound_device_id && !profile?.is_admin) {
      const cookie = req.cookies.get("skillies_device")?.value;
      if (!cookie || cookie !== profile.bound_device_id) {
        const lockUrl = new URL("/login", req.url);
        lockUrl.searchParams.set("locked", "1");
        return NextResponse.redirect(lockUrl);
      }
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
