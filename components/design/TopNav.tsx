"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Link = { href: string; label: string };

const LINKS: Link[] = [
  { href: "/", label: "Home" },
  { href: "/for", label: "For Business" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/skillies-school", label: "Skillies School" },
];

// When the user clicks a link that points to "/", scroll to top.
// If they're already on the home page the browser won't re-navigate,
// so we trigger the scroll explicitly. On other pages it's harmless —
// navigation happens immediately after.
const scrollTopIfHome = (href: string) => {
  if (href === "/" && typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

export default function TopNav({
  cta = {
    href: "https://cal.com/sager-zmd4kl/30min",
    label: "Book a call",
  },
}: {
  cta?: { href: string; label: string };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // null = not yet known; true/false = resolved. Server-rendered HTML
  // is always `null` (no SSR auth check), so the very first paint shows
  // neither Sign in nor Logout — then the useEffect below resolves it
  // within a few ms on the client.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth state, with a two-stage resolution:
  //   1. Synchronous cookie probe — sets the button immediately based
  //      on whether the Supabase auth-token cookie exists. May be a
  //      slight false positive (stale cookie pre-rotation) but only
  //      for a few ms before the async check below corrects it.
  //   2. Async `getUser()` — authoritative; also fetches is_admin.
  //
  // Subscribed to auth-state changes so logout / fresh sign-in flips
  // the button without a page reload.
  useEffect(() => {
    let cancelled = false;
    const supabase = createSupabaseBrowserClient();

    // 1. Synchronous cookie probe
    try {
      if (typeof document !== "undefined") {
        const hasToken = document.cookie
          .split(";")
          .map((c) => c.trim())
          .some((c) => /^sb-[^=]*-auth-token/i.test(c));
        if (hasToken) setSignedIn(true);
      }
    } catch {
      /* swallow */
    }

    // 2. Async resolution
    const sync = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) {
          setSignedIn(false);
          setIsAdmin(false);
          return;
        }
        setSignedIn(true);
        const { data } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .maybeSingle();
        if (!cancelled) setIsAdmin(!!data?.is_admin);
      } catch {
        if (!cancelled) setSignedIn(false);
      }
    };

    sync();
    const { data: sub } = supabase.auth.onAuthStateChange(() => sync());
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const onLogout = async () => {
    // The default signOut() makes a network call to Supabase's
    // /auth/v1/logout to invalidate the refresh token server-side. In
    // some environments that call hangs indefinitely (slow Supabase,
    // odd CORS, etc.), and because the redirect lives inside a finally
    // block AFTER `await`, the page never navigates. Two safeguards:
    //   1. Use `scope: 'local'` — skips the network call entirely and
    //      just clears the local session/cookie via the storage adapter.
    //   2. Race it against a hard 1.5s timeout. If even the local clear
    //      hangs we still proceed to the manual cookie wipe + redirect.
    try {
      const supabase = createSupabaseBrowserClient();
      await Promise.race([
        supabase.auth.signOut({ scope: "local" }),
        new Promise<void>((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch {
      /* swallow — fall through to manual clear */
    }
    // Belt-and-braces: explicitly expire any Supabase auth cookies.
    try {
      for (const part of document.cookie.split(";")) {
        const name = part.trim().split("=")[0];
        if (name && name.startsWith("sb-")) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      }
    } catch {
      /* swallow */
    }
    // Hard reload to the login page so server components re-render
    // with the cleared session cookie.
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeAnd = (fn?: () => void) => () => {
    setOpen(false);
    fn?.();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-60 transition-all duration-500 ease-in-out ${
          scrolled ? "py-3 sk-glass border-b" : "py-6 bg-transparent"
        }`}
        style={{ transform: "translateZ(0)" }}
      >
        <div className="sk-container flex items-center justify-between gap-8">
          <a
            href="/"
            aria-label="Skillies.AI — home"
            className="relative transition-transform duration-300 hover:scale-[1.02] flex items-center h-8 md:h-10"
            onClick={closeAnd()}
          >
            <img src="/skillies-logo-transparent.png" alt="Skillies.AI" className="h-full w-auto object-contain transform scale-[3.2] md:scale-[2.5] origin-left pointer-events-none" />
          </a>

          <div className="hidden md:flex items-center gap-10">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => scrollTopIfHome(l.href)}
                className="sk-font-meta text-[12px] font-semibold tracking-[0.1em] text-sk-ink opacity-70 transition-all duration-300 hover:opacity-100 hover:text-sk-red"
              >
                {l.label}
              </a>
            ))}
            {isAdmin && (
              <a
                href="/admin"
                className="sk-font-meta text-[12px] font-semibold tracking-[0.1em] text-sk-red opacity-80 transition-all duration-300 hover:opacity-100"
              >
                Admin
              </a>
            )}
          </div>

          <div className="flex items-center gap-6">
            {signedIn === false && (
              <a
                href="/login"
                className="hidden lg:block sk-font-meta text-[12px] font-semibold tracking-[0.1em] text-sk-ink opacity-60 transition-all duration-300 hover:opacity-100"
              >
                Sign in
              </a>
            )}
            {signedIn === true && (
              <>
                <a
                  href="/student"
                  className="hidden lg:block sk-font-meta text-[12px] font-semibold tracking-[0.1em] text-sk-ink opacity-60 transition-all duration-300 hover:opacity-100"
                >
                  Dashboard
                </a>
                <button
                  type="button"
                  onClick={onLogout}
                  className="hidden lg:block sk-font-meta text-[12px] font-semibold tracking-[0.1em] text-sk-red opacity-80 transition-all duration-300 hover:opacity-100 cursor-pointer bg-transparent border-none p-0 m-0"
                >
                  Logout
                </button>
              </>
            )}
            <a
              href={cta.href}
              target={cta.href.startsWith("http") ? "_blank" : undefined}
              rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="sk-shimmer relative inline-flex items-center justify-center px-5 py-2 bg-sk-red text-sk-cream rounded-full text-[11px] md:text-[12px] font-bold tracking-tight shadow-[0_8px_20px_rgba(217,52,43,0.15)] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_12px_30px_rgba(217,52,43,0.25)] active:scale-[0.98]"
            >
              {cta.label}
            </a>

            <button
              type="button"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-sk-hairline bg-sk-cream/50 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <div className="relative w-5 h-4">
                <span 
                  className={`absolute left-0 w-full h-[1.5px] bg-sk-ink transition-all duration-300 ${open ? "top-2 rotate-45" : "top-0"}`} 
                />
                <span 
                  className={`absolute left-0 w-full h-[1.5px] bg-sk-ink top-2 transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} 
                />
                <span 
                  className={`absolute left-0 w-full h-[1.5px] bg-sk-ink transition-all duration-300 ${open ? "top-2 -rotate-45" : "top-4"}`} 
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 h-[100dvh] w-screen z-55 pt-24 px-6 pb-10 bg-sk-cream flex flex-col sk-grain"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <div className="flex-1 flex flex-col gap-2 mt-8">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={closeAnd(() => scrollTopIfHome(l.href))}
                  className="flex items-center justify-between py-6 border-b border-sk-hairline"
                >
                  <span className="sk-font-display text-4xl text-sk-ink">{l.label}</span>
                  <span className="text-sk-red text-2xl">→</span>
                </motion.a>
              ))}
              {isAdmin && (
                <motion.a
                  href="/admin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + LINKS.length * 0.05 }}
                  onClick={closeAnd()}
                  className="flex items-center justify-between py-6 border-b border-sk-hairline"
                >
                  <span className="sk-font-display text-4xl text-sk-red">Admin</span>
                  <span className="text-sk-red text-2xl">→</span>
                </motion.a>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-auto space-y-4"
              >
                {signedIn === false && (
                  <>
                    <a
                      href="/signup"
                      onClick={closeAnd()}
                      className="flex items-center justify-between p-6 bg-sk-red text-sk-cream rounded-2xl shadow-xl"
                    >
                      <span className="sk-font-meta font-bold">Sign up</span>
                      <span>→</span>
                    </a>
                    <a
                      href="/login"
                      onClick={closeAnd()}
                      className="flex items-center justify-between p-6 bg-white/50 border border-sk-hairline rounded-2xl"
                    >
                      <span className="sk-font-meta font-bold">Sign in</span>
                      <span>→</span>
                    </a>
                  </>
                )}
                {signedIn === true && (
                  <>
                    <a
                      href="/student"
                      onClick={closeAnd()}
                      className="flex items-center justify-between p-6 bg-white/50 border border-sk-hairline rounded-2xl"
                    >
                      <span className="sk-font-meta font-bold">My Dashboard</span>
                      <span>→</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-between p-6 bg-sk-red text-sk-cream rounded-2xl shadow-xl cursor-pointer border-none"
                    >
                      <span className="sk-font-meta font-bold">Logout</span>
                      <span>↗</span>
                    </button>
                  </>
                )}
                <a
                  href={cta.href}
                  className="flex items-center justify-between p-6 bg-sk-cream border border-sk-hairline rounded-2xl"
                >
                  <span className="sk-font-meta font-bold">Book a call</span>
                  <span>↗</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
