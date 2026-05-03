/**
 * POST /api/quote
 *
 * Single source of truth for Skillies pricing. Wraps lib/pricing.ts
 * calculateQuote() and exposes it over HTTP so the WhatsApp Scoping
 * Agent v2 (ElevenLabs Convai server tool) can produce real quotes
 * during a sales conversation — without letting the LLM do the math.
 *
 * The /pricing UI calls this same engine in-process. The agent calls
 * it via webhook. Same numbers, always.
 *
 * Request body:
 *   {
 *     vertical: "real-estate" | "hajj" | "study-abroad" | "coaching" | "interiors" | "retail",
 *     monthly_qc: number,
 *     modules?: ModuleKey[],
 *     worker_seats?: number
 *   }
 *
 * Response:
 *   QuoteOutput from lib/pricing.ts (setupTotal, monthlyTotal,
 *   twelveMonthTotal, breakdown[], humanComparison)
 *
 * Auth · open. The numbers it computes are public (same as /pricing).
 * Rate-limited per IP to prevent scrapers (10 req/min per IP).
 */
import { NextResponse, type NextRequest } from "next/server";
import {
  calculateQuote,
  INDUSTRY_SETUP,
  MODULES,
  type VerticalKey,
  type ModuleKey,
  type QuoteInput,
} from "@/lib/pricing";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PER_MINUTE = 10;
const WINDOW_SECONDS = 60;

const VALID_VERTICALS = Object.keys(INDUSTRY_SETUP) as VerticalKey[];
const VALID_MODULES = Object.keys(MODULES) as ModuleKey[];

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const first = fwd.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  // Per-IP rate limit
  const ip = clientIp(req);
  const { ok, retryAfterSeconds } = rateLimit(
    `quote:${ip}`,
    MAX_PER_MINUTE,
    WINDOW_SECONDS,
  );
  if (!ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "bad_json", message: "Body must be JSON." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "bad_request", message: "Body must be an object." },
      { status: 400 },
    );
  }

  const b = body as Record<string, unknown>;

  // Validate vertical
  const vertical = b.vertical;
  if (typeof vertical !== "string" || !VALID_VERTICALS.includes(vertical as VerticalKey)) {
    return NextResponse.json(
      {
        error: "invalid_vertical",
        message: `vertical must be one of: ${VALID_VERTICALS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  // Validate monthly_qc
  const monthlyQc = b.monthly_qc;
  if (typeof monthlyQc !== "number" || !Number.isFinite(monthlyQc) || monthlyQc < 0) {
    return NextResponse.json(
      {
        error: "invalid_monthly_qc",
        message: "monthly_qc must be a non-negative number.",
      },
      { status: 400 },
    );
  }
  if (monthlyQc > 50_000) {
    return NextResponse.json(
      {
        error: "monthly_qc_too_high",
        message: "monthly_qc above 50,000 — this is enterprise scope. Escalate to Ehsan for a custom quote.",
      },
      { status: 400 },
    );
  }

  // Validate modules
  let modules: ModuleKey[] = [];
  if (Array.isArray(b.modules)) {
    const filtered = (b.modules as unknown[]).filter(
      (m): m is ModuleKey =>
        typeof m === "string" && VALID_MODULES.includes(m as ModuleKey),
    );
    modules = filtered as ModuleKey[];
  }

  // Validate worker_seats
  let workerSeats: number | undefined;
  if (typeof b.worker_seats === "number" && Number.isFinite(b.worker_seats)) {
    workerSeats = Math.max(0, Math.min(50, Math.floor(b.worker_seats)));
  }

  const input: QuoteInput = {
    vertical: vertical as VerticalKey,
    monthlyQc: Math.floor(monthlyQc),
    modules,
    workerSeats,
  };

  const quote = calculateQuote(input);

  return NextResponse.json({
    ok: true,
    input,
    quote,
    // Pre-formatted summary for the agent to drop straight into chat
    agent_summary: {
      headline: `${quote.tierName} tier · setup ₹${quote.setupTotal.toLocaleString("en-IN")} · then ₹${quote.monthlyTotal.toLocaleString("en-IN")}/month`,
      bullets: quote.breakdown
        .filter((b) => b.setup > 0 || b.monthly > 0)
        .map((b) => {
          const parts: string[] = [];
          if (b.setup > 0) parts.push(`₹${b.setup.toLocaleString("en-IN")} setup`);
          if (b.monthly > 0) parts.push(`₹${b.monthly.toLocaleString("en-IN")}/mo`);
          return `${b.label} · ${parts.join(" · ")}`;
        }),
      tier: quote.tierName,
      year_one_total: `₹${quote.twelveMonthTotal.toLocaleString("en-IN")}`,
      human_comparison:
        quote.humanComparison.savings > 0
          ? `Same QC capacity hiring ${quote.humanComparison.description} runs ~₹${quote.humanComparison.humanMonthly.toLocaleString("en-IN")}/mo (~₹${quote.humanComparison.humanAnnual.toLocaleString("en-IN")}/yr). Skillies saves ~₹${quote.humanComparison.savings.toLocaleString("en-IN")}/yr — and the agent works 24/7, doesn't take leaves, never makes data-entry errors, and remembers every customer forever.`
          : `Same QC capacity hiring ${quote.humanComparison.description} runs ~₹${quote.humanComparison.humanMonthly.toLocaleString("en-IN")}/mo. Skillies isn't dramatically cheaper at this volume — the wins are 24/7 coverage, lifelong memory, zero attrition, self-improving via monthly conversation analysis, and fixed-cost economics that get better as you scale.`,
    },
  });
}

// Allow GET for browser-based smoke tests · returns a sample quote
export async function GET() {
  const sample = calculateQuote({
    vertical: "real-estate",
    monthlyQc: 600,
    modules: ["vision", "voice", "calendar", "memory", "industryCustom"],
  });
  return NextResponse.json({
    ok: true,
    info:
      "Skillies pricing engine · single source of truth. POST { vertical, monthly_qc, modules, worker_seats } to compute a quote.",
    sample_input: {
      vertical: "real-estate",
      monthly_qc: 600,
      modules: ["vision", "voice", "calendar", "memory", "industryCustom"],
    },
    sample_output: sample,
    valid_verticals: VALID_VERTICALS,
    valid_modules: VALID_MODULES,
  });
}
