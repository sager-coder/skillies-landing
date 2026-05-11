/**
 * /admin/courses — course catalog management.
 *
 * Pure client component (no server data needed; all fetches go through
 * /api/admin/courses). Provides search, status filter, enable/disable
 * toggle per course, "New course" modal with full form, edit modal,
 * delete with confirmation, and live enrolled-student counts.
 */
import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = { title: "Courses · Skillies Admin" };
export const dynamic = "force-dynamic";

export default function CoursesPage() {
  return <CoursesClient />;
}
