"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import Footer from "./Footer";

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
  type: "House" | "Apartment" | "Townhouse" | "Land";
  status: "For Sale" | "Under Offer";
  gradient: string;
  tag?: string;
}

const PROPERTIES: Property[] = [
  { id: 1,  title: "The Langham Penthouse",       address: "3801/1 Queensbridge Square", suburb: "Southbank",      price: "$4,200,000", priceNum: 4200000, beds: 4, baths: 3, parking: 2, sqm: 285, type: "Apartment", status: "For Sale",     gradient: "linear-gradient(155deg,#0a1628 0%,#142744 50%,#0d1f38 100%)", tag: "Penthouse" },
  { id: 2,  title: "St Kilda Beachfront Villa",   address: "88 Fitzroy Street",          suburb: "St Kilda",        price: "$3,850,000", priceNum: 3850000, beds: 5, baths: 4, parking: 3, sqm: 420, type: "House",     status: "For Sale",     gradient: "linear-gradient(155deg,#081c2a 0%,#0f2e42 50%,#0a1e2e 100%)" },
  { id: 3,  title: "Armadale Garden Residence",   address: "24 Kooyong Road",            suburb: "Armadale",        price: "$2,950,000", priceNum: 2950000, beds: 4, baths: 3, parking: 2, sqm: 380, type: "House",     status: "Under Offer",  gradient: "linear-gradient(155deg,#0c1e12 0%,#163320 50%,#0e2016 100%)" },
  { id: 4,  title: "Port Melbourne Waterfront",   address: "1/105 Beach Street",         suburb: "Port Melbourne",  price: "$1,890,000", priceNum: 1890000, beds: 3, baths: 2, parking: 2, sqm: 195, type: "Apartment", status: "For Sale",     gradient: "linear-gradient(155deg,#0e1c28 0%,#183040 50%,#101e2c 100%)" },
  { id: 5,  title: "Toorak Manor Estate",         address: "15 Albany Road",             suburb: "Toorak",          price: "$8,500,000", priceNum: 8500000, beds: 6, baths: 5, parking: 4, sqm: 680, type: "House",     status: "For Sale",     gradient: "linear-gradient(155deg,#1c0e0a 0%,#301a10 50%,#201210 100%)", tag: "Prestige" },
  { id: 6,  title: "South Yarra Sky Residence",   address: "4201/200 Spencer Street",    suburb: "South Yarra",     price: "$2,100,000", priceNum: 2100000, beds: 3, baths: 2, parking: 1, sqm: 210, type: "Apartment", status: "For Sale",     gradient: "linear-gradient(155deg,#10121e 0%,#1c2038 50%,#121428 100%)" },
  { id: 7,  title: "Brighton Coastal Retreat",    address: "7 Middle Crescent",          suburb: "Brighton",        price: "$5,750,000", priceNum: 5750000, beds: 5, baths: 4, parking: 3, sqm: 560, type: "House",     status: "For Sale",     gradient: "linear-gradient(155deg,#0a1820 0%,#12283a 50%,#0c1e2c 100%)" },
  { id: 8,  title: "Prahran Terrace Collection",  address: "3/88 Greville Street",       suburb: "Prahran",         price: "$1,350,000", priceNum: 1350000, beds: 2, baths: 2, parking: 1, sqm: 155, type: "Townhouse", status: "For Sale",     gradient: "linear-gradient(155deg,#1c1408 0%,#2e200e 50%,#201a0c 100%)" },
  { id: 9,  title: "Malvern Grand Estate",        address: "6 Staniland Grove",          suburb: "Malvern",         price: "$6,200,000", priceNum: 6200000, beds: 5, baths: 4, parking: 3, sqm: 620, type: "House",     status: "Under Offer",  gradient: "linear-gradient(155deg,#101418 0%,#1c2430 50%,#121820 100%)", tag: "Grand" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const BedIcon  = () => <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8"/><path d="M2 12V8a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v4"/></svg>;
const BathIcon = () => <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6a2 2 0 012-2 2 2 0 012 2v2H9V6z"/><path d="M3 11h18v2a6 6 0 01-6 6H9a6 6 0 01-6-6v-2z"/><path d="M5 19v2M19 19v2"/></svg>;
const CarIcon  = () => <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>;
const SqmIcon  = () => <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg>;

// ─── Logo Overlay ─────────────────────────────────────────────────────────────
function LogoOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(1.5px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.38s ease",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", transform: visible ? "scale(1)" : "scale(0.85)", transition: "transform 0.42s cubic-bezier(0.22,1,0.36,1)" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", fontWeight: 600, color: "#fff", letterSpacing: "0.12em", lineHeight: 1 }}>LOREM</span>
        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.52rem", fontWeight: 400, color: "var(--gold)", letterSpacing: "0.42em", textTransform: "uppercase", lineHeight: 1 }}>IPSUM</span>
      </div>
    </div>
  );
}

// ─── Signature Card ───────────────────────────────────────────────────────────
function SignatureCard({ p, index, reducedMotion }: { p: Property; index: number; reducedMotion: boolean }) {
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

  const delay = reducedMotion ? 0 : (index % 3) * 0.08;

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#141920",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: reducedMotion
          ? "border-color 0.25s"
          : `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s, border-color 0.25s`,
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.45)" : "0 4px 16px rgba(0,0,0,0.25)",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "240px", background: p.gradient, overflow: "hidden", borderRadius: "12px 12px 0 0" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.022) 79px,rgba(255,255,255,0.022) 80px),repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(255,255,255,0.022) 59px,rgba(255,255,255,0.022) 60px)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 20%, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: p.gradient, opacity: 0.5, mixBlendMode: "multiply", transform: hovered ? "scale(1.05)" : "scale(1)", transition: reducedMotion ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
        <LogoOverlay visible={hovered} />

        {/* Badges */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ background: "rgba(13,17,23,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", fontFamily: "var(--font-inter)", fontSize: "0.45rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.18em", textTransform: "uppercase", padding: "0.25rem 0.55rem" }}>South Property · Signature</span>
        </div>
        <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
          <span style={{ background: p.status === "For Sale" ? "var(--gold)" : "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", borderRadius: "2px", color: "#fff", fontSize: "0.48rem", fontFamily: "var(--font-inter)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.26rem 0.6rem" }}>
            {p.status}
          </span>
        </div>
        {p.tag && (
          <div style={{ position: "absolute", bottom: "1rem", right: "1rem" }}>
            <span style={{ background: "rgba(6,8,12,0.65)", backdropFilter: "blur(6px)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "2px", color: "var(--gold)", fontSize: "0.45rem", fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", padding: "0.25rem 0.6rem" }}>{p.tag}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "1.5rem 1.6rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", fontWeight: 400, color: "var(--gold)", letterSpacing: "0.01em", marginBottom: "0.4rem", lineHeight: 1 }}>{p.price}</p>
        <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "0.95rem", fontWeight: 400, color: "#fff", letterSpacing: "0.02em", marginBottom: "0.35rem", lineHeight: 1.45 }}>{p.title}</h3>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "rgba(255,255,255,0.42)", marginBottom: "1rem", lineHeight: 1.5 }}>{p.address}, {p.suburb} VIC</p>
        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.9rem", marginTop: "auto" }}>
          {[
            { Icon: BedIcon,  v: p.beds,    l: "Beds"  },
            { Icon: BathIcon, v: p.baths,   l: "Baths" },
            { Icon: CarIcon,  v: p.parking, l: "Car"   },
            { Icon: SqmIcon,  v: p.sqm,     l: "m²"    },
          ].map(({ Icon, v, l }, si) => (
            <div key={l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", borderRight: si < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ color: "rgba(255,255,255,0.3)" }}><Icon /></div>
              <span style={{ fontFamily: "var(--font-playfair)", fontSize: "0.9rem", color: "#fff" }}>{v}</span>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</span>
            </div>
          ))}
        </div>
        <button
          className="sig-cta"
          aria-label={`View details for ${p.title}`}
          style={{ marginTop: "1.2rem", width: "100%", padding: "0.75rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter)", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.24em", textTransform: "uppercase", cursor: "pointer", borderRadius: "1px", transition: "background 0.25s, border-color 0.25s, color 0.25s" }}
        >
          View Property
        </button>
      </div>
    </article>
  );
}

// ─── Large Feature Card (hero strip) ─────────────────────────────────────────
function LargeFeatureCard({ p, reducedMotion }: { p: Property; reducedMotion: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", borderRadius: "16px", overflow: "hidden", background: p.gradient, cursor: "pointer", border: `1px solid ${hovered ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`, transform: hovered ? "translateY(-4px)" : "none", boxShadow: hovered ? "0 20px 56px rgba(0,0,0,0.55)" : "0 4px 20px rgba(0,0,0,0.3)", transition: reducedMotion ? "border-color 0.25s" : "border-color 0.25s, transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s" }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.022) 79px,rgba(255,255,255,0.022) 80px)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 65% 25%, rgba(255,255,255,0.045) 0%, transparent 55%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: p.gradient, opacity: 0.5, mixBlendMode: "multiply", transform: hovered ? "scale(1.06)" : "scale(1)", transition: reducedMotion ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.82) 100%)" }} />
      <LogoOverlay visible={hovered} />

      <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
        <div style={{ background: "rgba(13,17,23,0.72)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "0.28rem 0.65rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.15em", textTransform: "uppercase" }}>South Property</span>
          <span aria-hidden="true" style={{ width: "2px", height: "2px", borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Signature</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <span style={{ background: p.status === "For Sale" ? "var(--gold)" : "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", borderRadius: "2px", color: "#fff", fontSize: "0.48rem", fontFamily: "var(--font-inter)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.26rem 0.6rem" }}>{p.status}</span>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.4rem 1.5rem", background: "rgba(10,14,20,0.72)", backdropFilter: "blur(14px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "rgba(255,255,255,0.42)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{p.type}</span>
          <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.48rem", color: "rgba(255,255,255,0.42)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{p.sqm} m²</span>
        </div>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.35rem", fontWeight: 400, color: "var(--gold)", marginBottom: "0.3rem", lineHeight: 1 }}>{p.price}</p>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", color: "rgba(255,255,255,0.55)" }}>{p.address}, {p.suburb}</p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SignaturePageClient() {
  const [heroVisible, setHeroVisible] = useState(false);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setHeroVisible(true), 80);
    if (!reducedMotion.current) {
      const onScroll = () => {
        const bg = heroBgRef.current;
        if (!bg) return;
        bg.style.transform = `translateY(${(window.scrollY / window.innerHeight) * 22}%) scale(1.05)`;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
    }
    return () => clearTimeout(t);
  }, []);

  const rm = reducedMotion.current;

  return (
    <div style={{ background: "#0D1117", minHeight: "100vh", color: "#fff" }}>
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="sig-hero-heading" style={{ position: "relative", height: "100vh", minHeight: "580px", maxHeight: "860px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div ref={heroBgRef} aria-hidden="true" style={{ position: "absolute", inset: "-5%", transform: "scale(1.05)", background: "radial-gradient(ellipse at 60% 30%, rgba(40,20,10,0.7) 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(15,10,5,0.5) 0%, transparent 45%), linear-gradient(155deg, #120a06 0%, #1e1008 25%, #160c06 55%, #1a1008 80%, #0e0804 100%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 99px,rgba(255,255,255,0.018) 99px,rgba(255,255,255,0.018) 100px),repeating-linear-gradient(0deg,transparent,transparent 99px,rgba(255,255,255,0.018) 99px,rgba(255,255,255,0.018) 100px)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,3,2,0.3) 0%, rgba(6,3,2,0.1) 40%, rgba(6,3,2,0.78) 75%, rgba(6,3,2,0.97) 100%)" }} />
        {/* Gold accent glow */}
        <div aria-hidden="true" style={{ position: "absolute", top: "20%", right: "15%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "0 clamp(1.5rem, 6vw, 5rem) 5rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(16px)", transition: rm ? "none" : "opacity 0.8s ease, transform 0.8s ease", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--gold)" }}>South Property</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(201,168,76,0.5), transparent)", maxWidth: "70px" }} aria-hidden="true" />
          </div>
          <h1 id="sig-hero-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.8rem, 8vw, 6.5rem)", fontWeight: 400, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: "1.25rem", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(20px)", transition: rm ? "none" : "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s" }}>
            Signature<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Collection</em>
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)", color: "rgba(255,255,255,0.5)", maxWidth: "440px", lineHeight: 1.8, marginBottom: "2.5rem", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(14px)", transition: rm ? "none" : "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s" }}>
            Our most coveted residences — each handpicked for its exceptional address, architecture, and lifestyle offering.
          </p>
          <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", flexWrap: "wrap", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(10px)", transition: rm ? "none" : "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s" }}>
            {[{ v: "9", l: "Curated Listings" }, { v: "3", l: "Prestige Tags" }, { v: "$4.3M", l: "Avg. Price" }].map(({ v, l }) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#fff", fontWeight: 400, lineHeight: 1 }}>{v}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.52rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" style={{ padding: "1.25rem clamp(1.5rem, 6vw, 5rem)", borderBottom: "1px solid rgba(255,255,255,0.05)", maxWidth: "1400px", margin: "0 auto" }}>
        <ol style={{ listStyle: "none", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <li><Link href="/" style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.1em" }}>Home</Link></li>
          <li aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem" }}>/</li>
          <li><Link href="/buy" style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.1em" }}>Buy</Link></li>
          <li aria-hidden="true" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem" }}>/</li>
          <li><span style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", color: "var(--gold)", letterSpacing: "0.1em" }} aria-current="page">Signature</span></li>
        </ol>
      </nav>

      {/* ── Featured 3 (large cards strip) ───────────────────────────────── */}
      <section aria-labelledby="sig-featured-heading" style={{ padding: "4rem clamp(1.5rem, 6vw, 5rem) 3rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 id="sig-featured-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 400, color: "#fff" }}>
              Prestige <span style={{ color: "var(--gold)", fontStyle: "italic" }}>Highlights</span>
            </h2>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>3 properties</span>
          </div>
          <div className="sig-highlights-grid">
            {[PROPERTIES[0], PROPERTIES[4], PROPERTIES[8]].map((p, i) => (
              <div key={p.id} style={{ opacity: 1, height: i === 1 ? "420px" : "300px" }}>
                <LargeFeatureCard p={p} reducedMotion={rm} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Signature Listings ─────────────────────────────────────────── */}
      <section aria-labelledby="sig-all-heading" style={{ padding: "3rem clamp(1.5rem, 6vw, 5rem) 7rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div aria-hidden="true" style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)", marginBottom: "3rem" }} />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 id="sig-all-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 400, color: "#fff" }}>
              All <span style={{ color: "var(--gold)", fontStyle: "italic" }}>Listings</span>
            </h2>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>{PROPERTIES.length} properties</span>
          </div>
          <div className="sig-grid">
            {PROPERTIES.map((p, i) => (
              <SignatureCard key={p.id} p={p} index={i} reducedMotion={rm} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .sig-highlights-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr 1fr;
          gap: 1rem;
          align-items: end;
        }
        .sig-highlights-grid > div:first-child { margin-top: 2rem; }
        .sig-highlights-grid > div:last-child  { margin-top: 4rem; }
        @media (max-width: 900px) {
          .sig-highlights-grid { grid-template-columns: 1fr 1fr; }
          .sig-highlights-grid > div:last-child { display: none; }
          .sig-highlights-grid > div:first-child { margin-top: 0; }
          .sig-highlights-grid > div { height: 320px !important; }
        }
        @media (max-width: 580px) {
          .sig-highlights-grid { grid-template-columns: 1fr; }
          .sig-highlights-grid > div:nth-child(2) { display: none; }
        }
        .sig-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1100px) { .sig-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px)  { .sig-grid { grid-template-columns: 1fr; } }
        .sig-cta:hover {
          background: var(--gold) !important;
          border-color: var(--gold) !important;
          color: #fff !important;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: color 0.2s, border-color 0.2s, background 0.2s !important; }
        }
      `}</style>
    </div>
  );
}
