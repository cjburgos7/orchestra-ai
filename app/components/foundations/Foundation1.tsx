"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { Foundation1Slots } from "@/lib/types/startup";

export type { Foundation1Slots };

const DEFAULT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

export const DEFAULT_F1_SLOTS: Foundation1Slots = {
  logoText: "Aethera®",
  navItems: [
    { label: "Home",     href: "#hero",     muted: false },
    { label: "Studio",   href: "#features", muted: true  },
    { label: "Process",  href: "#process",  muted: true  },
    { label: "Journal",  href: "#testimonials", muted: true },
    { label: "Reach Us", href: "#cta",      muted: true  },
  ],
  navCtaLabel: "Begin Journey",
  headline: "Beyond silence, we build the eternal.",
  headlineItalicFragments: ["silence,", "the eternal."],
  description:
    "Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.",
  heroCtaLabel: "Begin Journey",
  videoUrl: DEFAULT_VIDEO_URL,
  editorialImageUrl: "https://images.unsplash.com/photo-1462275646964-a0e3380e5e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=900&q=85",
  stats: [
    { value: "2,400+", label: "Artists served worldwide" },
    { value: "98%",    label: "Client satisfaction rate" },
    { value: "12 yrs", label: "Industry experience" },
  ],
  process: [
    { step: "01", title: "Discovery Call", body: "We start with a deep conversation about your vision, audience, and what makes your work truly irreplaceable in the market." },
    { step: "02", title: "Creative Direction", body: "Our team crafts a complete sonic and visual blueprint — motifs, textures, and systems unique to your brand identity." },
    { step: "03", title: "Delivery & Integration", body: "Your complete system is delivered production-ready, with support for every platform, touchpoint, and audience moment." },
  ],
  featuresTitle: "What we do",
  features: [
    { title: "Sonic Identity", body: "We develop a complete sound language for your brand — motifs, textures, and systems that make you immediately recognizable across every medium and moment." },
    { title: "Spatial Audio", body: "Immersive environments designed for installations, digital spaces, and experiences that unfold in three dimensions, drawing your audience deeper into the world." },
    { title: "Composition", body: "Original music for film, campaigns, and live events. Every piece is built from emotional intention and creative conviction, never from algorithmic templates." },
  ],
  testimonials: [
    { quote: "Aethera didn't just score our film — they gave it a soul. The music made the audience feel things the visuals alone never could have achieved. Remarkable work.", name: "Margaux L.", role: "Film director" },
    { quote: "Working with them completely changed how we think about our brand. Sound isn't a feature anymore — it's the very first thing people feel when they encounter us.", name: "Tom R.", role: "Creative director" },
  ],
  ctaHeadline: "Ready to build something that endures?",
  ctaBody: "Tell us what you're making. We'll tell you what it should sound like.",
  ctaButtonLabel: "Begin Journey",
};

function HeadlineWithItalics({ headline, fragments }: { headline: string; fragments: string[] }) {
  if (!fragments.length) return <>{headline}</>;
  const parts: React.ReactNode[] = [];
  let remaining = headline;
  for (const frag of fragments) {
    const idx = remaining.indexOf(frag);
    if (idx === -1) { parts.push(remaining); remaining = ""; break; }
    if (idx > 0) parts.push(remaining.slice(0, idx));
    parts.push(<span key={frag} style={{ color: "#6F6F6F", fontStyle: "italic" }}>{frag}</span>);
    remaining = remaining.slice(idx + frag.length);
  }
  if (remaining) parts.push(remaining);
  return <>{parts}</>;
}

const SERIF = "var(--font-instrument-serif), 'Instrument Serif', serif";
const SANS  = "var(--font-inter), Inter, sans-serif";

// Map nav label patterns to section IDs for smooth scroll
function resolveHref(href: string, label: string): string {
  const l = label.toLowerCase();
  if (l.includes("home"))        return "#hero";
  if (l.includes("process") || l.includes("how") || l.includes("work")) return "#process";
  if (l.includes("studio") || l.includes("service") || l.includes("feature") || l.includes("offer") || l.includes("collection")) return "#features";
  if (l.includes("testimonial") || l.includes("review") || l.includes("journal") || l.includes("story") || l.includes("about")) return "#testimonials";
  if (l.includes("contact") || l.includes("reach") || l.includes("connect") || l.includes("book") || l.includes("start")) return "#cta";
  if (href.startsWith("#")) return href;
  return "#cta";
}

export default function Foundation1({ slots = DEFAULT_F1_SLOTS }: { slots?: Foundation1Slots }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroSrc, setHeroSrc] = useState<string | undefined>(slots.imageUrl || undefined);
  const refreshingRef = useRef(false);

  // Sync heroSrc when slots change (e.g. new project loaded)
  useEffect(() => {
    setHeroSrc(slots.imageUrl || undefined);
    refreshingRef.current = false;
  }, [slots.imageUrl]);

  // Auto-refresh when DALL-E failed during generation (heroSrc empty but category is set)
  useEffect(() => {
    if (heroSrc || !slots.imageCategory || refreshingRef.current) return;
    refreshingRef.current = true;
    fetch(`/api/image-refresh?category=${encodeURIComponent(slots.imageCategory)}`)
      .then((r) => r.json())
      .then((data: { url: string | null }) => {
        if (data.url) setHeroSrc(data.url);
        else refreshingRef.current = false;
      })
      .catch(() => { refreshingRef.current = false; });
  }, [heroSrc, slots.imageCategory]);

  const handleHeroError = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    // DALL-E URL expired — request a fresh one from the server
    if (slots.imageCategory) {
      try {
        const res = await fetch(`/api/image-refresh?category=${encodeURIComponent(slots.imageCategory)}`);
        const data: { url: string | null } = await res.json();
        if (data.url) {
          setHeroSrc(data.url);
          return;
        }
      } catch {
        // refresh failed — fall through to gradient
      }
    }
    setHeroSrc(undefined); // show gradient fallback
  }, [slots.imageCategory]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id.replace("#", ""));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !slots.videoUrl || slots.imageUrl) return;
    let rafId: number;
    const tick = () => {
      if (!video.duration || video.paused) { rafId = requestAnimationFrame(tick); return; }
      const t = video.currentTime;
      const rem = video.duration - t;
      video.style.opacity = t < 0.5 ? String(t / 0.5) : rem < 0.5 ? String(rem / 0.5) : "1";
      rafId = requestAnimationFrame(tick);
    };
    const onPlay  = () => { rafId = requestAnimationFrame(tick); };
    const onPause = () => cancelAnimationFrame(rafId);
    const onEnded = () => {
      cancelAnimationFrame(rafId);
      video.style.opacity = "0";
      setTimeout(() => { video.currentTime = 0; video.play().catch(() => {}); }, 100);
    };
    video.addEventListener("play",   onPlay);
    video.addEventListener("pause",  onPause);
    video.addEventListener("ended",  onEnded);
    video.muted = true;
    video.play().catch(() => {});
    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("play",  onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [slots.videoUrl, slots.imageUrl]);

  const features     = slots.features     ?? [];
  const testimonials = slots.testimonials ?? [];
  const stats        = slots.stats        ?? [];
  const process      = slots.process      ?? [];

  return (
    <div style={{ fontFamily: SANS, backgroundColor: "#ffffff", color: "#000000" }}>

      {/* ═══════════════════════════════════════════════════════════
          HERO — fullscreen
      ═══════════════════════════════════════════════════════════ */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>

        {/* Animated atmospheric orbs */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div className="f1-orb-1" style={{
            position: "absolute", top: "5%", right: "10%",
            width: "50vw", height: "50vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,0,0,0.055) 0%, transparent 70%)",
            filter: "blur(80px)",
          }} />
          <div className="f1-orb-2" style={{
            position: "absolute", bottom: "10%", left: "5%",
            width: "45vw", height: "45vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)",
            filter: "blur(100px)",
          }} />
          <div className="f1-orb-3" style={{
            position: "absolute", top: "40%", left: "30%",
            width: "35vw", height: "35vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)",
            filter: "blur(60px)",
          }} />
        </div>

        {/* Hero image — Ken Burns zoom */}
        <div style={{
          position: "absolute", top: "220px", right: 0, bottom: 0, left: 0,
          overflow: "hidden", zIndex: 1,
          // Soft fade from transparent at top so the image never hard-cuts
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 14%)",
        }}>
          {heroSrc && (
            <img
              src={heroSrc}
              alt=""
              aria-hidden="true"
              className="f1-ken-burns"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; void handleHeroError(); }}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center 30%",
                willChange: "transform",
                display: "block",
              }}
            />
          )}
        </div>

        {/* Video fallback when no imageUrl */}
        {!slots.imageUrl && slots.videoUrl && (
          <video ref={videoRef} src={slots.videoUrl} playsInline muted style={{
            position: "absolute", top: "220px", right: 0, bottom: 0, left: 0,
            width: "100%", height: "calc(100% - 220px)",
            objectFit: "cover", opacity: 0, zIndex: 2,
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 14%)",
          }} />
        )}

        {/* Gradient overlay: white → transparent → white */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.6) 28%, transparent 45%, transparent 70%, #ffffff 100%)",
        }} />

        {/* Nav */}
        <nav style={{
          position: "relative", zIndex: 10,
          maxWidth: "80rem", margin: "0 auto",
          padding: "1.5rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button
            onClick={() => scrollTo("#hero")}
            style={{ fontFamily: SERIF, fontSize: "1.875rem", letterSpacing: "-0.025em", color: "#000", textDecoration: "none", lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {slots.logoText}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {slots.navItems.map((item) => (
              <button key={item.label} onClick={() => scrollTo(resolveHref(item.href, item.label))} style={{
                fontSize: "0.875rem", color: item.muted ? "#6F6F6F" : "#000",
                textDecoration: "none", background: "none", border: "none", cursor: "pointer",
                transition: "color 0.2s", fontFamily: SANS, padding: 0,
              }}>
                {item.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollTo("#cta")}
            style={{ borderRadius: "9999px", padding: "0.625rem 1.5rem", fontSize: "0.875rem", background: "#000", color: "#fff", border: "none", cursor: "pointer", transition: "transform 0.2s", fontFamily: SANS }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {slots.navCtaLabel}
          </button>
        </nav>

        {/* Hero copy */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center",
          paddingTop: "calc(5rem - 40px)", paddingBottom: "10rem",
          paddingLeft: "1.5rem", paddingRight: "1.5rem",
        }}>
          <h1 className="animate-fade-rise" style={{
            fontFamily: SERIF, fontWeight: 400,
            fontSize: "clamp(3rem, 6vw, 5rem)",
            lineHeight: 0.95, letterSpacing: "-2.46px",
            color: "#000", maxWidth: "80rem", margin: "0 auto",
          }}>
            <HeadlineWithItalics headline={slots.headline} fragments={slots.headlineItalicFragments} />
          </h1>

          <p className="animate-fade-rise-delay" style={{
            color: "#6F6F6F", marginTop: "2rem",
            fontSize: "1rem", lineHeight: 1.75,
            maxWidth: "42rem", fontFamily: SANS,
          }}>
            {slots.description}
          </p>

          <button
            className="animate-fade-rise-delay-2"
            onClick={() => scrollTo("#cta")}
            style={{ marginTop: "3rem", borderRadius: "9999px", padding: "1.25rem 3.5rem", fontSize: "1rem", background: "#000", color: "#fff", border: "none", cursor: "pointer", transition: "transform 0.2s", fontFamily: SANS }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {slots.heroCtaLabel}
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS BAND
      ═══════════════════════════════════════════════════════════ */}
      {stats.length > 0 && (
        <section style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", padding: "4rem 2rem" }}>
          <div style={{
            maxWidth: "64rem", margin: "0 auto",
            display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: "2rem", textAlign: "center",
          }}>
            {stats.map((s, i) => (
              <div key={i} className="f1-card-3d" style={{ padding: "1.5rem 1rem", borderRadius: "16px", cursor: "default" }}>
                <p className="f1-stat-float" style={{ fontFamily: SERIF, fontSize: "clamp(2.5rem, 5vw, 3.75rem)", fontWeight: 400, letterSpacing: "-2px", lineHeight: 1, color: "#000", marginBottom: "0.5rem", animationDelay: `${i * 1.2}s` }}>
                  {s.value}
                </p>
                <p style={{ fontFamily: SANS, fontSize: "0.8125rem", color: "#6F6F6F", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════════════ */}
      {features.length > 0 && (
        <section id="features" style={{ padding: "8rem 2rem", maxWidth: "80rem", margin: "0 auto" }}>
          <p style={{
            fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.2em", color: "#6F6F6F",
            marginBottom: "3rem", fontFamily: SANS,
          }}>
            {slots.featuresTitle || "What we offer"}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "4rem" }}>
            {features.map((f, i) => (
              <div key={i} className={`f1-card-3d f1-reveal f1-reveal-${(i % 3) + 1}`} style={{ borderTop: "2px solid #e5e5e5", paddingTop: "2rem", borderRadius: "0 0 16px 16px" }}>
                <p style={{ fontFamily: SANS, fontSize: "0.75rem", color: "#aaa", marginBottom: "1rem", fontWeight: 500, letterSpacing: "0.1em" }}>
                  {"0" + (i + 1)}
                </p>
                <h3 style={{ fontFamily: SERIF, fontSize: "1.75rem", fontWeight: 400, color: "#000", marginBottom: "1.25rem", lineHeight: 1.1 }}>
                  {f.title}
                </h3>
                <p style={{ fontFamily: SANS, fontSize: "0.9375rem", color: "#6F6F6F", lineHeight: 1.75 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          EDITORIAL IMAGE — full-bleed mid-page
      ═══════════════════════════════════════════════════════════ */}
      {slots.editorialImageUrl && (
        <div style={{ position: "relative", height: "60vh", overflow: "hidden", margin: "0" }}>
          <img
            src={slots.editorialImageUrl}
            alt=""
            aria-hidden="true"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              display: "block",
            }}
          />
          {/* Gradient overlays top + bottom */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to bottom, #ffffff 0%, transparent 20%, transparent 80%, #ffffff 100%)",
          }} />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          PROCESS — How it works
      ═══════════════════════════════════════════════════════════ */}
      {process.length > 0 && (
        <section id="process" style={{ background: "#fafafa", padding: "8rem 2rem" }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
            <p style={{
              fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.2em", color: "#6F6F6F",
              marginBottom: "4rem", fontFamily: SANS,
            }}>
              How it works
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {process.map((p, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "120px 1fr",
                  gap: "3rem", paddingTop: "3rem", paddingBottom: "3rem",
                  borderTop: "1px solid #e5e5e5",
                  alignItems: "start",
                }}>
                  <p style={{ fontFamily: SERIF, fontSize: "3rem", fontWeight: 400, color: "#e5e5e5", lineHeight: 1, letterSpacing: "-2px" }}>
                    {p.step}
                  </p>
                  <div>
                    <h3 style={{ fontFamily: SERIF, fontSize: "1.5rem", fontWeight: 400, color: "#000", marginBottom: "1rem", lineHeight: 1.1 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontFamily: SANS, fontSize: "0.9375rem", color: "#6F6F6F", lineHeight: 1.75, maxWidth: "40rem" }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section id="testimonials" style={{ padding: "8rem 2rem" }}>
          <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
            <p style={{
              fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.2em", color: "#6F6F6F",
              marginBottom: "4rem", fontFamily: SANS,
            }}>
              What they say
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
              {testimonials.map((t, i) => (
                <div key={i} style={{ textAlign: i % 2 === 0 ? "left" : "right", paddingLeft: i % 2 === 0 ? "0" : "4rem", paddingRight: i % 2 === 0 ? "4rem" : "0" }}>
                  <p style={{
                    fontFamily: SERIF, fontSize: "clamp(1.375rem, 2.5vw, 2rem)",
                    fontWeight: 400, color: "#000", lineHeight: 1.4,
                    fontStyle: "italic", marginBottom: "1.5rem",
                  }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2rem", height: "1px", background: "#000" }} />
                    <p style={{ fontFamily: SANS, fontSize: "0.875rem", color: "#000", fontWeight: 500 }}>
                      {t.name}
                    </p>
                    {t.role && (
                      <p style={{ fontFamily: SANS, fontSize: "0.875rem", color: "#6F6F6F" }}>
                        {t.role}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CTA — dark
      ═══════════════════════════════════════════════════════════ */}
      {slots.ctaHeadline && (
        <section id="cta" style={{
          background: "#000", color: "#fff",
          padding: "10rem 2rem",
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: "1.75rem" }}>
              {slots.ctaHeadline}
            </h2>
            {slots.ctaBody && (
              <p style={{ fontFamily: SANS, fontSize: "1.0625rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "3rem" }}>
                {slots.ctaBody}
              </p>
            )}
            <button
              style={{ borderRadius: "9999px", padding: "1.125rem 3.5rem", fontSize: "1rem", background: "#fff", color: "#000", border: "none", cursor: "pointer", transition: "transform 0.2s", fontFamily: SANS, fontWeight: 500 }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {slots.ctaButtonLabel || slots.heroCtaLabel}
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ padding: "2.5rem 2rem", textAlign: "center", borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "80rem", margin: "0 auto" }}>
        <p style={{ fontFamily: SERIF, fontSize: "1rem", color: "#000" }}>
          {slots.logoText}
        </p>
        <p style={{ fontFamily: SANS, fontSize: "0.8125rem", color: "#aaa" }}>
          © {new Date().getFullYear()} — All rights reserved
        </p>
        <button
          onClick={() => scrollTo("#cta")}
          style={{ fontFamily: SANS, fontSize: "0.8125rem", color: "#000", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          {slots.navCtaLabel}
        </button>
      </footer>
    </div>
  );
}
