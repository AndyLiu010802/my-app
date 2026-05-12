"use client";

const footerLinks = {
  Lorem: ["Ipsum Dolor", "Sit Amet", "Consectetur", "Adipiscing Elit"],
  Ipsum: ["Lorem Dolor", "Sit Amet", "Eiusmod Tempor", "Incididunt Labore"],
  Dolor: ["Lorem Ipsum", "Sit Veniam", "Quis Nostrud", "Ullamco Laboris"],
  Amet: ["Lorem Ipsum", "Dolor Sit", "Consectetur", "Adipiscing"],
};

export default function Footer() {
  return (
    <footer
      className="footer-outer"
      style={{
        background: "#111518",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "5rem 2.5rem 2.5rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Top: Logo + links */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "4rem",
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  letterSpacing: "0.12em",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                LOREM
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.55rem",
                  fontWeight: 400,
                  color: "var(--gold)",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                }}
              >
                IPSUM
              </div>
            </div>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
              quis nostrud exercitation ullamco.
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                {
                  label: "Instagram",
                  icon: (
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  icon: (
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  icon: (
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  ),
                },
              ].map((social) => (
                <button
                  key={social.label}
                  aria-label={social.label}
                  style={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    transition: "border-color 0.3s, color 0.3s",
                  }}
                  onMouseOver={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "var(--gold)";
                    el.style.color = "var(--gold)";
                  }}
                  onMouseOut={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = "rgba(255,255,255,0.1)";
                    el.style.color = "rgba(255,255,255,0.6)";
                  }}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h5
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "1.5rem",
                }}
              >
                {category}
              </h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "rgba(255,255,255,0.8)";
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "rgba(255,255,255,0.6)";
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)",
            marginBottom: "2rem",
          }}
        />

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
            }}
          >
            © {new Date().getFullYear()} Lorem Ipsum Pty Ltd. Lorem ipsum
            dolor sit amet. ABN 00 000 000 000. Consectetur Adipiscing.
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
            eiusmod tempor incididunt ut labore et dolore.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .footer-outer { padding: 3.5rem 1.5rem 2rem !important; }
          .footer-grid  { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; margin-bottom: 2.5rem !important; }
          .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; }
        }
        @media (max-width: 480px) {
          .footer-outer { padding: 3rem 1.25rem 1.5rem !important; }
          .footer-grid  { grid-template-columns: 1fr !important; gap: 1.75rem !important; }
        }
      `}</style>
    </footer>
  );
}
