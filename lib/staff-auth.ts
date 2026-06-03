/**
 * Username + password login for the ticketing system (founder + staff).
 *
 * Supabase Auth identifies users by email, not username. So we map each
 * username to a deterministic synthetic email under a domain we never
 * send mail to. The person only ever sees "username + password"; under
 * the hood it's a normal Supabase email+password account — which means
 * sessions, cookies, and RLS (auth.uid()) all keep working unchanged.
 *
 * Pure functions — safe to import in both client and server code.
 */

/** Internal-only domain for synthetic staff emails. No mail is sent here. */
export const STAFF_EMAIL_DOMAIN = "staff.skillies.ai";

/** Lowercase, trim, keep only url/handle-safe chars. */
export function normalizeUsername(u: string): string {
  return (u || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

/** Deterministic synthetic email for a username. */
export function usernameToEmail(u: string): string {
  return `${normalizeUsername(u)}@${STAFF_EMAIL_DOMAIN}`;
}

export const MIN_PASSWORD_LENGTH = 6;
