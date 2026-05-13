"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

export default function Navigation() {
  const pathname               = usePathname();
  const isHome                 = pathname === "/";
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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

  // Close slide panel when route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

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
      <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.35rem", fontWeight: 600, color: "#fff", letterSpacing: "0.12em", lineHeight: 1 }}>LOREM</span>
      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", fontWeight: 400, color: "var(--gold)", letterSpacing: "0.35em", textTransform: "uppercase", lineHeight: 1 }}>IPSUM</span>
    </div>
  );

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          transition: "background 0.4s ease, box-shadow 0.4s ease",
          background: scrolled || !isHome ? "rgba(28, 33, 40, 0.97)" : "transparent",
          boxShadow: scrolled || !isHome ? "0 1px 24px rgba(0,0,0,0.18)" : "none",
          backdropFilter: scrolled || !isHome ? "blur(8px)" : "none",
        }}
      >
        <div
          className="nav-inner"
          style={{
            maxWidth: "1400px", margin: "0 auto", padding: "0 2.5rem",
            height: "5rem", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          {/* Logo — scrolls to top on home, links to / on sub-pages */}
          {isHome ? (
            <a href="#" onClick={(e) => scrollToSection(e, "#")} style={{ textDecoration: "none" }}>
              {logoEl}
            </a>
          ) : (
            <Link href="/" style={{ textDecoration: "none" }}>
              {logoEl}
            </Link>
          )}

          {/* Desktop anchor nav — homepage only */}
          {isHome && (
            <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="nav-link" onClick={(e) => scrollToSection(e, link.href)}>
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="nav-cta"
                style={{
                  padding: "0.6rem 1.6rem", background: "var(--gold)", color: "#fff",
                  fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                  textDecoration: "none", transition: "background 0.3s", border: "1px solid var(--gold)", whiteSpace: "nowrap",
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#B8962A"; }}
                onMouseOut={(e)  => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)"; }}
              >
                Lorem Ipsum
              </a>
            </nav>
          )}

          {/* Hamburger — always visible, right-aligned */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "4px", padding: "0.5rem",
              marginLeft: isHome ? "1.5rem" : "auto",
            }}
          >
            {menuOpen ? (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="3" y1="3" x2="17" y2="17" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="17" y1="3" x2="3"  y2="17" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            ) : (
              <>
                <span aria-hidden="true" style={{ display: "block", width: "22px", height: "1px", background: "#fff" }} />
                <span aria-hidden="true" style={{ display: "block", width: "14px", height: "1px", background: "var(--gold)", alignSelf: "flex-end" }} />
                <span aria-hidden="true" style={{ display: "block", width: "22px", height: "1px", background: "#fff" }} />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Backdrop */}
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

      {/* Slide-out panel */}
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
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", transition: "border-color 0.2s, color 0.2s", flexShrink: 0 }}
            onMouseOver={(e) => { const el = e.currentTarget; el.style.borderColor = "var(--gold)"; el.style.color = "var(--gold)"; }}
            onMouseOut={(e)  => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.color = "rgba(255,255,255,0.6)"; }}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="13" y1="1" x2="1"  y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

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
                      style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 0", gap: "1rem" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.58rem", color: "var(--gold)", letterSpacing: "0.1em", minWidth: "1.5rem" }}>0{i + 1}</span>
                        <span style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 400, color: "#fff", letterSpacing: "0.02em" }}>
                          {item.label}
                        </span>
                      </div>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{ transition: "transform 0.3s", transform: aboutExpanded ? "rotate(180deg)" : "none", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
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
                              style={{ fontFamily: "var(--font-inter)", fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.5rem" }}
                              onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)"; }}
                              onMouseOut={(e)  => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)"; }}
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
                      <span className="menu-item-label" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 400, color: "#fff", letterSpacing: "0.02em", transition: "color 0.2s" }}>
                        {item.label}
                      </span>
                    </div>
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
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
                style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
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
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .nav-cta     { display: none !important; }
        }
        @media (min-width: 1025px) and (max-width: 1536px) {
          .nav-inner { padding: 0 4rem !important; }
        }
        .menu-link:hover .menu-item-label { color: var(--gold) !important; }
        .menu-link:hover svg { color: rgba(201,168,76,0.6) !important; }
        .panel-cta:hover { background: #B8962A !important; }
      `}</style>
    </>
  );
}
