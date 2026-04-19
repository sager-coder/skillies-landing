import {
  PaisaPhone,
  PaisaCover,
  PaisaNewsCard,
  PaisaStatCard,
  PaisaCTA,
  PaisaLowerThird,
  ThumbnailGrid,
} from "@/components/paisa/Screens";
import PaisaIntro from "@/components/paisa/Intro";
import FooterEditorial from "@/components/design/FooterEditorial";
import TopNav from "@/components/design/TopNav";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Paisa.AI — weekly Malayalam income stories · Skillies.AI",
  description:
    "One week — one story. A weekly Malayalam show about real AI income from Kerala — coloring books, puzzle books, KDP stacks.",
};

export default function PaisaPage() {
  return (
    <main>
      <TopNav cta={{ href: "/workshop", label: "Workshop · ₹1,999" }} />
      <PaisaIntro />

      <section
        style={{
          padding: "80px 48px",
          background: "#FAF5EB",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 48,
              fontSize: 11,
              color: "#6B7280",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <span style={{ width: 44, height: 1, background: "#1F3A2E" }} />
            § 02 · Episode 014 · Reel stack
            <span
              style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }}
            />
            <span>Farida&apos;s ₹4.2L story</span>
          </div>
          <div
            className="skillies-paisa-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: 56,
              justifyItems: "center",
              marginBottom: 80,
            }}
          >
            <PaisaPhone label="01 · Cover">
              <PaisaCover />
            </PaisaPhone>
            <PaisaPhone label="02 · Chapter one">
              <PaisaNewsCard />
            </PaisaPhone>
            <PaisaPhone label="03 · Number of the week">
              <PaisaStatCard />
            </PaisaPhone>
            <PaisaPhone label="04 · Call to workshop">
              <PaisaCTA />
            </PaisaPhone>
            <PaisaPhone label="05 · Lower third overlay">
              <PaisaLowerThird />
            </PaisaPhone>
          </div>

          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <ThumbnailGrid />
          </div>
        </div>
      </section>

      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}
