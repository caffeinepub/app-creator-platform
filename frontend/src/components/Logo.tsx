import React from "react";

interface LogoProps {
  size?: "small" | "large";
}

export default function Logo({ size = "small" }: LogoProps) {
  const isLarge = size === "large";

  return (
    <div className={`flex items-center ${isLarge ? "gap-3" : "gap-2"}`}>
      <div
        className={`relative shrink-0 ${isLarge ? "w-10 h-10" : "w-7 h-7"}`}
        style={{ filter: "drop-shadow(0 0 8px oklch(0.72 0.19 45))" }}
      >
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="flame-outer" x1="20" y1="40" x2="20" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="oklch(0.65 0.22 30)" />
              <stop offset="60%" stopColor="oklch(0.72 0.19 45)" />
              <stop offset="100%" stopColor="oklch(0.85 0.15 70)" />
            </linearGradient>
            <linearGradient id="flame-inner" x1="20" y1="38" x2="20" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="oklch(0.85 0.15 70)" />
              <stop offset="100%" stopColor="oklch(0.95 0.08 90)" />
            </linearGradient>
          </defs>
          {/* Outer flame */}
          <path
            d="M20 2C20 2 28 12 28 20C28 26 24.5 30 20 32C15.5 30 12 26 12 20C12 12 20 2 20 2Z"
            fill="url(#flame-outer)"
          />
          {/* Inner flame */}
          <path
            d="M20 14C20 14 24 20 24 24C24 27 22.2 29 20 30C17.8 29 16 27 16 24C16 20 20 14 20 14Z"
            fill="url(#flame-inner)"
            opacity="0.9"
          />
        </svg>
      </div>
      <span
        className={`font-display font-bold tracking-tight ${isLarge ? "text-2xl" : "text-lg"}`}
        style={{
          background: "linear-gradient(135deg, oklch(0.72 0.19 45) 0%, oklch(0.85 0.15 70) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Noventra<span style={{ WebkitTextFillColor: "oklch(0.9 0.05 45)" }}>.ai</span>
      </span>
    </div>
  );
}
