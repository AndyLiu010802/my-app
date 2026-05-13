"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
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

// ─── Hover Logo Overlay ────────────────────────────────────────────────────────
function LogoOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(1.5px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.38s ease",
      }}
    >
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        transform: visible ? "scale(1)" : "scale(0.85)",
        transition: "transform 0.42s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", fontWeight: 600, color: "#fff", letterSpacing: "0.12em", lineHeight: 1 }}>LOREM</span>
        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.52rem", fontWeight: 400, color: "var(--gold)", letterSpacing: "0.42em", textTransform: "uppercase", lineHeight: 1 }}>IPSUM</span>
      </div>
    </div>
  );
}

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
        <LogoOverlay visible={hovered} />

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

// ─── Featured Image Card ───────────────────────────────────────────────────────
function FeaturedCard({ p, height, signature = false }: { p: Property; height: number; signature?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", height, borderRadius: "16px",
        overflow: "hidden", background: p.gradient, cursor: "pointer",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.25s, transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.6)" : "0 6px 24px rgba(0,0,0,0.35)",
      }}
    >
      {/* Architectural grid */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.022) 79px,rgba(255,255,255,0.022) 80px),repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(255,255,255,0.022) 59px,rgba(255,255,255,0.022) 60px)" }} />
      {/* Subtle light source */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
      {/* Zoom layer */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: p.gradient, opacity: 0.5, mixBlendMode: "multiply", transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)" }} />
      {/* Text legibility overlay */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.8) 100%)" }} />
      <LogoOverlay visible={hovered} />

      {/* Top-left brand badge */}
      <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
        <div style={{ background: "rgba(13,17,23,0.72)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "0.28rem 0.65rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.15em", textTransform: "uppercase" }}>South Property</span>
          {signature && (
            <>
              <span aria-hidden="true" style={{ width: "2px", height: "2px", borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Signature</span>
            </>
          )}
        </div>
      </div>

      {/* Top-right status */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <span style={{ display: "inline-block", background: p.status === "For Sale" ? "var(--gold)" : "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", borderRadius: "2px", color: "#fff", fontSize: "0.48rem", fontFamily: "var(--font-inter)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.26rem 0.6rem" }}>
          {p.status}
        </span>
      </div>

      {/* Bottom info panel */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: signature ? "1.4rem 1.5rem" : "1rem 1.2rem", background: "rgba(10,14,20,0.72)", backdropFilter: "blur(14px)", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "rgba(255,255,255,0.42)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{p.type}</span>
          <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.5rem" }}>·</span>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "rgba(255,255,255,0.42)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{p.sqm} m²</span>
        </div>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: signature ? "1.35rem" : "1.05rem", fontWeight: 400, color: "var(--gold)", letterSpacing: "0.01em", marginBottom: "0.3rem", lineHeight: 1 }}>{p.price}</p>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{p.address}, {p.suburb}</p>
      </div>
    </div>
  );
}

// ─── Featured Listings Section ─────────────────────────────────────────────────
function FeaturedSection({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  return (
    <section ref={ref} aria-labelledby="featured-heading" style={{ padding: "0 clamp(1.5rem, 6vw, 5rem) 7rem", position: "relative", overflow: "hidden" }}>
      {/* Decorative rings */}
      <div aria-hidden="true" style={{ position: "absolute", top: "-100px", left: "10%", width: "540px", height: "540px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.035)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: "80px", right: "6%", width: "360px", height: "360px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.025)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Divider */}
        <div aria-hidden="true" style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)", marginBottom: "5rem" }} />

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: reducedMotion ? "none" : "opacity 0.8s ease, transform 0.8s ease" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>South Property</p>
            <div aria-hidden="true" style={{ width: "2rem", height: "1px", background: "var(--gold)", opacity: 0.5, marginBottom: "1.25rem" }} />
            <h2 id="featured-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1 }}>
              Signature<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Listings</em>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem", opacity: inView ? 1 : 0, transition: reducedMotion ? "none" : "opacity 0.8s ease 0.2s" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.72rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: "280px", textAlign: "right" }}>
              Handpicked prestige residences in Melbourne's most sought-after addresses.
            </p>
            <Link
              href="/signature"
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "100px", padding: "0.65rem 1.5rem", color: "var(--gold)", fontFamily: "var(--font-inter)", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.25s, border-color 0.25s" }}
              onMouseOver={(e) => { const el = e.currentTarget; el.style.background = "rgba(201,168,76,0.16)"; el.style.borderColor = "var(--gold)"; }}
              onMouseOut={(e)  => { const el = e.currentTarget; el.style.background = "rgba(201,168,76,0.08)"; el.style.borderColor = "rgba(201,168,76,0.3)"; }}
            >
              View All Listings
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7H12M8 3L12 7L8 11"/></svg>
            </Link>
          </div>
        </div>

        {/* Asymmetric cards grid */}
        <div className="featured-grid">
          <div className="featured-left" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: reducedMotion ? "none" : "opacity 0.75s ease 0.12s, transform 0.75s ease 0.12s" }}>
            <FeaturedCard p={PROPERTIES[0]} height={300} />
          </div>
          <div className="featured-center" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: reducedMotion ? "none" : "opacity 0.75s ease 0.04s, transform 0.75s ease 0.04s" }}>
            <FeaturedCard p={PROPERTIES[4]} height={500} signature />
          </div>
          <div className="featured-right" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: reducedMotion ? "none" : "opacity 0.75s ease 0.2s, transform 0.75s ease 0.2s" }}>
            <FeaturedCard p={PROPERTIES[6]} height={300} />
          </div>
        </div>

        {/* Bottom nav row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", flexWrap: "wrap", gap: "1rem", opacity: inView ? 1 : 0, transition: reducedMotion ? "none" : "opacity 0.8s ease 0.35s" }}>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {[{ label: "Previous featured listing", d: "M8 4L4 8L8 12" }, { label: "Next featured listing", d: "M4 4L8 8L4 12" }].map(({ label, d }) => (
              <button key={label} aria-label={label} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "transparent", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.45)", cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
                onMouseOver={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
                onMouseOut={(e)  => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.14)"; el.style.color = "rgba(255,255,255,0.45)"; }}>
                <svg aria-hidden="true" width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
              </button>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.15em" }}>3 of {PROPERTIES.length} Featured</p>
        </div>
      </div>
    </section>
  );
}

// ─── Buy Enquiry Section ───────────────────────────────────────────────────────
type BuyFormData = { name: string; email: string; phone: string; interest: string; message: string };

function BuyEnquirySection({ reducedMotion }: { reducedMotion: boolean }) {
  const [form, setForm] = useState<BuyFormData>({ name: "", email: "", phone: "", interest: "", message: "" });
  const [errors, setErrors] = useState<Partial<BuyFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(reducedMotion);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (submitted && successRef.current) successRef.current.focus();
  }, [submitted]);

  const update = (field: keyof BuyFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((err) => { const c = { ...err }; delete c[field]; return c; });
    };

  const validate = (): Partial<BuyFormData> => {
    const errs: Partial<BuyFormData> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const inputBase: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", color: "#fff",
    fontFamily: "var(--font-inter)", fontSize: "0.75rem",
    padding: "0.85rem 1rem", outline: "none",
    transition: "border-color 0.2s", borderRadius: 0,
  };
  const labelBase: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-inter)", fontSize: "0.52rem",
    letterSpacing: "0.2em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem",
  };
  const onFocusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; };
  const onFocusOut = (hasErr: boolean) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    { e.currentTarget.style.borderColor = hasErr ? "rgba(220,80,80,0.5)" : "rgba(255,255,255,0.1)"; };

  return (
    <section ref={ref} aria-labelledby="buy-enquiry-heading" style={{ padding: "0 clamp(1.5rem, 6vw, 5rem) 7rem", position: "relative", overflow: "hidden" }}>
      {/* Decorative rings */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: "-40px", right: "4%", width: "420px", height: "420px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.035)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: "5%", left: "-4%", width: "300px", height: "300px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.025)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Divider */}
        <div aria-hidden="true" style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)", marginBottom: "5rem" }} />

        <div className="buy-enquiry-grid">
          {/* Left: info panel */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: reducedMotion ? "none" : "opacity 0.8s ease, transform 0.8s ease" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>Get in Touch</p>
            <div aria-hidden="true" style={{ width: "2rem", height: "1px", background: "var(--gold)", opacity: 0.5, marginBottom: "1.5rem" }} />
            <h2 id="buy-enquiry-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Enquire About<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>a Property</em>
            </h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: "340px" }}>
              Our experienced agents are ready to guide you through every step of your property journey. Reach out today.
            </p>
            {[
              { label: "Phone", value: "+61 3 9000 0000" },
              { label: "Email", value: "enquiries@southproperty.com.au" },
              { label: "Office", value: "Level 12, 200 Collins Street, Melbourne VIC 3000" },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ ...labelBase, marginBottom: "0.35rem" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.5 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Right: form card */}
          <div style={{ background: "rgba(20,25,32,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "clamp(1.75rem, 4vw, 2.75rem)", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: reducedMotion ? "none" : "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
                <div aria-hidden="true" style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "var(--gold)" }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11l5 5 9-9"/></svg>
                </div>
                <h3 ref={successRef} tabIndex={-1} style={{ fontFamily: "var(--font-playfair)", fontSize: "1.7rem", color: "#fff", marginBottom: "0.75rem", outline: "none" }}>Thank You</h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>
                  Your enquiry has been received. One of our agents will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-labelledby="buy-enquiry-heading">
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.52rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.75rem" }}>Property Enquiry</p>

                {/* Name + Email */}
                <div className="form-row" style={{ marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="enq-name" style={labelBase}>Full Name <span aria-hidden="true" style={{ color: "var(--gold)" }}>*</span></label>
                    <input id="enq-name" type="text" value={form.name} onChange={update("name")} aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "enq-name-err" : undefined} style={{ ...inputBase, borderColor: errors.name ? "rgba(220,80,80,0.5)" : undefined }} onFocus={onFocusIn} onBlur={onFocusOut(!!errors.name)} />
                    {errors.name && <span id="enq-name-err" role="alert" style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "rgba(220,80,80,0.9)", marginTop: "0.35rem" }}>{errors.name}</span>}
                  </div>
                  <div>
                    <label htmlFor="enq-email" style={labelBase}>Email <span aria-hidden="true" style={{ color: "var(--gold)" }}>*</span></label>
                    <input id="enq-email" type="email" value={form.email} onChange={update("email")} aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "enq-email-err" : undefined} style={{ ...inputBase, borderColor: errors.email ? "rgba(220,80,80,0.5)" : undefined }} onFocus={onFocusIn} onBlur={onFocusOut(!!errors.email)} />
                    {errors.email && <span id="enq-email-err" role="alert" style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "rgba(220,80,80,0.9)", marginTop: "0.35rem" }}>{errors.email}</span>}
                  </div>
                </div>

                {/* Phone + Interest */}
                <div className="form-row" style={{ marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="enq-phone" style={labelBase}>Phone</label>
                    <input id="enq-phone" type="tel" value={form.phone} onChange={update("phone")} style={inputBase} onFocus={onFocusIn} onBlur={onFocusOut(false)} />
                  </div>
                  <div>
                    <label htmlFor="enq-interest" style={labelBase}>Property Type</label>
                    <div style={{ position: "relative" }}>
                      <select id="enq-interest" value={form.interest} onChange={update("interest")} style={{ ...inputBase, appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: "2.5rem" }} onFocus={onFocusIn} onBlur={onFocusOut(false)}>
                        <option value="">Any type…</option>
                        <option>House</option>
                        <option>Apartment</option>
                        <option>Townhouse</option>
                        <option>Land</option>
                      </select>
                      <div style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)" }}><ChevronIcon /></div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label htmlFor="enq-message" style={labelBase}>Message <span aria-hidden="true" style={{ color: "var(--gold)" }}>*</span></label>
                  <textarea id="enq-message" value={form.message} onChange={update("message")} rows={4} aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message ? "enq-message-err" : undefined} style={{ ...inputBase, resize: "vertical", minHeight: "100px", borderColor: errors.message ? "rgba(220,80,80,0.5)" : undefined }} onFocus={onFocusIn} onBlur={onFocusOut(!!errors.message)} />
                  {errors.message && <span id="enq-message-err" role="alert" style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "rgba(220,80,80,0.9)", marginTop: "0.35rem" }}>{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  style={{ width: "100%", padding: "1rem", background: "var(--gold)", border: "1px solid var(--gold)", color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.25s" }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#B8962A"; }}
                  onMouseOut={(e)  => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)"; }}
                >
                  Submit Enquiry
                </button>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.52rem", color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
                  By submitting, you agree to our Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
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

      <FeaturedSection reducedMotion={rm} />
      <BuyEnquirySection reducedMotion={rm} />

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
        /* Featured section grid */
        .featured-grid {
          display: grid;
          grid-template-columns: 1fr 1.65fr 1fr;
          gap: 1rem;
          align-items: start;
        }
        .featured-left  { margin-top: 2.5rem; }
        .featured-right { margin-top: 5rem; }
        @media (max-width: 900px) {
          .featured-grid { grid-template-columns: 1fr 1fr; }
          .featured-right { display: none; }
          .featured-left { margin-top: 0; }
        }
        @media (max-width: 580px) {
          .featured-grid { grid-template-columns: 1fr; }
          .featured-center div[style*="height: 500"] { height: 360px !important; }
        }
        /* Enquiry section grid */
        .buy-enquiry-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: clamp(3rem, 6vw, 6rem);
          align-items: start;
        }
        @media (max-width: 860px) {
          .buy-enquiry-grid { grid-template-columns: 1fr; }
        }
        /* Form two-column row */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 560px) {
          .form-row { grid-template-columns: 1fr; }
        }
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
