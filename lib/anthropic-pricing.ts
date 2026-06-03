/**
 * Anthropic token pricing (USD per million tokens) for cost estimation
 * in usage tracking. These are list prices and may drift — update when
 * Anthropic changes pricing. Used by the coach usage logger to store an
 * `estimated_cost_usd` per reply.
 *
 * Cache reads bill at ~0.1× input; cache writes at ~1.25× input.
 */
export type ModelRate = {
  /** USD per 1M input tokens. */
  input: number;
  /** USD per 1M output tokens. */
  output: number;
};

const MILLION = 1_000_000;

// Defaults applied to any model not in the table below.
const FALLBACK_RATE: ModelRate = { input: 1, output: 5 };

const RATES: Record<string, ModelRate> = {
  // MiniMax-Text-01 — the coach's current model. Approximate list price
  // (USD per 1M tokens); update if MiniMax changes pricing.
  "MiniMax-Text-01": { input: 0.2, output: 1.1 },
  // Kept for the shared fallback chain / business agents.
  "claude-haiku-4-5-20251001": { input: 1, output: 5 },
  "claude-sonnet-4-6": { input: 3, output: 15 },
  "claude-opus-4-6": { input: 15, output: 75 },
};

export function rateFor(model: string): ModelRate {
  return RATES[model] ?? FALLBACK_RATE;
}

/**
 * Estimate the USD cost of one reply. Cache reads are billed at 0.1× the
 * input rate; cache-creation tokens at 1.25× the input rate.
 */
export function estimateCostUsd(usage: {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
}): number {
  const r = rateFor(usage.model);
  const cost =
    (usage.inputTokens * r.input +
      usage.outputTokens * r.output +
      usage.cacheReadTokens * r.input * 0.1 +
      usage.cacheCreationTokens * r.input * 1.25) /
    MILLION;
  return cost;
}
