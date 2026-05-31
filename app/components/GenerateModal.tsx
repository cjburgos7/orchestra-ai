"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveProject } from "@/lib/persistence/projects";

const SERIF = "var(--font-canela), 'Didot', 'Georgia', serif";

const PHASE1_MSGS = [
  "Reading your idea…",
  "Naming your startup…",
  "Crafting your identity…",
  "Shaping your brand…",
];
const PHASE2_MSGS = [
  "Building your world…",
  "Composing your launch page…",
  "Rendering your universe…",
  "Almost ready to launch…",
];
const PLACEHOLDERS = [
  "A platform that helps freelancers find long-term clients.",
  "AI tools for independent restaurant owners.",
  "A marketplace for sustainable fashion brands.",
  "Software that automates legal contracts for startups.",
  "An app that turns your fitness data into a coaching plan.",
];

type GenPhase = "input" | "phase1" | "preview" | "phase2";

export default function GenerateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [phase, setPhase] = useState<GenPhase>("input");
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [previewTagline, setPreviewTagline] = useState("");
  const [placeholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );
  const [selectedFoundation, setSelectedFoundation] = useState<"foundation-1" | "foundation-2" | "foundation-3">("foundation-1");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ideaImages, setIdeaImages] = useState<string[]>([]);
  const [selectedIdeaIdx, setSelectedIdeaIdx] = useState<number | null>(null);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "phase1" && phase !== "phase2") return;
    const msgs = phase === "phase1" ? PHASE1_MSGS : PHASE2_MSGS;
    setMsgIdx(0);
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % msgs.length), 1100);
    return () => clearInterval(id);
  }, [phase]);

  const handleClose = useCallback(() => {
    if (phase === "phase1" || phase === "phase2") return;
    setPhase("input");
    setIdea("");
    setError("");
    setPreviewName("");
    setPreviewTagline("");
    onClose();
  }, [phase, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string ?? null);
    reader.readAsDataURL(file);
  }

  async function handleGenerateIdeas() {
    if (!idea.trim()) return;
    setGeneratingIdeas(true);
    setIdeaImages([]);
    setSelectedIdeaIdx(null);
    try {
      const res = await fetch("/api/generate-image-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: idea.trim() }),
      });
      const data = await res.json() as { images?: string[]; error?: string };
      if (res.ok && data.images?.length) {
        setIdeaImages(data.images);
        setSelectedIdeaIdx(0);
      }
    } catch {
      // silent — just skip ideas panel
    } finally {
      setGeneratingIdeas(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim()) {
      setError("Please describe your startup idea to get started.");
      return;
    }
    const text = idea.trim();
    setError("");
    setPhase("phase1");

    let project: {
      id: string;
      slug: string;
      startupName: string;
      tagline: string;
      [key: string]: unknown;
    } | null = null;
    let brief: unknown = null;

    try {
      const r1 = await fetch("/api/generate-startup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: text }),
      });
      const d1 = await r1.json();
      if (!r1.ok) {
        setError(d1.error ?? "Generation failed");
        setPhase("input");
        return;
      }
      project = d1.project;
      brief = d1.brief;
    } catch {
      setError("Could not reach the server.");
      setPhase("input");
      return;
    }

    if (!project || !brief) {
      setError("Unexpected server response.");
      setPhase("input");
      return;
    }

    setPreviewName(project.startupName as string);
    setPreviewTagline(project.tagline as string);
    setPhase("preview");
    await new Promise((r) => setTimeout(r, 800));
    setPhase("phase2");

    try {
      const r2 = await fetch("/api/generate-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief,
          direction: "orchestra",
          seed: project.id,
          foundationId: selectedFoundation,
          referenceImageUrl: selectedIdeaIdx !== null ? ideaImages[selectedIdeaIdx] : (uploadedImage ?? undefined),
        }),
      });
      const d2 = await r2.json();
      if (!r2.ok) {
        setError(d2.error ?? "World generation failed");
        setPhase("input");
        return;
      }

      const complete = {
        ...(project as Record<string, unknown>),
        generatedSections: d2.sections,
        selectedDirection: "orchestra",
        status: "complete",
        updatedAt: new Date().toISOString(),
      };

      saveProject(complete as Parameters<typeof saveProject>[0]);

      fetch("/api/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: complete }),
      }).catch(() => {});

      router.push(`/projects/${project!.slug}`);
    } catch {
      setError("World generation failed. Please try again.");
      setPhase("input");
    }
  }

  if (!open) return null;

  const msgs = phase === "phase1" ? PHASE1_MSGS : PHASE2_MSGS;
  const isLoading = phase === "phase1" || phase === "phase2" || phase === "preview";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleClose}
    >
      <style>{`
        @keyframes gen-modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes gen-spin-cw  { to { transform: rotate(360deg);  } }
        @keyframes gen-spin-ccw { to { transform: rotate(-360deg); } }
        @keyframes gen-msg-in   { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(22% .012 270 / 0.52)",
          backdropFilter: "blur(20px) saturate(160%)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          margin: "0 16px",
          background: "oklch(99.5% .001 270)",
          border: "1px solid oklch(91% .005 270)",
          borderRadius: 24,
          boxShadow:
            "0 1px 0 oklch(100% 0 0 / 0.9) inset, 0 2px 4px oklch(20% .01 270 / 0.04), 0 40px 80px -20px oklch(30% .02 280 / 0.2)",
          overflow: "hidden",
          animation: "gen-modal-in 0.35s cubic-bezier(0.22,1,0.36,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lavender edge glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(to right, transparent, oklch(70% .11 295 / 0.5), transparent)",
          }}
        />

        {/* Header */}
        <div style={{ padding: "28px 28px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "oklch(70% .11 295)",
                  marginBottom: 8,
                }}
              >
                Orchestra · Startup Builder
              </div>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "oklch(22% .012 270)",
                  margin: 0,
                }}
              >
                {isLoading && previewName ? (
                  <span style={{ color: "oklch(50% .12 295)" }}>{previewName}</span>
                ) : (
                  "Describe your startup"
                )}
              </h2>
            </div>

            {!isLoading && (
              <button
                type="button"
                onClick={handleClose}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "1px solid oklch(91% .005 270)",
                  background: "oklch(97% .003 270)",
                  color: "oklch(52% .012 270)",
                  fontSize: 18,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px 0 16px",
                gap: 20,
              }}
            >
              {/* Spinner */}
              <div style={{ position: "relative", width: 56, height: 56 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "1.5px solid oklch(93% .005 270)",
                    borderTop: "1.5px solid oklch(70% .11 295)",
                    animation: "gen-spin-cw 1.4s linear infinite",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 10,
                    borderRadius: "50%",
                    border: "1px solid oklch(93% .005 270)",
                    borderBottom: "1px solid oklch(84% .07 295 / 0.7)",
                    animation: "gen-spin-ccw 2.2s linear infinite",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "oklch(70% .11 295)",
                    }}
                  />
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <p
                  key={`${phase}-${msgIdx}`}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "oklch(32% .012 275)",
                    margin: 0,
                    minHeight: "1.5em",
                    animation: "gen-msg-in 0.3s ease both",
                  }}
                >
                  {phase === "preview"
                    ? previewTagline || "Your startup is forming…"
                    : msgs[msgIdx]}
                </p>
                {phase === "phase2" && previewName && (
                  <p
                    style={{
                      marginTop: 8,
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "oklch(70% .11 295)",
                      fontWeight: 600,
                    }}
                  >
                    Building world for {previewName}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    background: "oklch(97% .012 25)",
                    border: "1px solid oklch(91% .03 25)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    marginBottom: 14,
                    fontSize: 13,
                    color: "oklch(45% .12 25)",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Template picker */}
              <div style={{ marginBottom: 18 }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "oklch(62% .012 270)",
                  marginBottom: 10,
                }}>
                  Choose template
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {([
                    { id: "foundation-1" as const, label: "Aethera",   sub: "Minimal · serif", emoji: "◻" },
                    { id: "foundation-2" as const, label: "Cinematic", sub: "Dark · spatial",  emoji: "✦" },
                    { id: "foundation-3" as const, label: "Future",    sub: "Video · bold",    emoji: "▶" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedFoundation(opt.id)}
                      style={{
                        flex: 1, borderRadius: 12, padding: "12px 10px", textAlign: "left",
                        border: selectedFoundation === opt.id
                          ? "1.5px solid oklch(70% .11 295)"
                          : "1.5px solid oklch(91% .005 270)",
                        background: selectedFoundation === opt.id
                          ? "oklch(96% .008 295)"
                          : "oklch(98.5% .002 270)",
                        cursor: "pointer", transition: "all 0.16s",
                        boxShadow: selectedFoundation === opt.id
                          ? "0 0 0 3px oklch(70% .11 295 / 0.12)"
                          : "none",
                      }}
                    >
                      <p style={{ fontSize: 14, marginBottom: 3, lineHeight: 1 }}>{opt.emoji}</p>
                      <p style={{
                        fontSize: 12, fontWeight: 700,
                        color: selectedFoundation === opt.id ? "oklch(38% .095 295)" : "oklch(32% .012 275)",
                        marginBottom: 2,
                      }}>
                        {opt.label}
                      </p>
                      <p style={{
                        fontSize: 10,
                        color: selectedFoundation === opt.id ? "oklch(52% .10 295)" : "oklch(65% .012 270)",
                      }}>
                        {opt.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image reference tools */}
              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "oklch(62% .012 270)",
                  marginBottom: 10,
                }}>
                  Visual direction <span style={{ fontWeight: 400, opacity: 0.6, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </p>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  {/* Upload reference */}
                  <div style={{ flex: 1 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: "100%", borderRadius: 10, padding: "10px 12px",
                        border: uploadedImage ? "1.5px solid oklch(70% .11 295)" : "1.5px dashed oklch(85% .005 270)",
                        background: uploadedImage ? "oklch(96% .008 295)" : "oklch(98.5% .002 270)",
                        cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                    >
                      {uploadedImage ? (
                        <>
                          <img src={uploadedImage} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(38% .095 295)", margin: 0 }}>Image uploaded</p>
                            <p style={{ fontSize: 10, color: "oklch(52% .10 295)", margin: 0 }}>Click to change</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                            style={{ marginLeft: "auto", fontSize: 14, color: "oklch(55% .012 270)", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
                          >×</button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>↑</span>
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(40% .012 275)", margin: 0 }}>Upload reference</p>
                            <p style={{ fontSize: 10, color: "oklch(62% .012 270)", margin: 0 }}>Guide the visual style</p>
                          </div>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI idea generator */}
                  <button
                    type="button"
                    disabled={generatingIdeas || !idea.trim()}
                    onClick={handleGenerateIdeas}
                    style={{
                      flex: 1, borderRadius: 10, padding: "10px 12px", textAlign: "left",
                      border: ideaImages.length ? "1.5px solid oklch(70% .11 295)" : "1.5px dashed oklch(85% .005 270)",
                      background: ideaImages.length ? "oklch(96% .008 295)" : "oklch(98.5% .002 270)",
                      cursor: idea.trim() ? "pointer" : "default",
                      opacity: !idea.trim() ? 0.5 : 1,
                      transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{generatingIdeas ? "⟳" : "✦"}</span>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(40% .012 275)", margin: 0 }}>
                        {generatingIdeas ? "Generating…" : ideaImages.length ? "3 ideas ready" : "Generate ideas"}
                      </p>
                      <p style={{ fontSize: 10, color: "oklch(62% .012 270)", margin: 0 }}>3 visual concepts</p>
                    </div>
                  </button>
                </div>

                {/* Idea picker */}
                {ideaImages.length > 0 && (
                  <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                    {ideaImages.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedIdeaIdx(i)}
                        style={{
                          flex: 1, padding: 0, border: "none", borderRadius: 8,
                          outline: selectedIdeaIdx === i ? "2px solid oklch(70% .11 295)" : "2px solid transparent",
                          outlineOffset: 2,
                          overflow: "hidden", cursor: "pointer",
                          aspectRatio: "1 / 1",
                        }}
                      >
                        <img src={src} alt={`Concept ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "oklch(98% .002 270)",
                  border: "1px solid oklch(91% .005 270)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <textarea
                  autoFocus
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={placeholder}
                  rows={4}
                  style={{
                    width: "100%",
                    resize: "none",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "18px 20px",
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "oklch(22% .012 270)",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderTop: "1px solid oklch(93% .005 270)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "oklch(65% .012 270)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    One sentence is enough
                  </span>
                  <button
                    type="submit"
                    style={{
                      background: "oklch(28% .015 280)",
                      color: "oklch(98% .003 270)",
                      border: "none",
                      borderRadius: 30,
                      padding: "9px 22px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: "-0.01em",
                      boxShadow:
                        "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 14px oklch(28% .015 280 / 0.3)",
                    }}
                  >
                    Launch my startup →
                  </button>
                </div>
              </div>

              <p
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: "oklch(65% .012 270)",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                }}
              >
                Generates name · tagline · features · pricing · cinematic launch page
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
