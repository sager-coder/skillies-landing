import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Terms of Service · Skillies.AI",
  description:
    "The terms that govern your use of skillies.ai and Skillies.AI workshops, courses, and mentorship.",
};

export default function TermsPage() {
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
          § LEGAL · TERMS OF SERVICE
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
          Terms of Service
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
          <p>
            These terms govern your use of skillies.ai and any product we sell
            through it. By purchasing a workshop ticket, enrolling in a course
            or cohort, or applying for mentorship, you agree to the terms below.
          </p>

          <H2>Who we are</H2>
          <p>
            Skillies.AI is operated as a sole-proprietorship by Ehsan Asgar
            Parambatt, a resident of Malappuram, Kerala, India. Any reference to
            "we", "us", or "Skillies.AI" in these terms refers to that entity.
          </p>
          <p>
            Contact: <a href="mailto:ehsan@skillies.ai" style={L}>ehsan@skillies.ai</a>{" "}
            · WhatsApp +91 87143 18352
          </p>

          <H2>What we sell</H2>
          <Ul>
            <Li><strong>Workshops</strong> — one-day, in-person, educational
              events teaching Amazon KDP publishing with AI assistance. Tickets
              are per-person, for a specific city and date.</Li>
            <Li><strong>Video courses</strong> — self-paced online learning
              material about Amazon KDP + AI workflows.</Li>
            <Li><strong>Live cohort</strong> — a 50-day guided program with
              live weekly Q&A, community, and lifetime resource access.</Li>
            <Li><strong>Private mentorship</strong> — six months of one-on-one
              work directly with Ehsan, capped at a small number of seats.</Li>
          </Ul>

          <H2>What we do NOT guarantee</H2>
          <p>
            We teach a system that has worked for Ehsan (₹1,16,000/month from
            63 AI-assisted books in 2025-2026). We do <strong>not</strong>{" "}
            guarantee you will earn the same amount, or any specific amount,
            from following it. Your results depend on:
          </p>
          <Ul>
            <Li>The number of books you actually publish.</Li>
            <Li>The niches you pick.</Li>
            <Li>The time and care you invest.</Li>
            <Li>
              Amazon KDP platform behaviour and policy — which can change
              independently of us.
            </Li>
          </Ul>
          <p>
            The only outcome-linked guarantee we offer is the one attached to
            the 50-day Cohort — see{" "}
            <a href="/refund" style={L}>Refund & Cancellation</a> for the exact
            terms of that guarantee.
          </p>

          <H2>Your responsibilities</H2>
          <Ul>
            <Li>Give accurate contact information at checkout. If we can't
              reach you via the WhatsApp number or email you provided, that's
              on you.</Li>
            <Li>Follow Amazon KDP's Terms of Service. We teach legitimate
              publishing methods; using them to upload plagiarised or policy-
              violating content is your problem, not ours.</Li>
            <Li>Treat other cohort/mentorship members with respect. Harassment
              or bad-faith behaviour can result in removal without refund.</Li>
            <Li>
              Respect intellectual property. Prompts, templates, recordings, and
              materials from any Skillies.AI program are for your personal
              use only — don't redistribute or resell them.
            </Li>
          </Ul>

          <H2>Payments</H2>
          <p>
            All transactions are processed by Razorpay. Prices listed on the
            site are in Indian Rupees (₹) and are inclusive of applicable taxes
            unless stated otherwise. For refund and cancellation terms, see the
            <a href="/refund" style={L}> Refund & Cancellation</a> page.
          </p>

          <H2>Intellectual property</H2>
          <p>
            All content on skillies.ai — text, visual design, the Skillies.AI
            brand — is owned by Ehsan Asgar Parambatt. You may not reproduce,
            republish, or sell it without written permission.
          </p>

          <H2>Liability</H2>
          <p>
            To the maximum extent permitted by Indian law, our liability for
            any claim arising from our products is capped at the amount you
            paid us for that specific product. We're not liable for indirect
            losses (lost time, lost revenue, lost opportunity) from
            participating in our programs.
          </p>

          <H2>Changes</H2>
          <p>
            We may update these terms from time to time. The "Last updated"
            date at the top reflects the most recent change. Material changes
            will be announced via email to active customers.
          </p>

          <H2>Governing law</H2>
          <p>
            These terms are governed by Indian law. Any dispute is subject to
            the jurisdiction of the courts in Malappuram, Kerala.
          </p>

          <H2>Contact</H2>
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:ehsan@skillies.ai" style={L}>
              ehsan@skillies.ai
            </a>{" "}
            or WhatsApp +91 87143 18352. We respond within 7 working days.
          </p>
        </div>
      </article>
      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}

const L = { color: "#C62828", fontWeight: 600 } as const;

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: "#1A1A1A",
        margin: "32px 0 14px",
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
        margin: "0 0 20px",
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
