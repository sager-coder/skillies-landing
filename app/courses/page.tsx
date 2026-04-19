import { redirect } from "next/navigation";
import { CoursePortalNav, CourseInstructors } from "@/components/courses/Sections";
import CoursesConstruction from "@/components/courses/Construction";
import TalkToEhsan from "@/components/design/TalkToEhsan";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Courses · Under Construction · Skillies.AI",
  description:
    "The Skillies.AI campus is being built. Nine courses in various stages of research, drafting, and recording. Cohort members get first access.",
};

// Render dynamically so auth state is checked on every request
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  // If Supabase is configured AND the user is logged in AND enrolled,
  // send them straight to their portal. Otherwise show the public
  // under-construction page.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);
        if (enrollments && enrollments.length > 0) {
          redirect("/learn");
        }
      }
    } catch {
      // Fall through to the public page
    }
  }

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
