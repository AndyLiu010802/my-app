import { createClient } from "@supabase/supabase-js";

// Anon client — for DB queries with public RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// Service-role client — only used server-side for Storage list operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

export type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  image: { url: string }[];
};

export async function getHeroVideoUrl(): Promise<string | null> {
  const { data } = await supabase
    .from("site_media")
    .select("media_url")
    .eq("slot", "hero_video")
    .order("sort_order")
    .limit(1)
    .maybeSingle();
  return data?.media_url ?? null;
}

export async function getLocationImages(): Promise<string[]> {
  // Try DB first (works once migration 002 is applied + seeded)
  const { data: dbRows } = await supabase
    .from("site_media")
    .select("media_url")
    .eq("slot", "location_image")
    .order("sort_order");

  if (dbRows && dbRows.length > 0) {
    return dbRows.map((r) => r.media_url);
  }

  // Fallback: list files directly from the site-media Storage bucket.
  // Preferred order: exterior → interior variety for the strip animation.
  const PREFERRED_ORDER = [
    "Pin-Drops-1.jpg",
    "Bellerive Dev 1.jpg",
    "Pin-Drops-2.jpg",
    "39 Cambridge.png",
    "Bellerive Dev 2.jpg",
    "39 - 2 Cambridge.png",
    "Pin-Drops-3.jpg",
  ];

  const { data: files } = await supabaseAdmin.storage
    .from("site-media")
    .list("", { limit: 50 });

  if (!files || files.length === 0) return [];

  const fileSet = new Set(files.map((f) => f.name));
  const ordered = PREFERRED_ORDER.filter((n) => fileSet.has(n));
  // Append any files not in the preferred list
  files.forEach((f) => { if (!PREFERRED_ORDER.includes(f.name)) ordered.push(f.name); });

  return ordered.map((name) => `${STORAGE_BASE}/site-media/${encodeURIComponent(name)}`);
}

export async function getBuyHeroImageUrl(): Promise<string | null> {
  const { data: files } = await supabaseAdmin.storage
    .from("site-media")
    .list("", { limit: 20 });

  if (!files || files.length === 0) return null;

  // Prefer a wide exterior shot for the hero
  const PREFERRED = ["Pin-Drops-1.jpg", "Bellerive Dev 1.jpg", "Pin-Drops-2.jpg"];
  const fileNames = files.map((f) => f.name);
  const pick = PREFERRED.find((n) => fileNames.includes(n)) ??
    files.find((f) => /\.(jpe?g|png|webp|avif)$/i.test(f.name))?.name;

  if (!pick) return null;
  return `${STORAGE_BASE}/site-media/${encodeURIComponent(pick)}`;
}

export async function getAllProperties(): Promise<Property[]> {
  const { data } = await supabase
    .from("properties")
    .select("id, title, suburb, price, property_images(image_url, sort_order)")
    .eq("status", "For Sale")
    .order("sort_order");

  return (data ?? []).map((row) => {
    const imgs = ((row.property_images as { image_url: string; sort_order: number }[]) ?? [])
      .sort((a, b) => a.sort_order - b.sort_order);
    return {
      id: row.id,
      name: row.title,
      location: row.suburb,
      price: row.price,
      image: imgs.map((img) => ({ url: img.image_url })),
    };
  });
}
