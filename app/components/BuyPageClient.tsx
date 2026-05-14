"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { supabase } from "../lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────────
type PropType   = "All" | "House" | "Apartment" | "Townhouse" | "Land";
type PriceKey   = "Any" | "sub1m" | "1m2m" | "2m5m" | "5mplus";
type StatusKey  = "All" | "for-sale" | "under-offer" | "sold" | "for-lease" | "leased";
type PropStatus = "For Sale" | "Under Offer" | "Sold" | "For Lease" | "Leased";

interface Property {
  id: string;
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
  status: PropStatus;
  gradient: string;
  imageUrl?: string;
  tag?: string;
  isSignature: boolean;
}

interface Contact {
  phone: string;
  email: string;
  address: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<StatusKey, PropStatus | null> = {
  "All": null, "for-sale": "For Sale", "under-offer": "Under Offer",
  "sold": "Sold", "for-lease": "For Lease", "leased": "Leased",
};

const PRICE_RANGES: { key: PriceKey; label: string }[] = [
  { key: "Any", label: "Any Price" },
  { key: "sub1m", label: "Under $1M" },
  { key: "1m2m", label: "$1M – $2M" },
  { key: "2m5m", label: "$2M – $5M" },
  { key: "5mplus", label: "$5M+" },
];

const GRADIENT_PALETTE = [
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

const STATUS_BADGE: Record<PropStatus, { bg: string; color: string }> = {
  "For Sale":    { bg: "var(--gold)", color: "#fff" },
  "Under Offer": { bg: "rgba(255,255,255,0.15)", color: "#fff" },
  "Sold":        { bg: "rgba(160,40,40,0.75)", color: "#fff" },
  "For Lease":   { bg: "rgba(30,90,170,0.75)", color: "#fff" },
  "Leased":      { bg: "rgba(30,120,70,0.75)", color: "#fff" },
};

const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxNDI3NDQiLz48L3N2Zz4=";

// ── Utilities ──────────────────────────────────────────────────────────────────
function propertyGradient(id: string) {
  let h = 0;
  for (const c of id) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return GRADIENT_PALETTE[Math.abs(h) % GRADIENT_PALETTE.length];
}

function formatAvgPrice(properties: Property[]): string {
  const priced = properties.filter((p) => p.priceNum > 0);
  if (!priced.length) return "–";
  const avg = priced.reduce((s, p) => s + p.priceNum, 0) / priced.length;
  return `$${(avg / 1_000_000).toFixed(1)}M`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Property {
  const imgs: { image_url: string; sort_order: number }[] =
    row.property_images ?? [];
  const hero = imgs.sort((a, b) => a.sort_order - b.sort_order)[0];
  return {
    id: row.id,
    title: row.title,
    address: row.address,
    suburb: row.suburb,
    price: row.price,
    priceNum: row.price_value ?? 0,
    beds: row.beds ?? 0,
    baths: row.baths ?? 0,
    parking: row.parking ?? 0,
    sqm: row.sqm ?? 0,
    type: row.type ?? "House",
    status: row.status,
    tag: row.tag ?? undefined,
    gradient: propertyGradient(row.id),
    imageUrl: hero?.image_url,
    isSignature: row.is_signature ?? false,
  };
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const BedIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8" />
    <path d="M2 12V8a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v4" />
  </svg>
);
const BathIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6a2 2 0 012-2 2 2 0 012 2v2H9V6z" />
    <path d="M3 11h18v2a6 6 0 01-6 6H9a6 6 0 01-6-6v-2z" />
    <path d="M5 19v2M19 19v2" />
  </svg>
);
const CarIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
    <circle cx="7.5" cy="17.5" r="1.5" />
    <circle cx="16.5" cy="17.5" r="1.5" />
  </svg>
);
const SqmIcon = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);
const ChevronIcon = () => (
  <svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 4l4 4 4-4" />
  </svg>
);

// ── Hover Logo Overlay ─────────────────────────────────────────────────────────
function LogoOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(1.5px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: visible ? 1 : 0, transition: "opacity 0.38s ease",
      }}
    >
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        transform: visible ? "scale(1)" : "scale(0.85)",
        transition: "transform 0.42s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", fontWeight: 600, color: "#fff", letterSpacing: "0.12em", lineHeight: 1 }}>SOUTH</span>
        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.77rem", color: "var(--gold)", letterSpacing: "0.42em", textTransform: "uppercase", lineHeight: 1 }}>PROPERTY</span>
      </div>
    </div>
  );
}

// ── Property Card ──────────────────────────────────────────────────────────────
function PropertyCard({ p, index, rm }: { p: Property; index: number; rm: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(rm);
  const [hovered, setHovered] = useState(false);
  const badge = STATUS_BADGE[p.status];
  const delay = rm ? 0 : index * 0.07;

  useEffect(() => {
    if (rm) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rm]);

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(145deg,#232830 0%,#1E2228 50%,#1A1C22 100%)"
          : "linear-gradient(145deg,#1F2330 0%,#1A1D24 55%,#17191F 100%)",
        borderRadius: "16px",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.22)" : "rgba(255,255,255,0.07)"}`,
        display: "flex", flexDirection: "column", overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: rm
          ? "border-color 0.2s, background 0.2s"
          : `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s, border-color 0.25s, background 0.25s`,
      }}
    >
      {/* Image / gradient placeholder */}
      <div style={{ position: "relative", height: "320px", background: p.gradient, overflow: "hidden" }} aria-hidden="true">
        {p.imageUrl ? (
          <Image
            src={p.imageUrl}
            alt={p.title}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1100px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              transform: hovered && !rm ? "scale(1.04)" : "scale(1)",
              transition: rm ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        ) : (
          <>
            <div style={{ borderRadius: "12px 12px 0 0",position: "absolute", inset: 0, backgroundImage: "linear-gradient(0deg,rgba(0,0,0,0.55) 0%,transparent 55%),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.025) 79px,rgba(255,255,255,0.025) 80px),repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(255,255,255,0.025) 59px,rgba(255,255,255,0.025) 60px)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 20%,rgba(255,255,255,0.04) 0%,transparent 60%)" }} />
            <div style={{ position: "absolute", inset: 0, background: p.gradient, opacity: 0.5, mixBlendMode: "multiply", transform: hovered && !rm ? "scale(1.04)" : "scale(1)", transition: rm ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
          </>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 60%,rgba(0,0,0,0.45) 100%)" }} />
        <LogoOverlay visible={hovered} />

        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
          <span style={{ display: "inline-block", background: badge.bg, backdropFilter: "blur(6px)", color: badge.color, fontSize: "0.77rem", fontFamily: "var(--font-inter)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.32rem 0.75rem" }}>
            {p.status}
          </span>
        </div>

        {p.tag && (
          <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
            <span style={{ display: "inline-block", background: "rgba(6,8,12,0.6)", backdropFilter: "blur(6px)", border: "1px solid rgba(201,168,76,0.45)", color: "var(--gold)", fontSize: "0.73rem", fontFamily: "var(--font-inter)", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", padding: "0.28rem 0.65rem" }}>
              {p.tag}
            </span>
          </div>
        )}

        <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.77rem", fontFamily: "var(--font-inter)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {p.type}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "1.5rem 1.6rem", flex: 1, display: "flex", flexDirection: "column",}}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.45rem", fontWeight: 400, color: "var(--gold)", letterSpacing: "0.01em", marginBottom: "0.45rem", lineHeight: 1 }}>
          {p.price}
        </p>
        <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", fontWeight: 400, color: "#fff", letterSpacing: "0.02em", marginBottom: "0.35rem", lineHeight: 1.45 }}>
          {p.title}
        </h3>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.95rem", color: "rgba(210,220,232,0.68)", marginBottom: "1.1rem", lineHeight: 1.5 }}>
          {p.address}, {p.suburb} VIC
        </p>

        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.9rem", marginTop: "auto" }}>
          {[
            { Icon: BedIcon, value: p.beds, label: "Beds" },
            { Icon: BathIcon, value: p.baths, label: "Baths" },
            { Icon: CarIcon, value: p.parking, label: "Car" },
            { Icon: SqmIcon, value: p.sqm, label: "m²" },
          ].map(({ Icon, value, label }, si) => (
            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", borderRight: si < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ color: "rgba(210,220,232,0.58)" }}><Icon /></div>
              <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.2rem", color: "#fff", fontWeight: 400 }}>{value}</span>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "rgba(210,220,232,0.52)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>

        <Link
          href={`/buy/${p.id}`}
          className="card-cta"
          aria-label={`View details for ${p.title}`}
          style={{
            display: "block", marginTop: "1.2rem", width: "100%", padding: "0.75rem",
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)",
            fontSize: "0.83rem", fontWeight: 500, letterSpacing: "0.24em",
            textTransform: "uppercase", textDecoration: "none", textAlign: "center",
            transition: "background 0.25s, border-color 0.25s, color 0.25s",
          }}
        >
          View Property
        </Link>
      </div>
    </article>
  );
}

// ── Featured Card ──────────────────────────────────────────────────────────────
function FeaturedCard({ p, height, signature = false, rm }: { p: Property; height: number; signature?: boolean; rm: boolean }) {
  const [hovered, setHovered] = useState(false);
  const badge = STATUS_BADGE[p.status];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", height, borderRadius: "16px", overflow: "hidden",
        background: p.gradient, cursor: "pointer",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color 0.25s, transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.6)" : "0 6px 24px rgba(0,0,0,0.35)"
      }}
    >
      {p.imageUrl ? (
        <Image
          src={p.imageUrl}
          alt={p.title}
          fill
          sizes="(max-width:580px) 100vw, (max-width:900px) 50vw, 33vw"
          style={{
            objectFit: "cover",
            transform: hovered && !rm ? "scale(1.07)" : "scale(1)",
            transition: rm ? "none" : "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          }}
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
      ) : (
        <>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,0.022) 79px,rgba(255,255,255,0.022) 80px),repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(255,255,255,0.022) 59px,rgba(255,255,255,0.022) 60px)" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: p.gradient, opacity: 0.5, mixBlendMode: "multiply", transform: hovered && !rm ? "scale(1.07)" : "scale(1)", transition: rm ? "none" : "transform 0.65s cubic-bezier(0.22,1,0.36,1)" }} />
        </>
      )}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.04) 40%,rgba(0,0,0,0.8) 100%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 20%,rgba(255,255,255,0.04) 0%,transparent 60%)" }} />
      <LogoOverlay visible={hovered} />

      <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
        <div style={{ background: "rgba(13,17,23,0.72)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "0.28rem 0.65rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.73rem", color: "rgba(255,255,255,0.65)", letterSpacing: "0.15em", textTransform: "uppercase" }}>South Property</span>
          {signature && (
            <>
              <span aria-hidden="true" style={{ width: "2px", height: "2px", borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.73rem", color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Signature</span>
            </>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        <span style={{ display: "inline-block", background: badge.bg, backdropFilter: "blur(6px)", borderRadius: "2px", color: badge.color, fontSize: "0.73rem", fontFamily: "var(--font-inter)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.26rem 0.6rem" }}>
          {p.status}
        </span>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: signature ? "1.4rem 1.5rem" : "1rem 1.2rem", background: "rgba(10,14,20,0.72)", backdropFilter: "blur(14px)", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.73rem", color: "rgba(210,220,232,0.68)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{p.type}</span>
          <span aria-hidden="true" style={{ color: "rgba(210,220,232,0.35)" }}>·</span>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.73rem", color: "rgba(210,220,232,0.68)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{p.sqm} m²</span>
        </div>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: signature ? "1.35rem" : "1.05rem", fontWeight: 400, color: "var(--gold)", marginBottom: "0.3rem", lineHeight: 1 }}>{p.price}</p>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{p.address}, {p.suburb}</p>
      </div>
    </div>
  );
}

// ── Featured / Signature Section ───────────────────────────────────────────────
function FeaturedSection({ rm, properties }: { rm: boolean; properties: Property[] }) {
  const sig = properties.filter((p) => p.isSignature);
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(rm);

  useEffect(() => {
    if (rm) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rm]);

  return (
    <section
      ref={ref}
      aria-labelledby="featured-heading"
      style={{
        position: "relative", overflow: "hidden",
        padding: "6rem clamp(1.5rem, 6vw, 5rem) 7rem",
        background: "linear-gradient(180deg,#0C0E11 0%,#0E1116 12%,#121720 32%,#161B24 50%,#121720 72%,#0E1116 88%,#0C0E11 100%)",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "900px", height: "600px", background: "radial-gradient(ellipse,rgba(201,168,76,0.11) 0%,rgba(201,168,76,0.04) 45%,transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: "-80px", left: "10%", width: "540px", height: "540px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.06)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: "100px", right: "6%", width: "360px", height: "360px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.04)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div aria-hidden="true" style={{ height: "1px", background: "linear-gradient(to right,transparent,rgba(201,168,76,0.35),transparent)", marginBottom: "4rem" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: rm ? "none" : "opacity 0.8s ease, transform 0.8s ease" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>South Property</p>
            <div aria-hidden="true" style={{ width: "2rem", height: "1px", background: "var(--gold)", opacity: 0.5, marginBottom: "1.25rem" }} />
            <h2 id="featured-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, color: "#fff", lineHeight: 1.1 }}>
              Signature<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Listings</em>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem", opacity: inView ? 1 : 0, transition: rm ? "none" : "opacity 0.8s ease 0.2s" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.97rem", color: "rgba(210,220,232,0.62)", lineHeight: 1.75, maxWidth: "280px", textAlign: "right" }}>
              Handpicked prestige residences in Melbourne&apos;s most sought-after addresses.
            </p>
            <Link
              href="/signature"
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "100px", padding: "0.65rem 1.5rem", color: "var(--gold)", fontFamily: "var(--font-inter)", fontSize: "0.83rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.25s, border-color 0.25s" }}
              onMouseOver={(e) => { const el = e.currentTarget; el.style.background = "rgba(201,168,76,0.16)"; el.style.borderColor = "var(--gold)"; }}
              onMouseOut={(e) => { const el = e.currentTarget; el.style.background = "rgba(201,168,76,0.08)"; el.style.borderColor = "rgba(201,168,76,0.3)"; }}
            >
              View All Listings
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7H12M8 3L12 7L8 11" /></svg>
            </Link>
          </div>
        </div>

        {sig.length > 0 && (
          <div className="featured-grid">
            {sig[0] && (
              <div className="featured-left" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: rm ? "none" : "opacity 0.75s ease 0.12s, transform 0.75s ease 0.12s" }}>
                <FeaturedCard p={sig[0]} height={300} rm={rm} />
              </div>
            )}
            {sig[1] && (
              <div className="featured-center" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: rm ? "none" : "opacity 0.75s ease 0.04s, transform 0.75s ease 0.04s" }}>
                <FeaturedCard p={sig[1]} height={500} signature rm={rm} />
              </div>
            )}
            {sig[2] && (
              <div className="featured-right" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(32px)", transition: rm ? "none" : "opacity 0.75s ease 0.2s, transform 0.75s ease 0.2s" }}>
                <FeaturedCard p={sig[2]} height={300} rm={rm} />
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", flexWrap: "wrap", gap: "1rem", opacity: inView ? 1 : 0, transition: rm ? "none" : "opacity 0.8s ease 0.35s" }}>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {[{ label: "Previous featured listing", d: "M8 4L4 8L8 12" }, { label: "Next featured listing", d: "M4 4L8 8L4 12" }].map(({ label, d }) => (
              <button key={label} aria-label={label} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "transparent", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(210,220,232,0.68)", cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
                onMouseOver={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
                onMouseOut={(e) => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.14)"; el.style.color = "rgba(210,220,232,0.68)"; }}>
                <svg aria-hidden="true" width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
              </button>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "rgba(210,220,232,0.38)", letterSpacing: "0.15em" }}>{sig.length} of {properties.length} Featured</p>
        </div>
      </div>
    </section>
  );
}

// ── Enquiry Section ────────────────────────────────────────────────────────────
type BuyFormData = { name: string; email: string; phone: string; interest: string; message: string };

function BuyEnquirySection({ rm, contact }: { rm: boolean; contact: Contact }) {
  const [form, setForm] = useState<BuyFormData>({ name: "", email: "", phone: "", interest: "", message: "" });
  const [errors, setErrors] = useState<Partial<BuyFormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(rm);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (rm) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rm]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    await supabase.from("enquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: `${form.interest ? `[${form.interest}] ` : ""}${form.message}`,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputBase: React.CSSProperties = {
    width: "100%", background: "rgba(28,33,40,0.04)",
    border: "1px solid rgba(28,33,40,0.14)", color: "var(--gun-darkest)",
    fontFamily: "var(--font-inter)", fontSize: "1rem",
    padding: "0.85rem 1rem", outline: "none",
    transition: "border-color 0.2s", borderRadius: 0,
  };
  const labelBase: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-inter)", fontSize: "0.77rem",
    letterSpacing: "0.2em", textTransform: "uppercase",
    color: "var(--gun-dark)", marginBottom: "0.5rem",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    { e.currentTarget.style.borderColor = "rgba(201,168,76,0.55)"; };
  const onBlur = (hasErr: boolean) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      { e.currentTarget.style.borderColor = hasErr ? "rgba(200,60,60,0.5)" : "rgba(28,33,40,0.14)"; };

  const contactItems = [
    { label: "Phone",  value: contact.phone   || "+61 3 9000 0000" },
    { label: "Email",  value: contact.email   || "enquiries@southproperty.com.au" },
    { label: "Office", value: contact.address || "Level 12, 200 Collins Street, Melbourne VIC 3000" },
  ];

  return (
    <section ref={ref} aria-labelledby="buy-enquiry-heading" style={{ background: "var(--cream)", padding: "5rem clamp(1.5rem, 6vw, 5rem) 7rem", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", bottom: "-40px", right: "4%", width: "420px", height: "420px", borderRadius: "50%", border: "1px solid rgba(28,33,40,0.06)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: "5%", left: "-4%", width: "300px", height: "300px", borderRadius: "50%", border: "1px solid rgba(28,33,40,0.04)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div aria-hidden="true" style={{ height: "1px", background: "linear-gradient(to right,transparent,rgba(201,168,76,0.38),transparent)", marginBottom: "5rem" }} />

        <div className="buy-enquiry-grid">
          {/* Left: contact info */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: rm ? "none" : "opacity 0.8s ease, transform 0.8s ease" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>Get in Touch</p>
            <div aria-hidden="true" style={{ width: "2rem", height: "1px", background: "var(--gold)", opacity: 0.6, marginBottom: "1.5rem" }} />
            <h2 id="buy-enquiry-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: "var(--gun-darkest)", lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Enquire About<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>a Property</em>
            </h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.03rem", color: "var(--gun-darkest)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: "340px" }}>
              Our experienced agents are ready to guide you through every step of your property journey.
            </p>
            {contactItems.map(({ label, value }) => (
              <div key={label} style={{ marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(28,33,40,0.09)" }}>
                <span style={{ ...labelBase, marginBottom: "0.35rem" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "1.03rem", color: "var(--gun-dark)", lineHeight: 1.5 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Right: form */}
          <div style={{ background: "#fff", border: "1px solid rgba(28,33,40,0.08)", borderRadius: "16px", padding: "clamp(1.75rem, 4vw, 2.75rem)", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: rm ? "none" : "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s", boxShadow: "0 4px 32px rgba(28,33,40,0.07)" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
                <div aria-hidden="true" style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "var(--gold)" }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11l5 5 9-9" /></svg>
                </div>
                <h3 ref={successRef} tabIndex={-1} style={{ fontFamily: "var(--font-playfair)", fontSize: "1.7rem", color: "var(--gun-darkest)", marginBottom: "0.75rem", outline: "none" }}>Thank You</h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "var(--gun-darkest)", lineHeight: 1.75 }}>
                  Your enquiry has been received. One of our agents will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-labelledby="buy-enquiry-heading">
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.77rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.75rem" }}>Property Enquiry</p>

                <div className="form-row" style={{ marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="enq-name" style={labelBase}>Full Name <span aria-hidden="true" style={{ color: "var(--gold)" }}>*</span></label>
                    <input id="enq-name" type="text" value={form.name} onChange={update("name")} aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "enq-name-err" : undefined} style={{ ...inputBase, borderColor: errors.name ? "rgba(200,60,60,0.5)" : undefined }} onFocus={onFocus} onBlur={onBlur(!!errors.name)} />
                    {errors.name && <span id="enq-name-err" role="alert" style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.83rem", color: "rgba(200,60,60,0.9)", marginTop: "0.35rem" }}>{errors.name}</span>}
                  </div>
                  <div>
                    <label htmlFor="enq-email" style={labelBase}>Email <span aria-hidden="true" style={{ color: "var(--gold)" }}>*</span></label>
                    <input id="enq-email" type="email" value={form.email} onChange={update("email")} aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "enq-email-err" : undefined} style={{ ...inputBase, borderColor: errors.email ? "rgba(200,60,60,0.5)" : undefined }} onFocus={onFocus} onBlur={onBlur(!!errors.email)} />
                    {errors.email && <span id="enq-email-err" role="alert" style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.83rem", color: "rgba(200,60,60,0.9)", marginTop: "0.35rem" }}>{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row" style={{ marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="enq-phone" style={labelBase}>Phone</label>
                    <input id="enq-phone" type="tel" value={form.phone} onChange={update("phone")} style={inputBase} onFocus={onFocus} onBlur={onBlur(false)} />
                  </div>
                  <div>
                    <label htmlFor="enq-interest" style={labelBase}>Property Type</label>
                    <div style={{ position: "relative" }}>
                      <select id="enq-interest" value={form.interest} onChange={update("interest")} style={{ ...inputBase, appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: "2.5rem" }} onFocus={onFocus} onBlur={onBlur(false)}>
                        <option value="">Any type…</option>
                        <option>House</option><option>Apartment</option><option>Townhouse</option><option>Land</option>
                      </select>
                      <div style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--gun-dark)" }}><ChevronIcon /></div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label htmlFor="enq-message" style={labelBase}>Message <span aria-hidden="true" style={{ color: "var(--gold)" }}>*</span></label>
                  <textarea id="enq-message" value={form.message} onChange={update("message")} rows={4} aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message ? "enq-message-err" : undefined} style={{ ...inputBase, resize: "vertical", minHeight: "100px", borderColor: errors.message ? "rgba(200,60,60,0.5)" : undefined }} onFocus={onFocus} onBlur={onBlur(!!errors.message)} />
                  {errors.message && <span id="enq-message-err" role="alert" style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.83rem", color: "rgba(200,60,60,0.9)", marginTop: "0.35rem" }}>{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ width: "100%", padding: "1rem", background: "var(--gun-darkest)", border: "1px solid var(--gun-darkest)", color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.87rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", cursor: submitting ? "wait" : "pointer", transition: "background 0.25s", opacity: submitting ? 0.7 : 1 }}
                  onMouseOver={(e) => { if (!submitting) { const b = e.currentTarget; b.style.background = "var(--gold)"; b.style.borderColor = "var(--gold)"; } }}
                  onMouseOut={(e) => { const b = e.currentTarget; b.style.background = "var(--gun-darkest)"; b.style.borderColor = "var(--gun-darkest)"; }}
                >
                  {submitting ? "Sending…" : "Submit Enquiry"}
                </button>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.77rem", color: "rgba(28,33,40,0.55)", textAlign: "center", marginTop: "1rem", lineHeight: 1.6 }}>
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

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BuyPageClient({ heroImageUrl }: { heroImageUrl?: string | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [contact, setContact] = useState<Contact>({ phone: "", email: "", address: "" });
  const [visibleCount, setVisibleCount] = useState(6);
  const [heroVisible, setHeroVisible] = useState(false);
  const [rm, setRm] = useState(false);
  const heroBgRef = useRef<HTMLDivElement>(null);

  // Load properties with hero image
  useEffect(() => {
    supabase
      .from("properties")
      .select("*, property_images(image_url, sort_order)")
      .order("sort_order")
      .then(({ data }) => setProperties(data ? data.map(mapRow) : []));
  }, []);

  // Load contact info from site_settings
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["company_phone", "company_email", "company_address"])
      .then(({ data }) => {
        if (!data) return;
        const m = Object.fromEntries(data.map((r) => [r.key, r.value]));
        setContact({
          phone: m.company_phone ?? "",
          email: m.company_email ?? "",
          address: m.company_address ?? "",
        });
      });
  }, []);

  // Reduced motion + hero entry + parallax
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRm(mq.matches);
    const t = setTimeout(() => setHeroVisible(true), 80);
    if (!mq.matches) {
      const onScroll = () => {
        const bg = heroBgRef.current;
        if (bg) bg.style.transform = `translateY(${(window.scrollY / window.innerHeight) * 25}%) scale(1.05)`;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
    }
    return () => clearTimeout(t);
  }, []);

  // Reset pagination on filter change
  useEffect(() => { setVisibleCount(6); }, [searchParams]);

  // Read filters from URL params
  const query      = searchParams.get("q")      ?? "";
  const typeFilter = (searchParams.get("type")   ?? "All") as PropType;
  const minBeds    = searchParams.get("beds")    ?? "0";
  const priceKey   = (searchParams.get("price")  ?? "Any") as PriceKey;
  const statusKey  = (searchParams.get("status") ?? "All") as StatusKey;
  const suburbKey  = searchParams.get("suburb")  ?? "All";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const targetStatus = STATUS_MAP[statusKey];
    return properties.filter((p) => {
      if (q && !p.suburb.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q) && !p.title.toLowerCase().includes(q)) return false;
      if (typeFilter !== "All" && p.type !== typeFilter) return false;
      if (minBeds !== "0" && p.beds < parseInt(minBeds)) return false;
      if (targetStatus !== null && p.status !== targetStatus) return false;
      if (suburbKey !== "All" && p.suburb !== suburbKey) return false;
      if (priceKey === "sub1m" && p.priceNum >= 1_000_000) return false;
      if (priceKey === "1m2m" && (p.priceNum < 1_000_000 || p.priceNum >= 2_000_000)) return false;
      if (priceKey === "2m5m" && (p.priceNum < 2_000_000 || p.priceNum >= 5_000_000)) return false;
      if (priceKey === "5mplus" && p.priceNum < 5_000_000) return false;
      return true;
    });
  }, [query, typeFilter, minBeds, priceKey, statusKey, suburbKey, properties]);

  // Hero stats derived from live data
  const heroStats = useMemo(() => [
    { value: `${properties.length}`,                                          label: "Active Listings" },
    { value: `${properties.filter((p) => p.status === "Sold").length}`,      label: "Sold This Quarter" },
    { value: formatAvgPrice(properties),                                       label: "Avg. Sale Price" },
    { value: `${new Set(properties.map((p) => p.suburb)).size}`,             label: "Suburbs" },
  ], [properties]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const clearFilters = () => router.replace("/buy", { scroll: false });

  return (
    <div style={{ background: "#0C0E11", minHeight: "100vh", color: "#fff" }}>
      <Navigation />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="buy-hero-heading"
        style={{ position: "relative", height: "105vh", minHeight: "800px", maxHeight: "900px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
      >
        <div ref={heroBgRef} aria-hidden="true" style={{ position: "absolute", inset: "-5%", transform: "scale(1.05)" }}>
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 65% 25%,rgba(25,55,90,0.55) 0%,transparent 55%),radial-gradient(ellipse at 20% 70%,rgba(15,35,60,0.4) 0%,transparent 45%),linear-gradient(160deg,#0a1520 0%,#162a42 25%,#0f1e30 55%,#182840 80%,#0b1a28 100%)",
            }} />
          )}
        </div>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg,transparent,transparent 99px,rgba(255,255,255,0.022) 99px,rgba(255,255,255,0.022) 100px),repeating-linear-gradient(0deg,transparent,transparent 99px,rgba(255,255,255,0.022) 99px,rgba(255,255,255,0.022) 100px)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(6,8,12,0.25) 0%,rgba(6,8,12,0.1) 40%,rgba(6,8,12,0.75) 75%,rgba(6,8,12,0.97) 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "0 clamp(1.5rem, 6vw, 5rem) 5rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(16px)", transition: rm ? "none" : "opacity 0.8s ease, transform 0.8s ease" }}>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.83rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold)" }}>South Property</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right,rgba(201,168,76,0.5),transparent)", maxWidth: "80px" }} aria-hidden="true" />
          </div>

          <h1 id="buy-hero-heading" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.8rem, 8vw, 6.5rem)", fontWeight: 400, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.05, marginBottom: "1.25rem", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(20px)", transition: rm ? "none" : "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s" }}>
            Properties<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>For Sale</em>
          </h1>

          <p style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(0.8rem, 1.5vw, 0.95rem)", color: "rgba(255,255,255,0.55)", maxWidth: "480px", lineHeight: 1.75, marginBottom: "2.5rem", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(16px)", transition: rm ? "none" : "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s" }}>
            Discover Melbourne&apos;s finest residences — from beachfront villas to prestige penthouses in the city&apos;s most coveted suburbs.
          </p>

          <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", flexWrap: "wrap", opacity: heroVisible ? 1 : 0, transform: heroVisible ? "none" : "translateY(12px)", transition: rm ? "none" : "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s" }}>
            {heroStats.map(({ value, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#fff", fontWeight: 400, lineHeight: 1 }}>{value}</span>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "rgba(210,220,232,0.65)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden="true" style={{ position: "absolute", bottom: "2.5rem", right: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: heroVisible ? 0.45 : 0, transition: rm ? "none" : "opacity 1s ease 0.6s" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.73rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#fff", writingMode: "vertical-rl" }}>Scroll</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom,rgba(255,255,255,0.6),transparent)", animation: rm ? "none" : "scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ── Property grid ──────────────────────────────────────────────────── */}
      <div style={{ background: "var(--cream)", borderRadius: "28px 28px 0 0", marginTop: "-28px", position: "relative", zIndex: 2}}>
        <section aria-label="Property listings" style={{ padding: "4rem clamp(1.5rem, 6vw, 5rem) 6rem", maxWidth: "1400px", margin: "0 auto" }}>

          {/* ── Status tabs ── */}
          <div role="tablist" aria-label="Filter by status" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {(
              [
                { key: "All",         label: "All"         },
                { key: "for-sale",    label: "For Sale"    },
                { key: "under-offer", label: "Under Offer" },
                { key: "sold",        label: "Sold"        },
                { key: "for-lease",   label: "For Lease"   },
                { key: "leased",      label: "Leased"      },
              ] as { key: StatusKey; label: string }[]
            ).map(({ key, label }) => {
              const active = statusKey === key;
              const count  = key === "All"
                ? properties.length
                : properties.filter((p) => p.status === STATUS_MAP[key]).length;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    const p = new URLSearchParams(searchParams.toString());
                    if (key === "All") p.delete("status"); else p.set("status", key);
                    router.replace(`/buy${p.toString() ? "?" + p.toString() : ""}`, { scroll: false });
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.5rem 1.1rem", borderRadius: "100px",
                    border: active ? "1px solid var(--gold)" : "1px solid rgba(28,33,40,0.15)",
                    background: active ? "var(--gold)" : "transparent",
                    color: active ? "#fff" : "rgba(28,33,40,0.6)",
                    fontFamily: "var(--font-inter)", fontSize: "0.8rem",
                    fontWeight: active ? 600 : 400, letterSpacing: "0.06em",
                    cursor: "pointer", whiteSpace: "nowrap",
                    transition: "background 0.2s, border-color 0.2s, color 0.2s",
                  }}
                >
                  {label}
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: "18px", height: "18px", borderRadius: "100px", padding: "0 4px",
                    background: active ? "rgba(255,255,255,0.25)" : "rgba(28,33,40,0.08)",
                    color: active ? "#fff" : "rgba(28,33,40,0.5)",
                    fontFamily: "var(--font-inter)", fontSize: "0.68rem", fontWeight: 500,
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Result count + active filter chips */}
          <div aria-live="polite" aria-atomic="true" style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "1rem", color: "rgba(74,72,72,0.55)", letterSpacing: "0.1em" }}>
              Showing <strong style={{ color: "var(--gold)", fontWeight: 500 }}>{filtered.length}</strong> {filtered.length === 1 ? "property" : "properties"}
              {(query || typeFilter !== "All" || minBeds !== "0" || priceKey !== "Any" || statusKey !== "All" || suburbKey !== "All") && " matching your criteria"}
            </span>
            {typeFilter !== "All" && <span style={chipStyle}>{typeFilter}</span>}
            {suburbKey !== "All" && <span style={chipStyle}>{suburbKey}</span>}
            {minBeds !== "0" && <span style={chipStyle}>{minBeds}+ Beds</span>}
            {priceKey !== "Any" && <span style={chipStyle}>{PRICE_RANGES.find((r) => r.key === priceKey)?.label}</span>}
          </div>

          {filtered.length === 0 ? (
            <div role="status" style={{ textAlign: "center", padding: "6rem 0" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.6rem", color: "var(--gun-darkest)", marginBottom: "1rem" }}>No properties found</p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "rgba(15,16,16,0.62)", marginBottom: "2rem" }}>Try adjusting your search filters</p>
              <button onClick={clearFilters} style={goldBtnStyle}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="buy-grid">
                {visible.map((p, i) => (
                  <PropertyCard key={p.id} p={p} index={i} rm={rm} />
                ))}
              </div>
              {hasMore && (
                <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "rgba(28,33,40,0.45)", letterSpacing: "0.15em", marginBottom: "1.25rem" }}>
                    Showing {visible.length} of {filtered.length}
                  </p>
                  <button onClick={() => setVisibleCount((v) => v + 6)} style={goldBtnStyle}>Load More Properties</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <FeaturedSection rm={rm} properties={properties} />
      <BuyEnquirySection rm={rm} contact={contact} />
      <Footer />

      <style>{`
        .buy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1100px) { .buy-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px)  { .buy-grid { grid-template-columns: 1fr; } }
        .card-cta:hover {
          background: var(--gold) !important;
          border-color: var(--gold) !important;
          color: #fff !important;
        }
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
          .featured-left  { margin-top: 0; }
        }
        @media (max-width: 580px) { .featured-grid { grid-template-columns: 1fr; } }
        .buy-enquiry-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: clamp(3rem, 6vw, 6rem);
          align-items: start;
        }
        @media (max-width: 860px) { .buy-enquiry-grid { grid-template-columns: 1fr; } }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.6; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(0.85); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: color 0.2s, border-color 0.2s, background 0.2s !important; }
        }
      `}</style>
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const chipStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)", fontSize: "0.77rem",
  letterSpacing: "0.12em", textTransform: "uppercase",
  color: "var(--gold)", background: "rgba(201,168,76,0.08)",
  border: "1px solid rgba(201,168,76,0.2)", padding: "0.2rem 0.6rem",
};

const goldBtnStyle: React.CSSProperties = {
  background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)",
  fontFamily: "var(--font-inter)", fontSize: "0.87rem", fontWeight: 500,
  letterSpacing: "0.22em", textTransform: "uppercase",
  padding: "0.9rem 2.5rem", cursor: "pointer",
  transition: "background 0.25s, color 0.25s",
};
