"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { supabase } from "../lib/supabase";

const BLUR_PLACEHOLDER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EACMQAAIBBAIBBQAAAAAAAAAAAAECAwQFETEhQVFhcf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCrc1wC3xRa3l7NG1uqMFkVEGSWJAHA9+tbFrm8T7DPSajNPHI7hPIiRyASOeM+vwpSgD//2Q==";

// ── Types ──────────────────────────────────────────────────────────────────────
type PropStatus = "For Sale" | "Under Offer" | "Sold" | "For Lease" | "Leased";
type TabId = "overview" | "gallery" | "floorplan" | "amenities";

interface AmenityCard {
  id: number; name: string; rating: number; description: string;
  accent: string; icon: React.ReactNode;
}
interface PropertyDetail {
  id: string; title: string; address: string; suburb: string; price: string;
  beds: number; baths: number; parking: number; sqm: number;
  type: string; status: PropStatus; gradient: string; tag?: string;
  description: string; features: string[];
  lat: number; lng: number;
  heroImageUrl?: string;
  images: { url: string; label: string }[];
  agent: { name: string; title: string; phone: string; email: string; initials: string; gradient: string; };
}

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<PropStatus, { bg: string; color: string }> = {
  "For Sale":    { bg: "var(--gold)",             color: "#fff" },
  "Under Offer": { bg: "rgba(255,255,255,0.15)",  color: "#fff" },
  "Sold":        { bg: "rgba(160,40,40,0.75)",    color: "#fff" },
  "For Lease":   { bg: "rgba(30,90,170,0.75)",    color: "#fff" },
  "Leased":      { bg: "rgba(30,120,70,0.75)",    color: "#fff" },
};

// ── Gradient utilities ─────────────────────────────────────────────────────────
const PROP_GRADIENTS = [
  "linear-gradient(155deg,#0a1628 0%,#142744 50%,#0d1f38 100%)",
  "linear-gradient(155deg,#081c2a 0%,#0f2e42 50%,#0a1e2e 100%)",
  "linear-gradient(155deg,#0c1e12 0%,#163320 50%,#0e2016 100%)",
  "linear-gradient(155deg,#0e1c28 0%,#183040 50%,#101e2c 100%)",
  "linear-gradient(155deg,#1c0e0a 0%,#301a10 50%,#201210 100%)",
  "linear-gradient(155deg,#10121e 0%,#1c2038 50%,#121428 100%)",
  "linear-gradient(155deg,#0a1820 0%,#12283a 50%,#0c1e2c 100%)",
  "linear-gradient(155deg,#1c1408 0%,#2e200e 50%,#201a0c 100%)",
  "linear-gradient(155deg,#101418 0%,#1c2430 50%,#121820 100%)",
];
const AGENT_GRADIENTS = [
  "linear-gradient(145deg,#1c2030 0%,#262c3e 100%)",
  "linear-gradient(145deg,#0e1c2a 0%,#162636 100%)",
  "linear-gradient(145deg,#121e14 0%,#1a2a1c 100%)",
  "linear-gradient(145deg,#1c120e 0%,#261c14 100%)",
];

function strGradient(palette: string[], s: string) {
  let h = 0;
  for (const c of s) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return palette[Math.abs(h) % palette.length];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDetailRow(row: any): PropertyDetail {
  const ag = row.agents;
  const imgs = ((row.property_images as { image_url: string; label: string | null; sort_order: number }[]) ?? [])
    .sort((a, b) => a.sort_order - b.sort_order);
  const hero = imgs[0];
  return {
    id:          row.id,
    title:       row.title,
    address:     row.address,
    suburb:      row.suburb,
    price:       row.price,
    beds:        row.beds        ?? 0,
    baths:       row.baths       ?? 0,
    parking:     row.parking     ?? 0,
    sqm:         row.sqm         ?? 0,
    type:        row.type        ?? "House",
    status:      row.status      as PropStatus,
    tag:         row.tag         ?? undefined,
    gradient:    strGradient(PROP_GRADIENTS, row.id),
    description: row.description ?? "",
    features:    row.features    ?? [],
    lat:         row.lat         ?? 0,
    lng:         row.lng         ?? 0,
    heroImageUrl: hero?.image_url,
    images:      imgs.map(i => ({ url: i.image_url, label: i.label ?? "" })),
    agent: ag ? {
      name:     ag.name,
      title:    ag.title,
      phone:    ag.phone    ?? "",
      email:    ag.email    ?? "",
      initials: ag.initials ?? "SP",
      gradient: strGradient(AGENT_GRADIENTS, ag.initials ?? "SP"),
    } : {
      name: "South Property", title: "Agent", phone: "", email: "",
      initials: "SP", gradient: AGENT_GRADIENTS[0],
    },
  };
}

// ── Floor plan PDFs (from floorplan-images bucket) ────────────────────────────
const STORAGE = "https://lgtbhinsdmblkrfuttnz.supabase.co/storage/v1/object/public/floorplan-images";
const FLOOR_PLAN_PDFS = [
  { label: "Apartment 302", url: `${STORAGE}/Cambridge%20Rd%20Apartments%20-%20MKT%20302.pdf` },
  { label: "Level 3",       url: `${STORAGE}/Cambridge%20Rd%20Apartments%20-%20MKT%20L3.pdf`  },
  { label: "Level 4",       url: `${STORAGE}/Cambridge%20Rd%20Apartments%20-%20MKT%20L4.pdf`  },
];

// ── Amenity cards ──────────────────────────────────────────────────────────────
function IconRestaurant() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2s-4 2-4 9h4"/><path d="M17 22v-7"/></svg>;
}
function IconPark() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-8"/><path d="M12 14l-4-4h8l-4 4z"/><path d="M12 10l-3-4h6l-3 4z"/></svg>;
}
function IconTrain() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="16" rx="2"/><path d="M4 10h16"/><path d="M9 2v8"/><path d="M15 2v8"/><path d="M7 18l-2 4"/><path d="M17 18l2 4"/></svg>;
}
function IconWave() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>;
}
function IconCoffee() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>;
}
function IconBag() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
}
function IconBook() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
}
function IconPlus() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>;
}
function IconStar() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}

const AMENITY_CARDS: AmenityCard[] = [
  { id:1, name:"Restaurants",    rating:4.5, accent:"rgba(201,168,76,0.15)",  icon:<IconRestaurant/>, description:"17 fine dining venues within 800m, from award-winning hatted restaurants to vibrant casual eateries. Melbourne's diverse culinary scene is at your doorstep." },
  { id:2, name:"Parks & Nature", rating:4.2, accent:"rgba(60,120,60,0.15)",   icon:<IconPark/>,       description:"Three public parks within 500m including a heritage-listed botanical garden. Perfect for morning runs, weekend picnics, and outdoor recreation year-round." },
  { id:3, name:"Transport",      rating:4.8, accent:"rgba(40,100,180,0.15)",  icon:<IconTrain/>,      description:"Exceptional connectivity with a train station 350m away, tram stops on the doorstep, and easy freeway access. City CBD commute under 12 minutes." },
  { id:4, name:"Quietness",      rating:3.9, accent:"rgba(148,170,191,0.15)", icon:<IconWave/>,       description:"Residential street with low traffic volume. Noise readings well within premium residential standards. Minimal aircraft flight paths. Genuinely peaceful." },
  { id:5, name:"Cafés",          rating:4.6, accent:"rgba(150,90,40,0.15)",   icon:<IconCoffee/>,     description:"11 specialty cafés within a 5-minute walk, including two roasters rated in Melbourne's top 20. Morning coffee culture thrives in this neighbourhood." },
  { id:6, name:"Shopping",       rating:4.1, accent:"rgba(100,60,140,0.15)",  icon:<IconBag/>,        description:"Village shopping strip 200m away with boutique retailers, a gourmet grocer, and a farmers' market every Saturday morning." },
  { id:7, name:"Schools",        rating:4.4, accent:"rgba(40,130,100,0.15)",  icon:<IconBook/>,       description:"Zoned for two of Victoria's highest-ranked government schools. Three leading independent schools within 2km. Excellent educational catchment." },
  { id:8, name:"Medical",        rating:4.7, accent:"rgba(60,140,160,0.15)",  icon:<IconPlus/>,       description:"Full-service medical centre 300m away. Two major hospitals reachable within 10 minutes. Specialist clinics and allied health practitioners in the precinct." },
  { id:9, name:"Entertainment",  rating:3.8, accent:"rgba(180,60,80,0.15)",   icon:<IconStar/>,       description:"Cinema, live music venues, and a performing arts theatre all within the immediate neighbourhood. Melbourne's vibrant cultural scene is genuinely accessible." },
];

// ── Google Maps dark style ─────────────────────────────────────────────────────
const DARK_MAP_STYLES = [
  { elementType: "geometry",              stylers: [{ color: "#1a1c22" }] },
  { elementType: "labels.text.stroke",    stylers: [{ color: "#0c0e11" }] },
  { elementType: "labels.text.fill",      stylers: [{ color: "#8899aa" }] },
  { featureType: "road", elementType: "geometry",        stylers: [{ color: "#21252c" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#17191f" }] },
  { featureType: "road", elementType: "labels.text.fill",stylers: [{ color: "#6b7280" }] },
  { featureType: "road.highway", elementType: "geometry",stylers: [{ color: "#2d3440" }] },
  { featureType: "poi.park", elementType: "geometry",    stylers: [{ color: "#141619" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#4a5568" }] },
  { featureType: "poi",     elementType: "labels.text.fill",  stylers: [{ color: "#6b7280" }] },
  { featureType: "transit", elementType: "geometry",          stylers: [{ color: "#17191f" }] },
  { featureType: "water",   elementType: "geometry",          stylers: [{ color: "#060810" }] },
  { featureType: "water",   elementType: "labels.text.fill",  stylers: [{ color: "#3d4a5a" }] },
];

// ── StarRating ─────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {[1,2,3,4,5].map(i => {
        const filled = i <= Math.floor(rating);
        const half   = !filled && i === Math.ceil(rating) && rating % 1 >= 0.4;
        return (
          <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="none">
            <polygon
              points="6,1 7.5,4.2 11,4.6 8.5,7 9.2,10.5 6,8.8 2.8,10.5 3.5,7 1,4.6 4.5,4.2"
              fill={filled ? "var(--gold)" : half ? "var(--gold)" : "rgba(201,168,76,0.2)"}
              stroke="none"
              opacity={half ? 0.55 : 1}
            />
          </svg>
        );
      })}
      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.62rem", color: "rgba(210,220,232,0.55)", marginLeft: "4px" }}>{rating.toFixed(1)}</span>
    </div>
  );
}

// ── AmenityFlipCard ────────────────────────────────────────────────────────────
function AmenityFlipCard({ card }: { card: AmenityCard }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(f => !f)}
      aria-pressed={flipped}
      role="button"
      style={{ flex: "0 0 calc(33.333% - 1rem)", cursor: "pointer", perspective: "1000px", height: "200px" }}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          background: `linear-gradient(145deg, #1e2230 0%, #191c26 100%)`,
          border: "1px solid rgba(180,195,212,0.10)",
          borderRadius: "12px", padding: "1.5rem",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "10px",
            background: card.accent, display: "flex", alignItems: "center",
            justifyContent: "center", color: "var(--gold)",
          }}>
            {card.icon}
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.05rem", color: "#fff", marginBottom: "0.5rem" }}>{card.name}</p>
            <StarRating rating={card.rating} />
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "rgba(201,168,76,0.6)", letterSpacing: "0.1em" }}>Tap to learn more</p>
        </div>
        {/* Back */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: `linear-gradient(145deg, #232836 0%, #1c2030 100%)`,
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "12px", padding: "1.5rem",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>{card.name}</p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(210,220,232,0.78)", lineHeight: 1.65 }}>{card.description}</p>
          </div>
          <StarRating rating={card.rating} />
        </div>
      </div>
    </div>
  );
}

// ── FloorPlanSection ───────────────────────────────────────────────────────────
function FloorPlanSection() {
  const sectionRef             = useRef<HTMLElement>(null);
  const [visible,  setVisible] = useState(false);
  const [planIdx,  setPlanIdx] = useState(0);
  const [pdfReady, setPdfReady] = useState(false);

  // Lazy-load: mount iframe only once the section enters the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Reset ready state when switching plans so the spinner shows briefly
  useEffect(() => { setPdfReady(false); }, [planIdx]);

  const plan = FLOOR_PLAN_PDFS[planIdx];

  return (
    <section id="floorplan" ref={sectionRef} aria-labelledby="floorplan-heading" style={{ padding: "5rem clamp(1.5rem, 6vw, 5rem)", background: "var(--bg-section)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <div style={{ marginBottom: "3rem" }}>
          <p className="section-label">Floor Plan</p>
          <div className="divider-gold" />
          <h2 id="floorplan-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff", fontWeight: 400 }}>Property Layout</h2>
        </div>

        {/* Tab bar + full-screen link */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {FLOOR_PLAN_PDFS.map((fp, i) => (
            <button
              key={fp.label}
              onClick={() => setPlanIdx(i)}
              style={{
                background: i === planIdx ? "var(--gold)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${i === planIdx ? "var(--gold)" : "rgba(255,255,255,0.12)"}`,
                borderRadius: "100px", cursor: "pointer",
                color: i === planIdx ? "#fff" : "rgba(210,220,232,0.65)",
                fontFamily: "var(--font-inter)", fontSize: "0.68rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "0.5rem 1.25rem",
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
              }}
            >
              {fp.label}
            </button>
          ))}
          <a
            href={plan.url} target="_blank" rel="noopener noreferrer"
            style={{
              marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem",
              background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px",
              color: "rgba(210,220,232,0.55)", fontFamily: "var(--font-inter)",
              fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "0.5rem 1.1rem", textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseOver={e => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
            onMouseOut={e  => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.color = "rgba(210,220,232,0.55)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 1h4v4M11 1L6.5 5.5M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8"/>
            </svg>
            Full Screen
          </a>
        </div>

        {/* PDF viewer */}
        <div style={{
          position: "relative", height: "680px",
          background: "var(--bg-card)", border: "1px solid rgba(180,195,212,0.12)",
          borderRadius: "16px", overflow: "hidden",
        }}>
          {/* Spinner shown until PDF signals onLoad */}
          {!pdfReady && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "var(--gold)", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.72rem", color: "rgba(210,220,232,0.4)", letterSpacing: "0.1em" }}>
                Loading {plan.label}…
              </p>
            </div>
          )}
          {/* iframe mounts only after section is visible (lazy) */}
          {visible && (
            <iframe
              key={planIdx}
              src={plan.url}
              title={plan.label}
              width="100%"
              height="100%"
              style={{ border: "none", display: "block", opacity: pdfReady ? 1 : 0, transition: "opacity 0.3s ease" }}
              onLoad={() => setPdfReady(true)}
              loading="lazy"
            />
          )}
        </div>

        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", color: "rgba(210,220,232,0.3)", marginTop: "0.75rem", textAlign: "center" }}>
          If the plan doesn&apos;t display,{" "}
          <a href={plan.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "none" }}>open it directly</a>.
        </p>
      </div>
    </section>
  );
}

// ── MapSection ─────────────────────────────────────────────────────────────────
function MapSection({ lat, lng, address }: { lat: number; lng: number; address: string }) {
  const mapRef   = useRef<HTMLDivElement>(null);
  const apiKey   = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    type GMaps = {
      maps: {
        Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown;
        Marker: new (opts: Record<string, unknown>) => unknown;
        SymbolPath: { CIRCLE: number };
        MapTypeStyle: unknown;
      };
    };

    const initMap = () => {
      if (!mapRef.current) return;
      const g = (window as unknown as { google: GMaps }).google;
      const map = new g.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        styles: DARK_MAP_STYLES,
        disableDefaultUI: false,
        zoomControl: true,
        scrollwheel: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      new g.maps.Marker({
        position: { lat, lng },
        map,
        title: address,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#C9A84C",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });
    };

    const g = (window as unknown as { google?: unknown }).google;
    if (g) { initMap(); return; }

    const existing = document.querySelector('script[data-map="south"]');
    if (existing) { existing.addEventListener("load", initMap); return; }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.setAttribute("data-map", "south");
    script.async = true;
    script.addEventListener("load", initMap);
    document.head.appendChild(script);
  }, [apiKey, lat, lng, address]);

  return (
    <section aria-label="Location map" style={{ padding: "5rem clamp(1.5rem, 6vw, 5rem)", background: "var(--bg-base)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p className="section-label">Location</p>
          <div className="divider-gold" />
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff", fontWeight: 400 }}>Explore the Neighbourhood</h2>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "rgba(210,220,232,0.55)", marginTop: "0.75rem" }}>{address}</p>
        </div>

        {apiKey ? (
          <div ref={mapRef} style={{ width: "100%", height: "480px", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(180,195,212,0.12)" }} />
        ) : (
          <div style={{
            width: "100%", height: "480px", borderRadius: "16px", overflow: "hidden",
            border: "1px solid rgba(180,195,212,0.12)",
            background: "linear-gradient(145deg, #141619 0%, #1a1c22 100%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem",
          }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", color: "#fff", marginBottom: "0.5rem" }}>{address}</p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", color: "rgba(210,220,232,0.45)", lineHeight: 1.65 }}>
                {lat.toFixed(5)}°S, {Math.abs(lng).toFixed(5)}°E
              </p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.62rem", color: "rgba(201,168,76,0.6)", marginTop: "1rem", letterSpacing: "0.05em" }}>
                Set <code style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.06)", padding: "0.1em 0.4em", borderRadius: "4px" }}>NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to enable interactive map
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── EnquirySection ─────────────────────────────────────────────────────────────
function EnquirySection({ propertyTitle, agent }: { propertyTitle: string; agent: PropertyDetail["agent"] }) {
  const [form, setForm]       = useState({ name:"", email:"", phone:"", message: `I'm interested in ${propertyTitle}. Please get in touch.` });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.85rem 1rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(180,195,212,0.12)",
    borderRadius: "8px", color: "#fff",
    fontFamily: "var(--font-inter)", fontSize: "0.82rem",
    outline: "none", transition: "border-color 0.2s",
  };

  return (
    <section aria-labelledby="detail-enquiry-heading" style={{ padding: "5rem clamp(1.5rem, 6vw, 5rem)", background: "var(--bg-section)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <p className="section-label">Enquire</p>
          <div className="divider-gold" />
          <h2 id="detail-enquiry-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff", fontWeight: 400 }}>Get In Touch</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "4rem", alignItems: "start" }}>
          {/* Agent card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid rgba(180,195,212,0.10)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ height: "180px", background: agent.gradient, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "2px solid rgba(201,168,76,0.5)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", color: "var(--gold)", fontWeight: 400 }}>{agent.initials}</span>
              </div>
            </div>
            <div style={{ padding: "1.75rem" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", color: "#fff", marginBottom: "0.25rem" }}>{agent.name}</p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1.5rem" }}>{agent.title}</p>
              {[{ icon: "📞", label: agent.phone }, { icon: "✉", label: agent.email }].map(({ icon, label }) => (
                <p key={label} style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "rgba(210,220,232,0.65)", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span aria-hidden="true" style={{ opacity: 0.7 }}>{icon}</span>{label}
                </p>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "var(--bg-card)", border: "1px solid rgba(180,195,212,0.10)", borderRadius: "16px", padding: "2.5rem" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "var(--gold)" }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11l5 5 9-9"/></svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.7rem", color: "#fff", marginBottom: "0.75rem" }}>Enquiry Received</h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(210,220,232,0.65)", lineHeight: 1.75 }}>
                  {agent.name} will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "2rem" }}>Property Enquiry</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(210,220,232,0.52)", marginBottom: "0.5rem" }}>Full Name *</label>
                    <input type="text" value={form.name} onChange={update("name")} required style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"}
                      onBlur={e  => e.currentTarget.style.borderColor = "rgba(180,195,212,0.12)"} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(210,220,232,0.52)", marginBottom: "0.5rem" }}>Email *</label>
                    <input type="email" value={form.email} onChange={update("email")} required style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"}
                      onBlur={e  => e.currentTarget.style.borderColor = "rgba(180,195,212,0.12)"} />
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(210,220,232,0.52)", marginBottom: "0.5rem" }}>Phone</label>
                  <input type="tel" value={form.phone} onChange={update("phone")} style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"}
                    onBlur={e  => e.currentTarget.style.borderColor = "rgba(180,195,212,0.12)"} />
                </div>
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(210,220,232,0.52)", marginBottom: "0.5rem" }}>Message</label>
                  <textarea value={form.message} onChange={update("message")} rows={4} style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"}
                    onBlur={e  => e.currentTarget.style.borderColor = "rgba(180,195,212,0.12)"} />
                </div>
                <button type="submit" disabled={submitting} style={{ width: "100%", padding: "1rem", background: "var(--gold)", border: "1px solid var(--gold)", color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", borderRadius: "6px", transition: "background 0.25s" }}
                  onMouseOver={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = "#B8962A"; }}
                  onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)"; }}
                >
                  {submitting ? "Sending…" : "Submit Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .enquiry-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PropertyDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [property, setProperty]   = useState<PropertyDetail | null>(null);
  const [loading,  setLoading]    = useState(true);
  const [activeTab,   setActiveTab]   = useState<TabId>("overview");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [amenityPage, setAmenityPage] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from("properties")
      .select("*, agents(name, title, phone, email, initials), property_images(image_url, label, sort_order)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProperty(data ? mapDetailRow(data) : null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (loading) return;
    if (!property) { router.replace("/buy"); return; }
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, [property, loading, router]);

  // Scroll spy
  useEffect(() => {
    const ids: TabId[] = ["overview", "gallery", "floorplan", "amenities"];
    const els = ids.map(tid => document.getElementById(tid)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveTab(e.target.id as TabId); }),
      { rootMargin: "-25% 0px -65% 0px" }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Keyboard for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const len = property?.images.length ?? 1;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     setLightboxIdx(null);
      if (e.key === "ArrowLeft")  setLightboxIdx(i => i === null ? null : (i - 1 + len) % len);
      if (e.key === "ArrowRight") setLightboxIdx(i => i === null ? null : (i + 1) % len);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, property]);

  const scrollToTab = useCallback((tabId: TabId) => {
    const el = document.getElementById(tabId);
    if (!el) return;
    const offset = 68;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  }, []);

  if (loading) return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Navigation />
      <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "var(--gold)", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!property) return null;

  const badge = STATUS_BADGE[property.status as PropStatus];
  const TABS: { id: TabId; label: string }[] = [
    { id: "overview",  label: "Overview"         },
    { id: "gallery",   label: "Gallery"           },
    { id: "floorplan", label: "Floor Plan"        },
    { id: "amenities", label: "Life Amenities"    },
  ];

  const totalAmenityPages = Math.ceil(AMENITY_CARDS.length / 3);

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", color: "#fff" }}>
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        aria-labelledby="detail-hero-heading"
        style={{ position: "relative", height: "100vh", minHeight: "600px", maxHeight: "920px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
      >
        {property.heroImageUrl ? (
          <Image
            src={property.heroImageUrl}
            alt={property.title}
            fill
            priority
            style={{ objectFit: "cover" }}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        ) : (
          <div aria-hidden="true" style={{ position: "absolute", inset: "-5%", background: property.gradient, transform: "scale(1.05)" }} />
        )}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 99px,rgba(255,255,255,0.018) 99px,rgba(255,255,255,0.018) 100px),repeating-linear-gradient(0deg,transparent,transparent 99px,rgba(255,255,255,0.018) 99px,rgba(255,255,255,0.018) 100px)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(6,8,12,0.15) 0%,rgba(6,8,12,0.05) 35%,rgba(6,8,12,0.7) 70%,rgba(6,8,12,0.97) 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "0 clamp(1.5rem, 6vw, 5rem) 5rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          {/* Back link */}
          <div style={{ marginBottom: "2rem", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(12px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
            <a href="/buy" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(210,220,232,0.6)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)"; }}
              onMouseOut={e  => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(210,220,232,0.6)"; }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to Listings
            </a>
          </div>

          {/* Status + tag */}
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.25rem", flexWrap: "wrap", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(14px)", transition: "opacity 0.8s ease 0.05s, transform 0.8s ease 0.05s" }}>
            <span style={{ background: badge.bg, color: badge.color, fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.3rem 0.8rem", borderRadius: "100px" }}>{property.status}</span>
            {property.tag && <span style={{ background: "rgba(255,255,255,0.12)", color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.3rem 0.8rem", borderRadius: "100px" }}>{property.tag}</span>}
          </div>

          {/* Address — large bold */}
          <h1
            id="detail-hero-heading"
            style={{
              fontFamily: "var(--font-playfair)", fontWeight: 700,
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              color: "#fff", lineHeight: 1.05, letterSpacing: "-0.01em",
              marginBottom: "0.5rem",
              opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(20px)",
              transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
            }}
          >
            {property.address}
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)", color: "rgba(210,220,232,0.6)", marginBottom: "1.5rem", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(12px)", transition: "opacity 0.8s ease 0.18s, transform 0.8s ease 0.18s" }}>
            {property.suburb}, VIC
          </p>

          {/* Price */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(12px)", transition: "opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s" }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.6rem, 4vw, 2.8rem)", color: "var(--gold)", fontWeight: 400 }}>{property.price}</span>
          </div>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(10px)", transition: "opacity 0.8s ease 0.32s, transform 0.8s ease 0.32s" }}>
            {[
              { v: property.beds,    l: "Bedrooms"  },
              { v: property.baths,   l: "Bathrooms" },
              { v: property.parking, l: "Parking"   },
              { v: `${property.sqm}m²`, l: "Internal" },
            ].map(({ v, l }) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", color: "#fff", fontWeight: 400, lineHeight: 1 }}>{v}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", color: "rgba(210,220,232,0.5)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Tab Bar ────────────────────────────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "linear-gradient(160deg,rgba(28,32,40,0.97) 0%,rgba(16,18,22,0.97) 100%)", borderBottom: "1px solid rgba(201,168,76,0.18)", backdropFilter: "blur(16px)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 clamp(1.5rem, 6vw, 5rem)", display: "flex", gap: "0", overflowX: "auto" }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => scrollToTab(tab.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-inter)", fontSize: "0.68rem", fontWeight: activeTab === tab.id ? 500 : 400,
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: activeTab === tab.id ? "var(--gold)" : "rgba(210,220,232,0.55)",
                padding: "1.2rem 1.75rem",
                borderBottom: `2px solid ${activeTab === tab.id ? "var(--gold)" : "transparent"}`,
                transition: "color 0.2s, border-color 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseOver={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = "rgba(210,220,232,0.85)"; }}
              onMouseOut={e  => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = "rgba(210,220,232,0.55)"; }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview ─────────────────────────────────────────────────────────── */}
      <section id="overview" aria-labelledby="overview-heading" style={{ padding: "5rem clamp(1.5rem, 6vw, 5rem)", background: "var(--bg-base)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: "4rem", alignItems: "start" }}>
          {/* Left: details */}
          <div>
            <p className="section-label">Overview</p>
            <div className="divider-gold" />
            <h2 id="overview-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff", fontWeight: 400, marginBottom: "1.5rem" }}>{property.title}</h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.88rem", color: "rgba(210,220,232,0.72)", lineHeight: 1.9, marginBottom: "2.5rem" }}>{property.description}</p>

            {/* Property stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "rgba(180,195,212,0.1)", borderRadius: "12px", overflow: "hidden", marginBottom: "3rem" }}>
              {[
                { icon:"🛏", label:"Bedrooms",  value: String(property.beds)    },
                { icon:"🚿", label:"Bathrooms", value: String(property.baths)   },
                { icon:"🚗", label:"Parking",   value: String(property.parking) },
                { icon:"📐", label:"Internal",  value: `${property.sqm}m²`      },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--bg-card)", padding: "1.5rem 1rem", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", color: "var(--gold)", fontWeight: 400, lineHeight: 1 }}>{value}</p>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", color: "rgba(210,220,232,0.5)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "0.4rem" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", color: "#fff", fontWeight: 400, marginBottom: "1.25rem" }}>Key Features</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {property.features.map(f => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(210,220,232,0.7)", lineHeight: 1.5 }}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}><polyline points="2,7 5.5,10.5 12,3.5" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: agent card */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "16px", overflow: "hidden" }}>
              {/* Portrait area */}
              <div style={{ height: "200px", background: property.agent.gradient, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.07) 0%,transparent 65%)" }} />
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "2px solid rgba(201,168,76,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", color: "var(--gold)", fontWeight: 400 }}>{property.agent.initials}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.05rem", color: "#fff" }}>{property.agent.name}</p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "0.2rem" }}>{property.agent.title}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: "1.75rem" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  {[{ label: "Phone", val: property.agent.phone }, { label: "Email", val: property.agent.email }].map(({ label, val }) => (
                    <div key={label} style={{ marginBottom: "0.85rem", paddingBottom: "0.85rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "rgba(210,220,232,0.45)", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "0.2rem" }}>{label}</span>
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(210,220,232,0.82)" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollToTab("amenities")}
                  style={{ display: "block", width: "100%", padding: "0.9rem", background: "var(--gold)", border: "1px solid var(--gold)", color: "#fff", textAlign: "center", fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", borderRadius: "6px", transition: "background 0.25s" }}
                  onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#B8962A"; }}
                  onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)"; }}
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────────── */}
      <section id="gallery" aria-labelledby="gallery-heading" style={{ padding: "5rem clamp(1.5rem, 6vw, 5rem)", background: "var(--bg-section)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <p className="section-label">Gallery</p>
            <div className="divider-gold" />
            <h2 id="gallery-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff", fontWeight: 400 }}>Property Gallery</h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "rgba(210,220,232,0.45)", marginTop: "0.5rem" }}>Click any image to view full screen</p>
          </div>

          {/* Masonry grid */}
          <div className="masonry-gallery">
            {property.images.map((img, idx) => (
              <div
                key={idx}
                className="masonry-item"
                onClick={() => setLightboxIdx(idx)}
                role="button"
                aria-label={`View ${img.label || "photo"} full screen`}
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && setLightboxIdx(idx)}
              >
                <div style={{ position: "relative", paddingBottom: "72%", overflow: "hidden" }}>
                  <Image
                    src={img.url}
                    alt={img.label || property.title}
                    fill
                    sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                  />
                  {/* Label overlay */}
                  <div className="masonry-label" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 50%)", display: "flex", alignItems: "flex-end", padding: "0.85rem 1rem", opacity: 0, transition: "opacity 0.3s ease" }}>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", color: "#fff", letterSpacing: "0.1em" }}>{img.label}</span>
                  </div>
                  {/* Expand icon */}
                  <div className="masonry-expand" style={{ position: "absolute", top: "0.75rem", right: "0.75rem", width: "30px", height: "30px", background: "rgba(0,0,0,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s ease" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"><path d="M7.5 1.5h3v3M4.5 10.5h-3v-3M1.5 1.5l3 3M10.5 10.5l-3-3"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightboxIdx !== null && property.images.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(6,8,12,0.95)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setLightboxIdx(null)}
        >
          <div style={{ position: "relative", width: "min(90vw, 960px)", height: "min(80vh, 640px)", borderRadius: "12px", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <Image
              src={property.images[lightboxIdx].url}
              alt={property.images[lightboxIdx].label || property.title}
              fill
              style={{ objectFit: "contain" }}
              sizes="90vw"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
            <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: "8px", padding: "0.5rem 0.85rem" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", color: "#fff", letterSpacing: "0.12em" }}>{property.images[lightboxIdx].label}</span>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "rgba(255,255,255,0.55)", marginTop: "0.2rem" }}>{lightboxIdx + 1} / {property.images.length}</p>
            </div>
          </div>

          {/* Controls */}
          <button onClick={() => setLightboxIdx(null)} aria-label="Close preview" style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", transition: "background 0.2s" }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
            onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/></svg>
          </button>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => i === null ? null : (i - 1 + property.images.length) % property.images.length); }} aria-label="Previous image" style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", transition: "background 0.2s" }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
            onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L6 8l4 5"/></svg>
          </button>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => i === null ? null : (i + 1) % property.images.length); }} aria-label="Next image" style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", transition: "background 0.2s" }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
            onMouseOut={e  => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l4 5-4 5"/></svg>
          </button>
        </div>
      )}

      {/* ── Floor Plan ───────────────────────────────────────────────────────── */}
      <FloorPlanSection />

      {/* ── Life Amenities ────────────────────────────────────────────────────── */}
      <section id="amenities" aria-labelledby="amenities-heading" style={{ padding: "5rem clamp(1.5rem, 6vw, 5rem)", background: "var(--bg-base)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <p className="section-label">Lifestyle</p>
            <div className="divider-gold" />
            <h2 id="amenities-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#fff", fontWeight: 400 }}>Life Amenities</h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "rgba(210,220,232,0.45)", marginTop: "0.5rem" }}>Tap any card to learn more</p>
          </div>

          {/* Cards viewport */}
          <div style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "1.25rem", transform: `translateX(calc(-${amenityPage * 100}% - ${amenityPage * 1.25}rem))`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              {AMENITY_CARDS.map(card => (
                <AmenityFlipCard key={card.id} card={card} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "2.5rem" }}>
            <button
              onClick={() => setAmenityPage(p => Math.max(0, p - 1))}
              disabled={amenityPage === 0}
              aria-label="Previous amenities"
              style={{ width: "40px", height: "40px", borderRadius: "50%", background: "none", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", cursor: amenityPage === 0 ? "default" : "pointer", color: amenityPage === 0 ? "rgba(255,255,255,0.2)" : "rgba(210,220,232,0.7)", transition: "border-color 0.2s, color 0.2s" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3L5 7l4 4"/></svg>
            </button>
            <div style={{ display: "flex", gap: "6px" }}>
              {Array.from({ length: totalAmenityPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAmenityPage(i)}
                  aria-label={`Page ${i + 1}`}
                  style={{ width: i === amenityPage ? "24px" : "8px", height: "8px", borderRadius: "100px", background: i === amenityPage ? "var(--gold)" : "rgba(201,168,76,0.3)", border: "none", cursor: "pointer", transition: "all 0.3s ease" }}
                />
              ))}
            </div>
            <button
              onClick={() => setAmenityPage(p => Math.min(totalAmenityPages - 1, p + 1))}
              disabled={amenityPage === totalAmenityPages - 1}
              aria-label="Next amenities"
              style={{ width: "40px", height: "40px", borderRadius: "50%", background: "none", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", cursor: amenityPage === totalAmenityPages - 1 ? "default" : "pointer", color: amenityPage === totalAmenityPages - 1 ? "rgba(255,255,255,0.2)" : "rgba(210,220,232,0.7)", transition: "border-color 0.2s, color 0.2s" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l4 4-4 4"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────────────────────── */}
      <MapSection lat={property.lat} lng={property.lng} address={property.address} />

      {/* ── Enquiry ──────────────────────────────────────────────────────────── */}
      <EnquirySection propertyTitle={property.title} agent={property.agent} />

      <Footer />

      <style>{`
        /* Masonry gallery */
        .masonry-gallery {
          columns: 3 280px;
          column-gap: 12px;
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 12px;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .masonry-item:hover {
          transform: scale(1.015);
        }
        .masonry-item:hover .masonry-label,
        .masonry-item:hover .masonry-expand {
          opacity: 1 !important;
        }

        /* Floor plan fade transition */
        @keyframes planFadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(6px); }
        }
        @keyframes planFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .plan-flip-out {
          animation: planFadeOut 0.25s ease forwards;
        }
        .plan-flip-in {
          animation: planFadeIn 0.35s ease forwards;
        }

        /* Overview responsive */
        @media (max-width: 900px) {
          #overview > div > div { grid-template-columns: 1fr !important; }
          #overview > div > div > div:last-child { position: static !important; }
        }

        /* Enquiry grid responsive */
        @media (max-width: 780px) {
          section[aria-labelledby="detail-enquiry-heading"] > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }

        /* Amenity cards — prevent overflow on mobile */
        @media (max-width: 700px) {
          .masonry-gallery { columns: 2 180px; }
        }
        @media (max-width: 480px) {
          .masonry-gallery { columns: 1; }
        }
      `}</style>
    </div>
  );
}
