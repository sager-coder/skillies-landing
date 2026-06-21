/**
 * Central place for outbound URLs we link to from many components.
 * Edit here, propagates everywhere.
 *
 * Founder contact policy:
 *   · Public CTAs MUST funnel through Cal.com booking
 *   · Personal WhatsApp numbers (+91 87143 18352 / 18353) are NEVER public
 *   · The agent's public WhatsApp Business line +91 80899 41131 IS public
 *     (it's the live agent demo, not a personal contact)
 */

/** Ehsan's 30-min Cal.com slot — every public "book a call" CTA points here. */
export const BOOKING_URL = "https://cal.com/sager-zmd4kl/30min";

/** Skillies' public WhatsApp Business API line (where the live agent runs). */
export const PUBLIC_WHATSAPP_URL =
  "https://wa.me/918089941131?text=Hi%2C%20I%20want%20to%20try%20the%20Skillies%20AI%20agent%20on%20WhatsApp.%20My%20business%20is%20";

/** Founder email · publicly safe contact. */
export const FOUNDER_EMAIL = "ehsan@skillies.ai";

/**
 * Live agent platform. Every vertical gets its own deep-link on the agent
 * subdomain (e.g. agents.skillies.ai/real-estate). The landing page shows
 * that address on each vertical card so the structure reads clearly.
 *
 * `AGENTS_LIVE` gates whether those cards actually navigate to the subdomain.
 * As of 2026-06, agents.skillies.ai DNS is not resolving yet, so we fall back
 * to the rich internal /for/<slug> page and never dead-end a live visitor.
 * Flip `AGENTS_LIVE` to true the moment the subdomain is serving traffic and
 * every vertical card across the site repoints — no other edits needed.
 */
export const AGENTS_BASE = "https://agents.skillies.ai";
export const AGENTS_LIVE = false;

/** Visible "address" we print on each vertical card (always the subdomain). */
export function agentAddressForVertical(slug: string): string {
  return `agents.skillies.ai/${slug}`;
}

/** Where a vertical card actually navigates (subdomain when live, else internal). */
export function agentUrlForVertical(slug: string): string {
  return AGENTS_LIVE ? `${AGENTS_BASE}/${slug}` : `/for/${slug}`;
}

/**
 * Build a Cal.com booking URL with a vertical hint pre-filled in the
 * Cal.com `notes` field — used by per-vertical pages so the inbound
 * booking comes in tagged.
 */
export function bookingUrlForVertical(verticalLabel: string): string {
  const note = `Vertical · ${verticalLabel}`;
  return `${BOOKING_URL}?notes=${encodeURIComponent(note)}`;
}
