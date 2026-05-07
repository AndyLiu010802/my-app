"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Trigger inner content animations once the section is 15% visible
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("about-in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Parallax: while Properties is sliding up over About (scroll range naturalTop
  // → naturalTop + height), drift the inner grid upward at ~35% scroll speed.
  useEffect(() => {
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
      id="vision"
      className="about-section"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 2,
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
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6rem",
          alignItems: "center",
          willChange: "transform",
        }}
        className="about-grid"
      >
        {/* Text column — fades and slides up on scroll entry */}
        <div className="about-text">
          <p className="section-label">Lorem Ipsum</p>
          <div className="divider-gold" />
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "var(--gun-darkest)",
              lineHeight: 1.2,
              marginBottom: "2rem",
            }}
          >
            Lorem Ipsum Dolor
            <br />
            <em style={{ fontStyle: "italic", color: "var(--gun-mid)" }}>
              Sit Amet Consectetur
            </em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "1rem",
              color: "var(--gun-light)",
              lineHeight: 1.9,
              marginBottom: "1.5rem",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "1rem",
              color: "var(--gun-light)",
              lineHeight: 1.9,
              marginBottom: "3rem",
            }}
          >
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit.
          </p>
          <a href="#residences" className="btn-gold cursor-box">
            Lorem Ipsum
          </a>
        </div>

        {/* Visual panel — slides in from the right on scroll entry; hover rotates both cards */}
        <div className="about-visual-panel about-cards" style={{ position: "relative" }}>
          {/* Main image */}
          <div
            className="about-main-card"
            style={{
              width: "100%",
              aspectRatio: "4/5",
              position: "relative",
              overflow: "hidden",
              borderRadius: "0.5rem",
              background: "#2D3440",
              boxShadow: "0 2px 24px rgba(0,0,0,0.28)",
            }}
          >
            <Image
              src="/aboutImg1.jpg"
              alt="About"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyRDM0NDAiLz48L3N2Zz4="
            />
          </div>

          {/* Floating accent card */}
          <div
            className="about-accent-card"
            style={{
              position: "absolute",
              bottom: "-2rem",
              right: "-2rem",
              background: "linear-gradient(300deg, var(--gun-darkest) 0%, #808080 100%)",
              padding: "2rem",
              width: "200px",
              borderRadius: "0.5rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "2.5rem",
                color: "var(--gold)",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}
            >
              15+
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Lorem Ipsum
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-section { padding: 4rem 1.5rem !important; }
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            max-width: 100% !important;
          }
          .about-grid h2 { font-size: 1.9rem !important; }
          .about-grid p  { font-size: 0.9rem !important; }
          .about-accent-card { display: none !important; }
          .about-main-card { aspect-ratio: 16/9 !important; }
        }
        @media (max-width: 480px) {
          .about-section { padding: 3.5rem 1.25rem !important; }
        }
        @media (min-width: 1025px) and (max-width: 1536px) {
          .about-section { padding: 3rem 5rem !important; }
          .about-grid    { gap: 3rem !important; max-width: 1000px !important; }
          .about-grid h2 { font-size: 2.2rem !important; margin-bottom: 1.25rem !important; }
          .about-grid p  { font-size: 0.9rem !important; line-height: 1.75 !important; margin-bottom: 1rem !important; }
          .about-main-card { aspect-ratio: 3/4 !important; }
          .about-accent-card { width: 160px !important; padding: 1.25rem !important; bottom: -1.25rem !important; right: -1.25rem !important; }
          .about-accent-card > div:first-child { font-size: 2rem !important; }
        }

        @media (min-width: 769px) {
        /* Initial hidden state — both elements start invisible before the section enters view */
        .about-text {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .about-cards {
          opacity: 0;
          transform: translateY(60px) translateX(40px);
          transition: opacity 1s ease 0.2s, transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
        }

        /* Triggered once the section reaches 15% visibility (IntersectionObserver threshold) */
        .about-in-view .about-text {
          opacity: 1;
          transform: translateY(0);
        }

        .about-in-view .about-cards {
          opacity: 1;
          transform: translateX(0);
        }

        /* Hover rotation — parent selector drives both cards simultaneously.
           Bounce easing (0.34, 1.56, 0.64, 1) gives a slight overshoot feel.
           To adjust angle: change rotate() values on the two :hover rules below. */
        .about-main-card {
          transition:
            transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: center center;
          will-change: transform;
        }
        .about-visual-panel:hover .about-main-card {
          transform: scale(1.04) rotate(-5deg);
        }

        .about-accent-card {
          transition:
            transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: bottom left;
          will-change: transform;
        }
        .about-visual-panel:hover .about-accent-card {
          transform: scale(1.08) rotate(5deg);
        }
      }
      `}</style>
    </section>
  );
}
