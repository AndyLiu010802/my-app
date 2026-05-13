"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

type PropType = "All" | "House" | "Apartment" | "Townhouse" | "Land";
type PriceKey = "Any" | "sub1m" | "1m2m" | "2m5m" | "5mplus";

interface Property {
  id: number;
  title: string;
  address: string;
  suburb: string;
  price: string;
  priceNum: number;
  beds: number;
  baths: number;
  parking: number;
  sqm: number;
  type: Exclude<PropType, "All">;
  status: "For Sale" | "Under Offer";
  gradient: string;
  tag?: string;
}

const PROPERTIES: Property[] = [
  {
    id: 1, title: "The Langham Penthouse", address: "3801/1 Queensbridge Square", suburb: "Southbank",
    price: "$4,200,000", priceNum: 4200000, beds: 4, baths: 3, parking: 2, sqm: 285,
    type: "Apartment", status: "For Sale",
    gradient: "linear-gradient(155deg,#0a1628 0%,#142744 50%,#0d1f38 100%)", tag: "Penthouse",
  },
  {
    id: 2, title: "St Kilda Beachfront Villa", address: "88 Fitzroy Street", suburb: "St Kilda",
    price: "$3,850,000", priceNum: 3850000, beds: 5, baths: 4, parking: 3, sqm: 420,
    type: "House", status: "For Sale",
    gradient: "linear-gradient(155deg,#081c2a 0%,#0f2e42 50%,#0a1e2e 100%)",
  },
  {
    id: 3, title: "Armadale Garden Residence", address: "24 Kooyong Road", suburb: "Armadale",
    price: "$2,950,000", priceNum: 2950000, beds: 4, baths: 3, parking: 2, sqm: 380,
    type: "House", status: "Under Offer",
    gradient: "linear-gradient(155deg,#0c1e12 0%,#163320 50%,#0e2016 100%)",
  },
  {
    id: 4, title: "Port Melbourne Waterfront", address: "1/105 Beach Street", suburb: "Port Melbourne",
    price: "$1,890,000", priceNum: 1890000, beds: 3, baths: 2, parking: 2, sqm: 195,
    type: "Apartment", status: "For Sale",
    gradient: "linear-gradient(155deg,#0e1c28 0%,#183040 50%,#101e2c 100%)",
  },
  {
    id: 5, title: "Toorak Manor Estate", address: "15 Albany Road", suburb: "Toorak",
    price: "$8,500,000", priceNum: 8500000, beds: 6, baths: 5, parking: 4, sqm: 680,
    type: "House", status: "For Sale",
    gradient: "linear-gradient(155deg,#1c0e0a 0%,#301a10 50%,#201210 100%)", tag: "Prestige",
  },
  {
    id: 6, title: "South Yarra Sky Residence", address: "4201/200 Spencer Street", suburb: "South Yarra",
    price: "$2,100,000", priceNum: 2100000, beds: 3, baths: 2, parking: 1, sqm: 210,
    type: "Apartment", status: "For Sale",
    gradient: "linear-gradient(155deg,#10121e 0%,#1c2038 50%,#121428 100%)",
  },
  {
    id: 7, title: "Brighton Coastal Retreat", address: "7 Middle Crescent", suburb: "Brighton",
    price: "$5,750,000", priceNum: 5750000, beds: 5, baths: 4, parking: 3, sqm: 560,
    type: "House", status: "For Sale",
    gradient: "linear-gradient(155deg,#0a1820 0%,#12283a 50%,#0c1e2c 100%)",
  },
  {
    id: 8, title: "Prahran Terrace Collection", address: "3/88 Greville Street", suburb: "Prahran",
    price: "$1,350,000", priceNum: 1350000, beds: 2, baths: 2, parking: 1, sqm: 155,
    type: "Townhouse", status: "For Sale",
    gradient: "linear-gradient(155deg,#1c1408 0%,#2e200e 50%,#201a0c 100%)",
  },
  {
    id: 9, title: "Malvern Grand Estate", address: "6 Staniland Grove", suburb: "Malvern",
    price: "$6,200,000", priceNum: 6200000, beds: 5, baths: 4, parking: 3, sqm: 620,
    type: "House", status: "Under Offer",
    gradient: "linear-gradient(155deg,#101418 0%,#1c2430 50%,#121820 100%)", tag: "Grand",
  },
];

const PRICE_RANGES: { key: PriceKey; label: string }[] = [
  { key: "Any", label: "Any Price" },
  { key: "sub1m", label: "Under $1M" },
  { key: "1m2m", label: "$1M – $2M" },
  { key: "2m5m", label: "$2M – $5M" },
  { key: "5mplus", label: "$5M+" },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const BedIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8"/>
    <path d="M2 12V8a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v4"/>
  </svg>
);
const BathIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6a2 2 0 012-2 2 2 0 012 2v2H9V6z"/><path d="M3 11h18v2a6 6 0 01-6 6H9a6 6 0 01-6-6v-2z"/>
    <path d="M5 19v2M19 19v2"/>
  </svg>
);
const CarIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>
  </svg>
);
const SqmIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
  </svg>
);
const SearchIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const ChevronIcon = () => (
  <svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 4l4 4 4-4"/>
  </svg>
);

// ─── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({ p, index, reducedMotion }: { p: Property; index: number; reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(reducedMotion);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const delay = reducedMotion ? 0 : index * 0.07;

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#141920",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.06)"}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: reducedMotion
          ? "border-color 0.2s"
          : `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s, border-color 0.25s`,
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", height: "220px", background: p.gradient, overflow: "hidden" }} aria-hidden="true">
        {/* Architectural grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, transparent 55%), " +
            "repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.025) 79px, rgba(255,255,255,0.025) 80px), " +
            "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.025) 59px, rgba(255,255,255,0.025) 60px)",
        }} />
        {/* Subtle light source */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
        {/* Image hover zoom */}
        <div style={{
          position: "absolute", inset: 0, background: p.gradient,
          transform: hovered && !reducedMotion ? "scale(1.04)" : "scale(1)",
          transition: reducedMotion ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          mixBlendMode: "multiply",
          opacity: 0.5,
        }} />

        {/* Status badge */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
          <span style={{
            display: "inline-block",
            background: p.status === "For Sale" ? "var(--gold)" : "rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            fontSize: "0.52rem",
            fontFamily: "var(--font-inter)",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "0.32rem 0.75rem",
          }}>
            {p.status}
          </span>
        </div>

        {/* Prestige tag */}
        {p.tag && (
          <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(6,8,12,0.6)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(201,168,76,0.45)",
              color: "var(--gold)",
              fontSize: "0.48rem",
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "0.28rem 0.65rem",
            }}>
              {p.tag}
            </span>
          </div>
        )}

        {/* Property type label */}
        <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.52rem", fontFamily: "var(--font-inter)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {p.type}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "1.5rem 1.6rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.45rem", fontWeight: 400, color: "var(--gold)", letterSpacing: "0.01em", marginBottom: "0.45rem", lineHeight: 1 }}>
          {p.price}
        </p>
        <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "0.95rem", fontWeight: 400, color: "#fff", letterSpacing: "0.02em", marginBottom: "0.35rem", lineHeight: 1.45 }}>
          {p.title}
        </h3>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "rgba(255,255,255,0.42)", marginBottom: "1.1rem", lineHeight: 1.5 }}>
          {p.address}, {p.suburb} VIC
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.9rem", marginTop: "auto", gap: "0" }}>
          {[
            { Icon: BedIcon, value: p.beds, label: "Beds" },
            { Icon: BathIcon, value: p.baths, label: "Baths" },
            { Icon: CarIcon, value: p.parking, label: "Car" },
            { Icon: SqmIcon, value: p.sqm, label: "m²" },
          ].map(({ Icon, value, label }, si) => (
            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", borderRight: si < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ color: "rgba(255,255,255,0.35)" }}><Icon /></div>
              <span style={{ fontFamily: "var(--font-playfair)", fontSize: "0.95rem", color: "#fff", fontWeight: 400 }}>{value}</span>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="card-cta"
          style={{
            marginTop: "1.2rem", width: "100%", padding: "0.75rem",
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)",
            fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.24em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "background 0.25s, border-color 0.25s, color 0.25s",
          }}
          aria-label={`View details for ${p.title}`}
        >
          View Property
        </button>
      </div>
    </article>
  );
}

// ─── Select wrapper ────────────────────────────────────────────────────────────
function FilterSelect({ id, label, value, onChange, children }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", flex: "1 1 140px", minWidth: "120px" }}>
      <label htmlFor={id} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", appearance: "none", WebkitAppearance: "none",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          color: value !== "All" && value !== "Any" && value !== "0" ? "var(--gold)" : "rgba(255,255,255,0.7)",
          fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "0.8rem 2.2rem 0.8rem 1rem", cursor: "pointer",
          transition: "border-color 0.2s, color 0.2s",
          outline: "none",
        }}
      >
        {children}
      </select>
      <div style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.35)" }}>
        <ChevronIcon />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function BuyPageClient() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PropType>("All");
  const [minBeds, setMinBeds] = useState("0");
  const [priceKey, setPriceKey] = useState<PriceKey>("Any");
  const [visibleCount, setVisibleCount] = useState(6);
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Hero entrance
    const t = setTimeout(() => setHeroVisible(true), 80);

    // Parallax
    if (!reducedMotion.current) {
      const onScroll = () => {
        const bg = heroBgRef.current;
        if (!bg) return;
        const progress = window.scrollY / window.innerHeight;
        bg.style.transform = `translateY(${progress * 25}%) scale(1.05)`;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
    }
    return () => clearTimeout(t);
  }, []);

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(6); }, [query, typeFilter, minBeds, priceKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROPERTIES.filter((p) => {
      if (q && !p.suburb.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q) && !p.title.toLowerCase().includes(q)) return false;
      if (typeFilter !== "All" && p.type !== typeFilter) return false;
      if (minBeds !== "0" && p.beds < parseInt(minBeds)) return false;
      if (priceKey === "sub1m" && p.priceNum >= 1_000_000) return false;
      if (priceKey === "1m2m" && (p.priceNum < 1_000_000 || p.priceNum >= 2_000_000)) return false;
      if (priceKey === "2m5m" && (p.priceNum < 2_000_000 || p.priceNum >= 5_000_000)) return false;
      if (priceKey === "5mplus" && p.priceNum < 5_000_000) return false;
      return true;
    });
  }, [query, typeFilter, minBeds, priceKey]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const activeFilters = [typeFilter !== "All", minBeds !== "0", priceKey !== "Any"].filter(Boolean).length;
  const rm = reducedMotion.current;

  const clearFilters = () => { setQuery(""); setTypeFilter("All"); setMinBeds("0"); setPriceKey("Any"); };

  return (
    <div style={{ background: "#0D1117", minHeight: "100vh", color: "#fff" }}>
      <Navigation />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        aria-labelledby="buy-hero-heading"
        style={{ position: "relative", height: "100vh", minHeight: "600px", maxHeight: "900px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
      >
        {/* Background layers */}
        <div
          ref={heroBgRef}
          aria-hidden="true"
          style={{
            position: "absolute", inset: "-5%",
            background:
              "radial-gradient(ellipse at 65% 25%, rgba(25,55,90,0.55) 0%, transparent 55%), " +
              "radial-gradient(ellipse at 20% 70%, rgba(15,35,60,0.4) 0%, transparent 45%), " +
              "linear-gradient(160deg, #0a1520 0%, #162a42 25%, #0f1e30 55%, #182840 80%, #0b1a28 100%)",
            transform: "scale(1.05)",
          }}
        />
        {/* Grid lines */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 99px, rgba(255,255,255,0.022) 99px, rgba(255,255,255,0.022) 100px), " +
            "repeating-linear-gradient(0deg, transparent, transparent 99px, rgba(255,255,255,0.022) 99px, rgba(255,255,255,0.022) 100px)",
        }} />
        {/* Gradient overlay for text legibility */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(6,8,12,0.25) 0%, rgba(6,8,12,0.1) 40%, rgba(6,8,12,0.75) 75%, rgba(6,8,12,0.97) 100%)",
        }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 1, padding: "0 clamp(1.5rem, 6vw, 5rem) 5rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(16px)",
              transition: rm ? "none" : "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)" }}>South Property</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(201,168,76,0.5), transparent)", maxWidth: "80px" }} aria-hidden="true" />
          </div>

          {/* Main heading */}
          <h1
            id="buy-hero-heading"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
              marginBottom: "1.25rem",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(20px)",
              transition: rm ? "none" : "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
            }}
          >
            Properties<br />
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>For Sale</em>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)",
              color: "rgba(255,255,255,0.55)",
              maxWidth: "480px",
              lineHeight: 1.75,
              marginBottom: "2.5rem",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(16px)",
              transition: rm ? "none" : "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
            }}
          >
            Discover Melbourne's finest residences — from beachfront villas to prestige penthouses in the city's most coveted suburbs.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", flexWrap: "wrap",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(12px)",
              transition: rm ? "none" : "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s",
            }}
          >
            {[
              { value: "48", label: "Active Listings" },
              { value: "12", label: "Sold This Month" },
              { value: "$4.2M", label: "Avg. Sale Price" },
              { value: "16", label: "Suburbs" },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#fff", fontWeight: 400, lineHeight: 1 }}>{value}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", bottom: "2.5rem", right: "clamp(1.5rem, 5vw, 4rem)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
            opacity: heroVisible ? 0.45 : 0, transition: rm ? "none" : "opacity 1s ease 0.6s",
          }}
        >
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#fff", writingMode: "vertical-rl" }}>Scroll</span>
          <div style={{
            width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)",
            animation: rm ? "none" : "scrollPulse 2s ease-in-out infinite",
          }} />
        </div>
      </section>

      {/* ── Search / Filter bar ───────────────────────────────────────────── */}
      <section aria-label="Property search filters" style={{ background: "#0D1117", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.75rem clamp(1.5rem, 6vw, 5rem)", position: "sticky", top: "5rem", zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>

            {/* Search input */}
            <div style={{ position: "relative", flex: "2 1 220px", minWidth: "180px" }}>
              <label htmlFor="buy-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>Search suburb or address</label>
              <div style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }}>
                <SearchIcon />
              </div>
              <input
                id="buy-search"
                type="search"
                placeholder="Suburb, address or title…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.72rem",
                  padding: "0.8rem 1rem 0.8rem 2.6rem",
                  outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>

            {/* Type */}
            <FilterSelect id="type-filter" label="Property type" value={typeFilter} onChange={(v) => setTypeFilter(v as PropType)}>
              <option value="All">All Types</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Land">Land</option>
            </FilterSelect>

            {/* Beds */}
            <FilterSelect id="beds-filter" label="Minimum bedrooms" value={minBeds} onChange={setMinBeds}>
              <option value="0">Any Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </FilterSelect>

            {/* Price */}
            <FilterSelect id="price-filter" label="Price range" value={priceKey} onChange={(v) => setPriceKey(v as PriceKey)}>
              {PRICE_RANGES.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </FilterSelect>

            {/* Clear */}
            {(query || activeFilters > 0) && (
              <button
                onClick={clearFilters}
                style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-inter)",
                  fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  padding: "0.8rem 1.25rem", cursor: "pointer", whiteSpace: "nowrap",
                  transition: "border-color 0.2s, color 0.2s", flexShrink: 0,
                }}
                onMouseOver={(e) => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.3)"; el.style.color = "#fff"; }}
                onMouseOut={(e)  => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.color = "rgba(255,255,255,0.5)"; }}
              >
                Clear {activeFilters > 0 ? `(${activeFilters})` : ""}
              </button>
            )}
          </div>

          {/* Results count — aria-live for screen readers */}
          <div aria-live="polite" aria-atomic="true" style={{ marginTop: "0.9rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.62rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
              Showing <strong style={{ color: "var(--gold)", fontWeight: 500 }}>{filtered.length}</strong> {filtered.length === 1 ? "property" : "properties"}
              {(query || activeFilters > 0) && " matching your criteria"}
            </span>
            {activeFilters > 0 && (
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {typeFilter !== "All" && <span style={chipStyle}>{typeFilter}</span>}
                {minBeds !== "0" && <span style={chipStyle}>{minBeds}+ Beds</span>}
                {priceKey !== "Any" && <span style={chipStyle}>{PRICE_RANGES.find(r => r.key === priceKey)?.label}</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Property grid ─────────────────────────────────────────────────── */}
      <section aria-label="Property listings" style={{ padding: "4rem clamp(1.5rem, 6vw, 5rem) 6rem", maxWidth: "1400px", margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <div role="status" style={{ textAlign: "center", padding: "6rem 0" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>No properties found</p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", marginBottom: "2rem" }}>Try adjusting your search filters</p>
            <button onClick={clearFilters} style={{ ...goldBtnStyle }}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="buy-grid">
              {visible.map((p, i) => (
                <PropertyCard key={p.id} p={p} index={i} reducedMotion={rm} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", marginBottom: "1.25rem" }}>
                  Showing {visible.length} of {filtered.length}
                </p>
                <button
                  onClick={() => setVisibleCount((v) => v + 6)}
                  style={{ ...goldBtnStyle }}
                >
                  Load More Properties
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />

      <style>{`
        .buy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1100px) {
          .buy-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .buy-grid { grid-template-columns: 1fr; }
        }
        .card-cta:hover {
          background: var(--gold) !important;
          border-color: var(--gold) !important;
          color: #fff !important;
        }
        select:focus {
          outline: 2px solid rgba(201,168,76,0.5);
          outline-offset: 2px;
        }
        input[type="search"]::-webkit-search-cancel-button { cursor: pointer; }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.6; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(0.85); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: color 0.2s, border-color 0.2s, background 0.2s !important; }
        }
      `}</style>
    </div>
  );
}

const chipStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)",
  fontSize: "0.52rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--gold)",
  background: "rgba(201,168,76,0.08)",
  border: "1px solid rgba(201,168,76,0.2)",
  padding: "0.2rem 0.6rem",
};

const goldBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--gold)",
  color: "var(--gold)",
  fontFamily: "var(--font-inter)",
  fontSize: "0.62rem",
  fontWeight: 500,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  padding: "0.9rem 2.5rem",
  cursor: "pointer",
  transition: "background 0.25s, color 0.25s",
};
