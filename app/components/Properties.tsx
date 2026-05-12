"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import type { Property } from "../../lib/datocms";

const CARD_W = 460;
const GAP = 24;
const UNIT = CARD_W + GAP;

const BLUR_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyRDM0NDAiLz48L3N2Zz4=";

export default function Properties({ properties }: { properties: Property[] }) {
  // Exactly 2 copies — animation scrolls translateX(-50%) = one full set, loops seamlessly
  const carouselItems = [...properties, ...properties];
  const TOTAL = properties.length * UNIT;
  // ~50px/s feels natural; minimum 15s so short lists don't spin too fast
  const duration = properties.length > 0 ? Math.max(15, TOTAL / 50) : 20;

  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("props-in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="residences"
      ref={sectionRef}
      aria-labelledby="properties-heading"
      className="props-section"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 3,
        background: "var(--gun-darkest)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8rem 0",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.35)",
      }}
    >
      {/* Section header — title + "View all" link */}
      <div
        className="props-header"
        style={{

          margin: "0 auto",
          padding: "0 2.5rem",
          marginBottom: "4rem",
          width: "80%",
          height: "100%",
        }}
      >
        <p className="section-label">Lorem Ipsum</p>
        <div className="divider-gold" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h2
            id="properties-heading"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "#FFFFFF",
              lineHeight: 1.2,
            }}
          >
            Lorem &amp; Ipsum
            <br />
            <em style={{ fontStyle: "italic", color: "var(--gun-mist)" }}>
              Dolor Amet
            </em>
          </h2>
          <a
            href="#contact"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--gold)",
              textDecoration: "none",
              borderBottom: "1px solid var(--gold)",
              paddingBottom: "2px",
              whiteSpace: "nowrap",
            }}
          >
            Lorem Ipsum →
          </a>
        </div>
      </div>


      <div
        className="props-carousel"
        style={{ width: "80vw", margin: "0 auto", overflow: "hidden" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="props-track"
          style={{
            display: "flex",
            gap: `${GAP}px`,
            width: "max-content",
            willChange: "transform",
            ["--scroll-duration" as string]: `${duration}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {carouselItems.map((property, index) => (
            <div
              key={index}
              aria-hidden={index >= properties.length ? "true" : undefined}
              className="props-card"
              style={{
                width: `${CARD_W}px`,
                flexShrink: 0,
                background: "var(--gun-dark)",
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(201,168,76,0.3)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(255,255,255,0.06)";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Property image */}
              <div
                className="props-card-img"
                style={{
                  position: "relative",
                  height: "300px",
                  overflow: "hidden",
                  background: "#2D3440",
                }}
              >
                <Image
                  src={property.image[0]?.url ?? ""}
                  alt={property.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 460px"
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                  blurDataURL={BLUR_URL}
                />
              </div>

              {/* Card body */}
              <div style={{ padding: "1.5rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {property.location}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "1.3rem",
                    fontWeight: 400,
                    color: "#FFFFFF",
                    marginBottom: "1.25rem",
                    lineHeight: 1.2,
                  }}
                >
                  {property.name}
                </h3>

                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.08)",
                    marginBottom: "1.25rem",
                  }}
                />

                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.6)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Price
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "1.1rem",
                      color: "#FFFFFF",
                    }}
                  >
                    {property.price}
                  </div>
                </div>

                <a
                  href="#contact"
                  style={{
                    display: "block",
                    marginTop: "1.25rem",
                    padding: "0.7rem",
                    border: "1px solid rgba(201,168,76,0.35)",
                    textAlign: "center",
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    textDecoration: "none",
                    transition: "background 0.3s, border-color 0.3s",
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(201,168,76,0.1)";
                    el.style.borderColor = "var(--gold)";
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "transparent";
                    el.style.borderColor = "rgba(201,168,76,0.35)";
                  }}
                >
                  Lorem Ipsum Dolor
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
      @keyframes props-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .props-track { animation: none !important; }
        .props-header, .props-carousel { transition: none !important; opacity: 1 !important; transform: none !important; }
      }
      .props-track {
        animation-name: props-scroll;
        animation-duration: var(--scroll-duration, 20s);
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
      @media (min-width: 1025px) and (max-width: 1536px) {
        .props-section    { padding: 3rem 0 !important; }
        .props-header     { margin-bottom: 2rem !important; padding: 0 5rem !important; width: 100% !important; }
        .props-header h2  { font-size: 2.2rem !important; }
        .props-carousel   { width: 90vw !important; }
        .props-card       { width: 360px !important; }
        .props-card-img   { height: 230px !important; }
        .props-card > div:last-child { padding: 1.1rem !important; }
      }
      @media (max-width: 767px) {
        .props-section   { padding: 4rem 0 !important; }
        .props-header    { width: 92vw !important; padding: 0 1.5rem !important; margin-bottom: 2rem !important; }
        .props-header h2 { font-size: 1.9rem !important; }
        .props-carousel  { width: 92vw !important; overflow: hidden; }
        .props-card      { width: 78vw !important; }
        .props-card-img  { height: 200px !important; }
        .props-card > div:last-child { padding: 1rem !important; }
      }
      @media (max-width: 480px) {
        .props-card     { width: 85vw !important; }
        .props-card-img { height: 180px !important; }
      }
      @media (min-width: 768px) {

        /* Initial hidden state — elements start low and invisible */
        .props-header {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .props-carousel {
          opacity: 0;
          transform: translateY(80px);
          transition: opacity 1s ease 0.2s, transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
        }

        /* Triggered once the section reaches 15% visibility */
        .props-in-view .props-header {
          opacity: 1;
          transform: translateY(0);
        }

        .props-in-view .props-carousel {
          opacity: 1;
          transform: translateY(0);
      }}
      `}</style>
    </section>
  );
}
