import React, { useEffect } from "react";
import { Volume2, X } from "lucide-react";
import { createOrResumeAudioContext } from "../hooks/useAlarmSound";

interface AudioEnablePromptProps {
  onEnabled: () => void;
  onDismiss: () => void;
}

export default function AudioEnablePrompt({ onEnabled, onDismiss }: AudioEnablePromptProps) {
  useEffect(() => {
    const handleClick = async () => {
      try {
        const ctx = createOrResumeAudioContext();
        await ctx.resume();
        if (ctx.state === "running") {
          onEnabled();
        }
      } catch {
        // ignore
      }
    };

    document.addEventListener("click", handleClick, { once: true });
    return () => document.removeEventListener("click", handleClick);
  }, [onEnabled]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-zinc-900 border border-brand/30 rounded-2xl px-4 py-3 shadow-xl shadow-brand/10 max-w-sm w-full mx-4">
      <div className="w-8 h-8 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center shrink-0">
        <Volume2 className="w-4 h-4 text-brand animate-pulse" />
      </div>
      <p className="flex-1 text-sm text-foreground/90">
        <span className="font-medium text-brand">Click anywhere</span> to enable alarm sound
      </p>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
