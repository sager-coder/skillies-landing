-- ===========================================================
-- Skillies.AI · Supabase schema · v1
-- Paste this into the Supabase SQL editor and hit Run.
-- Idempotent — safe to re-run after edits.
-- ===========================================================

-- ---------------------------------------------------------------
-- 1. profiles · extends auth.users with our app-side fields
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  phone              text unique,
  full_name          text,
  email              text,
  is_admin           boolean not null default false,
  bound_device_id    text,                -- one-device-per-account lock; null = unbound
  device_bound_at    timestamptz,         -- when the lock was set (for audit)
  created_at         timestamptz not null default now()
);

-- Safety for databases that already have this table without the new columns.
alter table public.profiles add column if not exists bound_device_id text;
alter table public.profiles add column if not exists device_bound_at timestamptz;

alter table public.profiles enable row level security;

-- NOTE: the previous "profiles_select_own_or_admin" policy ORed in an
-- EXISTS on profiles itself, which Postgres treated as recursive and
-- rejected with 42P17. All admin reads of profiles happen via the
-- service-role client in our route handlers, which bypasses RLS — so
-- the admin clause is dead weight here and was removed.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_select_own"          on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger: auto-create a profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, phone, email)
  values (
    new.id,
    new.phone,
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ---------------------------------------------------------------
-- 2. courses · catalog of programs
-- ---------------------------------------------------------------
create table if not exists public.courses (
  id            text primary key,           -- e.g. 'kdp-mastery'
  title         text not null,
  description   text,
  total_lessons int default 50,
  status        text not null default 'live'
                   check (status in ('live','drafting','recording','planned')),
  created_at    timestamptz not null default now()
);

alter table public.courses enable row level security;

-- Anyone can read courses (the catalog is public marketing info)
drop policy if exists "courses_public_select" on public.courses;
create policy "courses_public_select"
  on public.courses for select
  using (true);

-- Admin writes happen via the service-role client in our API routes
-- (which bypasses RLS), so we deliberately do NOT define an admin
-- write policy here. Previous versions did and triggered an infinite
-- recursion through the profiles policy (42P17). Drop any stale one.
drop policy if exists "courses_admin_write" on public.courses;

-- Seed: the flagship course
insert into public.courses (id, title, description, total_lessons, status)
values (
  'kdp-mastery',
  'KDP Mastery · 50-Day Program',
  'The 50-day intensive that ships your first book to Amazon and stacks 60 by the end.',
  50,
  'live'
)
on conflict (id) do nothing;


-- ---------------------------------------------------------------
-- 3. enrollments · who has access to which course
--    (defined before lessons because the lessons RLS policy
--    references enrollments)
-- ---------------------------------------------------------------
create table if not exists public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  course_id    text not null references public.courses(id) on delete cascade,
  tier         text not null check (tier in ('founding','standard','pro')),
  enrolled_at  timestamptz not null default now(),
  enrolled_by  uuid,                            -- admin id (null = self / Razorpay webhook)
  notes        text,
  unique (user_id, course_id)
);

alter table public.enrollments enable row level security;

-- Students see only their own enrollments. Admin reads go through
-- service-role so the admin clause was removed (triggered 42P17).
drop policy if exists "enrollments_select_own_or_admin" on public.enrollments;
drop policy if exists "enrollments_select_own"          on public.enrollments;
create policy "enrollments_select_own"
  on public.enrollments for select
  using (auth.uid() = user_id);

-- Admin grants/revokes happen via service-role in the API routes —
-- no RLS policy needed (and the previous one caused recursion).
drop policy if exists "enrollments_admin_write" on public.enrollments;


-- ---------------------------------------------------------------
-- 4. lessons · individual day-by-day units
-- ---------------------------------------------------------------
create table if not exists public.lessons (
  id               uuid primary key default gen_random_uuid(),
  course_id        text not null references public.courses(id) on delete cascade,
  day              int not null,
  title            text not null,
  description      text,
  video_id         text,                    -- Cloudflare Stream / VdoCipher uid
  duration_seconds int,
  is_published     boolean not null default false,
  created_at       timestamptz not null default now(),
  unique (course_id, day)
);

alter table public.lessons enable row level security;

-- Students see lessons only if they're enrolled in the course. Admin
-- previews go through service-role in the /learn page server code, so
-- the admin OR-branch (which triggered 42P17) has been removed.
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

-- Admin writes go through service-role. Drop any stale recursive policy.
drop policy if exists "lessons_admin_write" on public.lessons;


-- ---------------------------------------------------------------
-- 5. lesson_progress · per-student watch tracking
-- ---------------------------------------------------------------
create table if not exists public.lesson_progress (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  lesson_id         uuid not null references public.lessons(id) on delete cascade,
  watched_seconds   int not null default 0,
  completed         boolean not null default false,
  last_watched_at   timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

-- Students manage their own progress. Admin reads happen via service-role
-- so the admin clause (which caused 42P17 recursion) is removed.
drop policy if exists "progress_own_or_admin" on public.lesson_progress;
drop policy if exists "progress_own"          on public.lesson_progress;
create policy "progress_own"
  on public.lesson_progress for all
  using       (auth.uid() = user_id)
  with check  (auth.uid() = user_id);


-- ---------------------------------------------------------------
-- Convenience view: student dashboard summary
-- ---------------------------------------------------------------
create or replace view public.my_courses as
select
  c.id,
  c.title,
  c.description,
  c.total_lessons,
  c.status,
  e.tier,
  e.enrolled_at,
  (
    select count(*)
    from public.lesson_progress lp
    join public.lessons l on l.id = lp.lesson_id
    where lp.user_id = e.user_id
      and lp.completed = true
      and l.course_id = c.id
  ) as completed_count
from public.enrollments e
join public.courses c on c.id = e.course_id
where e.user_id = auth.uid();


-- ===========================================================
-- Skillies School v2 · Catalog metadata
--   Added 2026-05 to support the public courses page + admin
--   course CRUD. Idempotent; safe to re-run.
-- ===========================================================

alter table public.courses add column if not exists thumbnail_url      text;
alter table public.courses add column if not exists mentor_name        text;
alter table public.courses add column if not exists duration_label     text;     -- e.g. "50 days", "8 weeks"
alter table public.courses add column if not exists short_description  text;     -- one-liner for cards
alter table public.courses add column if not exists is_published       boolean not null default true;
alter table public.courses add column if not exists sort_order         int     not null default 0;

-- Backfill mentor + duration on the seeded flagship row, only if blank.
update public.courses
   set mentor_name    = coalesce(mentor_name,    'Ehsan Sager'),
       duration_label = coalesce(duration_label, '50 days'),
       short_description = coalesce(
         short_description,
         'Ship your first book to Amazon in 50 days. Stack 60 by the end.'
       )
 where id = 'kdp-mastery';


-- ===========================================================
-- Skillies School v3 · Profile completion fields
--   Added 2026-05 to support the "complete your details" step
--   after phone-OTP signup. Idempotent; safe to re-run.
-- ===========================================================

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name  text;


-- ===========================================================
-- Skillies School v4 · Admin moderation
--   `blocked` lets admins suspend a student account without
--   deleting it. Enforcement is in application code (e.g.
--   middleware or login gate) — column alone doesn't lock anyone.
-- ===========================================================

alter table public.profiles
  add column if not exists blocked boolean not null default false;


-- ===========================================================
-- Skillies School v5 · Video protection
--   Added 2026-05 alongside the Cloudflare Stream hardening
--   pass: signed-URL tokens, audit log, one-active-session-per-
--   user enforcement.  Idempotent; safe to re-run.
--
--   Two tables:
--     1. video_access_log  → every stream-token mint, for forensics
--        when a leaked recording surfaces.
--     2. video_sessions    → one row per (user, browser tab). The
--        /api/learn/session-heartbeat route uses it to kick older
--        tabs when the same user opens a new one.
-- ===========================================================

create table if not exists public.video_access_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  lesson_id   uuid not null references public.lessons(id)  on delete cascade,
  course_id   text          references public.courses(id)  on delete set null,
  session_id  uuid,
  ip          text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists video_access_log_user_idx
  on public.video_access_log(user_id, created_at desc);
create index if not exists video_access_log_lesson_idx
  on public.video_access_log(lesson_id, created_at desc);

alter table public.video_access_log enable row level security;
-- Writes happen via service-role from the route handler. No RLS
-- policies needed (and exposing the log to students by accident
-- would defeat the point).

create table if not exists public.video_sessions (
  -- session_id is generated client-side (crypto.randomUUID()) and is
  -- the natural unique key. Don't use a serial — multiple Vercel
  -- function instances can race on inserts otherwise.
  session_id    uuid primary key,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  lesson_id     uuid          references public.lessons(id)  on delete set null,
  started_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),
  ended_at      timestamptz,
  ended_reason  text         check (ended_reason in ('kicked-newer','tab-closed','expired') or ended_reason is null)
);

create index if not exists video_sessions_user_live_idx
  on public.video_sessions(user_id, ended_at, last_seen_at desc);

alter table public.video_sessions enable row level security;
-- Same rationale — only service-role touches this table.


-- ===========================================================
-- Done. Visit Settings → API to grab the URL + keys.
-- ===========================================================
