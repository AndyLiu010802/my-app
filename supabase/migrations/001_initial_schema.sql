-- ─────────────────────────────────────────────────────────────────────────────
-- South Property — Initial Schema
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type property_type as enum ('House', 'Apartment', 'Townhouse', 'Land');

create type property_status as enum (
  'For Sale', 'Under Offer', 'Sold', 'For Lease', 'Leased'
);

create type amenity_category as enum (
  'restaurants', 'parks', 'transport', 'quietness',
  'cafes', 'shopping', 'schools', 'medical', 'entertainment'
);

create type enquiry_status as enum ('new', 'read', 'replied', 'archived');

-- ─── agents ──────────────────────────────────────────────────────────────────

create table agents (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  title       text not null,
  phone       text,
  email       text,
  initials    text not null,           -- displayed when no avatar
  avatar_url  text,                    -- Supabase Storage URL
  bio         text,
  created_at  timestamptz default now()
);

-- ─── properties ──────────────────────────────────────────────────────────────

create table properties (
  id            uuid primary key default gen_random_uuid(),
  agent_id      uuid references agents(id) on delete set null,

  title         text not null,
  address       text not null,
  suburb        text not null,
  state         text not null default 'VIC',
  price         text not null,         -- display string e.g. "$4,200,000"
  price_value   numeric,               -- numeric for sorting / range filters
  beds          int,
  baths         int,
  parking       int,
  sqm           int,
  type          property_type,
  status        property_status not null default 'For Sale',
  tag           text,                  -- e.g. "Penthouse", "Prestige"

  description   text,
  features      text[],               -- ["Pool", "Wine cellar", ...]

  lat           numeric,
  lng           numeric,

  is_signature  boolean default false, -- show in Signature / Featured section
  sort_order    int default 0,

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_updated_at
  before update on properties
  for each row execute function set_updated_at();

-- ─── property_images ─────────────────────────────────────────────────────────

create table property_images (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,

  label         text,                  -- "Grand Living Room"
  image_url     text not null,         -- Supabase Storage URL
  sort_order    int default 0,

  created_at    timestamptz default now()
);

-- ─── floor_plans ─────────────────────────────────────────────────────────────

create table floor_plans (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,

  label         text not null,         -- "Ground Floor", "First Floor"
  total_area    text,                  -- "142 m²"
  image_url     text,                  -- optional: actual image instead of SVG
  sort_order    int default 0
);

-- ─── floor_plan_rooms ────────────────────────────────────────────────────────

create table floor_plan_rooms (
  id              uuid primary key default gen_random_uuid(),
  floor_plan_id   uuid not null references floor_plans(id) on delete cascade,

  name            text not null,       -- "Living", "Master", "WC"
  x               int not null,
  y               int not null,
  w               int not null,
  h               int not null,
  sort_order      int default 0
);

-- ─── property_amenities ──────────────────────────────────────────────────────

create table property_amenities (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid not null references properties(id) on delete cascade,

  category      amenity_category not null,
  rating        numeric check (rating >= 0 and rating <= 5),
  description   text,

  unique (property_id, category)       -- one row per category per property
);

-- ─── enquiries ───────────────────────────────────────────────────────────────

create table enquiries (
  id            uuid primary key default gen_random_uuid(),
  property_id   uuid references properties(id) on delete set null,
  agent_id      uuid references agents(id) on delete set null,

  name          text not null,
  email         text not null,
  phone         text,
  message       text,
  status        enquiry_status default 'new',

  created_at    timestamptz default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index on properties(status);
create index on properties(suburb);
create index on properties(type);
create index on properties(agent_id);
create index on properties(is_signature);
create index on property_images(property_id);
create index on floor_plans(property_id);
create index on floor_plan_rooms(floor_plan_id);
create index on property_amenities(property_id);
create index on enquiries(property_id);
create index on enquiries(status);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table agents            enable row level security;
alter table properties        enable row level security;
alter table property_images   enable row level security;
alter table floor_plans       enable row level security;
alter table floor_plan_rooms  enable row level security;
alter table property_amenities enable row level security;
alter table enquiries         enable row level security;

-- Public can read everything except enquiries
create policy "public read agents"             on agents            for select using (true);
create policy "public read properties"         on properties        for select using (true);
create policy "public read property_images"    on property_images   for select using (true);
create policy "public read floor_plans"        on floor_plans       for select using (true);
create policy "public read floor_plan_rooms"   on floor_plan_rooms  for select using (true);
create policy "public read property_amenities" on property_amenities for select using (true);

-- Anyone can submit an enquiry, nobody can read them from the client
create policy "public insert enquiries" on enquiries for insert with check (true);
