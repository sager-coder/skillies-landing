/**
 * /tools/dropshipping-products-finder · LIVE Product Finder (India).
 *
 * Same engine as the KDP Niche Finder, tool-namespaced ("products"):
 * scans live Amazon US data for products selling now with weak/no-name
 * brands and mediocre reviews — the China→USA→India import signal.
 * Books excluded. 3 free searches, then INR packs via Razorpay.
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import ProductFinder from "@/components/tools/ProductFinder";

export const metadata: Metadata = {
  title: "Product Finder for India · What's winning on Amazon US · Skillies",
  description:
    "Products trend China → USA → India. Describe a product and scan live Amazon US data for what's selling now with weak/no-name brands and mediocre reviews — the exact profile that gets imported into India next. Books excluded. 3 free searches.",
};

const FLOW = [
  { k: "1 · CHINA", t: "Made & proven", d: "A product takes off in Chinese factories and marketplaces." },
  { k: "2 · USA", t: "Scaling now", d: "It starts selling hard on Amazon US — often with weak, no-name brands." },
  { k: "3 · INDIA", t: "Your window", d: "6–18 months later it floods India. Source it before everyone else." },
];

const SIGNALS = [
  { t: "Bad reviews — still selling", d: "Under 3.5★ but still moving units. The market wants it and will buy a better version." },
  { t: "No brand moat", d: "Generic / unbranded listings out-selling — nothing stopping you replicating it." },
  { t: "Top US rank, few reviews", d: "Strong sales velocity with low review counts — early, low-competition movers." },
  { t: "Premium price, weak competition", d: "Higher-ticket products with mediocre incumbents — fat margins to take." },
];

export default function ProductFinderPage() {
  return (
    <main className="relative">
      <style>{`
        .pf-hero { padding-top: 92px; padding-bottom: 10px; }
        @media (min-width: 768px) { .pf-hero { padding-top: 120px; } }
        .pf-kicker {
          display:inline-flex; align-items:center; gap:8px;
          padding:7px 14px; border-radius:999px;
          background:rgba(217,52,43,0.08); color:#d9342b;
          font-size:11.5px; font-weight:700; letter-spacing:0.10em;
          margin-bottom:18px;
        }
        .pf-h1 {
          font-weight:900; font-size:clamp(34px,5vw,60px);
          line-height:1.03; letter-spacing:-0.04em; color:#141414; margin:0;
        }
        .pf-lede {
          font-size:16px; font-weight:500; color:#14141499;
          line-height:1.6; margin:18px auto 0; max-width:620px;
        }
        .pf-flow {
          display:grid; grid-template-columns:repeat(3,1fr); gap:16px;
          margin-top:34px;
        }
        @media (max-width:720px){ .pf-flow{ grid-template-columns:1fr; } }
        .pf-flow-card {
          background:#fff; border:1.5px solid #e7dcc4; border-radius:14px;
          padding:18px 20px; text-align:left;
        }
        .pf-flow-k { font-size:11px; font-weight:800; letter-spacing:0.14em; color:#d9342b; }
        .pf-flow-t { font-size:17px; font-weight:800; color:#141414; margin:6px 0 4px; }
        .pf-flow-d { font-size:13.5px; color:#14141499; line-height:1.5; }
        .pf-sig {
          display:grid; grid-template-columns:repeat(2,1fr); gap:16px;
        }
        @media (max-width:720px){ .pf-sig{ grid-template-columns:1fr; } }
        .pf-sig-card {
          background:#fff; border:1px solid rgba(20,20,20,0.1);
          border-left:4px solid #c9a24e; border-radius:12px; padding:20px 22px;
        }
      `}</style>

      <TopNav />

      <section className="sk-section pf-hero">
        <div className="sk-container max-w-[1000px] text-center">
          <span className="pf-kicker">⚡ AMAZON-US PRODUCT DISCOVERY · FOR INDIA SELLERS</span>
          <h1 className="pf-h1">
            What&apos;s winning in the US.
            <br />
            <span style={{ color: "#d9342b" }}>Before it hits India.</span>
          </h1>
          <p className="pf-lede">
            Products trend <strong>China → USA → India</strong>. We scan live Amazon US
            data for what&apos;s selling <em>right now</em> with weak or no-name brands and
            mediocre reviews — the exact profile that gets imported into India next.
            Describe a product, get the real listings winning it. Books excluded.
          </p>

          <div className="pf-flow">
            {FLOW.map((f) => (
              <div key={f.k} className="pf-flow-card">
                <div className="pf-flow-k">{f.k}</div>
                <div className="pf-flow-t">{f.t}</div>
                <div className="pf-flow-d">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The live tool ── */}
      <section className="sk-section" style={{ paddingTop: 24 }}>
        <div className="sk-container max-w-[1100px]">
          <ProductFinder />
        </div>
      </section>

      {/* ── Signals ── */}
      <section className="sk-section" style={{ paddingTop: 8, paddingBottom: 48 }}>
        <div className="sk-container max-w-[1000px]">
          <div className="text-center mb-10">
            <span className="pf-kicker">✕ THE SIGNALS</span>
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#141414", letterSpacing: "-0.03em", margin: 0 }}>
              The profile we hunt for
            </h2>
          </div>
          <div className="pf-sig">
            {SIGNALS.map((s) => (
              <div key={s.t} className="pf-sig-card">
                <div style={{ fontSize: 17, fontWeight: 800, color: "#141414", marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: "#14141499", lineHeight: 1.55 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterEditorial />
    </main>
  );
}
