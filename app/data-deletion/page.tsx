import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "User Data Deletion · Skillies.AI",
  description:
    "How to permanently delete the data Skillies.AI holds about you · DPDP Act 2023 right to erasure · WhatsApp Business message deletion.",
};

export default function DataDeletionPage() {
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
          § Legal · Data deletion
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
          User Data Deletion
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: "0 0 48px",
          }}
        >
          Last updated · 25 April 2026
        </p>

        <div
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "#1A1A1A",
          }}
        >
          <p>
            Under India&rsquo;s <strong>Digital Personal Data Protection Act
            2023 (DPDP Act)</strong>, you have the right to request that
            Skillies.AI permanently delete the personal data we hold about
            you. This page explains exactly how to exercise that right —
            three options below, pick whichever is easiest.
          </p>

          <H2>Option 1 · Delete your WhatsApp conversation (instant)</H2>
          <p>
            If you&rsquo;ve ever messaged us on WhatsApp{" "}
            <strong>+91 80899 41131</strong>, just send the single word{" "}
            <strong>STOP</strong> on that chat. Our system will:
          </p>
          <Ul>
            <Li>Reply confirming you&rsquo;ve been opted out.</Li>
            <Li>Permanently delete every message in that conversation
              within 24 hours.</Li>
            <Li>Remove your WhatsApp number from our active contacts.</Li>
          </Ul>
          <p>
            We keep an audit log entry that the deletion happened (timestamp +
            phone hash, no message content) so we can prove compliance with
            the DPDP Act if asked.
          </p>

          <H2>Option 2 · Email us (for full account deletion)</H2>
          <p>
            For everything else — your name, email, payment records, course
            access, mentorship notes — email{" "}
            <a
              href="mailto:ehsan@skillies.ai?subject=Data%20deletion%20request"
              style={{ color: "#C62828", fontWeight: 600 }}
            >
              ehsan@skillies.ai
            </a>{" "}
            with the subject line{" "}
            <em>&ldquo;Data deletion request&rdquo;</em> and tell us:
          </p>
          <Ul>
            <Li>The email address or phone number you used with Skillies.</Li>
            <Li>Whether you want us to delete <strong>everything</strong>{" "}
              we hold, or just specific items (e.g. only your WhatsApp
              chat, not your purchase records).</Li>
          </Ul>

          <H2>Option 3 · Programmatic API (for developers)</H2>
          <p>
            If you&rsquo;re technical, you can hit our DPDP Subject Access
            Request endpoint directly to either export or delete your data:
          </p>
          <pre
            style={{
              background: "rgba(26,26,26,0.04)",
              border: "1px solid rgba(26,26,26,0.08)",
              borderRadius: 8,
              padding: "14px 16px",
              fontSize: 13,
              fontFamily: "ui-monospace, Menlo, monospace",
              overflow: "auto",
              lineHeight: 1.65,
            }}
          >
            {`# Export everything we hold about your phone number
GET https://frontdesk.skillies.ai/api/dsar/{your_phone_digits}

# Permanently delete it all
DELETE https://frontdesk.skillies.ai/api/dsar/{your_phone_digits}`}
          </pre>
          <p>
            Where <code>{`{your_phone_digits}`}</code> is your WhatsApp
            number with country code, no spaces or +. Example:{" "}
            <code>919876543210</code>.
          </p>

          <H2>What we delete</H2>
          <Ul>
            <Li>WhatsApp message history (all conversations on +91 80899 41131).</Li>
            <Li>Lead-form submissions (name, phone, email).</Li>
            <Li>Workshop / cohort / mentorship enrolment metadata
              (apart from minimum tax-ledger entries we&rsquo;re legally
              required to retain — see below).</Li>
            <Li>Marketing-list membership.</Li>
            <Li>Any AI-derived knowledge chunks based on your private
              messages.</Li>
          </Ul>

          <H2>What we cannot delete (and why)</H2>
          <Ul>
            <Li>
              <strong>Razorpay payment receipts.</strong> Indian GST law
              requires us to retain transaction records for 8 years. If
              you&rsquo;ve paid us, the transaction itself stays in our
              ledger as a financial entry — without your contact details
              attached. You can request that, after deletion, the entry
              shows only a hashed reference.
            </Li>
            <Li>
              <strong>Audit log of the deletion itself.</strong> We retain a
              record that &ldquo;a deletion request was processed&rdquo; with
              a timestamp and a hash of your phone number. This is so we
              can prove compliance with the DPDP Act if regulators ask. The
              log contains no readable personal data.
            </Li>
          </Ul>

          <H2>Response time</H2>
          <p>
            <strong>WhatsApp STOP:</strong> instant (under 24 hours including
            propagation).
            <br />
            <strong>Email request:</strong> within 7 working days (DPDP Act
            allows up to 30; we aim for one week).
            <br />
            <strong>API delete:</strong> instant.
          </p>

          <H2>Questions or complaints</H2>
          <p>
            If you&rsquo;re not happy with how we handled your deletion
            request, you can complain directly to the Indian Data Protection
            Board (DPB) once it&rsquo;s operational, or contact our Data
            Protection Officer:
          </p>
          <p>
            Ehsan Asgar Parambatt
            <br />
            Skillies.AI · Malappuram, Kerala, India
            <br />
            Email:{" "}
            <a
              href="mailto:ehsan@skillies.ai"
              style={{ color: "#C62828", fontWeight: 600 }}
            >
              ehsan@skillies.ai
            </a>
            <br />
            WhatsApp: +91 80899 41131
          </p>
        </div>
      </article>
      <FooterEditorial />
      <WhatsAppButton />
    </main>
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
    <ul style={{ paddingLeft: 22, margin: "0 0 16px", display: "grid", gap: 8 }}>
      {children}
    </ul>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ paddingLeft: 4 }}>{children}</li>;
}
