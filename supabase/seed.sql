-- ─────────────────────────────────────────────────────────────────────────────
-- South Property — Seed Data
-- Run this AFTER 001_initial_schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Agents ──────────────────────────────────────────────────────────────────

insert into agents (id, name, title, phone, email, initials, bio) values
  ('a0000001-0000-0000-0000-000000000001', 'James Whitmore',  'Principal Agent', '+61 3 9000 0001', 'james@southproperty.com.au',  'JW', 'Principal agent with over 15 years experience in Melbourne prestige property.'),
  ('a0000001-0000-0000-0000-000000000002', 'Sarah Kensington', 'Senior Agent',    '+61 3 9000 0002', 'sarah@southproperty.com.au',  'SK', 'Specialist in bayside and inner-suburban properties across Melbourne.'),
  ('a0000001-0000-0000-0000-000000000003', 'Marcus Elliot',   'Director',         '+61 3 9000 0003', 'marcus@southproperty.com.au', 'ME', 'Director and founding principal with expertise in ultra-prestige estates.');

-- ─── Properties ──────────────────────────────────────────────────────────────

insert into properties (
  id, agent_id, title, address, suburb, price, price_value,
  beds, baths, parking, sqm, type, status, tag,
  description, features, lat, lng, is_signature, sort_order
) values
  (
    'b0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'The Langham Penthouse', '3801/1 Queensbridge Square', 'Southbank',
    '$4,200,000', 4200000, 4, 3, 2, 285, 'Apartment', 'For Sale', 'Penthouse',
    'Crowning the iconic Langham tower, this extraordinary penthouse commands uninterrupted 360° views across Melbourne''s skyline, the Yarra River, and Port Phillip Bay. Finished to hotel-grade specification, the residence features double-height ceilings, Calacatta marble throughout, and a private rooftop terrace.',
    ARRAY['360° panoramic skyline views','Private rooftop terrace with plunge pool','Calacatta marble kitchen & bathrooms','Dedicated concierge & valet parking','Smart-home automation throughout','Wine room & private lift access'],
    -37.8232, 144.9680, true, 1
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000002',
    'St Kilda Beachfront Villa', '88 Fitzroy Street', 'St Kilda',
    '$3,850,000', 3850000, 5, 4, 3, 420, 'House', 'Sold', null,
    'A breathtaking beachfront villa steps from St Kilda''s iconic foreshore. This architect-designed residence blends coastal luxury with urban sophistication, featuring expansive north-facing terraces, a heated pool, and a ground-floor entertainment pavilion opening directly onto the promenade.',
    ARRAY['Direct beach access & ocean views','Heated pool & outdoor pavilion','Chef''s kitchen with butler''s pantry','Guest suite with private entry','5-car garage with EV charging','Solar & battery energy system'],
    -37.8604, 144.9765, false, 2
  ),
  (
    'b0000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000001',
    'Armadale Garden Residence', '24 Kooyong Road', 'Armadale',
    '$2,950,000', 2950000, 4, 3, 2, 380, 'House', 'Under Offer', null,
    'A masterfully restored Edwardian home behind a wisteria-draped facade. Formal and informal living spaces flow to a lush north-facing garden with a 15m lap pool. The fully updated kitchen and bathrooms honour the home''s heritage while providing every contemporary convenience.',
    ARRAY['15m heated lap pool & garden','Restored Edwardian facade & cornicing','Bulthaup kitchen with Gaggenau appliances','Hydronic in-slab heating','Double-brick construction','Walking distance to Malvern Central'],
    -37.8556, 145.0229, false, 3
  ),
  (
    'b0000001-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000002',
    'Port Melbourne Waterfront', '1/105 Beach Street', 'Port Melbourne',
    '$4,500/mth', 1890000, 3, 2, 2, 195, 'Apartment', 'For Lease', null,
    'A refined waterfront apartment with direct bay views from every principal room. The open-plan living and dining space features floor-to-ceiling glazing, herringbone oak floors, and a Miele kitchen. Two secure car spaces and a storage cage are included.',
    ARRAY['Uninterrupted Port Phillip Bay views','Floor-to-ceiling glazing throughout','Miele appliances & stone benchtops','Secure double basement parking','Rooftop residents'' lounge & BBQ','300m to Bay Trail & restaurants'],
    -37.8326, 144.9268, false, 4
  ),
  (
    'b0000001-0000-0000-0000-000000000005',
    'a0000001-0000-0000-0000-000000000003',
    'Toorak Manor Estate', '15 Albany Road', 'Toorak',
    '$8,500,000', 8500000, 6, 5, 4, 680, 'House', 'For Sale', 'Prestige',
    'An exceptional Toorak manor on one of the suburb''s most coveted tree-lined boulevards. Set on 1,200m² with formal gardens, a championship-size tennis court, and a full-width entertainer''s terrace, this grand residence defines Toorak''s finest tradition of luxury living.',
    ARRAY['1,200m² allotment with formal gardens','Championship tennis court','Cinema room & wine cellar','4-car garage with workshop','6m coffered ceilings in formal rooms','Walk to Toorak Village & Como Park'],
    -37.8490, 145.0141, true, 5
  ),
  (
    'b0000001-0000-0000-0000-000000000006',
    'a0000001-0000-0000-0000-000000000003',
    'South Yarra Sky Residence', '4201/200 Spencer Street', 'South Yarra',
    '$2,100,000', 2100000, 3, 2, 1, 210, 'Apartment', 'For Sale', null,
    'On the 42nd level of South Yarra''s most architecturally acclaimed tower, this sky residence captures the full sweep of Melbourne''s CBD and inner suburbs. Wraparound glazing, a seamless indoor-outdoor layout, and a private north-facing terrace create an extraordinary elevated sanctuary.',
    ARRAY['42nd-floor panoramic wraparound views','Private north-facing terrace','Boffi kitchen & Dornbracht fixtures','Concealed home-office alcove','24-hour concierge & gym','Steps to Chapel Street & South Yarra station'],
    -37.8390, 144.9913, false, 6
  ),
  (
    'b0000001-0000-0000-0000-000000000007',
    'a0000001-0000-0000-0000-000000000002',
    'Brighton Coastal Retreat', '7 Middle Crescent', 'Brighton',
    '$6,800/mth', 5750000, 5, 4, 3, 560, 'House', 'For Lease', null,
    'A beautifully appointed Brighton residence positioned moments from Middle Brighton Beach and the famous bathing boxes. Light-filled interiors over three levels feature a custom kitchen, a resort-style pool and spa, and a dedicated home theatre and gym.',
    ARRAY['Resort pool, spa & cabana','Walking distance to Middle Brighton Beach','Custom Gaggenau kitchen','Dedicated home theatre & gym','3-car garage with workshop','Separate studio / teenager''s retreat'],
    -37.9103, 144.9984, true, 7
  ),
  (
    'b0000001-0000-0000-0000-000000000008',
    'a0000001-0000-0000-0000-000000000001',
    'Prahran Terrace Collection', '3/88 Greville Street', 'Prahran',
    '$2,200/mth', 1350000, 2, 2, 1, 155, 'Townhouse', 'Leased', null,
    'A pair of architecturally conceived terraces on one of Prahran''s most vibrant streets. Exposed brick, polished concrete, and industrial steel detailing define the aesthetic. Each terrace features a private courtyard, rooftop deck, and direct access to Greville Street''s renowned cafés and boutiques.',
    ARRAY['Private rooftop deck with city glimpses','Exposed brick & polished concrete','Courtyard with landscaped gardens','In-home laundry','One secure car space','100m to Greville Street strip'],
    -37.8487, 144.9920, false, 8
  ),
  (
    'b0000001-0000-0000-0000-000000000009',
    'a0000001-0000-0000-0000-000000000003',
    'Malvern Grand Estate', '6 Staniland Grove', 'Malvern',
    '$6,200,000', 6200000, 5, 4, 3, 620, 'House', 'Under Offer', 'Grand',
    'Set behind remote-gated entry on one of Malvern''s grandest private gardens, this substantial Victorian mansion has been transformed for contemporary living without compromising its architectural heritage. Soaring ceilings, Baltic pine floors, and an extraordinary kitchen garden create a truly timeless estate.',
    ARRAY['Remote-gated entry & circular driveway','Substantial kitchen garden & orchard','Restored Victorian facade','New Modulnova kitchen','Heated saltwater pool & pool house','Minutes to Malvern Central & Glenferrie Road'],
    -37.8602, 145.0270, false, 9
  );
