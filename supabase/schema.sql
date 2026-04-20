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

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

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

-- Only admins can write
drop policy if exists "courses_admin_write" on public.courses;
create policy "courses_admin_write"
  on public.courses for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

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

-- Students see only their own enrollments
drop policy if exists "enrollments_select_own_or_admin" on public.enrollments;
create policy "enrollments_select_own_or_admin"
  on public.enrollments for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Only admins can grant / revoke (until Razorpay webhook is wired)
drop policy if exists "enrollments_admin_write" on public.enrollments;
create policy "enrollments_admin_write"
  on public.enrollments for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));


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

-- Students see lessons only if they're enrolled in the course
drop policy if exists "lessons_enrolled_select" on public.lessons;
create policy "lessons_enrolled_select"
  on public.lessons for select
  using (
    is_published = true
    and (
      exists (
        select 1 from public.enrollments e
        where e.user_id = auth.uid()
          and e.course_id = lessons.course_id
      )
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
    )
  );

drop policy if exists "lessons_admin_write" on public.lessons;
create policy "lessons_admin_write"
  on public.lessons for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));


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

drop policy if exists "progress_own_or_admin" on public.lesson_progress;
create policy "progress_own_or_admin"
  on public.lesson_progress for all
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  )
  with check (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );


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


-- ---------------------------------------------------------------
-- Done. Visit Settings → API to grab the URL + keys.
-- ---------------------------------------------------------------
