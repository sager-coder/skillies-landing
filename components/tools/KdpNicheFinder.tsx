"use client";

/**
 * KDP Niche Finder — full functional tool as a single client component.
 *
 * Talks to the FastAPI backend (sager-coder/skillies-kdp-niche-finder) at
 * NEXT_PUBLIC_NICHE_API_URL via fetch. Mirrors the behaviour of the
 * standalone web/static/app.js but rebuilt as native React for skillies.ai.
 *
 * Endpoints used:
 *   GET  /api/patterns                    — 8 opportunity-pattern presets
 *   GET  /api/tiers                       — pricing + paypal_client_id
 *   GET  /api/license/:code               — restore an existing license
 *   POST /api/license/redeem-free         — issue a 1-search free license
 *   POST /api/checkout/create-order       — create a PayPal order (sandbox/live)
 *   POST /api/checkout/capture-order      — verify capture + issue license
 *   POST /api/search                      — run a search; consumes 1 credit
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

// Backend URL fallback chain:
//   1. NEXT_PUBLIC_NICHE_API_URL — set in Vercel env for permanent host
//   2. Hardcoded Render web service URL (the production backend host)
//      — stable across redeploys. Update if the host ever changes (e.g. moving
//      to Fly.io). The Vercel env var should win in production anyway.
//   3. localhost — only used during `next dev` if the env var is unset
const API_URL =
  process.env.NEXT_PUBLIC_NICHE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://127.0.0.1:8765"
    : "https://skillies-kdp-niche-finder.onrender.com");

const LS_KEY = "skillies_license_code";
// Flag set after the visitor's first anonymous credit is consumed. Stops
// us from auto-issuing another anonymous license if their localStorage
// still has the flag (they have to buy / sign in to keep searching).
const LS_FREE_USED = "skillies_free_used";

// ── Types ───────────────────────────────────────────────────────────────────
type Pattern = {
  name: string;
  label: string;
  eyebrow: string;
  description: string;
};

type Tier = {
  name: string;
  credits: number;
  price_usd: number;
  label: string;
};

type License = {
  code: string;
  tier: string;
  credits_total: number;
  credits_remaining: number;
  email?: string;
};

type Book = {
  asin?: string;
  title?: string;
  author?: string;
  binding?: string;
  price_usd?: number;
  rating?: number;
  review_count?: number;
  avg90_bsr?: number;
  avg365_bsr?: number;
  publication_date?: string;
  page_count?: number;
  primary_category?: string;
  amazon_url?: string;
};

type SearchResponse = {
  filters_used: {
    preset?: string | null;
    title_keywords?: string[];
    bindings?: string[];
    bsr_window?: string;
    bsr_max?: number;
    price_range_usd?: [number, number];
    reviews_range?: [number, number];
    rating_range?: [number, number];
    interpretation?: string;
  };
  candidates_found: number;
  books: Book[];
  credits_remaining?: number;
  message?: string;
  error?: string;
};

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonsConfig) => { render: (selector: string | HTMLElement) => void };
    };
  }
}

type PayPalActions = {
  orderID: string;
};
type PayPalButtonsConfig = {
  style: { layout?: string; color?: string; shape?: string; label?: string; height?: number };
  createOrder: () => Promise<string>;
  onApprove: (data: PayPalActions) => Promise<void>;
  onError: (err: unknown) => void;
  onCancel: () => void;
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmtNumber = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("en-US").format(n);
const fmtPrice = (p: number | null | undefined) =>
  p == null ? "—" : `$${Number(p).toFixed(2)}`;

// Pragmatic email validator — same regex the backend uses.
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const isValidEmail = (s: string) => EMAIL_RE.test(s.trim()) && s.trim().length <= 200;

// Example prompts — concise, signal-friendly briefs that pair well with each
// of the 8 patterns. Tap to autofill the textarea. Phrasing kept tight so the
// AI parser produces sharp filters.
type ExamplePrompt = { label: string; brief: string; suggestPattern?: string };
const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  { label: "Adult coloring books",           brief: "Adult coloring books, paperback, 80-120 pages, low-content",                   suggestPattern: "low_content_selling" },
  { label: "Bad-reviewed reference guides",  brief: "Reference guides on tax filing for small businesses with bad reviews still selling", suggestPattern: "complete_guide_low_rated" },
  { label: "Hidden 5-star gardening books",  brief: "Gardening books for beginners with 4.5-star ratings but few reviews",          suggestPattern: "high_rated_sleepers" },
  { label: "Activity journals for adults",   brief: "Adult mindfulness journals and gratitude trackers, low-content paperback",     suggestPattern: "low_content_selling" },
  { label: "Beginner sourdough cookbooks",   brief: "Sourdough baking cookbooks for beginners, paperback, premium price",           suggestPattern: "premium_low_competition" },
];

// ── Component ───────────────────────────────────────────────────────────────
export default function KdpNicheFinder() {
  // ── Patterns / tiers / license ──
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [paypalClientId, setPaypalClientId] = useState<string>("");
  const [paypalEnv, setPaypalEnv] = useState<string>("sandbox");

  const [license, setLicense] = useState<License | null>(null);

  // ── Form state ──
  const [pattern, setPattern] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [format, setFormat] = useState<string>("all");

  // ── Status / results ──
  const [status, setStatus] = useState<{
    kind: "info" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);

  // ── Auth + redeem state ──
  type AuthTab = "email" | "buy" | "code";
  // Default to the Buy Credits tab — sign-up no longer gates the first
  // search (anonymous license is auto-issued), so the only thing visitors
  // need from this panel after their free search is to pay for more.
  const [authTab, setAuthTab] = useState<AuthTab>("email");
  const [email, setEmail] = useState("");
  const [restoreCode, setRestoreCode] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);

  const paypalLoadedRef = useRef(false);
  const paypalMountedRef = useRef<Set<string>>(new Set());

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          fetch(`${API_URL}/api/patterns`),
          fetch(`${API_URL}/api/tiers`),
        ]);
        if (!cancelled && pRes.ok) {
          const data = await pRes.json();
          setPatterns(data.patterns || []);
        }
        if (!cancelled && tRes.ok) {
          const data = await tRes.json();
          setTiers(data.tiers || []);
          setPaypalClientId(data.paypal_client_id || "");
          setPaypalEnv(data.paypal_env || "sandbox");
        }
      } catch (err) {
        console.warn("boot fetch failed:", err);
        if (!cancelled) {
          setStatus({
            kind: "error",
            message:
              "Couldn't reach the niche-finder API. Make sure NEXT_PUBLIC_NICHE_API_URL is set and the FastAPI service is reachable.",
          });
        }
      }
      // Restore license from localStorage. If none AND the visitor has
      // never used a free search before, auto-issue an anonymous license
      // behind the scenes — frictionless first-touch search, no email gate.
      if (!cancelled) {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
          try {
            const r = await fetch(
              `${API_URL}/api/license/${encodeURIComponent(saved)}`,
            );
            if (r.ok) {
              const data = await r.json();
              if (!cancelled) setLicense(data);
            } else {
              localStorage.removeItem(LS_KEY);
            }
          } catch {
            /* ignore */
          }
        } else if (!localStorage.getItem(LS_FREE_USED)) {
          // First-time visitor → quietly issue 1-credit anonymous license
          try {
            const r = await fetch(`${API_URL}/api/start-anonymous`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });
            if (r.ok) {
              const data = await r.json();
              if (!cancelled) {
                localStorage.setItem(LS_KEY, data.license.code);
                setLicense(data.license);
              }
            }
          } catch {
            /* ignore — they'll see the sign-up gate instead */
          }
        }
      }
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Pattern dropdown helper text ──
  const patternHelp = pattern
    ? patterns.find((p) => p.name === pattern)?.description ||
      "Or describe the signal in your own words above."
    : "Or describe the signal in your own words above.";

  // ── Continue with email — auto-detects returning vs new ──────────────────
  // Try find-by-email first; on 404, fall back to redeem-free (which gives
  // a 1-credit free license to a new email). One input, no "did I sign up
  // already?" decision for the user.
  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setStatus({
        kind: "error",
        message: "Please enter a valid email address (e.g. you@domain.com).",
      });
      return;
    }
    setStatus(null);
    try {
      const find = await fetch(`${API_URL}/api/license/find-by-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (find.ok) {
        const data = await find.json();
        localStorage.setItem(LS_KEY, data.license.code);
        setLicense(data.license);
        setStatus({
          kind: "info",
          message: `Welcome back. ${data.license.credits_remaining} ${
            data.license.credits_remaining === 1 ? "search" : "searches"
          } remaining on this account.`,
        });
        return;
      }
      // No existing license for this email → issue a free one.
      const redeem = await fetch(`${API_URL}/api/license/redeem-free`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!redeem.ok) {
        const err = await redeem.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${redeem.status}`);
      }
      const data = await redeem.json();
      localStorage.setItem(LS_KEY, data.license.code);
      setLicense(data.license);
      setStatus({
        kind: "info",
        message: `Free license issued. You have ${data.license.credits_remaining} search credit.`,
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message: `Couldn't continue: ${(err as Error).message}`,
      });
    }
  };

  // ── License restore ──
  const onRestoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = restoreCode.trim();
    if (!code) return;
    setStatus(null);
    try {
      const r = await fetch(
        `${API_URL}/api/license/${encodeURIComponent(code)}`,
      );
      if (!r.ok) throw new Error("not found");
      const data = await r.json();
      localStorage.setItem(LS_KEY, code);
      setLicense(data);
      setStatus({
        kind: "info",
        message: `License restored. ${data.credits_remaining} credits remaining.`,
      });
    } catch {
      setStatus({ kind: "error", message: "License code not found." });
    }
  };

  // ── Sign out ──
  const onSignOut = () => {
    if (
      !confirm(
        "Sign out and remove the license code from this browser? Save the code somewhere first if you want to restore it later.",
      )
    )
      return;
    localStorage.removeItem(LS_KEY);
    setLicense(null);
  };

  // ── PayPal load + render ──────────────────────────────────────────────────
  const ensurePayPal = useCallback(async () => {
    if (paypalLoadedRef.current) return;
    if (!paypalClientId) {
      setStatus({
        kind: "error",
        message: "PayPal isn't configured yet — paid tiers disabled.",
      });
      return;
    }
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        paypalClientId,
      )}&currency=USD&intent=capture`;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
    paypalLoadedRef.current = true;
  }, [paypalClientId]);

  const renderPayPalButton = useCallback(
    (mountId: string, tier: string) => {
      const el = document.getElementById(mountId);
      if (!el || !window.paypal) return;
      if (paypalMountedRef.current.has(mountId)) return;
      el.innerHTML = "";
      window.paypal
        .Buttons({
          style: {
            layout: "horizontal",
            color: "gold",
            shape: "rect",
            label: "pay",
            height: 44,
          },
          createOrder: async () => {
            const r = await fetch(`${API_URL}/api/checkout/create-order`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tier }),
            });
            if (!r.ok) {
              const e = await r.json().catch(() => ({}));
              throw new Error(e.detail || `HTTP ${r.status}`);
            }
            const data = await r.json();
            return data.order_id;
          },
          onApprove: async (api) => {
            try {
              const r = await fetch(`${API_URL}/api/checkout/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: api.orderID, tier }),
              });
              if (!r.ok) {
                const e = await r.json().catch(() => ({}));
                throw new Error(e.detail || `HTTP ${r.status}`);
              }
              const data = await r.json();
              localStorage.setItem(LS_KEY, data.license.code);
              setLicense(data.license);
              setStatus({
                kind: "info",
                message: `Payment confirmed — license ${data.license.code} with ${data.license.credits_remaining} credits added. Save the code somewhere safe.`,
              });
            } catch (err) {
              setStatus({
                kind: "error",
                message: `Payment captured but license issue failed: ${
                  (err as Error).message
                }. Save your PayPal order ID and email support.`,
              });
            }
          },
          onError: (err) => {
            console.error(err);
            setStatus({
              kind: "error",
              message: `PayPal error: ${String(err).slice(0, 240)}`,
            });
          },
          onCancel: () => {
            setStatus({ kind: "info", message: "Payment cancelled. No charge." });
          },
        })
        .render(`#${mountId}`);
      paypalMountedRef.current.add(mountId);
    },
    [],
  );

  // Render PayPal buttons once tiers + clientId arrive AND we don't have a
  // license yet AND the user is on the "Buy credits" tab (the mount divs
  // only exist then).
  useEffect(() => {
    if (!paypalClientId || license || authTab !== "buy") return;
    (async () => {
      await ensurePayPal();
      // Wait one tick so the divs from the Buy-tab render are in the DOM.
      requestAnimationFrame(() => {
        ["single", "pack10", "pack20"].forEach((t) =>
          renderPayPalButton(`pp-${t}`, t),
        );
      });
    })();
  }, [paypalClientId, license, authTab, ensurePayPal, renderPayPalButton]);

  // Render top-up PayPal buttons when the panel is showing.
  // Auto-expand when the user has run out of credits so they never have to
  // click a "Top up" button just to see the prices.
  useEffect(() => {
    if (!license) return;
    const panelVisible = showTopUp || license.credits_remaining === 0;
    if (!panelVisible) return;
    (async () => {
      await ensurePayPal();
      requestAnimationFrame(() => {
        ["single", "pack10", "pack20"].forEach((t) =>
          renderPayPalButton(`pp-${t}-topup`, t),
        );
      });
    })();
  }, [showTopUp, license, ensurePayPal, renderPayPalButton]);

  // ── Search ────────────────────────────────────────────────────────────────
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!license) {
      setStatus({
        kind: "error",
        message: "Get a free search or buy a credit pack first.",
      });
      document
        .getElementById("license-panel")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (license.credits_remaining <= 0) {
      setStatus({
        kind: "error",
        message: "You're out of credits. Buy more above to keep searching.",
      });
      return;
    }
    setLoading(true);
    setStatus(null);
    setResults(null);

    try {
      const r = await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          format,
          pattern: pattern || null,
          license_code: license.code,
        }),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.detail || `HTTP ${r.status}`);
      }
      const data: SearchResponse = await r.json();
      if (typeof data.credits_remaining === "number") {
        setLicense({ ...license, credits_remaining: data.credits_remaining });
        // First free search consumed → mark it so we don't auto-issue
        // another anonymous license. Visitor must buy a pack now.
        if (data.credits_remaining === 0 && !license.email) {
          localStorage.setItem(LS_FREE_USED, "1");
        }
      }
      setResults(data);
      if (data.filters_used?.interpretation) {
        setStatus({
          kind: "info",
          message: `How we read your brief: ${data.filters_used.interpretation}`,
        });
      }
      // Scroll to results
      setTimeout(() => {
        document
          .getElementById("kdp-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err) {
      setStatus({
        kind: "error",
        message: `Couldn't run that search: ${(err as Error).message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="kdp-tool" style={{ scrollMarginTop: 80 }}>
      {/* Scoped styling for the tool — overrides any Tailwind preflight quirks
          and forces VISIBLE borders / backgrounds. The parent skillies.ai
          design tokens (--sk-hairline at 10 % opacity, --sk-ink60 at 60 %)
          are too subtle for form chrome — bump everything to readable. */}
      <style jsx>{`
        /* ═══════════════════════════════════════════════════════════════
           Skillies KDP Niche Finder · component-scoped design system
           ═══════════════════════════════════════════════════════════════
           Colors mirror the parent skillies.ai brand tokens. Form chrome,
           cards, and chips inherit a single visual grammar — soft tan
           border, generous padding, dashed separator + monospace stat
           footer pattern (matches the signal-card aesthetic the user
           explicitly liked). Mobile rules at the bottom. */

        /* ── Card primitive ────────────────────────────────────────── */
        .kdp-tool :global(.kdp-card) {
          position: relative;
          background: #ffffff;
          border: 1.5px solid #e7dcc4;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 8px 28px rgba(40, 25, 10, 0.06);
          transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .kdp-tool :global(.kdp-card-hover):hover {
          border-color: #d9342b;
          box-shadow: 0 18px 44px rgba(40, 25, 10, 0.10);
          transform: translateY(-2px);
        }

        /* Dashed separator + monospace stat footer (signal-card pattern) */
        .kdp-tool :global(.kdp-card-stat) {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px dashed #e7dcc4;
          font-family: "SF Mono", ui-monospace, Menlo, monospace;
          font-size: 12px;
          color: #14141499;
          letter-spacing: -0.005em;
          line-height: 1.5;
        }

        /* Eyebrow pill (semantic colors) */
        .kdp-tool :global(.kdp-eyebrow-pill) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          line-height: 1;
        }
        .kdp-tool :global(.kdp-eyebrow-red) {
          background: rgba(217, 52, 43, 0.09);
          color: #d9342b;
        }
        .kdp-tool :global(.kdp-eyebrow-green) {
          background: rgba(0, 167, 84, 0.10);
          color: #00a754;
        }
        .kdp-tool :global(.kdp-eyebrow-gold) {
          background: rgba(201, 162, 78, 0.16);
          color: #8a6a1f;
        }
        .kdp-tool :global(.kdp-eyebrow-ink) {
          background: rgba(20, 20, 20, 0.06);
          color: #141414;
        }

        /* Card title — bold, all-caps, charcoal (mirrors signal cards) */
        .kdp-tool :global(.kdp-card-title) {
          font-family: inherit;
          font-weight: 800;
          font-size: 19px;
          line-height: 1.18;
          letter-spacing: -0.012em;
          color: #141414;
          margin: 6px 0 4px;
        }

        /* Card body — muted, italic accents allowed */
        .kdp-tool :global(.kdp-card-body) {
          font-size: 14.5px;
          line-height: 1.55;
          color: #14141499;
          margin: 0;
        }
        .kdp-tool :global(.kdp-card-body em) {
          font-family: "Instrument Serif", Georgia, serif;
          font-style: italic;
          font-weight: 600;
          color: #141414;
          font-size: 1.06em;
        }

        /* ── Form fields ───────────────────────────────────────────── */
        .kdp-tool :global(.kdp-input),
        .kdp-tool :global(.kdp-select),
        .kdp-tool :global(.kdp-textarea) {
          width: 100%;
          padding: 14px 16px;
          font-size: 15px;
          font-family: inherit;
          color: #141414;
          background: #ffffff;
          border: 1.5px solid #d6cdb9;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none;
          appearance: none;
        }
        .kdp-tool :global(.kdp-textarea) { resize: vertical; min-height: 96px; line-height: 1.5; }
        .kdp-tool :global(.kdp-select) {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='none' stroke='%23141414' stroke-width='2' d='M1 1l5 5 5-5'/></svg>");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 44px;
        }
        .kdp-tool :global(.kdp-input::placeholder),
        .kdp-tool :global(.kdp-textarea::placeholder) { color: #14141466; }
        .kdp-tool :global(.kdp-input:focus),
        .kdp-tool :global(.kdp-select:focus),
        .kdp-tool :global(.kdp-textarea:focus) {
          border-color: #d9342b;
          box-shadow: 0 0 0 4px rgba(217, 52, 43, 0.13);
        }
        .kdp-tool :global(.kdp-field-label) {
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3d5a3d;
          margin-bottom: 8px;
        }

        /* ── Tabs ──────────────────────────────────────────────────── */
        .kdp-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          background: #f0e8d8;
          border: 1.5px solid #d6cdb9;
          max-width: 680px;
          margin: 0 auto 28px;
        }
        .kdp-tab {
          flex: 1 1 auto;
          min-width: 0;
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          font-family: inherit;
          background: transparent;
          color: #14141499;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .kdp-tab:hover { color: #141414; background: rgba(255, 255, 255, 0.7); }
        .kdp-tab[data-active="true"] {
          background: #141414;
          color: #faf5eb;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
        }

        /* ── Buttons ───────────────────────────────────────────────── */
        .kdp-tool :global(.kdp-btn-primary),
        .kdp-tool :global(.kdp-btn-ink) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 15px 26px;
          border-radius: 999px;
          font-size: 14.5px;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0;
          border: none;
          cursor: pointer;
          transition: background 0.15s, transform 0.06s, box-shadow 0.15s;
        }
        .kdp-tool :global(.kdp-btn-primary) {
          color: #ffffff;
          background: #d9342b;
          box-shadow: 0 8px 22px rgba(217, 52, 43, 0.26);
        }
        .kdp-tool :global(.kdp-btn-primary:hover) {
          background: #b8291f;
          box-shadow: 0 12px 28px rgba(217, 52, 43, 0.34);
          transform: translateY(-1px);
        }
        .kdp-tool :global(.kdp-btn-primary:active) { transform: translateY(0) scale(0.99); }
        .kdp-tool :global(.kdp-btn-primary:disabled) {
          background: #9ca3af;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        .kdp-tool :global(.kdp-btn-ink) {
          color: #faf5eb;
          background: #141414;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
        }
        .kdp-tool :global(.kdp-btn-ink:hover) {
          background: #2d2d2d;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
          transform: translateY(-1px);
        }

        /* ── Tier cards (Buy Credits) ─────────────────────────────── */
        .kdp-tool :global(.kdp-tier) {
          position: relative;
          padding: 28px 26px 24px;
          border-radius: 18px;
          background: #ffffff;
          border: 1.5px solid #e7dcc4;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 8px 28px rgba(40, 25, 10, 0.06);
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
        }
        .kdp-tool :global(.kdp-tier:hover) {
          transform: translateY(-3px);
          box-shadow: 0 18px 44px rgba(40, 25, 10, 0.10);
        }
        .kdp-tool :global(.kdp-tier-pro) {
          border: 2px solid #c9a24e;
          box-shadow: 0 14px 38px rgba(201, 162, 78, 0.22);
        }
        .kdp-tool :global(.kdp-tier-pro:hover) {
          box-shadow: 0 22px 50px rgba(201, 162, 78, 0.28);
        }

        /* ── Auth card ─────────────────────────────────────────────── */
        .kdp-tool :global(.kdp-auth-card) {
          max-width: 540px;
          margin: 0 auto;
          padding: 36px;
          border-radius: 20px;
          background: #ffffff;
          border: 1.5px solid #e7dcc4;
          box-shadow: 0 22px 56px rgba(40, 25, 10, 0.09);
        }
        .kdp-tool :global(.kdp-auth-card-headline) {
          font-family: "Instrument Serif", Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.025em;
          color: #141414;
          margin: 6px 0 18px;
        }

        /* ── Example-prompt chips ──────────────────────────────────── */
        .kdp-tool :global(.kdp-examples) {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
          margin-top: 10px;
        }
        .kdp-tool :global(.kdp-examples-label) {
          font-size: 12px;
          font-weight: 700;
          color: #14141499;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-right: 6px;
        }
        .kdp-tool :global(.kdp-chip) {
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 600;
          color: #3d5a3d;
          background: #faf5eb;
          border: 1px solid #d6cdb9;
          border-radius: 999px;
          padding: 7px 13px;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s, color 0.12s, transform 0.05s;
          white-space: nowrap;
        }
        .kdp-tool :global(.kdp-chip:hover) {
          background: #ffffff;
          border-color: #d9342b;
          color: #d9342b;
        }
        .kdp-tool :global(.kdp-chip:active) { transform: scale(0.97); }

        /* ── Spinner ──────────────────────────────────────────────── */
        @keyframes kdp-spin { to { transform: rotate(360deg); } }

        /* ═══════════════════════════════════════════════════════════
           Mobile audit — comprehensive responsive rules
           ═══════════════════════════════════════════════════════════ */
        @media (max-width: 640px) {
          .kdp-tool :global(.kdp-card) { padding: 22px; border-radius: 16px; }
          .kdp-tool :global(.kdp-auth-card) { padding: 24px; border-radius: 18px; }
          .kdp-tool :global(.kdp-auth-card-headline) { font-size: 28px; }
          .kdp-tool :global(.kdp-tier) { padding: 22px 20px 20px; border-radius: 16px; }
          .kdp-tool :global(.kdp-card-title) { font-size: 17px; }
          .kdp-tool :global(.kdp-card-body) { font-size: 14px; }
          .kdp-tool :global(.kdp-input),
          .kdp-tool :global(.kdp-select),
          .kdp-tool :global(.kdp-textarea) {
            padding: 13px 14px;
            font-size: 16px;  /* iOS Safari: prevents zoom-on-focus when ≥16px */
          }
          .kdp-tool :global(.kdp-btn-primary),
          .kdp-tool :global(.kdp-btn-ink) {
            padding: 14px 22px;
            font-size: 14.5px;
          }
          .kdp-tabs {
            gap: 2px;
            padding: 4px;
          }
          .kdp-tab {
            padding: 10px 12px;
            font-size: 12px;
            letter-spacing: -0.01em;
          }
          .kdp-tool :global(.kdp-examples-label) { width: 100%; margin-bottom: 2px; }
          .kdp-tool :global(.kdp-chip) {
            padding: 7px 12px;
            font-size: 12px;
          }
          .kdp-tool :global(.kdp-card-stat) {
            font-size: 11px;
            line-height: 1.55;
          }
          .kdp-tool :global(.kdp-eyebrow-pill) {
            font-size: 10px;
            letter-spacing: 0.12em;
            padding: 4px 10px;
          }
        }

        /* Very small screens (iPhone SE / 375px) — tabs need a row break */
        @media (max-width: 380px) {
          .kdp-tabs { flex-wrap: wrap; }
          .kdp-tab { flex: 1 1 calc(50% - 4px); }
        }
      `}</style>

      {/* ─── Status banner ─── */}
      {status && (
        <div
          className={`mb-6 rounded-lg px-5 py-4 text-[14px] leading-relaxed ${
            status.kind === "error"
              ? "border"
              : "border"
          }`}
          style={
            status.kind === "error"
              ? {
                  background: "rgba(198,40,40,0.06)",
                  borderColor: "rgba(198,40,40,0.18)",
                  color: "var(--sk-red, #c62828)",
                }
              : {
                  background: "rgba(91,123,91,0.08)",
                  borderColor: "rgba(91,123,91,0.18)",
                  color: "#2d4a3a",
                }
          }
        >
          {status.message}
        </div>
      )}

      {/* ─── License panel ─── */}
      <section id="license-panel" className="mb-12">
        {!license && (
          <>
            <div className="text-center mb-8">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5"
                style={{
                  color: "var(--sk-red, #c62828)",
                  borderColor: "var(--sk-red, #c62828)",
                  background: "rgba(255,255,255,0.55)",
                }}
              >
                <span className="sk-font-meta text-[11px] font-bold tracking-[0.16em]">
                  ✕ START
                </span>
              </span>
              <h2
                className="sk-font-display"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 44px)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.04em",
                  color: "var(--sk-ink)",
                  margin: "0 auto 10px",
                  fontWeight: 900,
                  maxWidth: "20ch",
                }}
              >
                Pay for what you use
                <span style={{ color: "var(--sk-red, #c62828)" }}>.</span>{" "}
                <span
                  className="sk-font-display-italic"
                  style={{ color: "var(--sk-red, #c62828)" }}
                >
                  Nothing else
                </span>
                <span style={{ color: "var(--sk-red, #c62828)" }}>.</span>
              </h2>
              <p
                className="sk-font-body"
                style={{
                  fontSize: 15,
                  color: "var(--sk-ink60)",
                  margin: "0 auto",
                  maxWidth: "620px",
                }}
              >
                One free search to start. Sign in if you&apos;ve used Skillies
                before, or buy a credit pack — no subscription, no auto-renewal.
              </p>
            </div>

            {/* Tab bar */}
            <div className="kdp-tabs">
              {([
                ["email", "Continue with email"],
                ["buy", "Buy credits"],
                ["code", "License code"],
              ] as Array<[AuthTab, string]>).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setAuthTab(k); setStatus(null); }}
                  className="kdp-tab"
                  data-active={authTab === k}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Email tab (signup + signin unified) ── */}
            {authTab === "email" && (
              <div className="kdp-auth-card">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <span className="kdp-eyebrow-pill kdp-eyebrow-green">Free first search · no card</span>
                  <span className="text-[12px] font-medium" style={{ color: "#14141466" }}>Returning? Same email signs you back in</span>
                </div>
                <div className="kdp-auth-card-headline">
                  Continue with your email.
                </div>
                <form onSubmit={onEmailSubmit} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    autoComplete="email"
                    className="kdp-input"
                  />
                  <button type="submit" className="kdp-btn-primary">
                    Continue →
                  </button>
                </form>
                <div className="kdp-card-stat">
                  New email → 1 free search · Returning email → your existing license restored on this device · no password
                </div>
              </div>
            )}

            {/* ── Buy credits tab ── */}
            {authTab === "buy" && (
              <>
                {!paypalClientId && (
                  <div
                    className="rounded-xl p-5 mb-6 max-w-[680px] mx-auto text-center text-[14px] font-medium"
                    style={{ background: "rgba(217,52,43,0.07)", border: "1.5px solid rgba(217,52,43,0.28)", color: "#b8291f" }}
                  >
                    <strong>Heads up:</strong> PayPal can&apos;t reach the
                    niche-finder backend right now (the API service hasn&apos;t
                    been deployed yet). Sign up for a free search to try the
                    tool — paid packs will activate once the backend is online.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* ── Single $10 ── */}
                  <article className="kdp-tier">
                    <span className="kdp-eyebrow-pill kdp-eyebrow-red">One-off</span>
                    <div
                      className="leading-none"
                      style={{
                        fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                        fontSize: 44,
                        fontWeight: 600,
                        letterSpacing: "-0.04em",
                        color: "#d9342b",
                        marginTop: 4,
                      }}
                    >
                      $10
                    </div>
                    <h3 className="kdp-card-title">1 search</h3>
                    <p className="kdp-card-body">
                      Pay once, hunt one signal. No commitment.
                    </p>
                    <div id="pp-single" className="min-h-[48px] mt-2" />
                    <div className="kdp-card-stat">
                      No expiry · License code emailed instantly · $10 / search
                    </div>
                  </article>

                  {/* ── Pack 10 $50 ── */}
                  <article className="kdp-tier">
                    <span className="kdp-eyebrow-pill kdp-eyebrow-green">Starter</span>
                    <div
                      className="leading-none"
                      style={{
                        fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                        fontSize: 44,
                        fontWeight: 600,
                        letterSpacing: "-0.04em",
                        color: "#d9342b",
                        marginTop: 4,
                      }}
                    >
                      $50
                    </div>
                    <h3 className="kdp-card-title">10 searches</h3>
                    <p className="kdp-card-body">
                      Best for indie authors testing <em>a handful</em> of niches.
                    </p>
                    <div id="pp-pack10" className="min-h-[48px] mt-2" />
                    <div className="kdp-card-stat">
                      No expiry · License code emailed instantly · $5 / search
                    </div>
                  </article>

                  {/* ── Pack 20 $79 — recommended ── */}
                  <article className="kdp-tier kdp-tier-pro">
                    <span
                      className="absolute top-[-12px] right-4 px-2.5 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-[0.18em]"
                      style={{
                        background: "#c9a24e",
                        color: "#141414",
                        boxShadow: "0 4px 12px rgba(201, 162, 78, 0.32)",
                      }}
                    >
                      Best · save 60 %
                    </span>
                    <span className="kdp-eyebrow-pill kdp-eyebrow-gold">Pro</span>
                    <div
                      className="leading-none"
                      style={{
                        fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                        fontSize: 44,
                        fontWeight: 600,
                        letterSpacing: "-0.04em",
                        color: "#d9342b",
                        marginTop: 4,
                      }}
                    >
                      $79
                    </div>
                    <h3 className="kdp-card-title">20 searches</h3>
                    <p className="kdp-card-body">
                      Best value — <em>save 60 %</em> vs single. For serious KDP research.
                    </p>
                    <div id="pp-pack20" className="min-h-[48px] mt-2" />
                    <div className="kdp-card-stat">
                      No expiry · License code emailed instantly · $3.95 / search
                    </div>
                  </article>
                </div>
              </>
            )}

            {/* ── License code tab ── */}
            {authTab === "code" && (
              <div className="kdp-auth-card">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <span className="kdp-eyebrow-pill kdp-eyebrow-ink">Have a code?</span>
                  <span className="text-[12px] font-medium" style={{ color: "#14141466" }}>Switching devices</span>
                </div>
                <div className="kdp-auth-card-headline">
                  Paste it to restore.
                </div>
                <form onSubmit={onRestoreSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={restoreCode}
                    onChange={(e) => setRestoreCode(e.target.value)}
                    placeholder="sk-…"
                    autoComplete="off"
                    className="kdp-input"
                    style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                  />
                  <button type="submit" className="kdp-btn-ink">
                    Restore →
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {license && (
          <>
            <div
              className="rounded-2xl p-6 md:p-8 flex flex-wrap items-center justify-between gap-4"
              style={{
                background: "#ffffff",
                border: "1.5px solid #d4e0d4",
                borderLeft: "5px solid #5b7b5b",
                boxShadow: "0 12px 36px rgba(40,25,10,0.06)",
              }}
            >
              <div>
                <div className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: "#3d5a3d", marginBottom: 6 }}>Your license</div>
                <div
                  className="sk-font-display-italic"
                  style={{ fontSize: 40, color: "#141414", letterSpacing: "-0.03em", lineHeight: 1 }}
                >
                  {license.credits_remaining}
                  <span className="ml-2 text-[17px]" style={{ fontStyle: "normal", color: "#14141499", fontFamily: "Inter, sans-serif" }}>
                    {license.credits_remaining === 1 ? "search remaining" : "searches remaining"}
                  </span>
                </div>
                <div className="text-[12px] mt-2" style={{ color: "#14141466" }}>
                  Code: <code className="px-2 py-0.5 rounded font-mono text-[11px]" style={{ background: "#f0e8d8", color: "#141414" }}>{license.code}</code> · Tier: {license.tier}
                </div>
              </div>
              <div className="flex gap-2.5">
                {license.credits_remaining > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowTopUp((v) => !v)}
                    className="rounded-full px-5 py-2.5 text-[13px] font-bold transition-all"
                    style={{ color: "#fff", background: "#3d5a3d", border: "1.5px solid #3d5a3d", boxShadow: "0 4px 12px rgba(61,90,61,0.20)" }}
                  >
                    {showTopUp ? "Hide top-up" : "Top up credits"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onSignOut}
                  className="rounded-full px-5 py-2.5 text-[13px] font-bold transition-all"
                  style={{ color: "#141414", background: "#ffffff", border: "1.5px solid #d6cdb9" }}
                >
                  Sign out
                </button>
              </div>
            </div>

            {(showTopUp || license.credits_remaining === 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
                <article className="rounded-xl border p-6 bg-white" style={{ borderColor: "var(--sk-hairline)" }}>
                  <div className="text-[11px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#3d5a3d" }}>Add 1 search</div>
                  <div className="text-[28px] font-semibold mb-3" style={{ color: "var(--sk-red, #c62828)", fontFamily: "var(--font-fraunces, 'Fraunces', serif)" }}>$10</div>
                  <div id="pp-single-topup" className="min-h-[48px]" />
                </article>
                <article className="rounded-xl border p-6 bg-white" style={{ borderColor: "var(--sk-hairline)" }}>
                  <div className="text-[11px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#3d5a3d" }}>Add 10 searches</div>
                  <div className="text-[28px] font-semibold mb-3" style={{ color: "var(--sk-red, #c62828)", fontFamily: "var(--font-fraunces, 'Fraunces', serif)" }}>$50</div>
                  <div id="pp-pack10-topup" className="min-h-[48px]" />
                </article>
                <article className="rounded-xl border p-6 bg-white" style={{ borderColor: "var(--sk-hairline)" }}>
                  <div className="text-[11px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#3d5a3d" }}>Add 20 searches</div>
                  <div className="text-[28px] font-semibold mb-3" style={{ color: "var(--sk-red, #c62828)", fontFamily: "var(--font-fraunces, 'Fraunces', serif)" }}>$79</div>
                  <div id="pp-pack20-topup" className="min-h-[48px]" />
                </article>
              </div>
            )}
          </>
        )}
      </section>

      {/* ─── Search form ─── */}
      <section className="mb-16">
        <div className="text-center mb-7">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5"
            style={{
              color: "var(--sk-red, #c62828)",
              borderColor: "var(--sk-red, #c62828)",
              background: "rgba(255,255,255,0.55)",
            }}
          >
            <span className="sk-font-meta text-[11px] font-bold tracking-[0.16em]">
              ✕ RUN A SEARCH
            </span>
          </span>
          <h2
            className="sk-font-display"
            style={{
              fontSize: "clamp(28px, 3.4vw, 44px)",
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              color: "var(--sk-ink)",
              margin: "0 0 8px",
              fontWeight: 900,
            }}
          >
            Pick a signal
            <span style={{ color: "var(--sk-red, #c62828)" }}>.</span>{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red, #c62828)" }}
            >
              Describe your topic
            </span>
            <span style={{ color: "var(--sk-red, #c62828)" }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--sk-ink60)", margin: 0 }}>
            The signal is the bet. Your topic narrows where to look.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl p-7 md:p-9 bg-white"
          style={{
            border: "1.5px solid #e7dcc4",
            boxShadow: "0 18px 48px rgba(40, 25, 10, 0.08)",
          }}
        >
          <label className="block mb-6">
            <span className="kdp-field-label">
              1 · Pick the signal you want to hunt
            </span>
            <select
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="kdp-select"
            >
              <option value="">— let the AI pick from my description —</option>
              {patterns.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.label}
                </option>
              ))}
            </select>
            <span className="block text-[13px] italic mt-2" style={{ color: "#14141499" }}>
              {patternHelp}
            </span>
          </label>

          <label className="block mb-6">
            <span className="kdp-field-label">
              2 · What&apos;s the topic / niche?
            </span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Adult coloring books · Beginner sourdough cookbooks · 4.5-star gardening books with few reviews"
              className="kdp-textarea"
            />
            <div className="kdp-examples">
              <span className="kdp-examples-label">Try one</span>
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  className="kdp-chip"
                  onClick={() => {
                    setDescription(ex.brief);
                    if (ex.suggestPattern) setPattern(ex.suggestPattern);
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </label>

          <label className="block mb-7">
            <span className="kdp-field-label">
              3 · Format
              <span className="ml-2 normal-case tracking-normal text-[11px] font-medium" style={{ color: "#14141466" }}>(optional)</span>
            </span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="kdp-select"
              style={{ maxWidth: 360 }}
            >
              <option value="all">All formats</option>
              <option value="paperback">Paperback</option>
              <option value="hardcover">Hardcover</option>
              <option value="kindle">Kindle eBook</option>
              <option value="audiobook">Audiobook</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="kdp-btn-primary"
            style={{ padding: "17px 30px", fontSize: 16 }}
          >
            {loading ? (
              <>
                Hunting Amazon live data…
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "kdp-spin 0.8s linear infinite",
                  }}
                />
              </>
            ) : (
              "Hunt this signal"
            )}
          </button>
        </form>
      </section>

      {/* ─── Results ─── */}
      {results && (
        <section id="kdp-results" className="mb-12">
          <div className="flex justify-between items-baseline pb-3.5 mb-6 border-b" style={{ borderColor: "var(--sk-hairline)" }}>
            <h2
              className="sk-font-display-italic"
              style={{
                fontSize: 38,
                color: "var(--sk-ink)",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Top opportunities
            </h2>
            <div className="text-[13px]" style={{ color: "var(--sk-ink60)", letterSpacing: "0.04em" }}>
              {results.books.length} shown · {results.candidates_found} candidates analysed
            </div>
          </div>

          {/* Filter summary */}
          {results.filters_used && (
            <div
              className="rounded-lg px-5 py-4 mb-6 text-[14px]"
              style={{
                background: "rgba(198,40,40,0.04)",
                border: "1px solid rgba(198,40,40,0.16)",
                color: "var(--sk-ink)",
                fontWeight: 500,
              }}
            >
              <strong style={{ display: "block", marginBottom: 4, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sk-red, #c62828)", fontWeight: 700 }}>
                Live filter applied
              </strong>
              Format: {(results.filters_used.bindings || []).join(", ") || "any"} ·
              {" "}BSR window: {results.filters_used.bsr_window} ≤ {fmtNumber(results.filters_used.bsr_max)} ·
              {" "}Price: ${(results.filters_used.price_range_usd || [0, 0])[0]} – ${(results.filters_used.price_range_usd || [0, 0])[1]} ·
              {" "}Reviews: {(results.filters_used.reviews_range || [0, 0]).join("–")} ·
              {" "}Rating: {(results.filters_used.rating_range || [0, 0])[0]}★ – {(results.filters_used.rating_range || [0, 0])[1]}★
              {results.filters_used.preset && (<> · Preset: {results.filters_used.preset}</>)}
            </div>
          )}

          {/* Books list */}
          {results.books.length === 0 && (
            <div className="rounded-lg p-6 text-[15px]" style={{ background: "var(--sk-cream)", color: "var(--sk-ink60)" }}>
              {results.message || "No books matched. Try widening the criteria."}
            </div>
          )}
          <div className="grid gap-4">
            {results.books.map((b, i) => {
              const stars = b.rating == null ? "—" : `${b.rating}★`;
              const bsr = b.avg365_bsr ?? b.avg90_bsr;
              return (
                <article
                  key={b.asin || i}
                  className="rounded-md p-5 md:p-6 bg-white grid gap-5 transition-all duration-100"
                  style={{
                    border: "1px solid var(--sk-hairline)",
                    borderLeft: "4px solid var(--sk-gold, #c9a24e)",
                    gridTemplateColumns: "60px 1fr auto",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="text-center"
                    style={{
                      fontFamily: "var(--font-fraunces, 'Fraunces', serif)",
                      fontWeight: 600,
                      fontSize: 44,
                      color: "var(--sk-red, #c62828)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="text-[18px] font-semibold mb-1.5" style={{ color: "var(--sk-ink)" }}>
                      {b.title || "(untitled)"}
                    </div>
                    <div className="text-[14px] mb-3" style={{ color: "var(--sk-ink60)" }}>
                      {b.author || "—"} · {b.binding || "—"} · {b.primary_category || ""}
                    </div>
                    <div className="flex flex-wrap gap-4 text-[13px]" style={{ color: "var(--sk-ink60)" }}>
                      <div>Rating <strong style={{ color: "var(--sk-ink)", marginLeft: 4 }}>{stars}</strong></div>
                      <div>Reviews <strong style={{ color: "var(--sk-ink)", marginLeft: 4 }}>{fmtNumber(b.review_count)}</strong></div>
                      <div>BSR (1-year avg) <strong style={{ color: "var(--sk-ink)", marginLeft: 4 }}>{fmtNumber(bsr)}</strong></div>
                      <div>Pub date <strong style={{ color: "var(--sk-ink)", marginLeft: 4 }}>{b.publication_date || "—"}</strong></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <div
                      style={{
                        fontFamily: "var(--font-instrument-serif, 'Instrument Serif', serif)",
                        fontStyle: "italic",
                        fontSize: 28,
                        color: "#2d4a3a",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {fmtPrice(b.price_usd)}
                    </div>
                    {b.amazon_url && (
                      <a
                        href={b.amazon_url}
                        target="_blank"
                        rel="noopener"
                        className="text-[13px] font-bold tracking-[0.16em] uppercase"
                        style={{ color: "var(--sk-red, #c62828)" }}
                      >
                        View on Amazon →
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* PayPal env disclaimer */}
      {paypalClientId && paypalEnv === "sandbox" && (
        <div className="text-center text-[12px] mt-4" style={{ color: "var(--sk-ink40)" }}>
          PayPal in <strong>sandbox</strong> mode — use a sandbox test account, no real money moves.
        </div>
      )}
    </div>
  );
}
