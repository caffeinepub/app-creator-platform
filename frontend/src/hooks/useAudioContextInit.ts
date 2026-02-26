import { useEffect, useState } from "react";
import { createOrResumeAudioContext } from "./useAlarmSound";

/**
 * Global hook that initializes the AudioContext on the first user interaction.
 * Must be used at the App level to ensure audio is ready before any alarm fires.
 */
export function useAudioContextInit() {
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      try {
        const ctx = createOrResumeAudioContext();
        ctx.resume().then(() => {
          setIsAudioReady(ctx.state === "running");
        }).catch(() => {});
      } catch {
        // AudioContext not supported
      }
    };

    // Listen for first user interaction
    const events = ["click", "keydown", "pointerdown", "touchstart"] as const;
    events.forEach((evt) => document.addEventListener(evt, handleInteraction, { once: false, passive: true }));

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, handleInteraction));
    };
  }, []);

  return { isAudioReady };
}
