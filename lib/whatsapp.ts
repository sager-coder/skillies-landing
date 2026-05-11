/**
 * WhatsApp deeplink helper for the manual-access flow.
 *
 * When a logged-in user clicks "Access Course" but isn't enrolled yet,
 * we route them to WhatsApp so the admin can confirm payment manually
 * and grant access from the admin dashboard.
 *
 * The number is hard-coded here (and not in a NEXT_PUBLIC_ var) because
 * it's the one fixed business contact — changing it is a code review
 * concern, not an env var concern.
 */

export const SKILLIES_WA_NUMBER_E164 = "+918714318352";

/** wa.me wants the number without the leading "+". */
const WA_NUMBER_BARE = SKILLIES_WA_NUMBER_E164.replace(/^\+/, "");

/**
 * Build a wa.me link with a pre-filled message.
 *
 * Pass either a plain string or no argument for the generic default.
 * Pass an options object to mention a specific course.
 */
export function buildWhatsAppUrl(
  arg?: string | { courseTitle?: string; phone?: string | null },
): string {
  let message =
    "Hi Skillies, I would like to access this course.";
  if (typeof arg === "string") {
    message = arg;
  } else if (arg) {
    const parts: string[] = ["Hi Skillies, I would like to access"];
    parts.push(arg.courseTitle ? `the "${arg.courseTitle}" course` : "this course");
    parts.push(".");
    if (arg.phone) parts.push(` My phone is ${arg.phone}.`);
    message = parts.join("");
  }
  return `https://wa.me/${WA_NUMBER_BARE}?text=${encodeURIComponent(message)}`;
}
