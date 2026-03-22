import React, { useEffect, useState } from "react";
import { type IconConfig, renderIconSVG } from "./IconBuilder";

interface UserAvatarProps {
  size?: "small" | "medium" | "large";
  fallbackInitials?: string;
  className?: string;
}

const SIZE_MAP = {
  small: 32,
  medium: 48,
  large: 64,
};

export default function UserAvatar({
  size = "medium",
  fallbackInitials = "?",
  className = "",
}: UserAvatarProps) {
  const [config, setConfig] = useState<IconConfig | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user-icon-config");
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        setConfig(null);
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user-icon-config") {
        try {
          setConfig(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setConfig(null);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const px = SIZE_MAP[size];

  if (config) {
    const svgStr = renderIconSVG(config, px);
    return (
      <div
        className={`rounded-full overflow-hidden border border-border bg-card/50 shrink-0 ${className}`}
        style={{ width: px, height: px }}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted SVG generated internally
        dangerouslySetInnerHTML={{ __html: svgStr }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 ${className}`}
      style={{ width: px, height: px }}
    >
      <span className="text-primary font-bold" style={{ fontSize: px * 0.35 }}>
        {fallbackInitials.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}
