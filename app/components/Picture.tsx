"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const STRIP_DIRS: ("ltr" | "rtl")[] = ["ltr", "rtl", "ltr", "rtl", "ltr", "rtl"];

const BLUR_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTI1MzAiLz48L3N2Zz4=";

export default function Location({ images }: { images: string[] }) {
  const STRIPS = STRIP_DIRS.map((dir, i) => ({
    h: 16,
    w: 160,
    dir,
    img: i % images.length,
  }));

  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<"idle" | "sweeping" | "settled">("idle");
  const [winner, setWinner] = useState(0);
  const imageLoadedRef = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const stripsEndedRef = useRef(false);

  useEffect(() => {
    setWinner(Math.floor(Math.random() * images.length));
  }, [images.length]);

  // Settle as soon as both strips have finished AND the winner image has loaded
  useEffect(() => {
    if (imageLoaded && stripsEndedRef.current) {
      setPhase("settled");
    }
  }, [imageLoaded]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let stripTimer: ReturnType<typeof setTimeout>;
    let fallbackTimer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("sweeping");
          stripTimer = setTimeout(() => {
            stripsEndedRef.current = true;
            if (imageLoadedRef.current) setPhase("settled");
            // Otherwise the imageLoaded effect above will trigger settle
          }, 1500);
          // Hard fallback: settle regardless after 6s total (e.g. slow network)
          fallbackTimer = setTimeout(() => setPhase("settled"), 6000);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
      clearTimeout(stripTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="location"
      aria-label="Location"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        minHeight: "100vh",
        overflow: "hidden",
        background: "#111418",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.35)",
      }}
    >
      <div aria-hidden="true" className={`loc-stage${phase === "settled" ? " loc-stage-out" : ""}`} />
      <div aria-hidden="true" className="bullets-wrap">
        {STRIPS.map((s, i) => (
          <div
            key={i}
            className={`bullet-strip ${s.dir}${phase !== "idle" ? " bullet-fire" : ""}`}
            style={{
              flex: `0 0 ${s.h}vh`,
              width: `${s.w}vw`,
              animationDelay: `${(i * 0.03).toFixed(3)}s`,
            }}
          >
            <Image
              src={images[s.img]}
              alt=""
              fill
              style={{ objectFit: "cover", objectPosition: "center" }} 
              sizes="160vw"
              priority={i === 0}
              placeholder="blur"
              blurDataURL={BLUR_URL}
            />
          </div>
        ))}
      </div>

      <div className={`loc-bg${phase === "settled" ? " loc-bg-in" : ""}`}>
        <Image
          src={images[winner]}
          alt="Location"
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
          placeholder="blur"
          blurDataURL={BLUR_URL}
          onLoad={() => {
            imageLoadedRef.current = true;
            setImageLoaded(true);
          }}
        />
      </div>

      <div aria-hidden="true" className={`loc-overlay${phase === "settled" ? " loc-overlay-in" : ""}`}>
        <div className="loc-vignette" />
        <div className="loc-grad-top" />
        <div className="loc-grad-bottom" />
        <div className="loc-masthead-line" />
        <div className="loc-gold-ornament" />
      </div>

      <style>{`
        /* ── Stage ── */
        .loc-stage {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(ellipse 70% 70% at 50% 50%,
            #1e2530 0%, #111418 100%);
          transition: opacity 0.6s ease;
        }
        .loc-stage-out { opacity: 0; }

        /* ── Strip container: flex column covering full viewport ── */
        .bullets-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 1;
          /* overflow visible so strips can animate outside container bounds;
             the section's overflow:hidden clips them at the viewport edge */
          overflow: visible;
        }

        /* ── Individual bullet strip ── */
        .bullet-strip {
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 40px;
          will-change: transform;
          box-shadow:
            0 6px 22px rgba(0, 0, 0, 0.55),
            0 2px  6px rgba(0, 0, 0, 0.35),
            0 0 0 1px  rgba(255, 255, 255, 0.06);
        }
        .bullet-strip.ltr { transform: translateX(-162vw); }
        .bullet-strip.rtl { transform: translateX( 162vw); }

        /* ── Bullet fire animations ── */
        @keyframes bullet-ltr {
          from { transform: translateX(-162vw); }
          to   { transform: translateX( 162vw); }
        }
        @keyframes bullet-rtl {
          from { transform: translateX( 162vw); }
          to   { transform: translateX(-162vw); }
        }
        .ltr.bullet-fire {
          animation: bullet-ltr 1.8s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }
        .rtl.bullet-fire {
          animation: bullet-rtl 1.8s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }

        /* ── Winner fullscreen — clip-path expands from centre ── */
        .loc-bg {
          position: absolute; inset: 0;
          z-index: 3; opacity: 0;
          clip-path: inset(34vh 28vw round 8px);
          transition:
            opacity   0.35s ease,
            clip-path 1.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .loc-bg-in {
          opacity: 1;
          clip-path: inset(0px round 0px);
          animation: loc-kenburns 14s ease-out forwards;
        }
        @keyframes loc-kenburns {
          from { transform: scale(1.07); }
          to   { transform: scale(1.0);  }
        }

        /* ── Luxury overlay ── */
        .loc-overlay {
          position: absolute; inset: 0;
          z-index: 4; pointer-events: none;
          opacity: 0;
          transition: opacity 1.4s ease 0.4s;
        }
        .loc-overlay-in { opacity: 1; }

        .loc-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 130% 130% at 50% 50%,
            transparent 25%,
            rgba(6,8,12,0.18) 55%,
            rgba(6,8,12,0.65) 100%);
        }
        .loc-grad-top {
          position: absolute; top: 0; left: 0; right: 0; height: 25%;
          background: linear-gradient(to bottom,
            rgba(6,8,12,0.55) 0%, transparent 100%);
        }
        .loc-grad-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(to top,
            rgba(6,8,12,0.82) 0%, rgba(6,8,12,0.4) 40%, transparent 100%);
        }
        .loc-masthead-line {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(to right,
            transparent 0%,
            rgba(201,168,76,0.45) 20%,
            rgba(201,168,76,0.45) 80%,
            transparent 100%);
        }
        .loc-gold-ornament {
          position: absolute; bottom: 3.5rem; left: 50%;
          transform: translateX(-50%);
          width: 7rem; height: 1px;
          background: linear-gradient(to right,
            transparent,
            rgba(201,168,76,0.9) 25%,
            rgba(201,168,76,0.9) 75%,
            transparent);
        }
        .loc-gold-ornament::before,
        .loc-gold-ornament::after {
          content: ""; position: absolute; top: 50%;
          width: 5px; height: 5px;
          background: rgba(201,168,76,0.75);
          transform: translateY(-50%) rotate(45deg);
          box-shadow: 0 0 8px rgba(201,168,76,0.45);
        }
        .loc-gold-ornament::before { left:  -7px; }
        .loc-gold-ornament::after  { right: -7px; }

        @media (prefers-reduced-motion: reduce) {
          .ltr.bullet-fire, .rtl.bullet-fire { animation: none !important; transform: translateX(200vw) !important; }
          .loc-bg { transition: none !important; clip-path: inset(0px round 0px) !important; animation: none !important; }
          .loc-overlay { transition: none !important; opacity: 1 !important; }
          .loc-stage { transition: none !important; opacity: 0 !important; }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .bullets-wrap { gap: 3px; }
          .bullet-strip { border-radius: 30px; }
          .loc-bg { clip-path: inset(28vh 18vw round 6px); }
          /* Override: settled state must still expand to full screen on mobile */
          .loc-bg.loc-bg-in { clip-path: inset(0px round 0px) !important; }
        }
      `}</style>
    </section>
  );
}
