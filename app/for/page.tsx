/**
 * /for · the vertical chooser. Same content as the homepage VerticalGrid,
 * but standalone so the nav can link here and so we have a clean URL
 * for ad campaigns ("which Skillies is right for your business?").
 */
import type { Metadata } from "next";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import VerticalGrid from "@/components/design/VerticalGrid";
import BookCallCTA from "@/components/skillies/BookCallCTA";

export const metadata: Metadata = {
  title: "Skillies for [your business] · pick your vertical",
  description:
    "Skillies builds AI sales workers per vertical. Pick yours: Real Estate, Hajj/Umrah, Study Abroad, Coaching, Modular Kitchen, Retail.",
};

export default function ForIndexPage() {
  return (
    <main style={{ background: "var(--sk-cream)" }}>
      <TopNav />

      <section className="sk-section pt-32 md:pt-40">
        <div className="sk-container">
          <p
            className="sk-font-meta mb-6"
            style={{ color: "var(--sk-ink60)" }}
          >
            PICK YOUR VERTICAL
          </p>
          <h1
            className="sk-font-display max-w-[20ch]"
            style={{
              fontSize: "var(--sk-text-display)",
              color: "var(--sk-ink)",
            }}
          >
            Skillies for{" "}
            <span
              className="sk-font-display-italic"
              style={{ color: "var(--sk-red)" }}
            >
              your business
            </span>
            .
          </h1>
          <p
            className="sk-font-body mt-6 max-w-[58ch]"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
            }}
          >
            Six vertical-specific AI sales workers. Pick the one closest to
            your business. Each page has its own pain, its own demo, and its
            own pricing.
          </p>
        </div>
      </section>

      <VerticalGrid />

      <BookCallCTA
        heading="Not sure which vertical fits?"
        note="30 min with Ehsan — we'll figure it out together. Even if it's a vertical we don't have a page for yet, we can build."
      />

      <FooterEditorial />
    </main>
  );
}
