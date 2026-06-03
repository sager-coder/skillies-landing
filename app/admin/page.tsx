/**
 * /admin — root admin route. Redirects to the default landing
 * (/admin/today). All real admin pages live under /admin/<section>.
 */
import { redirect } from "next/navigation";

export default function AdminRootPage() {
  redirect("/admin/today");
}
