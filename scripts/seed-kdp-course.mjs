#!/usr/bin/env node
/**
 * One-shot: ensure the KDP course is named "Amazon KDP Full Course" and
 * has all 7 lessons wired to their Cloudflare Stream UIDs. Idempotent —
 * re-runs just UPSERT the same rows.
 *
 * Run: node scripts/seed-kdp-course.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SR) {
  console.error("Missing Supabase URL or service-role key");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(URL, SR, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const COURSE_ID = "kdp-mastery";

const COURSE_PATCH = {
  title: "Amazon KDP Full Course",
  short_description:
    "The complete 7-part walkthrough — from niche research to publishing your first KDP book.",
  description:
    "An end-to-end Amazon KDP curriculum that takes you from zero understanding to a published book on Amazon. Seven lessons covering the KDP landscape, niche research, account creation, book structure, design, pricing, and launch.",
  mentor_name: "Ehsan Sager",
  duration_label: "7 parts",
  total_lessons: 7,
  status: "live",
  is_published: true,
  sort_order: 0,
};

const LESSONS = [
  { day: 1, title: "Part 1 · Introduction",       video_id: "f229691dff0c14b5eb181713b2d26196" },
  { day: 2, title: "Part 2 · Niche & Keyword Research", video_id: "e5c5029c043af5a80b508ca6f578334a" },
  { day: 3, title: "Part 3 · Account Creation",   video_id: "4c2a46b0324784b5b5949c24350ab2c6" },
  { day: 4, title: "Part 4 · Book Structure",     video_id: "8d232d82d6c64c27976ec5c82b5afb72" },
  { day: 5, title: "Part 5 · Cover & Title Design", video_id: "86b449a0a3a16d176f69e56e8a124aed" },
  { day: 6, title: "Part 6 · Pricing & Royalties", video_id: "56ff1bf3e0c55d0858d24ea3f75ddcdf" },
  { day: 7, title: "Part 7 · Launch & Scaling",   video_id: "e98df9eebf2611b955ede439522693eb" },
];

// 1. Update (or insert) the course row
console.log(`→ Course: ${COURSE_ID}`);
const { error: upsertCourseErr } = await supabase
  .from("courses")
  .upsert({ id: COURSE_ID, ...COURSE_PATCH }, { onConflict: "id" });
if (upsertCourseErr) {
  console.error(`   ✗ ${upsertCourseErr.message}`);
  process.exit(1);
}
console.log(`   ✓ title="${COURSE_PATCH.title}" · total_lessons=7 · published`);

// 2. Upsert each lesson on (course_id, day) — re-runs are no-ops
for (const l of LESSONS) {
  const { error } = await supabase
    .from("lessons")
    .upsert(
      {
        course_id: COURSE_ID,
        day: l.day,
        title: l.title,
        video_id: l.video_id,
        is_published: true,
      },
      { onConflict: "course_id,day" },
    );
  if (error) {
    console.error(`   ✗ day ${l.day}: ${error.message}`);
    continue;
  }
  console.log(`   ✓ day ${l.day} · ${l.title} · uid=${l.video_id}`);
}

console.log("\nDone. Sign in as an enrolled student and visit /learn/kdp-mastery.");
