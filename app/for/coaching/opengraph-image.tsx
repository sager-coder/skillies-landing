import { ogImageFor, OG_SIZE } from "@/lib/og";

export const alt = "Skillies for Coaching & EdTech — AI sales agent on WhatsApp";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImageFor("coaching");
}
