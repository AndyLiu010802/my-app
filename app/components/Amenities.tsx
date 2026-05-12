"use client";

import { useRef, useEffect } from "react";

const features = [
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="20" width="24" height="3" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="8" y="12" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="16" y1="4" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Lorem Ipsum Dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 8 C16 8 22 13 22 17 C22 20.3 19.3 23 16 23 C12.7 23 10 20.3 10 17 C10 13 16 8 16 8Z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Sit Amet Consectetur",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="10" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 10V7C10 5.3 11.3 4 13 4H19C20.7 4 22 5.3 22 7V10" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="16" y1="14" x2="16" y2="22" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="12" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Adipiscing Elit Sed",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur occaecat.",
  },
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Eiusmod Tempor",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 26C6 20.477 10.477 16 16 16C21.523 16 26 20.477 26 26" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="6" y1="6" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="26" y1="6" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Incididunt Labore",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
  },
  {
    icon: (
      <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 8V16L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Magna Aliqua Enim",
    description:
      "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor.",
  },
];

export default function Amenities() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Trigger entrance animations once section is 15% visible
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("amenities-in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;
    const naturalTop = window.scrollY + section.getBoundingClientRect().top;
    const handleScroll = () => {
      const progress = Math.min(1, Math.max(0, (window.scrollY - naturalTop) / section.offsetHeight));
      inner.style.transform = `translateY(${progress * -40}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      aria-labelledby="amenities-heading"
      className="amenities-section"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 4,
        background: "var(--cream)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "8rem 2.5rem",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.18)",
      }}
    >
      <div
        ref={innerRef}
        className="amenities-inner"
        style={{ maxWidth: "1000px", margin: "0 auto", width: "100%", willChange: "transform" }}
      >
        {/* Section header */}
        <div className="amenities-header" style={{ maxWidth: "600px", marginBottom: "5rem" }}>
          <p className="section-label">Lorem Ipsum Dolor</p>
          <div className="divider-gold" />
          <h2
            id="amenities-heading"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 2vw, 3rem)",
              fontWeight: 400,
              color: "var(--gun-darkest)",
              lineHeight: 1.2,
            }}
          >
            Lorem Ipsum Dolor
            <br />
            <em style={{ fontStyle: "italic", color: "var(--gun-mid)" }}>
              Sit Amet
            </em>
          </h2>
        </div>

        {/* Features grid */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
          }}
          className="amenities-grid features-grid"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                padding: "2.5rem",
                borderRight:
                  (index + 1) % 3 !== 0
                    ? "1px solid rgba(75,85,99,0.12)"
                    : "none",
                borderBottom:
                  index < 3 ? "1px solid rgba(75,85,99,0.12)" : "none",
                transition: "background 0.3s ease",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(75,85,99,0.04)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "transparent";
              }}
            >
              <div
                style={{
                  color: "var(--gun-mid)",
                  marginBottom: "1.5rem",
                  transition: "color 0.3s",
                }}
              >
                {feature.icon}
              </div>

              <div
                className="amenities-divider"
                style={{
                  width: "2rem",
                  height: "1px",
                  background: "var(--gold)",
                  marginBottom: "1.25rem",
                }}
              />

              <h3
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  color: "var(--gun-darkest)",
                  marginBottom: "0.75rem",
                  lineHeight: 1.3,
                }}
              >
                {feature.title}
              </h3>
              <p
                className="amenities-desc"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.875rem",
                  color: "var(--gun-light)",
                  lineHeight: 1.8,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .amenities-header {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .amenities-grid {
          opacity: 0;
          transform: translateY(80px);
          transition: opacity 1s ease 0.2s, transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
        }

        .amenities-in-view .amenities-header {
          opacity: 1;
          transform: translateY(0);
        }

        .amenities-in-view .amenities-grid {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .amenities-header, .amenities-grid { transition: none !important; opacity: 1 !important; transform: none !important; }
        }

        @media (min-width: 1025px) and (max-width: 1536px) {
          .amenities-section { padding: 3rem 5rem !important; }
          .amenities-inner   { max-width: 860px !important; }
          .amenities-in-view .amenities-header,
          .amenities-header  { margin-bottom: 2rem !important; max-width: 500px !important; }
          .amenities-header h2 { font-size: 2rem !important; }
          .amenities-grid > div,
          .features-grid  > div { padding: 1.5rem !important; }
          .amenities-desc { font-size: 0.8rem !important; line-height: 1.65 !important; }
        }
        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .features-grid > div:nth-child(2n) {
            border-right: none !important;
          }
          .features-grid > div:nth-child(3),
          .features-grid > div:nth-child(4) {
            border-bottom: 1px solid rgba(75,85,99,0.12) !important;
          }
          .features-grid > div:nth-child(5),
          .features-grid > div:nth-child(6) {
            border-bottom: none !important;
          }
        }
        @media (max-width: 768px) {
          .amenities-section { padding: 4rem 1.5rem !important; }
          .amenities-inner   { max-width: 100% !important; }
          .amenities-header  { margin-bottom: 2rem !important; max-width: 100% !important; }
          .amenities-header h2 { font-size: 1.9rem !important; }
        }
        @media (max-width: 640px) {
          .amenities-section { padding: 3.5rem 1.25rem !important; }
          .features-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 0.65rem !important;
          }
          .features-grid > div {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 1.25rem !important;
            padding: 1rem 1.25rem !important;
            border: 1px solid rgba(75,85,99,0.14) !important;
            border-radius: 14px !important;
            background: rgba(75,85,99,0.04) !important;
          }
          .amenities-divider,
          .amenities-desc { display: none !important; }
          .features-grid > div > div:first-child {
            margin-bottom: 0 !important;
            flex-shrink: 0;
            color: var(--gold) !important;
          }
          .features-grid > div > h3 {
            font-size: 0.95rem !important;
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
