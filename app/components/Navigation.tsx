"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Lorem", href: "#vision" },
  { label: "Ipsum", href: "#residences" },
  { label: "Dolor", href: "#features" },
  { label: "Amet", href: "#location" },
  { label: "Sit", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    let top = 0;
    let sibling = target.previousElementSibling as HTMLElement | null;
    while (sibling) {
      top += sibling.offsetHeight;
      sibling = sibling.previousElementSibling as HTMLElement | null;
    }
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background 0.4s ease, box-shadow 0.4s ease",
        background: scrolled ? "rgba(28, 33, 40, 0.97)" : "transparent",
        boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.18)" : "none",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div
        className="nav-inner"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2.5rem",
          height: "5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "2px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.35rem",
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "0.12em",
              lineHeight: 1,
            }}
          >
            LOREM
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.6rem",
              fontWeight: 400,
              color: "var(--gold)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            IPSUM
          </span>
        </a>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link" onClick={(e) => scrollToSection(e, link.href)}>
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            style={{
              padding: "0.6rem 1.6rem",
              background: "var(--gold)",
              color: "#FFFFFF",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.3s",
              border: "1px solid var(--gold)",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#B8962A";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "var(--gold)";
            }}
          >
            Lorem Ipsum
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            flexDirection: "column",
            gap: "5px",
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: "block",
                width: "24px",
                height: "1px",
                background: "#FFFFFF",
                transition: "transform 0.3s, opacity 0.3s",
                transform:
                  menuOpen && i === 0
                    ? "rotate(45deg) translate(4px, 4px)"
                    : menuOpen && i === 1
                      ? "scaleX(0)"
                      : menuOpen && i === 2
                        ? "rotate(-45deg) translate(4px, -4px)"
                        : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(28, 33, 40, 0.98)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "2rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              style={{
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 400,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="btn-gold cursor-box"

          >
            contact
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 1025px) and (max-width: 1536px) {
          .nav-inner { padding: 0 4rem !important; }
        }
      `}</style>
    </header>
  );
}
