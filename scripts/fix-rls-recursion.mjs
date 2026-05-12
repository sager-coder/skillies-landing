#!/usr/bin/env node
/**
 * Prints the SQL block that fixes the "infinite recursion detected in
 * policy for relation profiles" error (Postgres code 42P17).
 *
 * Cause: several RLS policies granted admins access via
 *   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin)
 * The profiles SELECT policy itself contained the same EXISTS, so any
 * query that triggered an admin-OR check would loop.
 *
 * Resolution: drop the admin-OR branches everywhere. All admin reads
 * and writes in the app go through the service-role client, which
 * bypasses RLS — so RLS doesn't need to know about admins at all.
 *
 * Run: node scripts/fix-rls-recursion.mjs
 * Then paste the printed SQL into Supabase Dashboard → SQL Editor.
 */
console.log(`
Paste this in Supabase Dashboard → SQL Editor and click Run.
Idempotent: drops + recreates the affected policies.

──────────────────────────────────────────────────────────────────────
-- profiles: users can read their own row only. Admin reads via
-- service-role bypass.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_select_own"          on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- courses: drop the for-all admin policy. Public select stays as-is.
drop policy if exists "courses_admin_write" on public.courses;

-- enrollments: drop the for-all admin policy. Students still see
-- their own rows (existing policy).
drop policy if exists "enrollments_admin_write" on public.enrollments;

-- lessons: drop the for-all admin policy, and remove the recursive
-- profile EXISTS from the enrolled-select policy.
drop policy if exists "lessons_admin_write"     on public.lessons;
drop policy if exists "lessons_enrolled_select" on public.lessons;
create policy "lessons_enrolled_select"
  on public.lessons for select
  using (
    is_published = true
    and exists (
      select 1 from public.enrollments e
      where e.user_id = auth.uid()
        and e.course_id = lessons.course_id
    )
  );

-- lesson_progress: users manage their own progress; admin via service-role.
drop policy if exists "progress_own_or_admin" on public.lesson_progress;
drop policy if exists "progress_own"          on public.lesson_progress;
create policy "progress_own"
  on public.lesson_progress for all
  using       (auth.uid() = user_id)
  with check  (auth.uid() = user_id);
──────────────────────────────────────────────────────────────────────
`);
