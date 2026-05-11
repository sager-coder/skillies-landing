#!/usr/bin/env node
/**
 * Printable migration helper — Supabase JS can't run raw DDL. Just
 * outputs the one statement so an operator can paste it in the SQL
 * editor. Idempotent.
 */
console.log(`
Paste this in Supabase Dashboard → SQL Editor and click Run:

────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists blocked boolean not null default false;
────────────────────────────────────────────────────────────────────
`);
