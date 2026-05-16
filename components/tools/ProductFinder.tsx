"use client";

/**
 * Product Finder (India) — find what's winning on Amazon US before it
 * lands in India, then source it.
 *
 * Same FastAPI backend as the KDP Niche Finder, tool-namespaced:
 *   GET  /api/tiers?tool=products                 INR tiers + razorpay_key_id
 *   POST /api/start-anonymous?tool=products       3 free credits
 *   GET  /api/license/:code                       restore
 *   POST /api/checkout/razorpay/create-order      create Razorpay order
 *   POST /api/checkout/razorpay/verify            verify + issue license
 *   POST /api/search   { tool:"products", ... }   1 credit / search
 *
 * Deliberately simpler than KdpNicheFinder: no PayPal, no Supabase
 * email-bridge (that mints KDP free licenses — wrong for this tool).
 * License resolution: saved code → else 3 anonymous free. After that,
 * email is collected at Razorpay checkout and the pack is bought in INR.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_NICHE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://127.0.0.1:8765"
    : "https://skillies-kdp-niche-finder.onrender.com");

// Separate localStorage namespace so a Products license never collides
// with a KDP license in the same browser.
const LS_KEY = "skillies_pf_license_code";
const LS_FREE_USED = "skillies_pf_free_used";
const RZP_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type Tier = {
  name: string;
  credits: number;
  price_inr: number;
  label: string;
};
type Pattern = { name: string; label: string; eyebrow: string; description: string };
type License = {
  code: string;
  tier: string;
  credits_total: number;
  credits_remaining: number;
  email?: string;
};
type Product = {
  asin?: string;
  title?: string;
  brand?: string;
  binding?: string;
  price_usd?: number;
  rating?: number;
  review_count?: number;
  avg90_bsr?: number;
  avg365_bsr?: number;
  primary_category?: string;
  amazon_url?: string;
  match_reason?: string;
};
type SearchResponse = {
  filters_used: { interpretation?: string } & Record<string, unknown>;
  candidates_found: number;
  books: Product[];
  credits_remaining?: number;
  message?: string;
  error?: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (ev: string, cb: (e: unknown) => void) => void;
    };
  }
}

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const isValidEmail = (s: string) =>
  EMAIL_RE.test(s.trim()) && s.trim().length <= 200;

/**
 * Read the Supabase access token from the sitewide auth cookie (same
 * proven approach as the KDP tool — the @supabase/ssr browser client is
 * unreliable on a cold tool mount). Used only to RESTORE an existing
 * Product Finder license bought under this email; the token is
 * re-verified server-side, so reading the cookie grants no trust.
 */
function readSupabaseAccessTokenFromCookie(): string | null {
  try {
    if (typeof document === "undefined") return null;
    const parts = document.cookie.split(";").map((c) => c.trim());
    const names = parts.map((c) => c.slice(0, c.indexOf("=")));
    const baseName = names.find((n) => /^sb-.*-auth-token$/.test(n));
    const chunkZero = names.find((n) => /^sb-.*-auth-token\.0$/.test(n));
    if (!baseName && !chunkZero) return null;
    let raw = "";
    if (chunkZero) {
      const root = chunkZero.replace(/\.0$/, "");
      for (let i = 0; ; i++) {
        const pref = `${root}.${i}=`;
        const ck = parts.find((c) => c.startsWith(pref));
        if (!ck) break;
        raw += decodeURIComponent(ck.slice(pref.length));
      }
    } else if (baseName) {
      const pref = `${baseName}=`;
      const ck = parts.find((c) => c.startsWith(pref));
      if (!ck) return null;
      raw = decodeURIComponent(ck.slice(pref.length));
    }
    if (!raw) return null;
    const json = JSON.parse(atob(raw.replace(/^base64-/, ""))) as {
      access_token?: string;
      expires_at?: number;
    };
    if (!json?.access_token) return null;
    if (json.expires_at && json.expires_at * 1000 < Date.now()) return null;
    return json.access_token;
  } catch {
    return null;
  }
}

const fmtN = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("en-US").format(n);
const fmtUSD = (p: number | null | undefined) =>
  p == null ? "—" : `$${Number(p).toFixed(2)}`;
const fmtINR = (n: number) => `₹${new Intl.NumberFormat("en-IN").format(n)}`;

type ExamplePrompt = { label: string; brief: string };
const EXAMPLES: ExamplePrompt[] = [
  { label: "Kitchen gadgets, no-name brands", brief: "Kitchen gadgets selling well in the US with no famous brand and mediocre reviews — the classic 'market wants a better version' import play" },
  { label: "Phone accessories trending now", brief: "Phone accessories blowing up in the US right now, low competition, under $20" },
  { label: "Home organization, bad reviews", brief: "Home organization products still selling despite bad reviews, weak brands" },
  { label: "Pet products, low competition", brief: "Pet products with strong US sales but very few reviews — early movers" },
  { label: "Fitness gear under $25", brief: "Home fitness and resistance gear under $25, selling steadily, generic brands" },
  { label: "Beauty tools, weak brands", brief: "Beauty and personal-care tools selling well in the US with generic no-name brands and so-so reviews" },
  { label: "Baby products, few reviews", brief: "Baby and toddler products with strong US sales but under 30 reviews — low-competition early movers" },
  { label: "Car accessories, bad reviews", brief: "Car and automotive accessories still selling despite bad reviews and no major brand" },
  { label: "Garden & outdoor under $30", brief: "Garden, patio and outdoor products under $30 selling steadily in the US with weak brands" },
  { label: "Desk & office gadgets", brief: "Office and desk gadgets trending in the US right now, low competition, no famous brand" },
  { label: "Kids toys, no moat", brief: "Toys and games selling well in the US with generic brands and mediocre reviews — easy to replicate" },
  { label: "Health & wellness, premium", brief: "Premium-priced health and household products with weak incumbents and few reviews — fat margins" },
  { label: "Tools & DIY, bad reviews", brief: "Hand tools and DIY gadgets still selling despite under-3.5-star reviews and no-name brands" },
  { label: "Travel & bottles under $20", brief: "Travel accessories and water bottles under $20 selling steadily in the US, generic brands" },
];

export default function ProductFinder() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [license, setLicense] = useState<License | null>(null);

  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [pattern, setPattern] = useState("");
  // Render free-tier cold start can take 30–60s; show a loading state
  // until boot resolves so an empty dropdown never looks broken.
  const [booting, setBooting] = useState(true);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<{ kind: "info" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);

  type AuthTab = "buy" | "code" | "email";
  const [authTab, setAuthTab] = useState<AuthTab>("buy");
  const [restoreCode, setRestoreCode] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [buyEmail, setBuyEmail] = useState("");
  const [buyingTier, setBuyingTier] = useState<string | null>(null);

  const rzpLoadedRef = useRef(false);

  // ── Boot: tiers + license resolution ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tRes, pRes] = await Promise.all([
          fetch(`${API_URL}/api/tiers?tool=products`),
          fetch(`${API_URL}/api/patterns?tool=products`),
        ]);
        if (!cancelled && tRes.ok) {
          const d = await tRes.json();
          setTiers((d.tiers || []).filter((t: Tier) => t.price_inr > 0));
          setRazorpayKeyId(d.razorpay_key_id || "");
        }
        if (!cancelled && pRes.ok) {
          const d = await pRes.json();
          setPatterns(d.patterns || []);
        }
      } catch {
        if (!cancelled)
          setStatus({ kind: "error", message: "Couldn't reach the Product Finder API. Try again in a moment." });
      }

      if (cancelled) return;
      let licenseSet = false;
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        try {
          const r = await fetch(`${API_URL}/api/license/${encodeURIComponent(saved)}`);
          if (r.ok) {
            const d = await r.json();
            if (!cancelled) {
              setLicense(d);
              licenseSet = true;
            }
          } else {
            localStorage.removeItem(LS_KEY);
          }
        } catch {
          /* ignore */
        }
      }
      // Signed in (sitewide email)? Restore an existing PRODUCTS license
      // bought under this email — cross-device parity with the niche
      // finder. 404 ⇒ no products pack on this email: stay silent and
      // fall through to the 3 anonymous free searches.
      if (!cancelled && !licenseSet) {
        const tok = readSupabaseAccessTokenFromCookie();
        if (tok) {
          try {
            const r = await fetch(`${API_URL}/api/license/auth-email-continue`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: tok, tool: "products" }),
            });
            if (r.ok) {
              const d = await r.json();
              if (!cancelled) {
                localStorage.setItem(LS_KEY, d.license.code);
                setLicense(d.license);
                licenseSet = true;
              }
            }
          } catch {
            /* ignore — anon path below */
          }
        }
      }
      if (!cancelled && !licenseSet && !localStorage.getItem(LS_FREE_USED)) {
        try {
          const r = await fetch(`${API_URL}/api/start-anonymous?tool=products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (r.ok) {
            const d = await r.json();
            if (!cancelled) {
              localStorage.setItem(LS_KEY, d.license.code);
              setLicense(d.license);
            }
          }
        } catch {
          /* ignore — they'll see the buy panel */
        }
      }
      if (!cancelled) setBooting(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Razorpay loader ───────────────────────────────────────────────────────
  const ensureRazorpay = useCallback(async () => {
    if (rzpLoadedRef.current && window.Razorpay) return;
    await new Promise<void>((resolve, reject) => {
      if (window.Razorpay) {
        rzpLoadedRef.current = true;
        return resolve();
      }
      const s = document.createElement("script");
      s.src = RZP_SRC;
      s.onload = () => {
        rzpLoadedRef.current = true;
        resolve();
      };
      s.onerror = () => reject(new Error("Razorpay failed to load"));
      document.head.appendChild(s);
    });
  }, []);

  const buyTier = useCallback(
    async (tierName: string) => {
      setStatus(null);
      const email = buyEmail.trim().toLowerCase();
      if (!isValidEmail(email)) {
        setStatus({ kind: "error", message: "Enter a valid email — your license is sent there." });
        return;
      }
      if (!razorpayKeyId) {
        setStatus({ kind: "error", message: "Payments aren't enabled yet. Please try again shortly." });
        return;
      }
      setBuyingTier(tierName);
      try {
        await ensureRazorpay();
        const orderRes = await fetch(`${API_URL}/api/checkout/razorpay/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier: tierName, email }),
        });
        if (!orderRes.ok) {
          const e = await orderRes.json().catch(() => ({}));
          throw new Error(e.detail || `HTTP ${orderRes.status}`);
        }
        const order = await orderRes.json();
        const rzp = new window.Razorpay!({
          key: order.key_id || razorpayKeyId,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Skillies Product Finder",
          description: tiers.find((t) => t.name === tierName)?.label || "Search credits",
          order_id: order.order_id,
          prefill: { email },
          theme: { color: "#d9342b" },
          handler: async (resp: unknown) => {
            const r = resp as {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            };
            try {
              const v = await fetch(`${API_URL}/api/checkout/razorpay/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: r.razorpay_order_id,
                  razorpay_payment_id: r.razorpay_payment_id,
                  razorpay_signature: r.razorpay_signature,
                  tier: tierName,
                  email,
                }),
              });
              if (!v.ok) {
                const e = await v.json().catch(() => ({}));
                throw new Error(e.detail || `HTTP ${v.status}`);
              }
              const d = await v.json();
              localStorage.setItem(LS_KEY, d.license.code);
              setLicense(d.license);
              setShowTopUp(false);
              setStatus({
                kind: "info",
                message: `Payment confirmed — ${d.license.credits_remaining} searches added. Your license code is saved on this device and emailed to you.`,
              });
            } catch (err) {
              setStatus({
                kind: "error",
                message: `Paid, but license issue failed: ${(err as Error).message}. Save your Razorpay payment id and email support.`,
              });
            } finally {
              setBuyingTier(null);
            }
          },
        });
        rzp.on("payment.failed", () => {
          setStatus({ kind: "error", message: "Payment failed or was cancelled. No charge." });
          setBuyingTier(null);
        });
        rzp.open();
      } catch (err) {
        setStatus({ kind: "error", message: `Couldn't start checkout: ${(err as Error).message}` });
        setBuyingTier(null);
      }
    },
    [buyEmail, razorpayKeyId, tiers, ensureRazorpay],
  );

  const onRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = restoreCode.trim();
    if (!code) return;
    setStatus(null);
    try {
      const r = await fetch(`${API_URL}/api/license/${encodeURIComponent(code)}`);
      if (!r.ok) throw new Error("not found");
      const d = await r.json();
      localStorage.setItem(LS_KEY, code);
      setLicense(d);
      setStatus({ kind: "info", message: `License restored. ${d.credits_remaining} searches remaining.` });
    } catch {
      setStatus({ kind: "error", message: "License code not found." });
    }
  };

  const onSignOut = () => {
    if (!confirm("Remove the license code from this browser? Save it first if you want to restore later.")) return;
    localStorage.removeItem(LS_KEY);
    setLicense(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!license) {
      setStatus({ kind: "error", message: "Get free searches or buy a pack first." });
      document.getElementById("pf-license")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (license.credits_remaining <= 0) {
      setStatus({ kind: "error", message: "You're out of searches. Buy a pack below to keep going." });
      setShowTopUp(true);
      document.getElementById("pf-license")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (description.trim().length < 4) {
      setStatus({ kind: "error", message: "Describe the product you want to find." });
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
          tool: "products",
          pattern: pattern || null,
          license_code: license.code,
        }),
      });
      if (!r.ok) {
        const e2 = await r.json().catch(() => ({}));
        throw new Error(e2.detail || `HTTP ${r.status}`);
      }
      const d: SearchResponse = await r.json();
      if (typeof d.credits_remaining === "number") {
        setLicense({ ...license, credits_remaining: d.credits_remaining });
        if (d.credits_remaining === 0) localStorage.setItem(LS_FREE_USED, "1");
      }
      setResults(d);
      if (d.filters_used?.interpretation) {
        setStatus({ kind: "info", message: `How we read it: ${d.filters_used.interpretation}` });
      }
      setTimeout(
        () => document.getElementById("pf-results")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
    } catch (err) {
      setStatus({ kind: "error", message: `Couldn't run that search: ${(err as Error).message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pf-tool" style={{ scrollMarginTop: 80 }}>
      <style jsx>{`
        .pf-tool :global(.pf-card) {
          background: #fff;
          border: 1.5px solid #e7dcc4;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 8px 28px rgba(40, 25, 10, 0.06);
        }
        .pf-tool :global(.pf-input),
        .pf-tool :global(.pf-textarea) {
          width: 100%;
          padding: 14px 16px;
          font-size: 16px;
          font-family: inherit;
          color: #141414;
          background: #fff;
          border: 1.5px solid #d6cdb9;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none;
        }
        .pf-tool :global(.pf-textarea) {
          resize: vertical;
          min-height: 110px;
          line-height: 1.5;
        }
        .pf-tool :global(.pf-input:focus),
        .pf-tool :global(.pf-textarea:focus) {
          border-color: #d9342b;
          box-shadow: 0 0 0 4px rgba(217, 52, 43, 0.13);
        }
        .pf-tool :global(.pf-label) {
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #3d5a3d;
          margin-bottom: 8px;
        }
        .pf-tool :global(.pf-btn) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px 26px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          border: none;
          cursor: pointer;
          color: #fff;
          background: #d9342b;
          box-shadow: 0 8px 22px rgba(217, 52, 43, 0.26);
          transition: background 0.15s, transform 0.06s;
        }
        .pf-tool :global(.pf-btn:hover) {
          background: #b8291f;
        }
        .pf-tool :global(.pf-btn:disabled) {
          background: #9ca3af;
          box-shadow: none;
          cursor: not-allowed;
        }
        .pf-tool :global(.pf-chip) {
          font-size: 12.5px;
          font-weight: 600;
          color: #3d5a3d;
          background: #faf5eb;
          border: 1px solid #d6cdb9;
          border-radius: 999px;
          padding: 7px 13px;
          cursor: pointer;
          transition: border-color 0.12s, color 0.12s;
        }
        .pf-tool :global(.pf-chip:hover) {
          border-color: #d9342b;
          color: #d9342b;
        }
        .pf-tool :global(.pf-tier) {
          position: relative;
          padding: 24px 22px;
          border-radius: 16px;
          background: #fff;
          border: 1.5px solid #e7dcc4;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 8px 28px rgba(40, 25, 10, 0.06);
        }
        .pf-tool :global(.pf-tier-pro) {
          border: 2px solid #c9a24e;
          box-shadow: 0 14px 38px rgba(201, 162, 78, 0.22);
        }
        @keyframes pf-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 640px) {
          .pf-tool :global(.pf-card) {
            padding: 22px;
          }
        }
      `}</style>

      {status && (
        <div
          className="mb-6 rounded-lg px-5 py-4 text-[14px] leading-relaxed border"
          style={
            status.kind === "error"
              ? { background: "rgba(198,40,40,0.06)", borderColor: "rgba(198,40,40,0.18)", color: "#c62828" }
              : { background: "rgba(91,123,91,0.08)", borderColor: "rgba(91,123,91,0.18)", color: "#2d4a3a" }
          }
        >
          {status.message}
        </div>
      )}

      {/* ── Search ── */}
      <section className="mb-14">
        <div className="text-center mb-7">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5"
            style={{ color: "#c62828", borderColor: "#c62828", background: "rgba(255,255,255,0.55)" }}
          >
            <span className="text-[11px] font-bold tracking-[0.16em]">✕ FIND A PRODUCT</span>
          </span>
          <h2
            style={{
              fontSize: "clamp(26px, 3.2vw, 40px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#141414",
              margin: "0 0 8px",
              fontWeight: 900,
            }}
          >
            What&apos;s winning in the US
            <span style={{ color: "#c62828" }}>.</span>{" "}
            <span style={{ color: "#c62828", fontStyle: "italic" }}>Before it hits India.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "0 auto", maxWidth: 640, lineHeight: 1.6 }}>
            China → USA → India. Describe a product; we scan live Amazon US data for what&apos;s
            selling now with weak/no-name brands and mediocre reviews — the exact profile that
            gets imported into India next. <strong>Books excluded.</strong>
          </p>
        </div>

        <form onSubmit={onSubmit} className="pf-card">
          <label className="block mb-6">
            <span className="pf-label">1 · Pick the signal you want to hunt</span>
            <select
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="pf-input"
              style={{ cursor: booting && patterns.length === 0 ? "wait" : "pointer" }}
              disabled={booting && patterns.length === 0}
            >
              {patterns.length === 0 ? (
                <option value="">
                  {booting ? "Loading signals…" : "— let the AI pick from my description —"}
                </option>
              ) : (
                <>
                  <option value="">— let the AI pick from my description —</option>
                  {patterns.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.label}
                    </option>
                  ))}
                </>
              )}
            </select>
            <span className="block text-[13px] italic mt-2" style={{ color: "#14141499" }}>
              {booting && patterns.length === 0
                ? "Waking the engine… (first load can take up to a minute)"
                : pattern
                ? patterns.find((p) => p.name === pattern)?.description ||
                  "Or describe the product in your own words below."
                : "Or just describe the product below — the AI reads the signal from your words."}
            </span>
          </label>
          <label className="block mb-2">
            <span className="pf-label">2 · Describe the product / niche</span>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Kitchen gadgets selling well in the US, no famous brand, bad reviews but still moving"
              className="pf-textarea"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-7 mt-2">
            <span className="text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: "#14141499" }}>
              Try one
            </span>
            {EXAMPLES.map((ex) => (
              <button key={ex.label} type="button" className="pf-chip" onClick={() => setDescription(ex.brief)}>
                {ex.label}
              </button>
            ))}
          </div>
          <button type="submit" disabled={loading} className="pf-btn" style={{ padding: "17px 30px", fontSize: 16 }}>
            {loading ? (
              <>
                Scanning live Amazon US data…
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "pf-spin 0.8s linear infinite",
                  }}
                />
              </>
            ) : (
              "Find winning products"
            )}
          </button>
          {license && (
            <div className="text-center text-[13px] mt-3" style={{ color: "#14141499" }}>
              {license.credits_remaining}{" "}
              {license.credits_remaining === 1 ? "search" : "searches"} remaining
              {license.tier === "products_free" ? " · free" : ""}
            </div>
          )}
        </form>
      </section>

      {/* ── License / Buy ── */}
      <section id="pf-license" className="mb-12">
        {license && license.credits_remaining > 0 && !showTopUp ? (
          <div
            className="rounded-2xl p-6 md:p-8 flex flex-wrap items-center justify-between gap-4"
            style={{ background: "#fff", border: "1.5px solid #d4e0d4", borderLeft: "5px solid #5b7b5b" }}
          >
            <div>
              <div className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: "#3d5a3d", marginBottom: 6 }}>
                Your access
              </div>
              <div style={{ fontSize: 34, color: "#141414", letterSpacing: "-0.03em", lineHeight: 1, fontWeight: 800 }}>
                {license.credits_remaining}
                <span className="ml-2 text-[16px]" style={{ color: "#14141499", fontWeight: 500 }}>
                  searches left
                </span>
              </div>
              <div className="text-[12px] mt-2" style={{ color: "#14141466" }}>
                Code:{" "}
                <code className="px-2 py-0.5 rounded font-mono text-[11px]" style={{ background: "#f0e8d8" }}>
                  {license.code}
                </code>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowTopUp(true)}
                className="rounded-full px-5 py-2.5 text-[13px] font-bold"
                style={{ color: "#fff", background: "#3d5a3d", border: "1.5px solid #3d5a3d" }}
              >
                Buy more searches
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-full px-5 py-2.5 text-[13px] font-bold"
                style={{ color: "#141414", background: "#fff", border: "1.5px solid #d6cdb9" }}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: "#141414", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
                {license ? (
                  <>
                    Out of free searches<span style={{ color: "#c62828" }}>.</span>{" "}
                    <span style={{ color: "#c62828", fontStyle: "italic" }}>Keep hunting.</span>
                  </>
                ) : (
                  <>
                    3 free searches<span style={{ color: "#c62828" }}>.</span>{" "}
                    <span style={{ color: "#c62828", fontStyle: "italic" }}>Then pay as you go.</span>
                  </>
                )}
              </h2>
              <p style={{ fontSize: 15, color: "#6b7280", margin: "0 auto", maxWidth: 560, lineHeight: 1.6 }}>
                No subscription. Pay in ₹ via Razorpay — UPI, cards, netbanking. Bigger packs are
                cheaper per search.
              </p>
            </div>

            <div className="flex gap-0 border-b mb-7 max-w-[420px] mx-auto" style={{ borderColor: "#e7dcc4" }}>
              {([
                ["buy", "Buy searches"],
                ["email", "Sign in"],
                ["code", "Have a code?"],
              ] as Array<[AuthTab, string]>).map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setAuthTab(k); setStatus(null); }}
                  className="flex-1 py-3.5 text-[13px] font-semibold"
                  style={{
                    color: authTab === k ? "#d9342b" : "#14141477",
                    borderBottom: `2px solid ${authTab === k ? "#d9342b" : "transparent"}`,
                    marginBottom: -1,
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {authTab === "buy" && (
              <>
                <div className="max-w-[420px] mx-auto mb-6">
                  <label className="pf-label">Email (license is sent here)</label>
                  <input
                    type="email"
                    inputMode="email"
                    value={buyEmail}
                    onChange={(e) => setBuyEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="pf-input"
                  />
                </div>
                {!razorpayKeyId && (
                  <div
                    className="rounded-xl p-4 mb-6 max-w-[680px] mx-auto text-center text-[14px] font-medium"
                    style={{ background: "rgba(217,52,43,0.07)", border: "1.5px solid rgba(217,52,43,0.28)", color: "#b8291f" }}
                  >
                    Paid packs activate the moment payments are switched on — your 3 free searches work now.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {tiers.map((t) => {
                    const perSearch = t.price_inr / t.credits;
                    const pro = t.name === "products_pack150";
                    return (
                      <article key={t.name} className={`pf-tier${pro ? " pf-tier-pro" : ""}`}>
                        {pro && (
                          <span
                            className="absolute right-4 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-[0.16em]"
                            style={{ top: -12, background: "#c9a24e", color: "#141414" }}
                          >
                            Best value
                          </span>
                        )}
                        <div style={{ fontSize: 38, fontWeight: 800, color: "#d9342b", letterSpacing: "-0.03em", lineHeight: 1 }}>
                          {fmtINR(t.price_inr)}
                        </div>
                        <h3 className="text-[17px] font-extrabold" style={{ color: "#141414" }}>
                          {t.credits} searches
                        </h3>
                        <p className="text-[13.5px]" style={{ color: "#14141499" }}>
                          {fmtINR(Math.round(perSearch))} / search · no expiry
                        </p>
                        <button
                          type="button"
                          disabled={buyingTier === t.name}
                          onClick={() => buyTier(t.name)}
                          className="pf-btn mt-2"
                          style={{ padding: "12px 18px", fontSize: 14 }}
                        >
                          {buyingTier === t.name ? "Opening…" : `Buy · ${fmtINR(t.price_inr)}`}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </>
            )}

            {authTab === "email" && (
              <div className="pf-card max-w-[440px] mx-auto text-center">
                <div className="text-[20px] font-extrabold mb-1" style={{ color: "#141414", fontStyle: "italic" }}>
                  Already bought a pack?
                </div>
                <p className="text-[14px] mb-5" style={{ color: "#14141499", lineHeight: 1.55 }}>
                  Sign in with the same email you used at checkout and your
                  remaining searches restore on this device automatically.
                </p>
                <a
                  href="/login?next=/tools/dropshipping-products-finder"
                  className="pf-btn"
                  style={{ textDecoration: "none", display: "inline-flex" }}
                >
                  Sign in with email →
                </a>
                <p className="text-[12px] mt-4" style={{ color: "#14141466", lineHeight: 1.5 }}>
                  New here? You get <strong>3 free searches</strong> with no
                  sign-in — just start searching above.
                </p>
              </div>
            )}

            {authTab === "code" && (
              <form onSubmit={onRestore} className="pf-card max-w-[440px] mx-auto flex flex-col gap-3">
                <span className="pf-label">Paste your license code</span>
                <input
                  type="text"
                  value={restoreCode}
                  onChange={(e) => setRestoreCode(e.target.value)}
                  placeholder="sk-…"
                  className="pf-input"
                  style={{ fontFamily: "ui-monospace, Menlo, monospace" }}
                />
                <button type="submit" className="pf-btn" style={{ background: "#141414" }}>
                  Restore →
                </button>
              </form>
            )}
          </>
        )}
      </section>

      {/* ── Results ── */}
      {results && (
        <section id="pf-results" className="mb-12">
          <div className="flex justify-between items-baseline pb-3.5 mb-6 border-b" style={{ borderColor: "rgba(20,20,20,0.1)" }}>
            <h2 style={{ fontSize: 30, color: "#141414", letterSpacing: "-0.03em", margin: 0, fontWeight: 800, fontStyle: "italic" }}>
              Top product opportunities
            </h2>
            <div className="text-[13px]" style={{ color: "#6b7280" }}>
              {results.books.length} shown · {results.candidates_found} analysed
            </div>
          </div>

          {(!license || license.credits_remaining <= 0) && (
            <div
              className="rounded-2xl px-6 py-5 mb-6 flex flex-wrap items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg, rgba(217,52,43,0.08), rgba(201,162,78,0.1))", border: "1.5px solid rgba(217,52,43,0.22)" }}
            >
              <div>
                <div style={{ fontSize: 20, color: "#141414", fontWeight: 800, fontStyle: "italic" }}>
                  That was a free search.
                </div>
                <div className="text-[14px] mt-1" style={{ color: "#14141499" }}>
                  Keep hunting from <strong style={{ color: "#141414" }}>₹16.6/search</strong> — no subscription.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTopUp(true);
                  setAuthTab("buy");
                  document.getElementById("pf-license")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="pf-btn"
                style={{ width: "auto", padding: "13px 26px" }}
              >
                Buy more →
              </button>
            </div>
          )}

          {results.books.length === 0 && (
            <div className="rounded-lg p-6 text-[15px]" style={{ background: "#faf5eb", color: "#6b7280" }}>
              {results.message || "No products matched. Try widening the description."}
            </div>
          )}

          <div className="grid gap-4">
            {results.books.map((b, i) => {
              const bsr = b.avg365_bsr ?? b.avg90_bsr;
              return (
                <article
                  key={b.asin || i}
                  className="rounded-md p-5 md:p-6 bg-white"
                  style={{ border: "1px solid rgba(20,20,20,0.1)", borderLeft: "4px solid #c9a24e" }}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <span style={{ fontSize: 30, fontWeight: 700, color: "#c62828", letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 20, color: "#2d4a3a", fontWeight: 600 }}>{fmtUSD(b.price_usd)}</span>
                  </div>
                  <div className="text-[16px] sm:text-[18px] font-semibold mb-1.5" style={{ color: "#141414", lineHeight: 1.3, wordBreak: "break-word" }}>
                    {b.title || "(untitled)"}
                  </div>
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    {b.brand ? (
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{ background: "rgba(20,20,20,0.06)", color: "#141414" }}
                      >
                        {b.brand}
                      </span>
                    ) : (
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-[0.1em] px-2 py-0.5 rounded"
                        style={{ background: "rgba(0,167,84,0.12)", color: "#00824a" }}
                      >
                        No-name brand
                      </span>
                    )}
                    <span className="text-[13px]" style={{ color: "#6b7280" }}>
                      {b.primary_category || "—"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] sm:text-[13px]" style={{ color: "#6b7280" }}>
                    <div>Rating <strong style={{ color: "#141414", marginLeft: 4 }}>{b.rating == null ? "—" : `${b.rating}★`}</strong></div>
                    <div>Reviews <strong style={{ color: "#141414", marginLeft: 4 }}>{fmtN(b.review_count)}</strong></div>
                    <div>US BSR <strong style={{ color: "#141414", marginLeft: 4 }}>{fmtN(bsr)}</strong></div>
                  </div>
                  {b.match_reason && (
                    <div
                      className="mt-3 text-[13px] rounded-lg px-3.5 py-2.5"
                      style={{ background: "rgba(201,162,78,0.12)", color: "#5a4a1f", lineHeight: 1.5 }}
                    >
                      <strong style={{ textTransform: "uppercase", fontSize: 10, letterSpacing: "0.14em", color: "#8a6a1f" }}>
                        Why this
                      </strong>
                      <br />
                      {b.match_reason}
                    </div>
                  )}
                  {b.amazon_url && (
                    <a
                      href={b.amazon_url}
                      target="_blank"
                      rel="noopener"
                      className="inline-block mt-3 text-[13px] font-bold tracking-[0.16em] uppercase"
                      style={{ color: "#c62828" }}
                    >
                      View on Amazon →
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
