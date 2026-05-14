-- ─────────────────────────────────────────────────────────────────────────────
-- South Property — Media & Content Schema
-- Run AFTER 001_initial_schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Enhance property_images ─────────────────────────────────────────────────

alter table property_images
  add column if not exists alt_text text,
  add column if not exists is_hero  boolean default false;

-- ─── site_media ──────────────────────────────────────────────────────────────
-- Global media assets, keyed by "slot":
--   'hero_video'     – homepage hero background video (first row by sort_order)
--   'location_image' – homepage Location section images (ordered by sort_order)
--   'about_image'    – homepage About section background

create table if not exists site_media (
  id          uuid primary key default gen_random_uuid(),
  slot        text not null,
  media_url   text not null,
  alt_text    text,
  sort_order  int  default 0,
  created_at  timestamptz default now()
);

create index if not exists idx_site_media_slot on site_media (slot, sort_order);

-- ─── site_settings ───────────────────────────────────────────────────────────
-- Simple key/value store for site-wide configuration.
-- Example keys: company_name, company_phone, company_email, instagram_url

create table if not exists site_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table site_media    enable row level security;
alter table site_settings enable row level security;

create policy "public read site_media"    on site_media    for select using (true);
create policy "public read site_settings" on site_settings for select using (true);
