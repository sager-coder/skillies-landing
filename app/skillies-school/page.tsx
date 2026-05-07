/**
 * /skillies-school · the consumer page (Amazon KDP only, post-pivot).
 */
import type { Metadata } from "next";
import SkilliesSchoolContent from "@/components/skillies/SkilliesSchoolContent";

export const metadata: Metadata = {
  title: "Skillies School · Amazon KDP income skill",
  description:
    "The Amazon KDP methodology that generated ₹8,71,982 from 63 books. Self-paced, founder-taught, Kerala-context. The original Skillies product, still here.",
};

export default function SkilliesSchoolPage() {
  return <SkilliesSchoolContent />;
}
