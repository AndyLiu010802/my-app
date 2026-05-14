// pnpm node --env-file=.env.local scripts/seed-media.mjs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── Property image definitions ───────────────────────────────────────────────
// Each property gets 6 images via picsum.photos stable seeds.
// Replace image_url values with real Supabase Storage URLs once uploaded.

const PROPERTY_IMAGES = [
  {
    id: "b0000001-0000-0000-0000-000000000001",
    images: [
      { seed: "langham-hero",     label: "Penthouse Suite",                is_hero: true,  sort_order: 0 },
      { seed: "langham-living",   label: "Grand Living Room",              is_hero: false, sort_order: 1 },
      { seed: "langham-kitchen",  label: "Calacatta Marble Kitchen",       is_hero: false, sort_order: 2 },
      { seed: "langham-bath",     label: "Spa Bathroom",                   is_hero: false, sort_order: 3 },
      { seed: "langham-terrace",  label: "Private Rooftop Terrace",        is_hero: false, sort_order: 4 },
      { seed: "langham-night",    label: "City Views at Dusk",             is_hero: false, sort_order: 5 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000002",
    images: [
      { seed: "stkilda-hero",     label: "Beachfront Facade",              is_hero: true,  sort_order: 0 },
      { seed: "stkilda-living",   label: "Coastal Living Room",            is_hero: false, sort_order: 1 },
      { seed: "stkilda-pool",     label: "Heated Pool & Pavilion",         is_hero: false, sort_order: 2 },
      { seed: "stkilda-kitchen",  label: "Chef's Kitchen",                 is_hero: false, sort_order: 3 },
      { seed: "stkilda-master",   label: "Master Bedroom",                 is_hero: false, sort_order: 4 },
      { seed: "stkilda-terrace",  label: "Entertainer's Terrace",          is_hero: false, sort_order: 5 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000003",
    images: [
      { seed: "armadale-hero",    label: "Edwardian Facade",               is_hero: true,  sort_order: 0 },
      { seed: "armadale-dining",  label: "Formal Dining Room",             is_hero: false, sort_order: 1 },
      { seed: "armadale-pool",    label: "15m Heated Lap Pool",            is_hero: false, sort_order: 2 },
      { seed: "armadale-kitchen", label: "Bulthaup Kitchen",               is_hero: false, sort_order: 3 },
      { seed: "armadale-garden",  label: "North-Facing Garden",            is_hero: false, sort_order: 4 },
      { seed: "armadale-study",   label: "Private Study",                  is_hero: false, sort_order: 5 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000004",
    images: [
      { seed: "portmelb-hero",    label: "Waterfront Apartment",           is_hero: true,  sort_order: 0 },
      { seed: "portmelb-views",   label: "Port Phillip Bay Views",         is_hero: false, sort_order: 1 },
      { seed: "portmelb-living",  label: "Open-Plan Living & Dining",      is_hero: false, sort_order: 2 },
      { seed: "portmelb-kitchen", label: "Miele Kitchen",                  is_hero: false, sort_order: 3 },
      { seed: "portmelb-bedroom", label: "Bay-View Bedroom",               is_hero: false, sort_order: 4 },
      { seed: "portmelb-rooftop", label: "Residents' Rooftop Lounge",      is_hero: false, sort_order: 5 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000005",
    images: [
      { seed: "toorak-hero",      label: "Manor Facade",                   is_hero: true,  sort_order: 0 },
      { seed: "toorak-gardens",   label: "Formal Gardens",                 is_hero: false, sort_order: 1 },
      { seed: "toorak-tennis",    label: "Championship Tennis Court",      is_hero: false, sort_order: 2 },
      { seed: "toorak-living",    label: "Grand Formal Living",            is_hero: false, sort_order: 3 },
      { seed: "toorak-cellar",    label: "Temperature-Controlled Wine Cellar", is_hero: false, sort_order: 4 },
      { seed: "toorak-cinema",    label: "Private Cinema",                 is_hero: false, sort_order: 5 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000006",
    images: [
      { seed: "southyarra-hero",    label: "Sky Residence Entry",          is_hero: true,  sort_order: 0 },
      { seed: "southyarra-views",   label: "42nd-Floor Panorama",          is_hero: false, sort_order: 1 },
      { seed: "southyarra-living",  label: "Wraparound Living Room",       is_hero: false, sort_order: 2 },
      { seed: "southyarra-kitchen", label: "Boffi Kitchen",                is_hero: false, sort_order: 3 },
      { seed: "southyarra-terrace", label: "North-Facing Terrace",         is_hero: false, sort_order: 4 },
      { seed: "southyarra-night",   label: "CBD Panorama at Night",        is_hero: false, sort_order: 5 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000007",
    images: [
      { seed: "brighton-hero",    label: "Coastal Residence",              is_hero: true,  sort_order: 0 },
      { seed: "brighton-pool",    label: "Resort Pool & Spa",              is_hero: false, sort_order: 1 },
      { seed: "brighton-beach",   label: "Beach Proximity",                is_hero: false, sort_order: 2 },
      { seed: "brighton-kitchen", label: "Gaggenau Kitchen",               is_hero: false, sort_order: 3 },
      { seed: "brighton-theatre", label: "Home Theatre",                   is_hero: false, sort_order: 4 },
      { seed: "brighton-terrace", label: "Entertainer's Terrace",          is_hero: false, sort_order: 5 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000008",
    images: [
      { seed: "prahran-hero",     label: "Terrace Facade",                 is_hero: true,  sort_order: 0 },
      { seed: "prahran-brick",    label: "Exposed Brick Interior",         is_hero: false, sort_order: 1 },
      { seed: "prahran-court",    label: "Landscaped Courtyard",           is_hero: false, sort_order: 2 },
      { seed: "prahran-roof",     label: "Rooftop Deck",                   is_hero: false, sort_order: 3 },
      { seed: "prahran-bedroom",  label: "Master Bedroom",                 is_hero: false, sort_order: 4 },
      { seed: "prahran-street",   label: "Greville Street Outlook",        is_hero: false, sort_order: 5 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000009",
    images: [
      { seed: "malvern-hero",     label: "Grand Estate Facade",            is_hero: true,  sort_order: 0 },
      { seed: "malvern-hall",     label: "Victorian Heritage Hall",        is_hero: false, sort_order: 1 },
      { seed: "malvern-garden",   label: "Kitchen Garden & Orchard",       is_hero: false, sort_order: 2 },
      { seed: "malvern-pool",     label: "Heated Saltwater Pool",          is_hero: false, sort_order: 3 },
      { seed: "malvern-kitchen",  label: "Modulnova Kitchen",              is_hero: false, sort_order: 4 },
      { seed: "malvern-library",  label: "Formal Library",                 is_hero: false, sort_order: 5 },
    ],
  },
];

// ─── Floor plan definitions ───────────────────────────────────────────────────
// Grid is 12 cols × 8 rows. x, y, w, h are grid units.
// Apartment properties: 1, 4, 6  |  Townhouse: 8  |  Houses: 2, 3, 5, 7, 9

const HOUSE_GROUND = [
  { name: "Entry Hall",   x: 0, y: 0, w: 2, h: 2, sort_order: 0 },
  { name: "Living Room",  x: 0, y: 2, w: 6, h: 4, sort_order: 1 },
  { name: "Dining Room",  x: 6, y: 0, w: 4, h: 3, sort_order: 2 },
  { name: "Kitchen",      x: 6, y: 3, w: 4, h: 3, sort_order: 3 },
  { name: "Powder Room",  x: 0, y: 6, w: 2, h: 2, sort_order: 4 },
  { name: "Laundry",      x: 2, y: 6, w: 2, h: 2, sort_order: 5 },
  { name: "Garage",       x: 10, y: 0, w: 2, h: 6, sort_order: 6 },
];

const HOUSE_FIRST = [
  { name: "Master Bedroom",  x: 0, y: 0, w: 5, h: 4, sort_order: 0 },
  { name: "Walk-In Robe",    x: 5, y: 0, w: 3, h: 2, sort_order: 1 },
  { name: "Ensuite",         x: 5, y: 2, w: 3, h: 2, sort_order: 2 },
  { name: "Bedroom 2",       x: 8, y: 0, w: 4, h: 4, sort_order: 3 },
  { name: "Bedroom 3",       x: 0, y: 4, w: 4, h: 4, sort_order: 4 },
  { name: "Bedroom 4",       x: 4, y: 4, w: 4, h: 4, sort_order: 5 },
  { name: "Bathroom",        x: 8, y: 4, w: 4, h: 4, sort_order: 6 },
];

const APT_LIVING = [
  { name: "Entry",        x: 0, y: 0, w: 2, h: 2, sort_order: 0 },
  { name: "Living Room",  x: 0, y: 2, w: 6, h: 4, sort_order: 1 },
  { name: "Dining Room",  x: 6, y: 0, w: 6, h: 3, sort_order: 2 },
  { name: "Kitchen",      x: 6, y: 3, w: 6, h: 3, sort_order: 3 },
  { name: "WC",           x: 0, y: 6, w: 3, h: 2, sort_order: 4 },
  { name: "Terrace",      x: 3, y: 6, w: 9, h: 2, sort_order: 5 },
];

const APT_SLEEPING = [
  { name: "Master Bedroom",  x: 0, y: 0, w: 5, h: 4, sort_order: 0 },
  { name: "Master Ensuite",  x: 5, y: 0, w: 4, h: 2, sort_order: 1 },
  { name: "Walk-In Robe",    x: 5, y: 2, w: 4, h: 2, sort_order: 2 },
  { name: "Bedroom 2",       x: 0, y: 4, w: 5, h: 4, sort_order: 3 },
  { name: "Bedroom 3",       x: 5, y: 4, w: 5, h: 4, sort_order: 4 },
  { name: "Bathroom",        x: 10, y: 0, w: 2, h: 8, sort_order: 5 },
];

// Apartment property IDs
const APT_IDS = new Set([
  "b0000001-0000-0000-0000-000000000001", // Langham Penthouse
  "b0000001-0000-0000-0000-000000000004", // Port Melbourne
  "b0000001-0000-0000-0000-000000000006", // South Yarra Sky
]);

const FLOOR_PLANS = [
  {
    id: "b0000001-0000-0000-0000-000000000001",
    floors: [
      { label: "Living Level", total_area: "142 m²", rooms: APT_LIVING,    sort_order: 0 },
      { label: "Sleeping Level", total_area: "143 m²", rooms: APT_SLEEPING, sort_order: 1 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000002",
    floors: [
      { label: "Ground Floor", total_area: "210 m²", rooms: HOUSE_GROUND, sort_order: 0 },
      { label: "First Floor",  total_area: "210 m²", rooms: HOUSE_FIRST,  sort_order: 1 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000003",
    floors: [
      { label: "Ground Floor", total_area: "190 m²", rooms: HOUSE_GROUND, sort_order: 0 },
      { label: "First Floor",  total_area: "190 m²", rooms: HOUSE_FIRST,  sort_order: 1 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000004",
    floors: [
      { label: "Living Level",   total_area: "98 m²", rooms: APT_LIVING,    sort_order: 0 },
      { label: "Sleeping Level", total_area: "97 m²", rooms: APT_SLEEPING,  sort_order: 1 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000005",
    floors: [
      { label: "Ground Floor", total_area: "340 m²", rooms: HOUSE_GROUND, sort_order: 0 },
      { label: "First Floor",  total_area: "340 m²", rooms: HOUSE_FIRST,  sort_order: 1 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000006",
    floors: [
      { label: "Living Level",   total_area: "105 m²", rooms: APT_LIVING,    sort_order: 0 },
      { label: "Sleeping Level", total_area: "105 m²", rooms: APT_SLEEPING,  sort_order: 1 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000007",
    floors: [
      { label: "Ground Floor", total_area: "280 m²", rooms: HOUSE_GROUND, sort_order: 0 },
      { label: "First Floor",  total_area: "280 m²", rooms: HOUSE_FIRST,  sort_order: 1 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000008",
    floors: [
      { label: "Level 1", total_area: "78 m²", rooms: APT_LIVING,    sort_order: 0 },
      { label: "Level 2", total_area: "77 m²", rooms: APT_SLEEPING,  sort_order: 1 },
    ],
  },
  {
    id: "b0000001-0000-0000-0000-000000000009",
    floors: [
      { label: "Ground Floor", total_area: "310 m²", rooms: HOUSE_GROUND, sort_order: 0 },
      { label: "First Floor",  total_area: "310 m²", rooms: HOUSE_FIRST,  sort_order: 1 },
    ],
  },
];

// ─── Site media ───────────────────────────────────────────────────────────────
// hero_video: replace with your Supabase Storage URL once uploaded
// location_image: 6 picsum images cycled across the Location section strips

const SITE_MEDIA = [
  {
    slot: "hero_video",
    // Placeholder — upload your video to Supabase Storage bucket "site-media"
    // and replace this URL with:  https://<project>.supabase.co/storage/v1/object/public/site-media/hero.mp4
    media_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    alt_text: null,
    sort_order: 0,
  },
  { slot: "location_image", media_url: "https://picsum.photos/seed/melb-skyline/1920/1080",   alt_text: "Melbourne skyline",          sort_order: 0 },
  { slot: "location_image", media_url: "https://picsum.photos/seed/melb-bayside/1920/1080",   alt_text: "Melbourne bayside",          sort_order: 1 },
  { slot: "location_image", media_url: "https://picsum.photos/seed/melb-parkland/1920/1080",  alt_text: "Melbourne parkland",         sort_order: 2 },
  { slot: "location_image", media_url: "https://picsum.photos/seed/melb-chapel/1920/1080",    alt_text: "Chapel Street, South Yarra", sort_order: 3 },
  { slot: "location_image", media_url: "https://picsum.photos/seed/melb-beach/1920/1080",     alt_text: "Brighton beach",             sort_order: 4 },
  { slot: "location_image", media_url: "https://picsum.photos/seed/melb-gardens/1920/1080",   alt_text: "Royal Botanic Gardens",      sort_order: 5 },
];

// ─── Site settings ────────────────────────────────────────────────────────────

const SITE_SETTINGS = [
  { key: "company_name",    value: "South Property" },
  { key: "company_phone",   value: "+61 3 9000 0000" },
  { key: "company_email",   value: "info@southproperty.com.au" },
  { key: "company_address", value: "Level 10, 200 Collins Street, Melbourne VIC 3000" },
  { key: "instagram_url",   value: "https://www.instagram.com/southproperty" },
  { key: "facebook_url",    value: "https://www.facebook.com/southproperty" },
  { key: "linkedin_url",    value: "https://www.linkedin.com/company/southproperty" },
  { key: "abn",             value: "12 345 678 900" },
  { key: "rea_agency_url",  value: "https://www.realestate.com.au" },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────

let imgCount = 0;
let planCount = 0;
let roomCount = 0;

// Property images — delete then insert for clean idempotent re-runs
for (const prop of PROPERTY_IMAGES) {
  const { error: delErr } = await supabase
    .from("property_images")
    .delete()
    .eq("property_id", prop.id);
  if (delErr) throw new Error(`delete property_images(${prop.id}): ${delErr.message}`);

  const rows = prop.images.map((img) => ({
    property_id: prop.id,
    image_url: `https://picsum.photos/seed/${img.seed}/1280/854`,
    alt_text: img.label,
    label: img.label,
    is_hero: img.is_hero,
    sort_order: img.sort_order,
  }));

  const { error: insErr } = await supabase.from("property_images").insert(rows);
  if (insErr) throw new Error(`insert property_images(${prop.id}): ${insErr.message}`);
  imgCount += rows.length;
}

// Floor plans — delete by property_id (cascade removes rooms)
for (const prop of FLOOR_PLANS) {
  const { error: delErr } = await supabase
    .from("floor_plans")
    .delete()
    .eq("property_id", prop.id);
  if (delErr) throw new Error(`delete floor_plans(${prop.id}): ${delErr.message}`);

  for (const floor of prop.floors) {
    const { data: plan, error: planErr } = await supabase
      .from("floor_plans")
      .insert({
        property_id: prop.id,
        label: floor.label,
        total_area: floor.total_area,
        sort_order: floor.sort_order,
      })
      .select("id")
      .single();
    if (planErr || !plan) throw new Error(`insert floor_plan(${prop.id}/${floor.label}): ${planErr?.message}`);

    planCount++;

    const rooms = floor.rooms.map((r) => ({ ...r, floor_plan_id: plan.id }));
    const { error: roomErr } = await supabase.from("floor_plan_rooms").insert(rooms);
    if (roomErr) throw new Error(`insert rooms(${plan.id}): ${roomErr.message}`);
    roomCount += rooms.length;
  }
}

// Site media — delete all then insert
{
  const { error: delErr } = await supabase.from("site_media").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw new Error(`delete site_media: ${delErr.message}`);

  const { error: insErr } = await supabase.from("site_media").insert(SITE_MEDIA);
  if (insErr) throw new Error(`insert site_media: ${insErr.message}`);
}

// Site settings — upsert (safe to re-run)
{
  const { error } = await supabase
    .from("site_settings")
    .upsert(SITE_SETTINGS, { onConflict: "key" });
  if (error) throw new Error(`upsert site_settings: ${error.message}`);
}

console.log(`✓ ${imgCount} property images`);
console.log(`✓ ${planCount} floor plans / ${roomCount} rooms`);
console.log(`✓ ${SITE_MEDIA.length} site media entries`);
console.log(`✓ ${SITE_SETTINGS.length} site settings`);
