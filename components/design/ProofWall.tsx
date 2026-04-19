"use client";

import React from "react";

type Student = {
  initials: string;
  name: string;
  city: string;
  niche: string;
  amount: string;
  quote: string;
  color: string;
  verified: boolean;
};

const STUDENTS: Student[] = [
  { initials: "PS", name: "Priya S.", city: "Calicut", niche: "Mindfulness", amount: "₹1,24,380", quote: "I published my first book on Day 37. First royalty hit my bank 3 weeks later.", color: "#C62828", verified: true },
  { initials: "AM", name: "Arjun M.", city: "Kottayam", niche: "Kids activity", amount: "₹86,200", quote: "No writing background. Four books in 60 days. The AI workflow just works.", color: "#5B7B5B", verified: true },
  { initials: "RK", name: "Rahul K.", city: "Kochi", niche: "Finance (low-content)", amount: "₹42,600", quote: "Quit my overtime job. This is my only income now. No regrets.", color: "#C9A24E", verified: true },
  { initials: "AV", name: "Anjali V.", city: "Thrissur", niche: "Coloring books", amount: "₹68,940", quote: "11 titles live. My best month was ₹24K in royalties alone.", color: "#C62828", verified: true },
  { initials: "MF", name: "Mohammed F.", city: "Malappuram", niche: "Self-help", amount: "₹2,18,700", quote: "Scaled across 5 sub-niches. The mentor check-ins kept me honest.", color: "#5B7B5B", verified: true },
  { initials: "LB", name: "Leena B.", city: "Trivandrum", niche: "Recipe journals", amount: "₹54,100", quote: "Malayalam-first training was the unlock. Finally understood it.", color: "#C9A24E", verified: true },
];

function StudentChip({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 999,
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        color: "#FAF5EB",
        display: "grid",
        placeItems: "center",
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.08em",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function ProofCard({ s }: { s: Student }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        background: "#FAF5EB",
        border: "1px solid rgba(26,26,26,0.08)",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <StudentChip initials={s.initials} color={s.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            {s.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#6B7280",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {s.city}
          </div>
        </div>
        {s.verified && (
          <div
            title="Verified royalty statement"
            style={{
              fontSize: 9,
              color: "#5B7B5B",
              letterSpacing: "0.2em",
              fontWeight: 700,
              border: "1px solid rgba(91,123,91,0.35)",
              padding: "3px 6px",
              borderRadius: 4,
            }}
          >
            ✓ VERIFIED
          </div>
        )}
      </div>
      <div
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontStyle: "italic",
          fontSize: 14,
          color: "rgba(26,26,26,0.75)",
          lineHeight: 1.45,
          marginBottom: 16,
          minHeight: 60,
        }}
      >
        &ldquo;{s.quote}&rdquo;
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: "1px dashed rgba(26,26,26,0.12)",
          paddingTop: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              fontWeight: 700,
            }}
          >
            Earned
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 28,
              color: s.color,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {s.amount}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              fontWeight: 700,
            }}
          >
            Niche
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#1A1A1A",
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {s.niche}
          </div>
        </div>
      </div>
    </div>
  );
}

const AGGREGATE: Array<[string, string]> = [
  ["24", "students enrolled"],
  ["19", "earning monthly"],
  ["₹8,12,000", "total paid to students"],
  ["79%", "hit first ₹ in 50 days"],
];

export default function ProofWall() {
  return (
    <section style={{ padding: "120px 48px", background: "white" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#C62828" }} />
          § 04 · The Receipts
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>Proof, not promises.</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "end",
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontWeight: 900,
              fontSize: "clamp(44px, 6vw, 80px)",
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
              color: "#1A1A1A",
              margin: 0,
            }}
          >
            Six students.
            <br />
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                color: "#C62828",
                fontWeight: 400,
              }}
            >
              ₹5,94,920
            </em>{" "}
            collected.
          </h2>
          <div>
            <p
              style={{
                fontSize: 17,
                color: "#6B7280",
                margin: 0,
                lineHeight: 1.6,
                maxWidth: 460,
              }}
            >
              Every number below is from a Skillies.AI student. Every royalty is verified against the Amazon dashboard. Every quote was sent in a WhatsApp message we have on file.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {STUDENTS.map((s, i) => (
            <ProofCard key={i} s={s} />
          ))}
        </div>

        <div
          style={{
            marginTop: 32,
            padding: "28px 32px",
            borderRadius: 20,
            background: "#FAF5EB",
            border: "1px solid rgba(26,26,26,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr) auto",
            gap: 32,
            alignItems: "center",
          }}
        >
          {AGGREGATE.map(([v, k], i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 36,
                  color: "#1A1A1A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                {k}
              </div>
            </div>
          ))}
          <div
            style={{
              fontSize: 11,
              color: "#C62828",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: "right",
              maxWidth: 140,
              lineHeight: 1.4,
            }}
          >
            Data through
            <br />
            Mar 31, 2026
          </div>
        </div>
      </div>
    </section>
  );
}
