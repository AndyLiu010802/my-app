"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type PropType = "All" | "House" | "Apartment" | "Townhouse" | "Land";
type PriceKey = "Any" | "sub1m" | "1m2m" | "2m5m" | "5mplus";

const navLinks = [
  { label: "Lorem", href: "#vision" },
  { label: "Ipsum", href: "#residences" },
  { label: "Dolor", href: "#features" },
  { label: "Amet", href: "#location" },
  { label: "Sit", href: "#contact" },
];

const menuItems = [
  { label: "Buy",      href: "/buy" },
  { label: "Projects", href: "/projects" },
  { label: "Lease",    href: "/lease" },
  { label: "Sold",     href: "/sold" },
  { label: "Appraise", href: "/appraisals" },
  {
    label: "About", href: "/about",
    children: [
      { label: "Who We Are", href: "/about" },
      { label: "Our Team",   href: "/team"  },
    ],
  },
  { label: "Contact", href: "/contact" },
];

// ── Icons ──────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

const MiniChevron = () => (
  <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M2 3.5l3 3 3-3"/>
  </svg>
);

// ── Compact pill select (used in navbar search bar) ────────────────────────────
function NavSelect({ label, value, active, onChange, children }: {
  label: string; value: string; active: boolean;
  onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <label style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: "2.1rem",
          background: active ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${active ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "100px",
          color: active ? "var(--gold)" : "rgba(237,232,223,0.65)",
          fontFamily: "var(--font-inter)", fontSize: "0.6rem",
          fontWeight: active ? 500 : 400,
          letterSpacing: "0.06em",
          padding: "0 1.65rem 0 0.85rem",
          appearance: "none", WebkitAppearance: "none",
          cursor: "pointer", outline: "none",
          transition: "background 0.2s, border-color 0.2s, color 0.2s",
        }}
      >
        {children}
      </select>
      <div style={{
        position: "absolute", right: "0.45rem", top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none",
        color: active ? "var(--gold)" : "rgba(237,232,223,0.42)",
      }}>
        <MiniChevron />
      </div>
    </div>
  );
}

// ── Panel select (used in mobile slide-out) ────────────────────────────────────
function PanelSelect({ label, value, active, onChange, children }: {
  label: string; value: string; active: boolean;
  onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative" }}>
      <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(237,232,223,0.52)", marginBottom: "0.35rem" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", height: "2.6rem",
            background: active ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${active ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "6px",
            color: active ? "var(--gold)" : "rgba(237,232,223,0.75)",
            fontFamily: "var(--font-inter)", fontSize: "0.72rem",
            padding: "0 2.2rem 0 0.9rem",
            appearance: "none", WebkitAppearance: "none",
            cursor: "pointer", outline: "none",
          }}
        >
          {children}
        </select>
        <div style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: active ? "var(--gold)" : "rgba(237,232,223,0.42)" }}>
          <MiniChevron />
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Navigation() {
  const pathname                           = usePathname();
  const isHome                             = pathname === "/";
  const isBuy                              = pathname === "/buy";
  const router                             = useRouter();

  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  // Buy page filter state — pushed to URL, read by BuyPageClient via useSearchParams
  const [buyQ, setBuyQ]         = useState("");
  const [buyType, setBuyType]   = useState<PropType>("All");
  const [buyBeds, setBuyBeds]   = useState("0");
  const [buyPrice, setBuyPrice] = useState<PriceKey>("Any");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Sync filter state from URL when navigating to /buy (handles direct load or back navigation)
  useEffect(() => {
    if (!isBuy) {
      setBuyQ(""); setBuyType("All"); setBuyBeds("0"); setBuyPrice("Any");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setBuyQ(params.get("q") ?? "");
    setBuyType((params.get("type") ?? "All") as PropType);
    setBuyBeds(params.get("beds") ?? "0");
    setBuyPrice((params.get("price") ?? "Any") as PriceKey);
  }, [isBuy, pathname]);

  const pushFilters = (overrides: { q?: string; type?: string; beds?: string; price?: string }) => {
    const q     = "q"     in overrides ? overrides.q!     : buyQ;
    const type  = "type"  in overrides ? overrides.type!  : buyType;
    const beds  = "beds"  in overrides ? overrides.beds!  : buyBeds;
    const price = "price" in overrides ? overrides.price! : buyPrice;
    const params = new URLSearchParams();
    if (q)              params.set("q", q);
    if (type  !== "All") params.set("type", type);
    if (beds  !== "0")   params.set("beds", beds);
    if (price !== "Any") params.set("price", price);
    const qs = params.toString();
    router.replace(`/buy${qs ? "?" + qs : ""}`, { scroll: false });
  };

  const clearBuyFilters = () => {
    setBuyQ(""); setBuyType("All"); setBuyBeds("0"); setBuyPrice("Any");
    router.replace("/buy", { scroll: false });
  };

  const buyActiveCount = [!!buyQ, buyType !== "All", buyBeds !== "0", buyPrice !== "Any"].filter(Boolean).length;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    let top = 0;
    let el = target.previousElementSibling as HTMLElement | null;
    while (el) { top += el.offsetHeight; el = el.previousElementSibling as HTMLElement | null; }
    window.scrollTo({ top, behavior: "smooth" });
  };

  const logoEl = (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.3rem", fontWeight: 600, color: "#fff", letterSpacing: "0.12em", lineHeight: 1 }}>LOREM</span>
      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", fontWeight: 400, color: "var(--gold)", letterSpacing: "0.38em", textTransform: "uppercase", lineHeight: 1 }}>IPSUM</span>
    </div>
  );

  return (
    <>
      {/* ── Floating pill navbar ─────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: "1.1rem",
          left: "clamp(0.75rem, 3vw, 2.25rem)",
          right: "clamp(0.75rem, 3vw, 2.25rem)",
          zIndex: 100,
          borderRadius: "100px",
          background: scrolled ? "rgba(68, 81, 107, 0.98)" : "rgba(40, 47, 61, 0.98)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          opacity: scrolled ? 0.9 : 0.7,
          transition: "background 0.35s ease, box-shadow 0.35s ease",
        }}
      >
        <div style={{ padding: "0 1.4rem", height: "3.75rem", display: "flex", alignItems: "center", gap: "1rem" }}>

          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            {isHome ? (
              <a href="#" onClick={(e) => scrollToSection(e, "#")} style={{ textDecoration: "none" }}>
                {logoEl}
              </a>
            ) : (
              <Link href="/" style={{ textDecoration: "none" }}>
                {logoEl}
              </Link>
            )}
          </div>

          {/* Desktop anchor nav — homepage only */}
          {isHome && (
            <nav className="pill-desktop-nav" aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: "2rem", flex: 1 }}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="nav-link" onClick={(e) => scrollToSection(e, link.href)}>
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="pill-cta"
                style={{
                  padding: "0.48rem 1.35rem",
                  background: "var(--gold)",
                  color: "#fff",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "100px",
                  border: "1px solid var(--gold)",
                  whiteSpace: "nowrap",
                  transition: "background 0.25s",
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#B8962A"; }}
                onMouseOut={(e)  => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)"; }}
              >
                Lorem Ipsum
              </a>
            </nav>
          )}

          {/* Buy page inline search bar — desktop only */}
          {isBuy && (
            <div
              className="buy-nav-search-bar"
              role="search"
              aria-label="Search properties"
              style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {/* Text search */}
              <div style={{ position: "relative", flex: "1 1 0", minWidth: 0 }}>
                <span style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "rgba(237,232,223,0.42)", pointerEvents: "none", display: "flex" }}>
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  aria-label="Search suburb or address"
                  placeholder="Suburb or address…"
                  value={buyQ}
                  onChange={(e) => { setBuyQ(e.target.value); pushFilters({ q: e.target.value }); }}
                  style={{
                    width: "100%", height: "2.1rem",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "100px",
                    color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.62rem",
                    padding: "0 0.85rem 0 2.1rem",
                    outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </div>

              {/* Type */}
              <NavSelect label="Property type" value={buyType} active={buyType !== "All"} onChange={(v) => { setBuyType(v as PropType); pushFilters({ type: v }); }}>
                <option value="All">Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apt</option>
                <option value="Townhouse">T/H</option>
                <option value="Land">Land</option>
              </NavSelect>

              {/* Beds */}
              <NavSelect label="Min bedrooms" value={buyBeds} active={buyBeds !== "0"} onChange={(v) => { setBuyBeds(v); pushFilters({ beds: v }); }}>
                <option value="0">Beds</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </NavSelect>

              {/* Price */}
              <NavSelect label="Price range" value={buyPrice} active={buyPrice !== "Any"} onChange={(v) => { setBuyPrice(v as PriceKey); pushFilters({ price: v }); }}>
                <option value="Any">Price</option>
                <option value="sub1m">&lt;$1M</option>
                <option value="1m2m">$1–2M</option>
                <option value="2m5m">$2–5M</option>
                <option value="5mplus">$5M+</option>
              </NavSelect>

              {/* Clear */}
              {buyActiveCount > 0 && (
                <button
                  onClick={clearBuyFilters}
                  aria-label="Clear all filters"
                  style={{
                    background: "none", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "100px", color: "rgba(237,232,223,0.55)",
                    fontFamily: "var(--font-inter)", fontSize: "0.52rem",
                    letterSpacing: "0.08em", padding: "0 0.8rem", height: "2.1rem",
                    cursor: "pointer", flexShrink: 0,
                    display: "flex", alignItems: "center", gap: "0.3rem",
                    whiteSpace: "nowrap", transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseOver={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
                  onMouseOut={(e)  => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.color = "rgba(237,232,223,0.55)"; }}
                >
                  <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/></svg>
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Spacer for non-home, non-buy pages */}
          {!isHome && !isBuy && <div style={{ flex: 1 }} />}

          {/* Hamburger pill button with active-filter badge */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{
                background: menuOpen ? "rgba(255,255,255,0.06)" : "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "100px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.5rem 0.9rem",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.32)"; }}
              onMouseOut={(e)  => { if (!menuOpen) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
            >
              {menuOpen ? (
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <line x1="3" y1="3" x2="17" y2="17" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="17" y1="3" x2="3"  y2="17" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                  <span aria-hidden="true" style={{ display: "block", width: "18px", height: "1px", background: "#fff" }} />
                  <span aria-hidden="true" style={{ display: "block", width: "12px", height: "1px", background: "var(--gold)" }} />
                  <span aria-hidden="true" style={{ display: "block", width: "18px", height: "1px", background: "#fff" }} />
                </div>
              )}
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Menu
              </span>
            </button>

            {/* Active filter count badge */}
            {isBuy && buyActiveCount > 0 && (
              <span
                aria-label={`${buyActiveCount} active filter${buyActiveCount > 1 ? "s" : ""}`}
                style={{
                  position: "absolute", top: "-5px", right: "-5px",
                  width: "17px", height: "17px",
                  background: "var(--gold)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-inter)", fontSize: "0.45rem",
                  fontWeight: 700, color: "#000",
                  pointerEvents: "none",
                }}
              >
                {buyActiveCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(6, 8, 12, 0.6)",
          backdropFilter: "blur(3px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      />

      {/* ── Slide-out panel ───────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(400px, 90vw)",
          background: "#0D1117",
          zIndex: 201,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          display: "flex", flexDirection: "column",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
          overflowY: "auto",
        }}
      >
        {/* Panel top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.75rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 600, color: "#fff", letterSpacing: "0.12em" }}>LOREM</span>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.5rem", color: "var(--gold)", letterSpacing: "0.35em", textTransform: "uppercase" }}>IPSUM</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", cursor: "pointer", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", transition: "border-color 0.2s, color 0.2s", flexShrink: 0 }}
            onMouseOver={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
            onMouseOut={(e)  => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.color = "rgba(255,255,255,0.6)"; }}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="13" y1="1" x2="1"  y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Mobile property search filters (buy page only) ─────────────── */}
        {isBuy && (
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)" }}>Search Properties</span>
            <div style={{ width: "2rem", height: "1px", background: "var(--gold)", marginTop: "0.6rem", opacity: 0.5, marginBottom: "1.1rem" }} aria-hidden="true" />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {/* Search input */}
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(237,232,223,0.52)", marginBottom: "0.35rem" }}>
                  Suburb or Address
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "rgba(237,232,223,0.38)", pointerEvents: "none", display: "flex" }}>
                    <SearchIcon />
                  </span>
                  <input
                    type="search"
                    placeholder="Toorak, Southbank…"
                    value={buyQ}
                    onChange={(e) => { setBuyQ(e.target.value); pushFilters({ q: e.target.value }); }}
                    style={{
                      width: "100%", height: "2.6rem",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.72rem",
                      padding: "0 0.9rem 0 2.2rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Type + Beds row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <PanelSelect label="Property Type" value={buyType} active={buyType !== "All"} onChange={(v) => { setBuyType(v as PropType); pushFilters({ type: v }); }}>
                  <option value="All">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Land">Land</option>
                </PanelSelect>

                <PanelSelect label="Min Bedrooms" value={buyBeds} active={buyBeds !== "0"} onChange={(v) => { setBuyBeds(v); pushFilters({ beds: v }); }}>
                  <option value="0">Any Beds</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                  <option value="5">5+ Beds</option>
                </PanelSelect>
              </div>

              {/* Price */}
              <PanelSelect label="Price Range" value={buyPrice} active={buyPrice !== "Any"} onChange={(v) => { setBuyPrice(v as PriceKey); pushFilters({ price: v }); }}>
                <option value="Any">Any Price</option>
                <option value="sub1m">Under $1M</option>
                <option value="1m2m">$1M – $2M</option>
                <option value="2m5m">$2M – $5M</option>
                <option value="5mplus">$5M+</option>
              </PanelSelect>

              {/* Clear */}
              {buyActiveCount > 0 && (
                <button
                  onClick={() => { clearBuyFilters(); setMenuOpen(false); }}
                  style={{
                    background: "none", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "6px", color: "rgba(237,232,223,0.55)",
                    fontFamily: "var(--font-inter)", fontSize: "0.6rem",
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    padding: "0.7rem 1rem", cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseOver={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
                  onMouseOut={(e)  => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.color = "rgba(237,232,223,0.55)"; }}
                >
                  Clear Filters ({buyActiveCount})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Nav label */}
        <div style={{ padding: "2rem 2rem 1rem", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)" }}>Navigation</span>
          <div style={{ width: "2rem", height: "1px", background: "var(--gold)", marginTop: "0.6rem", opacity: 0.5 }} aria-hidden="true" />
        </div>

        {/* Nav items */}
        <nav style={{ padding: "0 2rem", flex: 1 }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {menuItems.map((item, i) => (
              <li key={item.label} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setAboutExpanded(!aboutExpanded)}
                      aria-expanded={aboutExpanded}
                      style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 0", gap: "1rem" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "var(--gold)", letterSpacing: "0.1em", minWidth: "1.5rem" }}>0{i + 1}</span>
                        <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 400, color: "#fff", letterSpacing: "0.02em" }}>{item.label}</span>
                      </div>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: "transform 0.3s", transform: aboutExpanded ? "rotate(180deg)" : "none", color: "rgba(237,232,223,0.65)", flexShrink: 0 }}>
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <div style={{ overflow: "hidden", maxHeight: aboutExpanded ? "200px" : "0", transition: "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                      <ul style={{ listStyle: "none", padding: "0 0 1rem 2.75rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={() => setMenuOpen(false)}
                              style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(237,232,223,0.68)", textDecoration: "none", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem" }}
                              onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)"; }}
                              onMouseOut={(e)  => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(237,232,223,0.68)"; }}
                            >
                              <span aria-hidden="true" style={{ width: "4px", height: "4px", background: "var(--gold)", borderRadius: "50%", flexShrink: 0, opacity: 0.6 }} />
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="menu-link"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 0", textDecoration: "none", gap: "1rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "var(--gold)", letterSpacing: "0.1em", minWidth: "1.5rem" }}>0{i + 1}</span>
                      <span className="menu-item-label" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 400, color: "#fff", letterSpacing: "0.02em", transition: "color 0.2s" }}>{item.label}</span>
                    </div>
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "rgba(237,232,223,0.38)", flexShrink: 0 }}>
                      <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom: CTA + socials */}
        <div style={{ padding: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          {isHome ? (
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="panel-cta"
              style={{ display: "block", width: "100%", padding: "1rem", background: "var(--gold)", color: "#fff", textAlign: "center", fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", border: "1px solid var(--gold)", transition: "background 0.3s" }}
              onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#B8962A"; }}
              onMouseOut={(e)  => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)"; }}
            >
              Enquire Now
            </a>
          ) : (
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="panel-cta"
              style={{ display: "block", width: "100%", padding: "1rem", background: "var(--gold)", color: "#fff", textAlign: "center", fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", border: "1px solid var(--gold)", transition: "background 0.3s" }}
              onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#B8962A"; }}
              onMouseOut={(e)  => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)"; }}
            >
              Enquire Now
            </Link>
          )}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
            {[
              { label: "Instagram", href: "https://www.instagram.com/south.property.group/", icon: <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
              { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61550912872160", icon: <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", color: "rgba(237,232,223,0.65)", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
                onMouseOver={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
                onMouseOut={(e)  => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.color = "rgba(255,255,255,0.4)"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .pill-desktop-nav { display: none !important; }
          .buy-nav-search-bar { display: none !important; }
        }
        @media (max-width: 960px) {
          .buy-nav-search-bar select:nth-child(4) { display: none; }
        }
        .menu-link:hover .menu-item-label { color: var(--gold) !important; }
        .menu-link:hover svg { color: rgba(201,168,76,0.6) !important; }
        .panel-cta:hover { background: #B8962A !important; }
        .pill-cta:hover { background: #B8962A !important; }
      `}</style>
    </>
  );
}
