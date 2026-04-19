import {
  CoursePortalNav,
  CoursePortalHero,
  CourseCatalog,
  CourseInstructors,
} from "@/components/courses/Sections";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Courses · Skillies.AI",
  description:
    "KDP Mastery, Claude for book outlines, and more. Every skill we teach to help you earn real income with AI.",
};

export default function CoursesPage() {
  return (
    <main>
      <CoursePortalNav />
      <CoursePortalHero />
      <CourseCatalog />
      <CourseInstructors />
      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}
