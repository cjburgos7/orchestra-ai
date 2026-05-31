"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Foundation1Slots } from "@/lib/types/startup";

// Foundation #3 reuses Foundation1Slots — same data model, Future visual treatment
export type Foundation3Slots = Foundation1Slots;

const F3_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";

const SENSITIVITY = 0.8;

function clamp(min: number, max: number, val: number): number {
  return Math.min(max, Math.max(min, val));
}

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let idx = 0;
    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export const DEFAULT_F3_SLOTS: Foundation3Slots = {
  logoText: "Mainframe",
  navItems: [
    { label: "Features",  href: "#features",  muted: false },
    { label: "Process",   href: "#process",   muted: false },
    { label: "Contact",   href: "#contact",   muted: false },
    { label: "Work",      href: "#cta",       muted: false },
  ],
  navCtaLabel: "Get in touch",
  headline: "Glad you stopped in. Good taste tends to find us. Now, what are we building?",
  headlineItalicFragments: [],
  description: "Your creative partner for the next generation",
  heroCtaLabel: "Get in touch",
  videoUrl: F3_VIDEO_URL,
  stats: [],
  process: [],
  featuresTitle: "What we do",
  features: [
    { title: "Pitch us an idea",   body: "" },
    { title: "Come work here",     body: "" },
    { title: "Send a brief hello", body: "" },
    { title: "See how we operate", body: "" },
  ],
  testimonials: [],
  ctaHeadline: "Let's build something.",
  ctaBody: "",
  ctaButtonLabel: "Get in touch",
};

export default function Foundation3({ slots = DEFAULT_F3_SLOTS }: { slots?: Foundation3Slots }) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const imageRef  = useRef<HTMLImageElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);

  const introLine1 = `Hey there, meet ${slots.logoText},`;
  const introLine2 = slots.description || "Your creative partner for the next generation";

  const typewriterText =
    slots.headline.length > 30
      ? slots.headline
      : `Glad you stopped in. Good taste tends to find us. Now, what are we building?`;

  const { displayed, done } = useTypewriter(typewriterText, 38, 600);

  // Mouse-scrub video
  const prevXRef      = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const seekingRef    = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function doSeek() {
      if (!video) return;
      video.currentTime = targetTimeRef.current;
    }

    function onSeeked() {
      seekingRef.current = false;
      if (video && Math.abs(video.currentTime - targetTimeRef.current) > 0.05) {
        seekingRef.current = true;
        doSeek();
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!video || !video.duration) return;
      const delta =
        prevXRef.current !== null ? e.clientX - prevXRef.current : 0;
      prevXRef.current = e.clientX;
      if (delta === 0) return;
      const newTime = clamp(
        0,
        video.duration,
        targetTimeRef.current +
          (delta / window.innerWidth) * SENSITIVITY * video.duration
      );
      targetTimeRef.current = newTime;
      if (!seekingRef.current) {
        seekingRef.current = true;
        doSeek();
      }
    }

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Image mode — mouse-driven parallax mirroring the video scrub feel
  const prevXImageRef   = useRef<number | null>(null);
  const imageOffsetXRef = useRef(0);
  const rafImageRef     = useRef(0);

  useEffect(() => {
    if (!slots.imageUrl) return;

    function onMouseMove(e: MouseEvent) {
      const img = imageRef.current;
      if (!img) return;
      const delta = prevXImageRef.current !== null ? e.clientX - prevXImageRef.current : 0;
      prevXImageRef.current = e.clientX;
      if (delta === 0) return;
      // Accumulate offset — same SENSITIVITY constant as video scrub
      imageOffsetXRef.current = clamp(
        -5,
        5,
        imageOffsetXRef.current + (delta / window.innerWidth) * SENSITIVITY * 10
      );
      cancelAnimationFrame(rafImageRef.current);
      rafImageRef.current = requestAnimationFrame(() => {
        if (imageRef.current) {
          imageRef.current.style.transform = `scale(1.06) translateX(${imageOffsetXRef.current}%)`;
        }
      });
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafImageRef.current);
    };
  }, [slots.imageUrl]);

  // Pills appear 400ms after mount
  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Nav items — map to real section anchors
  const navAnchors = ["#features", "#process", "#contact", "#cta"];
  const navItems = (slots.navItems.slice(0, 4).length
    ? slots.navItems.slice(0, 4)
    : [
        { label: "Features",  href: "#features" },
        { label: "Process",   href: "#process" },
        { label: "Contact",   href: "#contact" },
        { label: "Work",      href: "#cta" },
      ]
  ).map((item, i) => ({ ...item, href: navAnchors[i] ?? item.href }));

  // Pill button labels from features (first 4), mapped to anchors
  const defaults = ["Features", "Process", "Contact", "Let's work"];
  const pillAnchors = ["#features", "#process", "#contact", "#cta"];
  const pillButtons = [0, 1, 2, 3].map((i) => ({
    label: slots.features?.[i]?.title || defaults[i],
    anchor: pillAnchors[i],
  }));

  const brandSlug    = slots.logoText.toLowerCase().replace(/[^a-z0-9]/g, "");
  const contactEmail = `hello@${brandSlug}.co`;

  // Features (3 items for grid, or however many exist)
  const featureItems = (slots.features ?? []).slice(0, 3);

  // Process steps
  const processItems = (slots.process ?? []).slice(0, 3);

  // Stats
  const statItems = slots.stats ?? [];

  function scrollTo(id: string) {
    if (typeof document !== "undefined") {
      document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    }
  }

  // When a Flux image is present, use it as full-bleed background (dark cinematic mode)
  const isImageMode = !!slots.imageUrl;
  const tc  = isImageMode ? "#fff" : "#000";
  const tcb = isImageMode ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";

  return (
    <>
      <style>{`
        @import url('https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium');
        @import url('https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg');
        .f3-root {
          font-family: 'HelveticaNowDisplayW01-Rg', 'Helvetica Neue', Arial, sans-serif;
        }
        .f3-logo-text {
          font-family: 'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif;
        }
        @keyframes f3-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .f3-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: var(--f3-tc, #000);
          vertical-align: middle;
          margin-left: 2px;
          animation: f3-blink 1s step-end infinite;
        }
        .f3-ham-bar {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--f3-tc, #000);
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .f3-ham-open .f3-bar-1 { transform: rotate(45deg) translate(0, 7px); }
        .f3-ham-open .f3-bar-2 { opacity: 0; }
        .f3-ham-open .f3-bar-3 { transform: rotate(-45deg) translate(0, -7px); }
        @media (min-width: 768px) {
          .f3-desktop-nav { display: flex !important; }
          .f3-desktop-cta { display: block !important; }
          .f3-ham         { display: none !important; }
          .f3-hero { justify-content: center !important; padding-bottom: 0 !important; }
        }
        /* Features grid */
        .f3-features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 640px) {
          .f3-features-grid { grid-template-columns: repeat(3, 1fr); }
        }
        /* Process grid */
        .f3-process-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 640px) {
          .f3-process-grid { grid-template-columns: repeat(3, 1fr); }
        }
        /* Stats band */
        .f3-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0;
        }
        @media (min-width: 640px) {
          .f3-stats-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      <div className="f3-root" style={{ position: "relative", minHeight: "100vh", background: "#fff", "--f3-tc": tc } as React.CSSProperties}>

        {/* ── Background: Flux cinematic image OR default robot video ── */}
        {isImageMode ? (
          <>
            <img
              ref={imageRef}
              src={slots.imageUrl!}
              alt=""
              aria-hidden="true"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                width: "110%",
                height: "110vh",
                marginLeft: "-5%",
                marginTop: "-5vh",
                objectFit: "cover",
                objectPosition: "center",
                transform: "scale(1.06) translateX(0%)",
                willChange: "transform",
              }}
            />
            {/* Cinematic gradient — top & bottom darkening for text legibility */}
            <div aria-hidden="true" style={{
              position: "fixed", inset: 0, zIndex: 1,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.8) 100%)",
              pointerEvents: "none",
            }} />
            {/* Radial vignette */}
            <div aria-hidden="true" style={{
              position: "fixed", inset: 0, zIndex: 1,
              background: "radial-gradient(ellipse at 60% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
              pointerEvents: "none",
            }} />
          </>
        ) : (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              width: "100%",
              height: "100vh",
              objectFit: "cover",
              objectPosition: "70% center",
            }}
          >
            <source src={F3_VIDEO_URL} type="video/mp4" />
          </video>
        )}

        {/* ── Navbar ── */}
        <nav style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(1rem, 2vw, 1.25rem) clamp(1.25rem, 4vw, 2rem)",
        }}>
          {/* Back to Orchestra */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link
              href="/projects"
              style={{
                fontSize: "clamp(11px, 1.2vw, 13px)",
                color: tc,
                textDecoration: "none",
                opacity: 0.45,
                letterSpacing: "0.01em",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.45"; }}
            >
              ← Orchestra
            </Link>

            {/* Logo */}
            <span
              className="f3-logo-text"
              style={{ fontSize: "clamp(18px, 2.5vw, 24px)", letterSpacing: "-0.02em", color: tc }}
            >
              {slots.logoText}
              <sup style={{ fontSize: "0.5em", verticalAlign: "super" }}>®</sup>
            </span>
            <span
              aria-hidden="true"
              style={{ fontSize: "clamp(22px, 3vw, 30px)", color: tc, userSelect: "none", letterSpacing: "-0.02em" }}
            >✳︎</span>
          </div>

          {/* Desktop links */}
          <div
            className="f3-desktop-nav"
            style={{ display: "none", alignItems: "center", gap: "0" }}
          >
            {navItems.map((item, i) => (
              <span key={item.label} style={{ fontSize: "clamp(18px, 2vw, 22px)", color: tc }}>
                {i > 0 && <span style={{ opacity: 0.35, marginRight: "0.15em" }}>,</span>}
                <a
                  href={item.href || "#"}
                  style={{ color: tc, textDecoration: "none", transition: "opacity 0.15s", marginRight: "0.15em" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.55"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {item.label}
                </a>
              </span>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="f3-desktop-cta"
            style={{
              display: "none",
              fontSize: "clamp(18px, 2vw, 22px)",
              color: tc,
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.55"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            {slots.navCtaLabel || "Get in touch"}
          </a>

          {/* Hamburger */}
          <button
            type="button"
            className={`f3-ham ${mobileMenuOpen ? "f3-ham-open" : ""}`}
            onClick={() => setMobileMenuOpen((v) => !v)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: "5px", padding: "4px",
            }}
            aria-label="Toggle navigation"
          >
            <span className="f3-ham-bar f3-bar-1" />
            <span className="f3-ham-bar f3-bar-2" />
            <span className="f3-ham-bar f3-bar-3" />
          </button>
        </nav>

        {/* ── Mobile overlay ── */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 19,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(4px)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingLeft: "2rem", gap: "2rem",
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href || "#"}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "clamp(28px, 6vw, 36px)",
                fontWeight: 500, color: "#000", textDecoration: "none",
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: "clamp(28px, 6vw, 36px)",
              fontWeight: 500, color: "#000",
              textDecoration: "underline", textUnderlineOffset: "2px",
            }}
          >
            {slots.navCtaLabel || "Get in touch"}
          </a>
        </div>

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section
          className="f3-hero"
          style={{
            position: "relative", zIndex: 2,
            minHeight: "100vh",
            display: "flex", flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: "3rem",
            paddingLeft: "clamp(1.25rem, 4vw, 2.5rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2.5rem)",
            paddingTop: "5rem",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: "36rem", position: "relative", zIndex: 10 }}>
            {/* Blurred intro */}
            <p style={{
              pointerEvents: "none",
              userSelect: "none",
              marginBottom: "1.25rem",
              fontSize: "clamp(16px, 3.5vw, 24px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: tc,
              filter: "blur(4px)",
            }}>
              {introLine1}<br />
              {introLine2}
            </p>

            {/* Typewriter */}
            <p style={{
              color: tc,
              marginBottom: "1.25rem",
              fontSize: "clamp(16px, 3.5vw, 24px)",
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: "54px",
            }}>
              {displayed}
              {!done && <span className="f3-cursor" />}
            </p>

            {/* Pill buttons with smooth scroll */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4em",
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}>
              {pillButtons.map(({ label, anchor }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollTo(anchor)}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: isImageMode ? "rgba(255,255,255,0.12)" : "#fff",
                    color: tc,
                    border: `1px solid ${tcb}`,
                    borderRadius: "9999px",
                    fontSize: "clamp(11px, 1.4vw, 14px)",
                    padding: "0.3em 1.1em",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    marginBottom: "0.35em",
                    backdropFilter: isImageMode ? "blur(8px)" : "none",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = tc;
                    (e.currentTarget as HTMLElement).style.color = isImageMode ? "#000" : "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = isImageMode ? "rgba(255,255,255,0.12)" : "#fff";
                    (e.currentTarget as HTMLElement).style.color = tc;
                  }}
                >
                  {label}
                </button>
              ))}

              {/* Contact copy pill */}
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(contactEmail).catch(() => {});
                  }
                }}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  gap: "0.5rem",
                  background: "transparent", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.7)",
                  borderRadius: "9999px",
                  fontSize: "clamp(11px, 1.4vw, 14px)",
                  padding: "0.3em 1.1em",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  marginBottom: "0.35em",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#fff";
                  (e.currentTarget as HTMLElement).style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
              >
                Reach us:{" "}
                <span style={{ textDecoration: "underline", textUnderlineOffset: "1px" }}>
                  {contactEmail}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ══ STATS BAND ════════════════════════════════════════════ */}
        {statItems.length > 0 && (
          <section style={{
            position: "relative",
            zIndex: 2,
            background: "#000",
            color: "#fff",
            padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2.5rem)",
          }}>
            <div className="f3-stats-grid" style={{ maxWidth: "1100px", margin: "0 auto" }}>
              {statItems.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: "clamp(1.5rem, 3vw, 2rem)",
                    borderRight: i < statItems.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  }}
                >
                  <div style={{
                    fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}>
                    {"value" in stat ? (stat as { value: string }).value : ""}
                  </div>
                  <div style={{
                    fontSize: "clamp(11px, 1.2vw, 13px)",
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}>
                    {"label" in stat ? (stat as { label: string }).label : ""}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ FEATURES ═════════════════════════════════════════════ */}
        <section
          id="features"
          style={{
            position: "relative",
            zIndex: 2,
            background: "#fff",
            padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 2.5rem)",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* Section header */}
            <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
              <div style={{
                fontSize: "clamp(10px, 1vw, 11px)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(0,0,0,0.35)",
                marginBottom: "1rem",
                fontFamily: "'HelveticaNowDisplayW01-Rg', 'Helvetica Neue', Arial, sans-serif",
              }}>
                01 — {slots.featuresTitle || "What we do"}
              </div>
              <h2 style={{
                fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#000",
                margin: 0,
                maxWidth: "28rem",
              }}>
                {slots.featuresTitle || "What we do"}
              </h2>
            </div>

            {/* 3-column features grid */}
            <div className="f3-features-grid">
              {(featureItems.length > 0 ? featureItems : [
                { title: "Craft", body: "We approach every project with rigorous craft and attention to detail." },
                { title: "Strategy", body: "Thoughtful strategic direction aligned with your business goals." },
                { title: "Delivery", body: "On time, on brief, with the quality that sets you apart." },
              ]).map((feat, i) => (
                <div
                  key={i}
                  style={{
                    padding: "clamp(1.75rem, 3vw, 2.5rem)",
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    borderRight: i < 2 ? "1px solid rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <div style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 300,
                    color: "rgba(0,0,0,0.08)",
                    lineHeight: 1,
                    marginBottom: "1.5rem",
                    fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
                    letterSpacing: "-0.02em",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{
                    fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "#000",
                    marginBottom: "0.75rem",
                    margin: "0 0 0.75rem",
                  }}>
                    {feat.title}
                  </h3>
                  {feat.body && (
                    <p style={{
                      fontSize: "clamp(13px, 1.4vw, 15px)",
                      lineHeight: 1.65,
                      color: "rgba(0,0,0,0.55)",
                      margin: 0,
                    }}>
                      {feat.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROCESS ══════════════════════════════════════════════ */}
        <section
          id="process"
          style={{
            position: "relative",
            zIndex: 2,
            background: "#fff",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 2.5rem)",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* Section header */}
            <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
              <div style={{
                fontSize: "clamp(10px, 1vw, 11px)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(0,0,0,0.35)",
                marginBottom: "1rem",
              }}>
                02 — How we work
              </div>
              <h2 style={{
                fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "#000",
                margin: 0,
                maxWidth: "28rem",
              }}>
                Our process
              </h2>
            </div>

            {/* Process steps */}
            <div className="f3-process-grid">
              {(processItems.length > 0 ? processItems : [
                { step: "01", title: "Discover", body: "We start by deeply understanding your challenge, context, and ambitions." },
                { step: "02", title: "Design",   body: "We shape the idea into a coherent, beautiful system that works." },
                { step: "03", title: "Deliver",  body: "We ship with precision, making sure every detail earns its place." },
              ]).map((step, i) => (
                <div
                  key={i}
                  style={{
                    padding: "clamp(1.75rem, 3vw, 2.5rem)",
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    borderRight: i < 2 ? "1px solid rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <div style={{
                    fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(10px, 1vw, 11px)",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(0,0,0,0.3)",
                    marginBottom: "1.25rem",
                  }}>
                    {"step" in step ? (step as { step: string }).step : String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{
                    fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "#000",
                    margin: "0 0 0.75rem",
                  }}>
                    {"title" in step ? (step as { title: string }).title : ""}
                  </h3>
                  {"body" in step && (step as { body: string }).body && (
                    <p style={{
                      fontSize: "clamp(13px, 1.4vw, 15px)",
                      lineHeight: 1.65,
                      color: "rgba(0,0,0,0.55)",
                      margin: 0,
                    }}>
                      {(step as { body: string }).body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA / CONTACT ════════════════════════════════════════ */}
        <section
          id="cta"
          style={{
            position: "relative",
            zIndex: 2,
            background: "#000",
            color: "#fff",
            padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 2.5rem)",
          }}
        >
          <div id="contact" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{
              fontSize: "clamp(10px, 1vw, 11px)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "1.5rem",
            }}>
              03 — Let's work
            </div>

            <h2 style={{
              fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
              fontSize: "clamp(2rem, 6vw, 5rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              color: "#fff",
              margin: "0 0 clamp(1rem, 3vw, 2rem)",
              maxWidth: "22rem",
            }}>
              {slots.ctaHeadline || "Let's build something."}
            </h2>

            {slots.ctaBody && (
              <p style={{
                fontSize: "clamp(14px, 1.6vw, 17px)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.55)",
                margin: "0 0 clamp(2rem, 4vw, 3rem)",
                maxWidth: "28rem",
              }}>
                {slots.ctaBody}
              </p>
            )}

            <a
              href={`mailto:${contactEmail}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#fff",
                color: "#000",
                textDecoration: "none",
                borderRadius: "9999px",
                padding: "0.75em 2em",
                fontFamily: "'HelveticaNowDisplay-Medium', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(13px, 1.4vw, 16px)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.85)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#fff";
              }}
            >
              {slots.ctaButtonLabel || "Get in touch"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </a>

            {/* Email display */}
            <div style={{
              marginTop: "clamp(3rem, 6vw, 5rem)",
              paddingTop: "clamp(2rem, 4vw, 3rem)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}>
              <span style={{
                fontFamily: "'HelveticaNowDisplayW01-Rg', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(13px, 1.4vw, 16px)",
                color: "rgba(255,255,255,0.4)",
              }}>
                {contactEmail}
              </span>
              <span style={{
                fontFamily: "'HelveticaNowDisplayW01-Rg', 'Helvetica Neue', Arial, sans-serif",
                fontSize: "clamp(11px, 1.1vw, 13px)",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}>
                {slots.logoText} · {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
