"use client";
import { useState, useRef, useEffect } from "react";

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  project: string;
  message: string;
};

const BLANK: FormData = {
  firstname: "", lastname: "", email: "", phone: "", project: "", message: "",
};

function validate(f: FormData) {
  return {
    firstname: f.firstname.trim() ? "" : "First name is required",
    lastname: f.lastname.trim() ? "" : "Last name is required",
    email: !f.email.trim()
      ? "Email address is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)
        ? "Please enter a valid email address"
        : "",
    phone: f.phone.trim() ? "" : "Phone number is required",
    message: f.message.trim() ? "" : "Please include a message",
    project: "",
  };
}

const contactInfo = [
  {
    label: "Office",
    value: "123 Lorem Street, Melbourne VIC 3000",
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6.2C3.5 9.7 8 14.5 8 14.5C8 14.5 12.5 9.7 12.5 6.2C12.5 3.5 10.5 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+61 3 1234 5678",
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 3.5C3 3.5 4 2 5 2C6 2 6.5 3 7 4C7.5 5 7 5.5 6.5 6C7 7 9 9 10 9.5C10.5 9 11 8.5 12 9C13 9.5 14 10 14 11C14 12 12.5 13 12.5 13C11 14 4.5 8 3 5C2.5 3.5 3 3.5 3 3.5Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "enquiries@lorem.com.au",
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 5.5L8 9.5L14.5 5.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
];

export default function Enquiry() {
  const [form, setForm] = useState<FormData>(BLANK);
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const errors = validate(form);
  const err = (f: keyof typeof errors) =>
    (touched[f] || submitAttempted) ? errors[f] : "";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1025px)").matches) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / rect.height));
      content.style.transform = `translateY(${p * -20}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.focus();
    }
  }, [submitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setTouched(t => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (Object.values(errors).some(Boolean)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(BLANK);
    setTouched({});
    setSubmitAttempted(false);
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError("");
  };

  const Field = ({
    name, label, type = "text", autoComplete,
  }: {
    name: keyof FormData; label: string; type?: string; autoComplete?: string;
  }) => {
    const e = err(name);
    const errId = `eq-${name}-err`;
    return (
      <div className="eq-field">
        <label className={`eq-label${e ? " eq-label-err" : ""}`} htmlFor={`eq-${name}`}>
          {label} <span className="eq-req" aria-hidden="true">*</span>
        </label>
        <input
          id={`eq-${name}`}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`eq-input${e ? " eq-input-err" : ""}`}
          autoComplete={autoComplete}
          aria-required="true"
          aria-invalid={e ? true : undefined}
          aria-describedby={errId}
        />
        <div className="eq-bar">
          <div className={`eq-bar-fill${e ? " eq-bar-err" : ""}`} />
        </div>
        {e ? (
          <span id={errId} role="alert" className="eq-err-msg">
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
              <line x1="5" y1="3" x2="5" y2="5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <circle cx="5" cy="7.2" r="0.5" fill="currentColor" />
            </svg>
            {e}
          </span>
        ) : (
          <span id={errId} className="eq-err-msg eq-err-placeholder" aria-hidden="true" />
        )}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="enquiry-heading"
      className="enquiry-section"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 6,
        background: "var(--cream)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8rem 0",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.35)",
      }}
    >
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: "50%",
        width: "1px", height: "6rem",
        background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))",
      }} />

      <div ref={contentRef} style={{ willChange: "transform" }}>
        <div className="eq-container" style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 5rem" }}>
          <div className="enquiry-grid">

            {/* ── Left: info panel ── */}
            <div className="eq-info">
              <p className="section-label">Lorem Ipsum</p>
              <div className="divider-gold" />
              <h2 id="enquiry-heading" style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                fontWeight: 400,
                color: "var(--gun-darkest)",
                lineHeight: 1.2,
                marginBottom: "1.5rem",
              }}>
                Lorem Ipsum
                <br />
                <em style={{ fontStyle: "italic", color: "var(--gun-mist)" }}>
                  Dolor Sit Amet
                </em>
              </h2>
              <p style={{
                fontFamily: "var(--font-inter)",
                fontSize: "1rem",
                color: "var(--gun-mist)",
                lineHeight: 1.9,
                marginBottom: "2.5rem",
              }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
                {contactInfo.map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div className="eq-contact-icon" aria-hidden="true">{item.icon}</div>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--gun-darkest)",
                        marginBottom: "0.2rem",
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.95rem",
                        color: "var(--gun-darkest)",
                      }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="eq-note">
                <p style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.78rem",
                  color: "var(--gun-darkest)",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  Lorem ipsum dolor sit amet — we typically respond within 24 hours on business days.
                </p>
              </div>
            </div>

            {/* ── Right: form ── */}
            <div className="eq-form-wrap">
              {submitted ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
                  <div className="eq-success-icon" aria-hidden="true">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <path d="M4 13L10 19L22 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3
                    ref={successRef}
                    tabIndex={-1}
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "2rem",
                      fontWeight: 400,
                      color: "var(--gun-darkest)",
                      marginBottom: "1rem",
                      outline: "none",
                    }}
                  >
                    Enquiry Sent
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9rem",
                    color: "var(--gun-darkest)",
                    lineHeight: 1.8,
                    marginBottom: "2.5rem",
                    maxWidth: "340px",
                    margin: "0 auto 2.5rem",
                  }}>
                    Thank you, {form.firstname}. Lorem ipsum dolor sit amet consectetur.
                    We&apos;ll be in touch shortly.
                  </p>
                  <button onClick={handleReset} className="btn-gold cursor-box" style={{ width: "200px", margin: "0 auto" }}>
                    New Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>

                  <div className="eq-row-2">
                    <Field name="firstname" label="First Name" autoComplete="given-name" />
                    <Field name="lastname" label="Last Name" autoComplete="family-name" />
                  </div>

                  <div className="eq-row-2">
                    <Field name="email" label="Email Address" type="email" autoComplete="email" />
                    <Field name="phone" label="Phone Number" type="tel" autoComplete="tel" />
                  </div>

                  <div className="eq-field">
                    <label className="eq-label eq-label-static" htmlFor="eq-project">
                      Project Interest
                    </label>
                    <div className="eq-select-wrap">
                      <select
                        id="eq-project"
                        name="project"
                        value={form.project}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`eq-input eq-select${form.project ? " eq-select-filled" : ""}`}
                      >
                        <option value="">— Select a project type —</option>
                        <option value="residential">Residential</option>
                        <option value="penthouse">Penthouse</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="investment">Investment Property</option>
                        <option value="commercial">Commercial</option>
                      </select>
                      <div className="eq-select-chevron" aria-hidden="true">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="eq-bar">
                      <div className="eq-bar-fill" />
                    </div>
                    <span className="eq-err-msg eq-err-placeholder" aria-hidden="true" />
                  </div>

                  <div className="eq-field">
                    <label
                      className={`eq-label${err("message") ? " eq-label-err" : ""}`}
                      htmlFor="eq-message"
                    >
                      Your Message <span className="eq-req" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="eq-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                      className={`eq-input eq-textarea${err("message") ? " eq-input-err" : ""}`}
                      aria-required="true"
                      aria-invalid={err("message") ? true : undefined}
                      aria-describedby="eq-message-err"
                    />
                    <div className="eq-bar">
                      <div className={`eq-bar-fill${err("message") ? " eq-bar-err" : ""}`} />
                    </div>
                    {err("message") ? (
                      <span id="eq-message-err" role="alert" className="eq-err-msg">
                        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
                          <line x1="5" y1="3" x2="5" y2="5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                          <circle cx="5" cy="7.2" r="0.5" fill="currentColor" />
                        </svg>
                        {err("message")}
                      </span>
                    ) : (
                      <span id="eq-message-err" className="eq-err-msg eq-err-placeholder" aria-hidden="true" />
                    )}
                  </div>

                  <button type="submit" className="eq-submit" disabled={submitting}>
                    <span>{submitting ? "Sending…" : "Send Enquiry"}</span>
                    {!submitting && (
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8H14M9 3L14 8L9 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  {submitError && (
                    <p
                      role="alert"
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.75rem",
                        color: "rgba(210,70,70,0.9)",
                        marginTop: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      {submitError}
                    </p>
                  )}
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .enquiry-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 8rem;
          align-items: start;
        }

        .eq-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        .eq-contact-icon {
          width: 36px;
          height: 36px;
          border: 1px solid var(--gun-darkest);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          flex-shrink: 0;
          transition: background 0.3s;
        }
        .eq-contact-icon:hover { background: var(--gun-darkest); }

        .eq-note {
          padding: 1rem 1.25rem;
          border-left: 2px solid var(--gold);
          background: rgba(201,168,76,0.04);
        }

        .eq-field {
          margin-bottom: 0.25rem;
        }

        .eq-label {
          display: block;
          font-family: var(--font-inter);
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gun-darkest);
          margin-bottom: 0.6rem;
          transition: color 0.25s ease;
        }
        .eq-field:focus-within .eq-label { color: var(--gold); }
        .eq-label-err { color: rgba(210, 70, 70, 0.75) !important; }
        .eq-field:focus-within .eq-label-err { color: rgba(210, 70, 70, 0.9) !important; }
        .eq-label-static { color: var(--gun-darkest); }
        .eq-field:focus-within .eq-label-static { color: var(--gold); }
        .eq-req { color: var(--gold); opacity: 0.8; }

        .eq-input {
          display: block;
          width: 100%;
          padding: 0.9rem 0;
          background: transparent;
          border: none;
          color: var(--gun-darkest);
          font-family: var(--font-inter);
          font-size: 1rem;
          outline: none;
          caret-color: var(--gold);
          appearance: none;
          -webkit-appearance: none;
        }
        .eq-input::placeholder { color: var(--gun-darkest); }
        .eq-input-err::placeholder { color: rgba(210,70,70,0.3); }
        .eq-input:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

        .eq-bar {
          position: relative;
          height: 1px;
          background: var(--gun-darkest);
          margin-bottom: 0.4rem;
        }
        .eq-bar-fill {
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .eq-field:focus-within .eq-bar-fill { transform: scaleX(1); }
        .eq-bar-err {
          background: rgba(210, 70, 70, 0.8);
          transform: scaleX(1) !important;
        }

        .eq-err-msg {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-inter);
          font-size: 0.68rem;
          letter-spacing: 0.03em;
          color: rgba(210, 70, 70, 0.85);
          min-height: 1.4rem;
          padding-top: 0.1rem;
        }
        .eq-err-placeholder { visibility: hidden; }

        .eq-select-wrap {
          position: relative;
        }
        .eq-select {
          cursor: pointer;
          color: rgba(210,220,232,0.42);
        }
        .eq-select-filled { color: var(--gun-darkest); }
        .eq-select option {
          background: #1C2128;
          color: var(--gun-darkest);
        }
        .eq-select-chevron {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(210,220,232,0.52);
          pointer-events: none;
          transition: color 0.25s, transform 0.25s;
        }
        .eq-field:focus-within .eq-select-chevron {
          color: var(--gold);
          transform: translateY(-50%) rotate(180deg);
        }

        .eq-textarea {
          resize: none;
          line-height: 1.75;
        }

        .eq-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1.3rem 2rem;
          margin-top: 1.25rem;
          background: var(--gold);
          border: 1px solid var(--gold);
          color: #FFFFFF;
          font-family: var(--font-inter);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s ease, letter-spacing 0.3s ease, gap 0.3s ease;
        }
        .eq-submit:hover:not(:disabled) {
          background: #b8962a;
          border-color: #b8962a;
          letter-spacing: 0.3em;
          gap: 1rem;
        }
        .eq-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .eq-submit:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 3px;
        }

        .eq-success-icon {
          width: 64px;
          height: 64px;
          border: 1px solid var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: var(--gold);
          animation: eq-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes eq-pop {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .eq-success-icon { animation: none; }
          .eq-bar-fill { transition: none; }
          .eq-submit { transition: none; }
          .eq-label { transition: none; }
          .eq-select-chevron { transition: none; }
          .eq-contact-icon { transition: none; }
        }

        @media (min-width: 1025px) and (max-width: 1536px) {
          .enquiry-section { padding: 3rem 0 !important; }
          .eq-container    { padding: 0 5rem !important; max-width: 1100px !important; }
          .enquiry-grid    { gap: 4rem !important; }
          .eq-info h2      { font-size: 2.2rem !important; margin-bottom: 1rem !important; }
          .eq-info p       { font-size: 0.88rem !important; margin-bottom: 1.75rem !important; }
          .eq-row-2        { gap: 1.5rem !important; }
          .eq-submit       { padding: 1rem 2rem !important; margin-top: 0.75rem !important; }
        }
        @media (max-width: 1024px) {
          .enquiry-grid {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
        }
        @media (max-width: 768px) {
          .enquiry-section { padding: 4rem 0 !important; }
          .eq-container    { padding: 0 1.5rem !important; max-width: 100% !important; }
          .enquiry-grid    { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .eq-info h2      { font-size: 1.9rem !important; }
        }
        @media (max-width: 600px) {
          .enquiry-section { padding: 3.5rem 0 !important; }
          .eq-container    { padding: 0 1.25rem !important; }
          .eq-row-2        { grid-template-columns: 1fr !important; gap: 0 !important; }
        }
      `}</style>
    </section>
  );
}
