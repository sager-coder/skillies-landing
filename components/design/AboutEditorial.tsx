"use client";

import React, { Fragment } from "react";
import { Kicker } from "./Primitives";

/**
 * About — the soul of the site.
 *
 * Three-act origin story (2020 uHRS → 2025 KDP → 2026 Skillies.AI),
 * current research stack, and the bigger vision. Portrait at
 * public/ehsan-founder.jpg.
 */

const HUSTLES: Array<[string, string, string]> = [
  ["Day job", "Teacher · Malappuram school", "The steady one."],
  ["63 books", "Amazon KDP · published in 2025", "₹1.16L last month · zero new publishes since Oct."],
  ["Etsy printables", "PageBoo shop · weekends only", "Small. Growing. ₹8K/mo."],
  ["Skillies.AI", "Research · teach · serve", "This is the one."],
];

const RESEARCHING: Array<{ tool: string; what: string; accent: string }> = [
  {
    tool: "HeyGen + ElevenLabs",
    what: "Automated video production — avatars, voice, editing. Next income stream, and next course.",
    accent: "#C62828",
  },
  {
    tool: "Claude Code",
    what: "Agent orchestration. I'm building the Skillies.AI web app with it, line by line, instead of outsourcing.",
    accent: "#C9A24E",
  },
  {
    tool: "Meta ads + Claude",
    what: "Copy agents + funnel math. Pretty soon, ad ops is a solo job.",
    accent: "#5B7B5B",
  },
  {
    tool: "Etsy + AI printables",
    what: "My weekend engine. Proof that KDP isn't the only passive-income stack.",
    accent: "#8B1A1A",
  },
];

const AI_FRONTIERS: Array<[string, string]> = [
  ["Video production", "HeyGen · Sora · avatars"],
  ["Accounting", "AI bookkeeping agents"],
  ["Digital marketing", "Claude + Meta ads + copy agents"],
  ["Teaching", "Personal AI tutors"],
  ["Architecture · 3D", "Generative modeling"],
  ["Ops · Support", "Agents running the back office"],
];

export default function AboutEditorial() {
  return (
    <section
      id="about"
      style={{
        padding: "128px 24px",
        background: "#1A1A1A",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "-10%",
          top: "-10%",
          width: "60%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(198,40,40,0.20), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-10%",
          bottom: "-20%",
          width: "70%",
          height: "80%",
          background:
            "radial-gradient(circle, rgba(201,162,78,0.10), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* grain */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.07,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }}
      />

      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
        {/* dateline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 56,
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#EF4444" }} />
          § 09 · About the Founder
          <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>
            Long-form · read slowly
          </span>
        </div>

        {/* HEADER — name + photo + identity */}
        <div
          className="skillies-about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 64,
            alignItems: "center",
            marginBottom: 96,
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                aspectRatio: "3/4",
                borderRadius: 22,
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 60px 120px rgba(0,0,0,0.35), 0 2px 0 rgba(201,162,78,0.25) inset",
                background: "#1A1A1A",
                backgroundImage: "url('/ehsan-founder.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center 28%",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(198,40,40,0.14) 0%, transparent 35%, rgba(0,0,0,0.35) 85%, rgba(0,0,0,0.55) 100%)",
                  mixBlendMode: "multiply",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.12,
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 22,
                  left: 22,
                  right: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}
              >
                <span>Fig. 02 · Between classes · Apr 2026</span>
                <span style={{ color: "rgba(255,255,255,0.55)" }}>No. 037</span>
              </div>
            </div>
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: -18,
                right: -18,
                width: 108,
                height: 108,
                border: "2px solid rgba(198,40,40,0.35)",
                borderRadius: 22,
                zIndex: -1,
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -18,
                left: -18,
                width: 72,
                height: 72,
                background: "rgba(91,123,91,0.12)",
                borderRadius: 22,
                zIndex: -1,
              }}
            />
          </div>

          <div>
            <Kicker tone="green-light">Your mentor · Researcher + Teacher</Kicker>
            <h2
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(54px, 6.5vw, 96px)",
                letterSpacing: "-0.025em",
                lineHeight: 0.98,
                margin: "18px 0 14px",
              }}
            >
              Ehsan{" "}
              <em style={{ fontStyle: "italic", color: "#EF4444" }}>
                Asgar P.
              </em>
            </h2>
            <p
              style={{
                fontSize: 20,
                color: "#7A9A7A",
                margin: "0 0 32px",
                letterSpacing: "-0.01em",
                fontWeight: 600,
              }}
            >
              Teacher · Researcher · Founder, Skillies.AI · Malappuram
            </p>

            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.6vw, 32px)",
                lineHeight: 1.35,
                color: "#E6C178",
                margin: "0 0 32px",
                maxWidth: 580,
                borderLeft: "3px solid rgba(201,162,78,0.5)",
                paddingLeft: 22,
              }}
            >
              &ldquo;I could publish more books and earn more. I&apos;m
              choosing not to. I&apos;m a researcher first, a teacher second —
              and Skillies.AI is what happens when those two meet.&rdquo;
            </p>

            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.75,
                margin: 0,
                maxWidth: 580,
              }}
            >
              I teach English at a school in Malappuram. I&apos;ve been a
              researcher in my own time, on my own bandwidth, since 2020.
              Everything on this site — the books, the workflows, this web app
              you&apos;re reading right now — I built it myself, between
              classes and after the kids went home. Not because I had to.
              Because the building is the research.
            </p>
          </div>
        </div>

        {/* THE STORY — three acts */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 72,
            marginBottom: 96,
          }}
        >
          <Kicker tone="red">The story</Kicker>
          <h3
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 4.5vw, 60px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: "16px 0 48px",
              maxWidth: 800,
            }}
          >
            How a teacher from Malappuram ended up
            <br />
            <em style={{ fontStyle: "italic", color: "#EF4444" }}>
              obsessed with AI income.
            </em>
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 40,
            }}
          >
            {/* Act 1 */}
            <article>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 72,
                    color: "#C62828",
                    lineHeight: 0.8,
                    letterSpacing: "-0.04em",
                  }}
                >
                  2020
                </span>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  Act I
                </span>
              </div>
              <h4
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                }}
              >
                uHRS · The first signal
              </h4>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                I found uHRS — Microsoft&apos;s data-labelling platform — and
                taught a few friends how to use it. Inside three months they
                earned more than I did. Not because they worked harder, but
                because I was busy researching how to automate the work
                instead of grinding it. That was the tell.{" "}
                <em
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    color: "#E6C178",
                  }}
                >
                  I wasn&apos;t a grinder. I was a researcher.
                </em>
              </p>
            </article>

            {/* Act 2 */}
            <article>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 72,
                    color: "#C9A24E",
                    lineHeight: 0.8,
                    letterSpacing: "-0.04em",
                  }}
                >
                  2025
                </span>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  Act II
                </span>
              </div>
              <h4
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                }}
              >
                KDP · The loop I cracked
              </h4>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Sixty-three books published in a year. ₹8,71,982 in KDP royalties to date. Last
                month, ₹1.16L arrived in my bank account without me touching
                a single new book in six months. I could keep stacking and
                double it — but I already know that loop. The research part
                is done.{" "}
                <em
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    color: "#E6C178",
                  }}
                >
                  So now I&apos;m off looking at what&apos;s next.
                </em>
              </p>
            </article>

            {/* Act 3 */}
            <article>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 72,
                    color: "#5B7B5B",
                    lineHeight: 0.8,
                    letterSpacing: "-0.04em",
                  }}
                >
                  2026
                </span>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  Act III
                </span>
              </div>
              <h4
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                }}
              >
                Skillies.AI · The answer
              </h4>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                I sat with one question: &ldquo;what do I actually want to do
                with my time?&rdquo; The answer wasn&apos;t &ldquo;publish more
                books.&rdquo; It was: learn the next thing, teach it to people
                who&apos;ll actually use it, and build the tools we all need.
                That&apos;s Skillies.AI —{" "}
                <em
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    color: "#E6C178",
                  }}
                >
                  research, teach, serve.
                </em>
              </p>
            </article>
          </div>
        </div>

        {/* WHAT I'M RESEARCHING */}
        <div
          style={{
            padding: "48px 48px",
            borderRadius: 26,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 72,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 20,
              marginBottom: 6,
              flexWrap: "wrap",
            }}
          >
            <Kicker tone="gold">This month · lab notes</Kicker>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              updated April 19, 2026
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 4vw, 52px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: "14px 0 36px",
              maxWidth: 780,
            }}
          >
            What I&apos;m{" "}
            <em style={{ fontStyle: "italic", color: "#E6C178" }}>
              actually researching
            </em>{" "}
            right now — not what I&apos;m selling.
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
          >
            {RESEARCHING.map((r) => (
              <div
                key={r.tool}
                style={{
                  padding: "22px 24px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 3,
                    background: r.accent,
                  }}
                />
                <div
                  style={{
                    paddingLeft: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: r.accent,
                    }}
                  >
                    In the lab
                  </div>
                  <h4
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {r.tool}
                  </h4>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {r.what}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              marginTop: 28,
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.65,
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              maxWidth: 700,
            }}
          >
            Could I have hired someone to build this web app? Yes. I didn&apos;t —
            because building it is the research. When it ships next month, I&apos;ll
            know exactly how to teach it.
          </p>
        </div>

        {/* VISION */}
        <div style={{ marginBottom: 72 }}>
          <Kicker tone="red">The vision</Kicker>
          <h3
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 68px)",
              letterSpacing: "-0.025em",
              lineHeight: 1.0,
              margin: "16px 0 32px",
              maxWidth: 960,
            }}
          >
            Every profession is going{" "}
            <em style={{ fontStyle: "italic", color: "#EF4444" }}>AI-native</em>{" "}
            within the decade.
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "flex-start",
              marginBottom: 36,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.75,
                  margin: "0 0 20px",
                }}
              >
                Video production, accounting, digital marketing, teaching,
                architecture, 3D modeling, ops, support — everything.
                Every profession in India will run with an AI on its
                shoulder inside ten years.
              </p>
              <p
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                The only question worth asking a Kerala teacher, freelancer,
                small-business owner, or Gulf NRI in 2026 is this:{" "}
                <strong style={{ color: "white" }}>
                  are you learning to instruct the AI, or will someone who did
                  quietly replace you?
                </strong>
              </p>
            </div>
            <div
              style={{
                padding: "24px 28px",
                borderRadius: 18,
                border: "1px solid rgba(201,162,78,0.3)",
                background:
                  "linear-gradient(135deg, rgba(201,162,78,0.08), rgba(198,40,40,0.05))",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#E6C178",
                  marginBottom: 14,
                }}
              >
                AI is already touching —
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {AI_FRONTIERS.map(([title, tools]) => (
                  <div
                    key={title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      fontSize: 13,
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ color: "white", fontWeight: 600 }}>
                      {title}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "'Instrument Serif', serif",
                        fontStyle: "italic",
                        fontSize: 13,
                      }}
                    >
                      {tools}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skillies.AI closing statement */}
          <div
            style={{
              padding: "40px 44px",
              borderRadius: 22,
              background:
                "linear-gradient(135deg, rgba(198,40,40,0.14) 0%, rgba(139,26,26,0.08) 100%)",
              border: "1px solid rgba(198,40,40,0.22)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                right: "-10%",
                top: "-30%",
                width: "50%",
                height: "160%",
                background:
                  "radial-gradient(circle, rgba(201,162,78,0.18), transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", maxWidth: 900 }}>
              <Kicker tone="gold">The Kerala answer</Kicker>
              <h4
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  margin: "14px 0 18px",
                }}
              >
                Skillies.AI will{" "}
                <em style={{ fontStyle: "italic", color: "#EF4444" }}>
                  research, teach, and serve.
                </em>
              </h4>
              <p
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.7,
                  margin: "0 0 8px",
                }}
              >
                We find what actually works in 2026 — not 2018&apos;s playbook.
                We teach it straight. We build tools for the businesses that
                can&apos;t wait. No hype, no random skills, no &ldquo;secret
                formulas.&rdquo; Only what&apos;s proven to make money this year.
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "#E6C178",
                  margin: "16px 0 0",
                }}
              >
                One day we&apos;ll be India&apos;s most trusted AI skills school.
                We&apos;re 6 students in. We&apos;re not in a hurry.
              </p>
            </div>
          </div>
        </div>

        {/* HUSTLE STACK — compact, as epilogue */}
        <div
          style={{
            padding: "24px 28px",
            borderRadius: 18,
            border: "1px dashed rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.02)",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "rgba(122,154,122,0.9)",
              marginBottom: 14,
            }}
          >
            What I do · in parallel
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {HUSTLES.map(([title, sub, note]) => (
              <div
                key={title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr auto",
                  gap: 14,
                  alignItems: "baseline",
                  fontSize: 14,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "white",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title}
                </div>
                <div style={{ color: "rgba(255,255,255,0.55)" }}>{sub}</div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 13,
                    color: "rgba(230,193,120,0.85)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 28,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 36,
                color: "#FAF5EB",
                lineHeight: 1,
              }}
            >
              — Ehsan
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              Teacher · Researcher · Founder
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: "right",
              lineHeight: 1.6,
            }}
          >
            Signed at Calicut
            <br />
            April 2026
          </div>
        </div>
      </div>
    </section>
  );
}
