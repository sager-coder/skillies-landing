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
          Last updated · 20 May 2026
        </p>

        <Prose>
          <p>
            Skillies.AI ("we", "us") is operated by Ehsan Asgar P (Ehsan Asgar
            Parambatt), a sole proprietorship registered in Malappuram, Kerala,
            India (GSTIN 32FEOPP5745A2ZF). This policy explains how we collect,
            use, and protect the personal data you share when visiting
            skillies.ai, messaging our WhatsApp line, or purchasing the
            Skillies KDP course or AI Sales Agent service.
          </p>
          <p>
            This policy is written to satisfy India&rsquo;s <strong>Digital
            Personal Data Protection Act 2023 (DPDP Act)</strong> and the
            Information Technology Rules 2011.
          </p>

          <H2>What we collect</H2>
          <Ul>
            <Li><strong>When you buy a course or service:</strong> name,
              WhatsApp number, email, and payment metadata returned by
              Razorpay (transaction ID, amount, status). We do <em>not</em> see
              your card or UPI account details &mdash; Razorpay does.</Li>
            <Li><strong>When you message our WhatsApp line:</strong> your
              WhatsApp display name, phone number, and the content of the
              messages you send us (text, voice notes, images, documents).</Li>
            <Li><strong>When you browse the site:</strong> IP address, device
              type, pages visited, and Meta Pixel events (ad conversion
              tracking). We do not use cross-site tracking cookies beyond Meta.</Li>
          </Ul>

          <H2>How we use it</H2>
          <Ul>
            <Li>Deliver the product you paid for &mdash; course access,
              programme onboarding, or AI Sales Agent setup.</Li>
            <Li>Send you programme reminders, payment receipts, and
              post-purchase resources (only relating to what you bought).</Li>
            <Li>Answer your questions over WhatsApp using a combination of
              automated (AI) and human responses.</Li>
            <Li>Measure ad performance via Meta Pixel &mdash; aggregate, not
              personally identifying.</Li>
            <Li>Comply with Indian tax, GST, and Razorpay record-keeping
              obligations.</Li>
          </Ul>

          <H2>What we do NOT do</H2>
          <Ul>
            <Li>We don&rsquo;t sell your data.</Li>
            <Li>We don&rsquo;t share your data with any third party for their
              own marketing or analytics. We use trusted sub-processors that
              act only on our behalf and instructions (listed below).</Li>
            <Li>We don&rsquo;t send unsolicited marketing on WhatsApp. Any
              WhatsApp message from us is either a reply to something you
              wrote, a transactional update about a product you bought, or a
              follow-up to an enquiry you already started.</Li>
          </Ul>

          <H2>WhatsApp Business Cloud API &middot; what to know</H2>
          <p>
            Skillies.AI operates a WhatsApp Business Cloud API line on{" "}
            <strong>+91 80899 41131</strong>. Inbound messages are processed
            through Meta&rsquo;s WhatsApp Business platform and stored on our
            servers (Supabase, Mumbai region) so our agent can answer you,
            remember context across the conversation, and follow up on the
            Skillies KDP course or AI Sales Agent service.
          </p>
          <Ul>
            <Li>
              <strong>What we store:</strong> your WhatsApp display name, phone
              number, the messages you send us, and the messages we send back.
              We also store metadata such as detected language, intent, and a
              rolling memory note our agent uses to avoid asking you the same
              question twice.
            </Li>
            <Li>
              <strong>Consent model:</strong> messaging our WhatsApp line is
              treated as deemed consent under <strong>DPDP Act 2023 &sect;7</strong>{" "}
              for the specific purpose of replying to your enquiry. You can
              revoke at any time &mdash; reply <strong>STOP</strong>{" "}
              (or &ldquo;unsubscribe&rdquo; / &ldquo;delete me&rdquo; /{" "}
              &ldquo;വേണ്ട&rdquo;) and our system immediately stops messaging
              you and deletes the conversation in line with DPDP &sect;11.
            </Li>
            <Li>
              <strong>AI assistance:</strong> most replies are drafted by an AI
              agent (Anthropic Claude). Voice notes you send are transcribed
              by OpenAI Whisper and voice replies we send are synthesised by
              ElevenLabs. Anything our agent can&rsquo;t answer with
              confidence is escalated to a human (Ehsan or a Skillies operator)
              within minutes during business hours.
            </Li>
            <Li>
              <strong>What we never do over WhatsApp:</strong> diagnose
              medical conditions, give legal/tax/visa/immigration advice,
              promise specific earnings, store payment-card numbers, or share
              your phone number with third parties (other than Razorpay when
              you click a payment link).
            </Li>
            <Li>
              <strong>Retention:</strong> WhatsApp conversation history is
              retained while you are an active customer or have an open enquiry
              with us. You can request deletion at any time per DPDP &sect;11;
              reply <strong>STOP</strong> to trigger the same deletion
              automatically. Purchase records and invoices are retained for 8
              years to satisfy the GST Act.
            </Li>
            <Li>
              <strong>Templates and proactive messages:</strong> outside the
              24-hour WhatsApp service window, Meta only permits us to send
              pre-approved utility templates (booking confirmations, payment
              reminders, course details, transactional follow-ups). We do not
              broadcast generic marketing messages to non-customers.
            </Li>
          </Ul>

          <H2>Sub-processors</H2>
          <p>
            We use the following sub-processors. Each acts only on our
            documented instructions and is bound by its own data processing
            agreement with us:
          </p>
          <Ul>
            <Li><strong>Supabase</strong> (Mumbai region) &mdash; primary
              database for tenant data, conversation history, and customer
              memory.</Li>
            <Li><strong>Vercel</strong> &mdash; application hosting and the
              public skillies.ai website.</Li>
            <Li><strong>Anthropic (Claude)</strong> &mdash; large language
              model that drafts WhatsApp replies and customer summaries.</Li>
            <Li><strong>OpenAI</strong> &mdash; speech-to-text transcription
              for voice notes you send us.</Li>
            <Li><strong>ElevenLabs</strong> &mdash; text-to-speech synthesis
              when we reply to a voice note with a voice note.</Li>
            <Li><strong>Meta (WhatsApp Business Cloud API)</strong> &mdash;
              message transport for the +91 80899 41131 line and ad
              attribution via Meta Pixel.</Li>
            <Li><strong>Razorpay</strong> &mdash; payment processing for
              course and service purchases.</Li>
            <Li><strong>Resend</strong> &mdash; transactional email delivery
              (receipts, daily digests, reset links).</Li>
          </Ul>

          <H2>Business clients &middot; technology provider services</H2>
          <p>
            Where Skillies.AI provides WhatsApp customer-service assistants to
            business clients as a technology provider, each client connects
            their own WhatsApp Business Account and remains the controller of
            their customers&rsquo; data. Skillies.AI processes that data solely
            on the relevant client&rsquo;s behalf and instructions, strictly
            to operate that client&rsquo;s assistant. Each client&rsquo;s data
            is isolated and is never shared with, or accessible to, any other
            client. Customers of a client business should refer to that
            business&rsquo;s own privacy notice for how it controls their
            data.
          </p>

          <H2>Your rights under DPDP Act 2023</H2>
          <Ul>
            <Li><strong>Access</strong> &mdash; ask us what data we hold about
              you.</Li>
            <Li><strong>Correction</strong> &mdash; ask us to fix anything
              wrong.</Li>
            <Li><strong>Erasure</strong> &mdash; ask us to delete your data
              (subject to tax/payment record-keeping requirements). Replying
              STOP to our WhatsApp line triggers the same deletion
              automatically.</Li>
            <Li><strong>Withdraw consent</strong> &mdash; unsubscribe from
              marketing messages at any time, or revoke WhatsApp consent by
              replying STOP.</Li>
          </Ul>
          <p>
            Exercise any of these by emailing{" "}
            <a
              href="mailto:ehsan@skillies.ai"
              style={{ color: "#C62828", fontWeight: 600 }}
            >
              ehsan@skillies.ai
            </a>{" "}
            . We respond within 7 working days.
          </p>

          <H2>Data retention</H2>
          <p>
            We keep purchase records and invoices for 8 years (GST Act
            requirement). WhatsApp conversation data is retained while you are
            an active customer or have an open enquiry, and deleted on request
            or after a STOP reply. Non-purchase data from general enquiries
            that go quiet is retained for up to 24 months, then deleted.
          </p>

          <H2>Security</H2>
          <p>
            Payments run through Razorpay (PCI-DSS certified). Our site and
            dashboard are hosted on Vercel with HTTPS enforced site-wide. Our
            database is hosted on Supabase in the Mumbai region with at-rest
            encryption and access scoped via row-level security per tenant.
            Your payment card data never touches our servers.
          </p>

          <H2>Changes</H2>
          <p>
            If this policy changes, the &ldquo;Last updated&rdquo; date at the
            top will change. Material changes will be announced on our
            Instagram and via email to active customers.
          </p>

          <H2>Contact</H2>
          <p>
            Ehsan Asgar P (Ehsan Asgar Parambatt) &middot; Skillies.AI &middot;
            Malappuram, Kerala, India
            <br />
            Email:{" "}
            <a
              href="mailto:ehsan@skillies.ai"
              style={{ color: "#C62828", fontWeight: 600 }}
            >
              ehsan@skillies.ai
            </a>
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
