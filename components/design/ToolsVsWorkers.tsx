/**
 * ToolsVsWorkers · the brand-defining contrast section.
 *
 * Side-by-side comparison · "What every WhatsApp tool does" vs "What a
 * Skillies worker does." Heavy visual weight on the difference. The single
 * most repeated message in the brand voice — make it stick on the page.
 */
const TOOL_FEATURES = [
  "Routes messages",
  "Sends broadcast templates",
  "Auto-replies with canned answers",
  "Multi-agent inbox",
  "Click-to-WhatsApp ads",
  "Payment integration",
];

const WORKER_FEATURES = [
  "Reads photos · floor plans, hairlines, kitchens",
  "Listens to voice notes in 5 Indic languages",
  "Remembers each customer · weeks, months, years",
  "Switches Mal-Eng-Hin mid-conversation",
  "Books site visits + payment links + EMI math",
  "Closes the deal · doesn't hand off to a human",
];

export default function ToolsVsWorkers() {
  return (
    <section
      className="sk-section relative overflow-hidden"
      style={{ background: "var(--sk-ink)", color: "var(--sk-cream)" }}
    >
      {/* Subtle red glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-10%",
          top: "-20%",
          width: "60%",
          height: "120%",
          background:
            "radial-gradient(circle, rgba(217,52,43,0.18), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="sk-container relative">
        <p
          className="sk-font-meta mb-4"
          style={{ color: "rgba(250,245,235,0.5)" }}
        >
          THE FRAME
        </p>
        <h2
          className="sk-font-display"
          style={{
            fontSize: "var(--sk-text-h2)",
            color: "var(--sk-cream)",
            maxWidth: "20ch",
          }}
        >
          AiSensy, WATI, Interakt sell{" "}
          <span style={{ color: "rgba(250,245,235,0.5)" }}>tools</span>.<br />
          Skillies builds{" "}
          <span
            className="sk-font-display-italic"
            style={{ color: "var(--sk-red)" }}
          >
            workers
          </span>
          .
        </h2>
        <p
          className="sk-font-body mt-6 max-w-[58ch]"
          style={{
            fontSize: "var(--sk-text-lead)",
            color: "rgba(250,245,235,0.65)",
          }}
        >
          Tools need a human to operate them. Workers do the job. Same WhatsApp
          number, different category of product.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-10">
          {/* Tools column */}
          <article
            className="rounded-3xl p-8 md:p-10"
            style={{
              background: "rgba(250,245,235,0.04)",
              border: "1px solid rgba(250,245,235,0.08)",
            }}
          >
            <p
              className="sk-font-meta mb-3"
              style={{ color: "rgba(250,245,235,0.45)" }}
            >
              WHAT TOOLS DO
            </p>
            <h3
              className="sk-font-section"
              style={{
                fontSize: "1.875rem",
                color: "rgba(250,245,235,0.6)",
                marginBottom: 24,
              }}
            >
              They route messages.
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {TOOL_FEATURES.map((f) => (
                <li
                  key={f}
                  className="sk-font-body"
                  style={{
                    fontSize: "1rem",
                    color: "rgba(250,245,235,0.55)",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(250,245,235,0.06)",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 18,
                      height: 1,
                      background: "rgba(250,245,235,0.35)",
                      flexShrink: 0,
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <p
              className="sk-font-meta mt-6"
              style={{ color: "rgba(250,245,235,0.4)" }}
            >
              YOU STILL HIRE THE SDR.
            </p>
          </article>

          {/* Workers column */}
          <article
            className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(217,52,43,0.12), rgba(217,52,43,0.04))",
              border: "1px solid rgba(217,52,43,0.35)",
            }}
          >
            <p
              className="sk-font-meta mb-3"
              style={{ color: "var(--sk-red)" }}
            >
              WHAT WORKERS DO
            </p>
            <h3
              className="sk-font-section"
              style={{
                fontSize: "1.875rem",
                color: "var(--sk-cream)",
                marginBottom: 24,
              }}
            >
              They close the deal.
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {WORKER_FEATURES.map((f) => (
                <li
                  key={f}
                  className="sk-font-body"
                  style={{
                    fontSize: "1rem",
                    color: "rgba(250,245,235,0.92)",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(250,245,235,0.08)",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      color: "var(--sk-red)",
                      fontWeight: 600,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    →
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <p
              className="sk-font-meta mt-6"
              style={{ color: "var(--sk-red)" }}
            >
              YOU STOP HIRING.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
