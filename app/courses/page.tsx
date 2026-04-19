import { CoursePortalNav, CourseInstructors } from "@/components/courses/Sections";
import CoursesConstruction from "@/components/courses/Construction";
import TalkToEhsan from "@/components/design/TalkToEhsan";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Courses · Under Construction · Skillies.AI",
  description:
    "The Skillies.AI campus is being built. Nine courses in various stages of research, drafting, and recording. Cohort members get first access.",
};

export default function CoursesPage() {
  return (
    <main>
      <CoursePortalNav />
      <CoursesConstruction />
      <TalkToEhsan context="courses" tone="charcoal" />
      <CourseInstructors />
      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}
