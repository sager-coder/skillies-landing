import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Privacy Policy · Skillies.AI",
  description:
    "How Skillies.AI collects, uses, and protects your data. Compliant with India's DPDP Act 2023 and Razorpay merchant guidelines.",
};

export default function PrivacyPage() {
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
          § LEGAL · PRIVACY POLICY
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
          Privacy Policy
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

        <Prose>
          <p>
            Skillies.AI ("we", "us") is operated by Ehsan Asgar Parambatt from
            Malappuram, Kerala, India. This policy explains how we collect,
            use, and protect the personal data you share when visiting
            skillies.ai or purchasing a workshop, course, or mentorship.
          </p>
          <p>
            This policy is written to satisfy India's <strong>Digital Personal
            Data Protection Act 2023 (DPDP Act)</strong> and the
            Information Technology Rules 2011.
          </p>

          <H2>What we collect</H2>
          <Ul>
            <Li><strong>When you buy a ticket or course:</strong> name,
              WhatsApp number, email, workshop city (if applicable), and
              payment metadata returned by Razorpay (transaction ID, amount).
              We do <em>not</em> see your card/UPI details — Razorpay does.</Li>
            <Li><strong>When you apply for mentorship:</strong> the same,
              plus anything you send over WhatsApp.</Li>
            <Li><strong>When you browse the site:</strong> IP address, device
              type, pages visited, and Meta Pixel events (ad conversion
              tracking). We do not use cross-site tracking cookies beyond Meta.</Li>
          </Ul>

          <H2>How we use it</H2>
          <Ul>
            <Li>Deliver the product you paid for — seat confirmation, course
              access, or mentorship onboarding.</Li>
            <Li>Send you workshop venue details, start reminders, and
              post-event resources (only relating to what you purchased).</Li>
            <Li>Measure ad performance via Meta Pixel — aggregate, not
              personally identifying.</Li>
            <Li>Comply with Indian tax + GST + Razorpay record-keeping
              obligations.</Li>
          </Ul>

          <H2>What we do NOT do</H2>
          <Ul>
            <Li>We don't sell your data.</Li>
            <Li>We don't share your WhatsApp number or email with any third
              party other than Razorpay (payment) and Meta (ad attribution).</Li>
            <Li>We don't spam. If you hear from us after your purchase, it's
              either about your seat, your workshop, or a new Skillies.AI
              product you'd find relevant — with an unsubscribe link.</Li>
          </Ul>

          <H2>Your rights under DPDP Act 2023</H2>
          <Ul>
            <Li><strong>Access</strong> — ask us what data we hold about you.</Li>
            <Li><strong>Correction</strong> — ask us to fix anything wrong.</Li>
            <Li><strong>Erasure</strong> — ask us to delete your data (subject to
              tax/payment record-keeping requirements).</Li>
            <Li><strong>Withdraw consent</strong> — unsubscribe from marketing
              messages at any time.</Li>
          </Ul>
          <p>
            Exercise any of these by emailing{" "}
            <a
              href="mailto:ehsan@skillies.ai"
              style={{ color: "#C62828", fontWeight: 600 }}
            >
              ehsan@skillies.ai
            </a>{" "}
            or WhatsApping +91 87143 18352. We respond within 7 working days.
          </p>

          <H2>Data retention</H2>
          <p>
            We keep purchase records for 8 years (GST Act requirement). Non-purchase data (leads, general
            enquiries) — 2 years, then deleted.
          </p>

          <H2>Security</H2>
          <p>
            Payments run through Razorpay (PCI-DSS certified). Our site is
            hosted on Vercel with HTTPS enforced site-wide. Your payment card
            data never touches our servers.
          </p>

          <H2>Changes</H2>
          <p>
            If this policy changes, the "Last updated" date at the top will
            change. Material changes will be announced on our Instagram and
            via email to active customers.
          </p>

          <H2>Contact</H2>
          <p>
            Ehsan Asgar Parambatt · Skillies.AI · Malappuram, Kerala, India
            <br />
            Email:{" "}
            <a
              href="mailto:ehsan@skillies.ai"
              style={{ color: "#C62828", fontWeight: 600 }}
            >
              ehsan@skillies.ai
            </a>
            <br />
            WhatsApp: +91 87143 18352
          </p>
        </Prose>
      </article>
      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}

/* ── Shared prose primitives (kept in-file so the legal pages ship without
      dragging in the design system). ──────────────────────────────────── */

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 16,
        lineHeight: 1.75,
        color: "#1A1A1A",
      }}
    >
      {children}
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: "#1A1A1A",
        margin: "36px 0 14px",
        letterSpacing: "-0.015em",
      }}
    >
      {children}
    </h2>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul
      style={{
        paddingLeft: 22,
        margin: "0 0 16px",
        display: "grid",
        gap: 8,
      }}
    >
      {children}
    </ul>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ paddingLeft: 4 }}>{children}</li>;
}
