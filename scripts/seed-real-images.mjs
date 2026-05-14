// pnpm node --env-file=.env.local scripts/seed-real-images.mjs
// 需要先在 Supabase SQL Editor 运行 002_media_and_content.sql（添加 is_hero / alt_text 列）
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE = "https://lgtbhinsdmblkrfuttnz.supabase.co/storage/v1/object/public/property-images";

// 7 张真实图片（文件名含空格的需 URL encode）
const IMAGES = [
  { file: "Pin-Drops-1.jpg",            label: "Exterior View"     },
  { file: "Bellerive%20Dev%201.jpg",    label: "Property Facade"   },
  { file: "39%20Cambridge.png",         label: "Street Frontage"   },
  { file: "Pin-Drops-2.jpg",            label: "Living & Dining"   },
  { file: "Bellerive%20Dev%202.jpg",    label: "Garden & Outdoor"  },
  { file: "39%20-%202%20Cambridge.png", label: "Interior Living"   },
  { file: "Pin-Drops-3.jpg",            label: "Interior Space"    },
];

// 9 个房产 ID（按 seed.sql 顺序）
const PROPERTY_IDS = [
  "b0000001-0000-0000-0000-000000000001", // Langham Penthouse
  "b0000001-0000-0000-0000-000000000002", // St Kilda Villa
  "b0000001-0000-0000-0000-000000000003", // Armadale Garden
  "b0000001-0000-0000-0000-000000000004", // Port Melbourne
  "b0000001-0000-0000-0000-000000000005", // Toorak Manor
  "b0000001-0000-0000-0000-000000000006", // South Yarra Sky
  "b0000001-0000-0000-0000-000000000007", // Brighton Coastal
  "b0000001-0000-0000-0000-000000000008", // Prahran Terrace
  "b0000001-0000-0000-0000-000000000009", // Malvern Grand
];

// 每个房产获得全部 7 张图片，但 hero 图从不同偏移开始
// → 前 7 个房产的卡片封面各不相同；P8/P9 循环回来（可接受的测试数据）
const rows = [];
for (let pi = 0; pi < PROPERTY_IDS.length; pi++) {
  const heroOffset = pi % IMAGES.length;
  for (let ii = 0; ii < IMAGES.length; ii++) {
    const imgIdx = (heroOffset + ii) % IMAGES.length;
    const img = IMAGES[imgIdx];
    rows.push({
      property_id: PROPERTY_IDS[pi],
      image_url:   `${BASE}/${img.file}`,
      label:       img.label,
      sort_order:  ii,      // sort_order 0 = hero image (no is_hero column needed yet)
    });
  }
}

// 删除旧记录
const { error: delErr } = await supabase
  .from("property_images")
  .delete()
  .not("id", "is", null);
if (delErr) throw new Error(`delete: ${delErr.message}`);

// 批量插入（63 条）
const { error: insErr } = await supabase.from("property_images").insert(rows);
if (insErr) throw new Error(`insert: ${insErr.message}`);

console.log(`✓ ${rows.length} property_image 记录已写入（${PROPERTY_IDS.length} 个房产 × ${IMAGES.length} 张图片）`);
console.log("\n房产卡片封面分配：");
for (let pi = 0; pi < PROPERTY_IDS.length; pi++) {
  const heroOffset = pi % IMAGES.length;
  console.log(`  P${pi + 1}: ${IMAGES[heroOffset].label} (${IMAGES[heroOffset].file})`);
}
