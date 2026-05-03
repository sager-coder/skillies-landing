import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Refund & Cancellation Policy · Skillies.AI",
  description:
    "Skillies.AI workshop tickets are non-refundable but seats are transferable. Cohort and mentorship programs carry an outcome-linked refund guarantee.",
};

export default function RefundPage() {
  return (
    <main style={{ background: "#FAF5EB", minHeight: "100vh" }}>
      <TopNav />
      <article
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "120px 24px 80px",
          color: "#1A1A1A",
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
            margin: "0 0 14px",
          }}
        >
          § LEGAL · REFUND & CANCELLATION
        </p>
        <h1
          style={{
            fontSize: "clamp(40px, 5vw, 56px)",
            fontWeight: 900,
            color: "#1A1A1A",
            margin: "0 0 12px",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
          }}
        >
          Refund & Cancellation
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: "0 0 48px",
          }}
        >
          Last updated · 23 April 2026
        </p>

        <div
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "#1A1A1A",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1A1A1A",
              margin: "0 0 14px",
              letterSpacing: "-0.015em",
            }}
          >
            The KDP Workshop (all tiers)
          </h2>
          <p>
            <strong>Workshop tickets are non-refundable.</strong> Your seat is
            transferable, though. If you can't make the date you chose, you can:
          </p>
          <ol style={{ paddingLeft: 22, margin: "0 0 20px", display: "grid", gap: 8 }}>
            <li>
              Send someone else in your place — just WhatsApp us their name and
              phone at least 48 hours before the workshop.
            </li>
            <li>
              Shift your ticket to another city in the same tour, subject to
              seat availability at that city. Request this at least 7 days
              before your original date.
            </li>
          </ol>
          <p>
            Transfers are free. The new attendee pays nothing extra, nor do you.
          </p>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1A1A1A",
              margin: "32px 0 14px",
              letterSpacing: "-0.015em",
            }}
          >
            If Skillies.AI cancels a workshop
          </h2>
          <p>
            If we cancel a workshop (weather, venue, illness, or any reason on
            our side), you get — at your choice:
          </p>
          <ul style={{ paddingLeft: 22, margin: "0 0 20px", display: "grid", gap: 8 }}>
            <li>A full refund to your original payment method within 7 working days, or</li>
            <li>A free seat at the next scheduled workshop city in the tour.</li>
          </ul>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1A1A1A",
              margin: "32px 0 14px",
              letterSpacing: "-0.015em",
            }}
          >
            The 50-day Cohort (₹35,000)
          </h2>
          <p>
            Cohort enrollment is covered by our outcome-linked guarantee:
          </p>
          <ul style={{ paddingLeft: 22, margin: "0 0 20px", display: "grid", gap: 8 }}>
            <li>Finish the 50-day cohort — every assignment, every check-in.</li>
            <li>Follow the exact Skillies.AI workflow taught in the program.</li>
            <li>Keep publishing ≥ 2 hours a day for 6 months after the cohort.</li>
            <li>
              If your KDP royalties haven't reached ₹35,000 total after that
              6-month window, we refund the cohort fee minus whatever Amazon
              has already paid you.
            </li>
          </ul>
          <p>
            Full text lives on the{" "}
            <a href="/" style={{ color: "#C62828", fontWeight: 600 }}>
              homepage guarantee section
            </a>
            .
          </p>
          <p>
            <strong>Cooling-off period:</strong> if you change your mind within
            14 days of paying AND the cohort hasn't started, we refund 100%.
            Once the cohort starts, the outcome-linked guarantee above applies.
          </p>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1A1A1A",
              margin: "32px 0 14px",
              letterSpacing: "-0.015em",
            }}
          >
            Private Mentorship (₹1,75,000 founding)
          </h2>
          <p>
            Before the kickoff audit call, a 100% refund is available if you
            request it within 7 days of paying. After the kickoff call happens,
            the mentorship is non-refundable — by that point you've received
            real strategic work from Ehsan directly.
          </p>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1A1A1A",
              margin: "32px 0 14px",
              letterSpacing: "-0.015em",
            }}
          >
            How to request a refund, transfer, or cancellation
          </h2>
          <p>
            Email{" "}
            <a
              href="mailto:ehsan@skillies.ai"
              style={{ color: "#C62828", fontWeight: 600 }}
            >
              ehsan@skillies.ai
            </a>
            . Include your name, phone number used at checkout, and the
            Razorpay transaction ID (on your payment confirmation email).
          </p>
          <p>
            Valid refunds are processed to the original payment method within
            <strong> 7 working days</strong> of approval.
          </p>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1A1A1A",
              margin: "32px 0 14px",
              letterSpacing: "-0.015em",
            }}
          >
            Chargebacks
          </h2>
          <p>
            If you dispute a charge with your bank or card issuer without
            first contacting us, we reserve the right to provide the payment
            provider with the reservation record, attendance log (if any), and
            this policy as evidence of the service delivered. Talk to us first
            — it's always faster.
          </p>
        </div>
      </article>
      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}
