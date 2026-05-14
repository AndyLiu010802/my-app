import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lgtbhinsdmblkrfuttnz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndGJoaW5zZG1ibGtyZnV0dG56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYzNjk3OCwiZXhwIjoyMDk0MjEyOTc4fQ.TfeC-KixLp4HyB9qacynqqodIRguXgIbtf0FVvN9qMw"
);

// ── Agents ────────────────────────────────────────────────────────────────────
const agents = [
  { id: "a0000001-0000-0000-0000-000000000001", name: "James Whitmore",  title: "Principal Agent", phone: "+61 3 9000 0001", email: "james@southproperty.com.au",  initials: "JW", bio: "Principal agent with over 15 years experience in Melbourne prestige property." },
  { id: "a0000001-0000-0000-0000-000000000002", name: "Sarah Kensington", title: "Senior Agent",    phone: "+61 3 9000 0002", email: "sarah@southproperty.com.au",  initials: "SK", bio: "Specialist in bayside and inner-suburban properties across Melbourne." },
  { id: "a0000001-0000-0000-0000-000000000003", name: "Marcus Elliot",   title: "Director",         phone: "+61 3 9000 0003", email: "marcus@southproperty.com.au", initials: "ME", bio: "Director and founding principal with expertise in ultra-prestige estates." },
];

// ── Properties ────────────────────────────────────────────────────────────────
const properties = [
  {
    id: "b0000001-0000-0000-0000-000000000001", agent_id: "a0000001-0000-0000-0000-000000000001",
    title: "The Langham Penthouse", address: "3801/1 Queensbridge Square", suburb: "Southbank",
    price: "$4,200,000", price_value: 4200000, beds: 4, baths: 3, parking: 2, sqm: 285,
    type: "Apartment", status: "For Sale", tag: "Penthouse",
    description: "Crowning the iconic Langham tower, this extraordinary penthouse commands uninterrupted 360° views across Melbourne's skyline, the Yarra River, and Port Phillip Bay. Finished to hotel-grade specification, the residence features double-height ceilings, Calacatta marble throughout, and a private rooftop terrace.",
    features: ["360° panoramic skyline views", "Private rooftop terrace with plunge pool", "Calacatta marble kitchen & bathrooms", "Dedicated concierge & valet parking", "Smart-home automation throughout", "Wine room & private lift access"],
    lat: -37.8232, lng: 144.9680, is_signature: true, sort_order: 1,
  },
  {
    id: "b0000001-0000-0000-0000-000000000002", agent_id: "a0000001-0000-0000-0000-000000000002",
    title: "St Kilda Beachfront Villa", address: "88 Fitzroy Street", suburb: "St Kilda",
    price: "$3,850,000", price_value: 3850000, beds: 5, baths: 4, parking: 3, sqm: 420,
    type: "House", status: "Sold", tag: null,
    description: "A breathtaking beachfront villa steps from St Kilda's iconic foreshore. This architect-designed residence blends coastal luxury with urban sophistication, featuring expansive north-facing terraces, a heated pool, and a ground-floor entertainment pavilion opening directly onto the promenade.",
    features: ["Direct beach access & ocean views", "Heated pool & outdoor pavilion", "Chef's kitchen with butler's pantry", "Guest suite with private entry", "5-car garage with EV charging", "Solar & battery energy system"],
    lat: -37.8604, lng: 144.9765, is_signature: false, sort_order: 2,
  },
  {
    id: "b0000001-0000-0000-0000-000000000003", agent_id: "a0000001-0000-0000-0000-000000000001",
    title: "Armadale Garden Residence", address: "24 Kooyong Road", suburb: "Armadale",
    price: "$2,950,000", price_value: 2950000, beds: 4, baths: 3, parking: 2, sqm: 380,
    type: "House", status: "Under Offer", tag: null,
    description: "A masterfully restored Edwardian home behind a wisteria-draped facade. Formal and informal living spaces flow to a lush north-facing garden with a 15m lap pool. The fully updated kitchen and bathrooms honour the home's heritage while providing every contemporary convenience.",
    features: ["15m heated lap pool & garden", "Restored Edwardian facade & cornicing", "Bulthaup kitchen with Gaggenau appliances", "Hydronic in-slab heating", "Double-brick construction", "Walking distance to Malvern Central"],
    lat: -37.8556, lng: 145.0229, is_signature: false, sort_order: 3,
  },
  {
    id: "b0000001-0000-0000-0000-000000000004", agent_id: "a0000001-0000-0000-0000-000000000002",
    title: "Port Melbourne Waterfront", address: "1/105 Beach Street", suburb: "Port Melbourne",
    price: "$4,500/mth", price_value: 1890000, beds: 3, baths: 2, parking: 2, sqm: 195,
    type: "Apartment", status: "For Lease", tag: null,
    description: "A refined waterfront apartment with direct bay views from every principal room. The open-plan living and dining space features floor-to-ceiling glazing, herringbone oak floors, and a Miele kitchen. Two secure car spaces and a storage cage are included.",
    features: ["Uninterrupted Port Phillip Bay views", "Floor-to-ceiling glazing throughout", "Miele appliances & stone benchtops", "Secure double basement parking", "Rooftop residents' lounge & BBQ", "300m to Bay Trail & restaurants"],
    lat: -37.8326, lng: 144.9268, is_signature: false, sort_order: 4,
  },
  {
    id: "b0000001-0000-0000-0000-000000000005", agent_id: "a0000001-0000-0000-0000-000000000003",
    title: "Toorak Manor Estate", address: "15 Albany Road", suburb: "Toorak",
    price: "$8,500,000", price_value: 8500000, beds: 6, baths: 5, parking: 4, sqm: 680,
    type: "House", status: "For Sale", tag: "Prestige",
    description: "An exceptional Toorak manor on one of the suburb's most coveted tree-lined boulevards. Set on 1,200m² with formal gardens, a championship-size tennis court, and a full-width entertainer's terrace, this grand residence defines Toorak's finest tradition of luxury living.",
    features: ["1,200m² allotment with formal gardens", "Championship tennis court", "Cinema room & wine cellar", "4-car garage with workshop", "6m coffered ceilings in formal rooms", "Walk to Toorak Village & Como Park"],
    lat: -37.8490, lng: 145.0141, is_signature: true, sort_order: 5,
  },
  {
    id: "b0000001-0000-0000-0000-000000000006", agent_id: "a0000001-0000-0000-0000-000000000003",
    title: "South Yarra Sky Residence", address: "4201/200 Spencer Street", suburb: "South Yarra",
    price: "$2,100,000", price_value: 2100000, beds: 3, baths: 2, parking: 1, sqm: 210,
    type: "Apartment", status: "For Sale", tag: null,
    description: "On the 42nd level of South Yarra's most architecturally acclaimed tower, this sky residence captures the full sweep of Melbourne's CBD and inner suburbs. Wraparound glazing, a seamless indoor-outdoor layout, and a private north-facing terrace create an extraordinary elevated sanctuary.",
    features: ["42nd-floor panoramic wraparound views", "Private north-facing terrace", "Boffi kitchen & Dornbracht fixtures", "Concealed home-office alcove", "24-hour concierge & gym", "Steps to Chapel Street & South Yarra station"],
    lat: -37.8390, lng: 144.9913, is_signature: false, sort_order: 6,
  },
  {
    id: "b0000001-0000-0000-0000-000000000007", agent_id: "a0000001-0000-0000-0000-000000000002",
    title: "Brighton Coastal Retreat", address: "7 Middle Crescent", suburb: "Brighton",
    price: "$6,800/mth", price_value: 5750000, beds: 5, baths: 4, parking: 3, sqm: 560,
    type: "House", status: "For Lease", tag: null,
    description: "A beautifully appointed Brighton residence positioned moments from Middle Brighton Beach and the famous bathing boxes. Light-filled interiors over three levels feature a custom kitchen, a resort-style pool and spa, and a dedicated home theatre and gym.",
    features: ["Resort pool, spa & cabana", "Walking distance to Middle Brighton Beach", "Custom Gaggenau kitchen", "Dedicated home theatre & gym", "3-car garage with workshop", "Separate studio / teenager's retreat"],
    lat: -37.9103, lng: 144.9984, is_signature: true, sort_order: 7,
  },
  {
    id: "b0000001-0000-0000-0000-000000000008", agent_id: "a0000001-0000-0000-0000-000000000001",
    title: "Prahran Terrace Collection", address: "3/88 Greville Street", suburb: "Prahran",
    price: "$2,200/mth", price_value: 1350000, beds: 2, baths: 2, parking: 1, sqm: 155,
    type: "Townhouse", status: "Leased", tag: null,
    description: "A pair of architecturally conceived terraces on one of Prahran's most vibrant streets. Exposed brick, polished concrete, and industrial steel detailing define the aesthetic. Each terrace features a private courtyard, rooftop deck, and direct access to Greville Street's renowned cafés and boutiques.",
    features: ["Private rooftop deck with city glimpses", "Exposed brick & polished concrete", "Courtyard with landscaped gardens", "In-home laundry", "One secure car space", "100m to Greville Street strip"],
    lat: -37.8487, lng: 144.9920, is_signature: false, sort_order: 8,
  },
  {
    id: "b0000001-0000-0000-0000-000000000009", agent_id: "a0000001-0000-0000-0000-000000000003",
    title: "Malvern Grand Estate", address: "6 Staniland Grove", suburb: "Malvern",
    price: "$6,200,000", price_value: 6200000, beds: 5, baths: 4, parking: 3, sqm: 620,
    type: "House", status: "Under Offer", tag: "Grand",
    description: "Set behind remote-gated entry on one of Malvern's grandest private gardens, this substantial Victorian mansion has been transformed for contemporary living without compromising its architectural heritage. Soaring ceilings, Baltic pine floors, and an extraordinary kitchen garden create a truly timeless estate.",
    features: ["Remote-gated entry & circular driveway", "Substantial kitchen garden & orchard", "Restored Victorian facade", "New Modulnova kitchen", "Heated saltwater pool & pool house", "Minutes to Malvern Central & Glenferrie Road"],
    lat: -37.8602, lng: 145.0270, is_signature: false, sort_order: 9,
  },
];

// ── Amenities per property ────────────────────────────────────────────────────
const amenityTemplates = {
  "b0000001-0000-0000-0000-000000000001": [ // Langham Penthouse
    { category: "restaurants",   rating: 4.9, description: "Over 20 fine dining venues within 500m of Queensbridge Square, including multiple hatted restaurants overlooking the Yarra." },
    { category: "parks",         rating: 3.8, description: "Southbank Promenade and Crown Riverwalk provide leafy river walks. Alexandra Gardens is a short tram ride away." },
    { category: "transport",     rating: 5.0, description: "Flinders Street Station is 400m away. Tram stops on the doorstep. CBD commute under 5 minutes on foot." },
    { category: "quietness",     rating: 3.5, description: "Inner-city energy with some street noise at lower levels. Upper floors are well-insulated with exceptional acoustic glazing." },
    { category: "cafes",         rating: 4.7, description: "The Langham's own café plus 15 specialty coffee spots within a 5-minute walk, including riverside roasters." },
    { category: "shopping",      rating: 4.8, description: "Crown Melbourne and Southgate precinct offer luxury retail, boutiques, and a premium supermarket 200m away." },
    { category: "schools",       rating: 4.0, description: "South Melbourne Primary School nearby. Melbourne Grammar and Wesley College within easy reach." },
    { category: "medical",       rating: 4.6, description: "Alfred Hospital 1km away. Multiple specialist clinics and allied health providers in the Southbank precinct." },
    { category: "entertainment", rating: 5.0, description: "Crown Entertainment Complex, Arts Centre Melbourne, and National Gallery of Victoria all within 600m." },
  ],
  "b0000001-0000-0000-0000-000000000002": [ // St Kilda Beachfront
    { category: "restaurants",   rating: 4.6, description: "Acland Street and Fitzroy Street strip offers Melbourne's most diverse dining scene — beachside cafes to acclaimed restaurants." },
    { category: "parks",         rating: 5.0, description: "St Kilda Beach and Catani Gardens directly opposite. St Kilda Botanical Gardens 500m away. Truly outstanding parkland." },
    { category: "transport",     rating: 4.2, description: "Iconic tram along Fitzroy Street to CBD. St Kilda Road trams and bus connections. City commute under 20 minutes." },
    { category: "quietness",     rating: 3.8, description: "Residential pocket off Fitzroy Street. Weekend activity around the esplanade is lively but the street itself is calm." },
    { category: "cafes",         rating: 4.8, description: "10+ specialty cafés and roasters within 400m. Beachside breakfast culture is genuinely world-class." },
    { category: "shopping",      rating: 4.3, description: "Acland Street boutiques and Chapel Street a short ride away. Readings bookshop and independent retailers." },
    { category: "schools",       rating: 3.9, description: "St Kilda Primary nearby. Star of the Sea College and MacRobertson Girls' within reasonable distance." },
    { category: "medical",       rating: 4.1, description: "St Kilda Road medical precinct 10 minutes away. Alfred Hospital easily accessible." },
    { category: "entertainment", rating: 4.9, description: "Luna Park, St Kilda Arts Festival, Palais Theatre, and beach volleyball courts — entertainment is the suburb's DNA." },
  ],
  "b0000001-0000-0000-0000-000000000003": [ // Armadale Garden Residence
    { category: "restaurants",   rating: 4.3, description: "High Street Armadale has excellent restaurant options. Hawksburn Village dining precinct 10 minutes walk." },
    { category: "parks",         rating: 4.5, description: "Beatty Avenue Reserve adjacent. Fawkner Park a short walk. Mature street trees create a genuinely leafy feel." },
    { category: "transport",     rating: 4.4, description: "Armadale Station 600m away. Glen Waverley and Sandringham lines. Tram on High Street. CBD in 18 minutes." },
    { category: "quietness",     rating: 4.8, description: "Deep residential streets, double-brick construction, mature plantings — one of Melbourne's quietest inner suburbs." },
    { category: "cafes",         rating: 4.2, description: "Hawksburn Village has outstanding specialty coffee. Several acclaimed brunch spots on High Street." },
    { category: "shopping",      rating: 4.4, description: "Malvern Central 600m away. Hawksburn Village boutiques. Chapel Street 10 minutes by tram." },
    { category: "schools",       rating: 4.9, description: "Zoned for Armadale Primary. Xavier College, Loreto Mandeville Hall, and Caulfield Grammar all nearby — exceptional catchment." },
    { category: "medical",       rating: 4.3, description: "Cabrini Hospital Malvern 1.2km away. Numerous GP clinics and allied health on High Street and Glenferrie Road." },
    { category: "entertainment", rating: 3.8, description: "Village atmosphere with independent cinema, weekend markets, and the Astor Theatre for classic films." },
  ],
  "b0000001-0000-0000-0000-000000000004": [ // Port Melbourne Waterfront
    { category: "restaurants",   rating: 4.2, description: "Bay Street dining strip 400m away. Waterfront restaurants along Beach Street with bay views." },
    { category: "parks",         rating: 4.7, description: "Port Melbourne Beach and Bay Trail directly accessible. Lagoon Reserve and Sandridge Beach nearby." },
    { category: "transport",     rating: 4.5, description: "96 tram to CBD on the doorstep. City Link freeway access. Docklands 10 minutes. Citylink convenient for airport." },
    { category: "quietness",     rating: 4.4, description: "Waterfront residential pocket with low through-traffic. Beach Street is calm outside peak summer weekends." },
    { category: "cafes",         rating: 4.0, description: "Espresso bar downstairs and several specialty cafés along Bay Street and on the waterfront." },
    { category: "shopping",      rating: 3.8, description: "Bay Street local shops cover essentials. DFO South Wharf 5 minutes by car." },
    { category: "schools",       rating: 3.9, description: "Port Melbourne Primary School 400m away. Zoned for South Melbourne College." },
    { category: "medical",       rating: 4.0, description: "Port Melbourne Medical Centre 300m. Alfred Hospital accessible via the 96 tram." },
    { category: "entertainment", rating: 4.3, description: "Beach swimming, volleyball, and the Bay Trail cycling and running path. Williamstown ferry from Station Pier." },
  ],
  "b0000001-0000-0000-0000-000000000005": [ // Toorak Manor Estate
    { category: "restaurants",   rating: 4.5, description: "Toorak Village restaurants include some of Melbourne's finest. Chapel Street's acclaimed dining scene a short drive." },
    { category: "parks",         rating: 4.4, description: "Como Park and the Yarra River Trail accessible. The estate's own 1,200m² garden rivals any public park." },
    { category: "transport",     rating: 4.2, description: "Toorak Station 900m away. Tram on Toorak Road. CBD 15 minutes by car or rail." },
    { category: "quietness",     rating: 5.0, description: "Private tree-lined boulevard with negligible traffic. Behind remote-gated entry — absolute serenity. Melbourne's best." },
    { category: "cafes",         rating: 4.3, description: "Toorak Village café strip 600m away. Hawksburn Village's outstanding coffee 10 minutes walk." },
    { category: "shopping",      rating: 4.5, description: "Toorak Village boutiques include jewellers, art galleries, and luxury fashion. Chapel Street luxury retail nearby." },
    { category: "schools",       rating: 5.0, description: "Scotch College 800m. Melbourne Grammar, Loreto, Sacré Cœur all within 2km. Arguably Melbourne's best school precinct." },
    { category: "medical",       rating: 4.4, description: "Cabrini Hospital Malvern 2km. Multiple GP and specialist suites in Toorak Village." },
    { category: "entertainment", rating: 4.2, description: "Private tennis court on site. Como House gardens nearby. Melbourne's cultural institutions a short drive." },
  ],
  "b0000001-0000-0000-0000-000000000006": [ // South Yarra Sky Residence
    { category: "restaurants",   rating: 4.8, description: "Chapel Street and Toorak Road offer Melbourne's densest concentration of acclaimed restaurants within 300m." },
    { category: "parks",         rating: 4.3, description: "Fawkner Park and the Tan Track 600m away. Kings Domain and Royal Botanic Gardens a short walk." },
    { category: "transport",     rating: 4.9, description: "South Yarra Station 200m away. Three tram routes. CBD commute under 10 minutes. Exceptional connectivity." },
    { category: "quietness",     rating: 3.9, description: "Elevated position provides acoustic separation from street activity. Wraparound glazing is triple-insulated." },
    { category: "cafes",         rating: 4.9, description: "Chapel Street's world-renowned café culture starts at the building's doorstep. 20+ specialty options within 5 minutes." },
    { category: "shopping",      rating: 5.0, description: "Chapel Street luxury precinct, Toorak Road boutiques, and Como Centre retail all within 400m. Shopping perfection." },
    { category: "schools",       rating: 4.2, description: "Melbourne Grammar and Wesley College within 1km. South Yarra Primary School nearby." },
    { category: "medical",       rating: 4.5, description: "Cabrini and Alfred hospitals both accessible. Specialist medical suites along Toorak Road." },
    { category: "entertainment", rating: 4.7, description: "Astor Theatre, Palace Cinema Como, rooftop bars, and live music venues all within the immediate precinct." },
  ],
  "b0000001-0000-0000-0000-000000000007": [ // Brighton Coastal Retreat
    { category: "restaurants",   rating: 4.2, description: "Church Street Brighton dining strip is 10 minutes walk. Bay Street cafés and the Esplanade Hotel for casual dining." },
    { category: "parks",         rating: 5.0, description: "Middle Brighton Beach and its iconic bathing boxes 200m away. Dendy Park and green corridors throughout the suburb." },
    { category: "transport",     rating: 4.0, description: "Middle Brighton Station 800m away. CBD train commute 35 minutes. Nepean Highway freeway access." },
    { category: "quietness",     rating: 4.7, description: "Quiet residential street, large allotments, mature canopy trees. Brighton is one of Melbourne's most peaceful suburbs." },
    { category: "cafes",         rating: 4.1, description: "Several well-regarded cafés on Bay Street and Church Street. Beachside coffee culture in full swing on weekends." },
    { category: "shopping",      rating: 4.3, description: "Church Street Brighton: boutique fashion, homewares, and luxury goods. Bay Street for everyday needs." },
    { category: "schools",       rating: 4.7, description: "Zoned for Brighton Grammar and Firbank Grammar. Star of the Sea and Brighton Secondary College nearby." },
    { category: "medical",       rating: 4.0, description: "Brighton Medical Centre on Bay Street. Sandringham Hospital 10 minutes by car." },
    { category: "entertainment", rating: 4.5, description: "Beach swimming, stand-up paddleboarding, cycling the Bay Trail. Brighton Baths and sailing clubs nearby." },
  ],
  "b0000001-0000-0000-0000-000000000008": [ // Prahran Terrace
    { category: "restaurants",   rating: 4.7, description: "Greville Street's restaurant strip directly outside the front door. Commercial Road and Chapel Street extend the options." },
    { category: "parks",         rating: 3.9, description: "Fawkner Park 10 minutes walk. Linlithgow Avenue Reserve nearby. Greenery is accessible if not immediately abundant." },
    { category: "transport",     rating: 4.8, description: "Prahran Station 500m away. Three tram routes on Chapel Street. CBD under 15 minutes. Outstanding access." },
    { category: "quietness",     rating: 3.5, description: "Greville Street has vibrant foot traffic and music venues. The terrace's courtyard provides a private retreat." },
    { category: "cafes",         rating: 4.9, description: "Greville Street is one of Melbourne's great café destinations. 8 specialty roasters within 200m of the front door." },
    { category: "shopping",      rating: 4.8, description: "Chapel Street, Greville Street boutiques, and Prahran Market — some of Melbourne's best shopping on the doorstep." },
    { category: "schools",       rating: 3.9, description: "Prahran Primary School nearby. Wesley and Melbourne Grammar within commuting distance." },
    { category: "medical",       rating: 4.2, description: "Alfred Hospital 1km away. Prahran has strong allied health and GP representation." },
    { category: "entertainment", rating: 5.0, description: "Chapel Street nightlife, Greville Street live music, Prahran Market, and Palace Cinemas — entertainment is the suburb's identity." },
  ],
  "b0000001-0000-0000-0000-000000000009": [ // Malvern Grand Estate
    { category: "restaurants",   rating: 4.3, description: "Glenferrie Road dining strip 800m away. Malvern Central precinct has excellent options. Hawksburn Village 10 minutes." },
    { category: "parks",         rating: 4.6, description: "Malvern Valley Golf Course borders the suburb. Central Park Malvern a short walk. Large private garden on site." },
    { category: "transport",     rating: 4.3, description: "Malvern Station 700m away. Tram on Glenferrie Road. CBD commute 22 minutes by rail." },
    { category: "quietness",     rating: 4.9, description: "Staniland Grove is among Malvern's most private addresses. Remote-gated entry, lush canopy, minimal traffic." },
    { category: "cafes",         rating: 4.1, description: "Several outstanding cafés on Glenferrie Road. Malvern Central precinct café options expanding." },
    { category: "shopping",      rating: 4.4, description: "Malvern Central shopping centre 700m. Glenferrie Road boutiques and Hawksburn Village nearby." },
    { category: "schools",       rating: 4.8, description: "Zoned for Malvern Primary. Caulfield Grammar, Lauriston Girls', and De La Salle all within 2km. Excellent catchment." },
    { category: "medical",       rating: 4.3, description: "Cabrini Hospital Malvern 1.5km. Well-serviced by GPs and specialist clinics on Glenferrie Road." },
    { category: "entertainment", rating: 3.9, description: "Village lifestyle with independent bookshops, galleries, and weekend markets. Melbourne's cultural scene a short drive." },
  ],
};

async function seed() {
  console.log("Seeding agents...");
  const { error: agentErr } = await supabase
    .from("agents")
    .upsert(agents, { onConflict: "id" });
  if (agentErr) { console.error("Agents error:", agentErr.message); process.exit(1); }
  console.log(`  ✓ ${agents.length} agents`);

  console.log("Seeding properties...");
  const { error: propErr } = await supabase
    .from("properties")
    .upsert(properties, { onConflict: "id" });
  if (propErr) { console.error("Properties error:", propErr.message); process.exit(1); }
  console.log(`  ✓ ${properties.length} properties`);

  console.log("Seeding amenities...");
  const amenityRows = [];
  for (const [propId, rows] of Object.entries(amenityTemplates)) {
    for (const row of rows) {
      amenityRows.push({ property_id: propId, ...row });
    }
  }
  const { error: amenErr } = await supabase
    .from("property_amenities")
    .upsert(amenityRows, { onConflict: "property_id,category" });
  if (amenErr) { console.error("Amenities error:", amenErr.message); process.exit(1); }
  console.log(`  ✓ ${amenityRows.length} amenity rows (9 categories × 9 properties)`);

  console.log("\nDone! All dummy data inserted.");
}

seed();
