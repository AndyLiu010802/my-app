import { Suspense } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function PlaceholderPage({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <Suspense fallback={null}><Navigation /></Suspense>
      <main
        style={{
          minHeight: "100vh",
          background: "#0C0E11",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "8rem 2rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "1.5rem",
          }}
        >
          South Property
        </p>
        <div
          style={{
            width: "2rem",
            height: "1px",
            background: "var(--gold)",
            marginBottom: "2rem",
            opacity: 0.5,
          }}
        />
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 400,
            color: "#FFFFFF",
            textAlign: "center",
            letterSpacing: "0.02em",
            marginBottom: "1.5rem",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.9rem",
              color: "rgba(210,220,232,0.65)",
              textAlign: "center",
              maxWidth: "400px",
              lineHeight: 1.8,
            }}
          >
            {subtitle}
          </p>
        )}
        <p
          style={{
            marginTop: "3rem",
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(210,220,232,0.38)",
          }}
        >
          Coming Soon
        </p>
      </main>
      <Footer />
    </>
  );
}
