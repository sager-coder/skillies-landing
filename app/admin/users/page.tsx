/**
 * /admin/users — student management.
 *
 * Server component loads the course catalog (needed for the "grant
 * access" dropdown inside each row's detail), then defers all live
 * state — students list, search, filtering, pagination, block toggle,
 * enrollment grants — to the client component below.
 */
import type { Metadata } from "next";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import UsersClient from "./UsersClient";

export const metadata: Metadata = { title: "Users · Skillies Admin" };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const admin = createSupabaseAdminClient();
  const { data: courseRows } = await admin
    .from("courses")
    .select("id, title")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const courses = (courseRows || []).map((c) => ({ id: c.id, title: c.title }));

  return <UsersClient courses={courses} />;
}
