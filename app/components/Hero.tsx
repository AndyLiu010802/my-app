"use client";

import { useRef, useEffect } from "react";

export default function Hero({ videoUrl }: { videoUrl: string | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const handleScroll = () => {
      const naturalTop =
        window.scrollY + section.getBoundingClientRect().top;

      const progress = Math.min(
        1,
        Math.max(
          0,
          (window.scrollY - naturalTop) / section.offsetHeight
        )
      );
      content.style.transform = `translateY(${progress * -50}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#1C2128",
      }}
    >
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        {videoUrl && <source src={videoUrl} type="video/mp4" />}
      </video>

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(20, 25, 32, 0.68)", zIndex: 1 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)", zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: "absolute", top: 0, right: "15%", width: "1px", height: "40vh", background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.5), transparent)", zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: "20%", width: "1px", height: "35vh", background: "linear-gradient(to top, transparent, rgba(201,168,76,0.3), transparent)", zIndex: 2 }} />

      {/* Content — ref'd for parallax scroll offset */}
      <div
        ref={contentRef}
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 3,
          textAlign: "center",
          padding: "8rem 2rem 6rem",
          maxWidth: "900px",
          margin: "0 auto",
          willChange: "transform",
        }}
      >
        <div className="animate-fade-up">
          <p className="section-label" style={{ color: "var(--gold)", marginBottom: "2rem" }}>
            Lorem Ipsum
          </p>
        </div>

        <h1
          id="hero-heading"
          className="animate-fade-up animate-delay-200"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 400,
            color: "#FFFFFF",
            lineHeight: 1.15,
            letterSpacing: "0.02em",
            marginBottom: "2rem",
          }}
        >
          Lorem Ipsum Dolor
          <br />
          <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
            Sit Amet Consectetur
          </em>
        </h1>

        <div
          className="animate-fade-up animate-delay-400"
          style={{
            width: "3rem",
            height: "1px",
            background: "var(--gold)",
            margin: "0 auto 2rem",
          }}
        />

        <p
          className="animate-fade-up animate-delay-400"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.8,
            letterSpacing: "0.04em",
            maxWidth: "520px",
            margin: "0 auto 3rem",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div
          className="animate-fade-up animate-delay-600"
          style={{
            display: "flex",
            gap: "1.25rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a href="#residences" className="btn-gold cursor-box" onClick={(e) => { e.preventDefault(); const t = document.querySelector("#residences") as HTMLElement; if (t) window.scrollTo({ top: t.offsetTop, behavior: "smooth" }); }}>
            Lorem Ipsum
          </a>
          <a href="#contact" className="btn-outline" onClick={(e) => { e.preventDefault(); const t = document.querySelector("#contact") as HTMLElement; if (t) window.scrollTo({ top: t.offsetTop, behavior: "smooth" }); }}>
            Dolor Sit
          </a>
        </div>

        {/* Stats row */}
        <div
          className="animate-fade-up animate-delay-600 status-data hero-stats"

          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4rem",
            marginTop: "5rem",
            flexWrap: "wrap",

          }}
        >
          {[
            { value: "15+", label: "Lorem Ipsum" },
            { value: "200+", label: "Dolor Amet" },
            { value: "98%", label: "Sit Consectetur" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "2.2rem",
                  fontWeight: 400,
                  color: "var(--gold)",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(210,220,232,0.58)",
          }}
        >
          <a href="#vision" onClick={(e) => { e.preventDefault(); const t = document.querySelector("#vision") as HTMLElement; if (t) window.scrollTo({ top: t.offsetTop, behavior: "smooth" }); }}>Lorem </a>
        </span>
        <div
          style={{
            width: "1px",
            height: "3rem",
            background:
              "linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)",
          }}
        />
      </div>
      <style>{`
        @media (max-width: 768px) {
          .status-data { display: none !important; }
          .hero-content { padding: 7rem 1.5rem 3rem !important; max-width: 100% !important; }
          .hero-content h1 { font-size: 2.2rem !important; line-height: 1.2 !important; margin-bottom: 1rem !important; }
          .hero-content p  { font-size: 0.88rem !important; margin-bottom: 2rem !important; }
        }
        @media (max-width: 480px) {
          .hero-content { padding: 6rem 1.25rem 2.5rem !important; }
          .hero-content h1 { font-size: 1.9rem !important; }
        }
        @media (min-width: 1025px) and (max-width: 1536px) {
          .hero-content { padding: 3rem 5rem 2.5rem !important; max-width: 780px !important; }
          .hero-content h1 { font-size: 2.8rem !important; margin-bottom: 1.25rem !important; }
          .hero-content p  { font-size: 0.9rem !important; margin-bottom: 2rem !important; }
          .hero-stats { gap: 2rem !important; margin-top: 2rem !important; }
          .hero-stats > div > div:first-child { font-size: 1.7rem !important; }
        }
      `}</style>
    </section>
  );
}
