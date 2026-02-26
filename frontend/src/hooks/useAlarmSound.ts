import { useRef, useState, useCallback, useEffect } from "react";

// Shared AudioContext singleton
let sharedAudioContext: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext | null {
  return sharedAudioContext;
}

export function createOrResumeAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContext();
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

interface UseAlarmSoundReturn {
  isPlaying: boolean;
  audioReady: boolean;
  playAlarm: () => { needsUserGesture: boolean };
  stopAlarm: () => void;
  resumeAudioContext: () => Promise<void>;
}

export function useAlarmSound(): UseAlarmSoundReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);

  // Check audio context state periodically
  useEffect(() => {
    const check = () => {
      const ctx = sharedAudioContext;
      setAudioReady(!!ctx && ctx.state === "running");
    };
    check();
    const id = setInterval(check, 500);
    return () => clearInterval(id);
  }, []);

  const playBeepPattern = useCallback(() => {
    const ctx = sharedAudioContext;
    if (!ctx || ctx.state !== "running") return;

    // Play two quick beeps
    const beepTimes = [0, 0.25];
    beepTimes.forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime + offset);

      gain.gain.setValueAtTime(0, ctx.currentTime + offset);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + offset + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + offset + 0.18);

      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.2);

      activeNodesRef.current.push({ osc, gain });

      osc.onended = () => {
        activeNodesRef.current = activeNodesRef.current.filter((n) => n.osc !== osc);
        try { gain.disconnect(); } catch {}
      };
    });
  }, []);

  const stopAlarm = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Stop any active oscillators
    activeNodesRef.current.forEach(({ osc, gain }) => {
      try { osc.stop(); } catch {}
      try { gain.disconnect(); } catch {}
    });
    activeNodesRef.current = [];
    setIsPlaying(false);
  }, []);

  const playAlarm = useCallback((): { needsUserGesture: boolean } => {
    const ctx = sharedAudioContext;
    if (!ctx || ctx.state !== "running") {
      return { needsUserGesture: true };
    }

    // Stop any existing alarm first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPlaying(true);
    playBeepPattern();

    // Repeat every 1.5 seconds
    intervalRef.current = setInterval(() => {
      playBeepPattern();
    }, 1500);

    return { needsUserGesture: false };
  }, [playBeepPattern]);

  const resumeAudioContext = useCallback(async () => {
    const ctx = createOrResumeAudioContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    setAudioReady(ctx.state === "running");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, [stopAlarm]);

  return { isPlaying, audioReady, playAlarm, stopAlarm, resumeAudioContext };
}
