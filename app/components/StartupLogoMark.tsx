"use client";

import type { CSSProperties } from "react";
import type { StartupLogo } from "@/lib/types/startup";

type Props = {
  logo: StartupLogo;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
};

const FONT: Record<StartupLogo["fontStyle"], string> = {
  sans: "font-sans tracking-tight",
  serif: "font-serif tracking-tight",
  mono: "font-mono tracking-tight",
  display: "font-sans font-black tracking-tighter uppercase",
};

const SHAPE: Record<StartupLogo["shape"], string> = {
  rounded: "rounded-xl",
  circle: "rounded-full",
  squircle: "rounded-2xl",
  sharp: "rounded-md",
};

export default function StartupLogoMark({
  logo,
  size = "md",
  showWordmark = true,
  className = "",
}: Props) {
  const iconSize = size === "sm" ? "w-7 h-7 text-[10px]" : size === "lg" ? "w-11 h-11 text-sm" : "w-9 h-9 text-xs";
  const wordSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  const markStyle = getMarkStyle(logo);

  return (
    <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
      <div
        className={`${iconSize} ${SHAPE[logo.shape]} flex items-center justify-center flex-shrink-0 font-bold`}
        style={markStyle}
      >
        <span className={logo.style === "outline" ? "" : "text-white"}>{logo.monogram}</span>
      </div>
      {showWordmark && (
        <span className={`${wordSize} ${FONT[logo.fontStyle]} truncate ${className}`}>
          {logo.wordmark}
        </span>
      )}
    </div>
  );
}

function getMarkStyle(logo: StartupLogo): CSSProperties {
  const { accentColor, secondaryColor, style } = logo;
  switch (style) {
    case "gradient":
      return {
        background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
        color: "#fff",
        boxShadow: `0 4px 14px ${accentColor}40`,
      };
    case "solid":
      return { backgroundColor: accentColor, color: "#fff" };
    case "outline":
      return {
        backgroundColor: "transparent",
        border: `2px solid ${accentColor}`,
        color: accentColor,
      };
    case "glass":
      return {
        background: `linear-gradient(135deg, ${accentColor}30, ${secondaryColor}20)`,
        backdropFilter: "blur(8px)",
        border: `1px solid ${accentColor}40`,
        color: accentColor,
      };
  }
}

export function LogoIconOnly({ logo, className = "" }: { logo: StartupLogo; className?: string }) {
  return <StartupLogoMark logo={logo} size="sm" showWordmark={false} className={className} />;
}
