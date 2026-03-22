import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_MORNING_TONE_CONFIG,
  MORNING_TONE_SEQUENCE,
  type MorningToneConfig,
} from "../data/morningToneSequence";
import { SOUND_LIBRARY } from "../data/soundLibrary";

const STORAGE_KEY = "morning-tone-config";

export function useMorningToneConfig() {
  const [config, setConfig] = useState<MorningToneConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_MORNING_TONE_CONFIG;
    } catch {
      return DEFAULT_MORNING_TONE_CONFIG;
    }
  });

  const updateConfig = useCallback((updates: Partial<MorningToneConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { config, updateConfig };
}

export function useMorningTonePlayer() {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stop = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const play = useCallback(async () => {
    stop();

    let audioCtx: AudioContext;
    try {
      audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
    } catch {
      return;
    }

    let offset = 0;

    for (const step of MORNING_TONE_SEQUENCE) {
      const sound = SOUND_LIBRARY.find((s) => s.id === step.soundId);
      if (!sound) {
        offset += step.duration;
        continue;
      }

      const delay = offset;
      const t = setTimeout(() => {
        try {
          const params = sound.synthParams;
          const now = audioCtx.currentTime;
          const duration = params.duration ?? 1.0;
          const attack = params.attack ?? 0.01;
          const decay = params.decay ?? 0.1;
          const sustain = params.sustain ?? 0.7;
          const release = params.release ?? 0.3;
          const volume = step.tuningOverrides?.volume ?? 0.7;

          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(volume, now + attack);
          gainNode.gain.linearRampToValueAtTime(
            volume * sustain,
            now + attack + decay,
          );
          gainNode.gain.setValueAtTime(
            volume * sustain,
            now + duration - release,
          );
          gainNode.gain.linearRampToValueAtTime(0, now + duration);
          gainNode.connect(audioCtx.destination);

          if (params.noiseType) {
            // Noise-based source
            const bufferSize = Math.ceil(audioCtx.sampleRate * duration);
            const buffer = audioCtx.createBuffer(
              1,
              bufferSize,
              audioCtx.sampleRate,
            );
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++)
              data[i] = Math.random() * 2 - 1;
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;

            if (params.filterType && params.filterFreq) {
              const filter = audioCtx.createBiquadFilter();
              filter.type = params.filterType;
              filter.frequency.value = params.filterFreq;
              if (params.filterQ) filter.Q.value = params.filterQ;
              source.connect(filter);
              filter.connect(gainNode);
            } else {
              source.connect(gainNode);
            }
            source.start(now);
            source.stop(now + duration + 0.05);
          } else {
            // Oscillator-based source
            const osc = audioCtx.createOscillator();
            osc.type = params.oscillatorType ?? "sine";
            osc.frequency.setValueAtTime(params.frequency ?? 440, now);

            if (params.frequencyEnd !== undefined) {
              osc.frequency.linearRampToValueAtTime(
                params.frequencyEnd,
                now + duration,
              );
            }

            // Harmonics (flat number[] — each value is a gain multiplier at integer ratio)
            if (params.harmonics && params.harmonics.length > 0) {
              params.harmonics.forEach((harmGainVal, idx) => {
                const harmOsc = audioCtx.createOscillator();
                harmOsc.type = "sine";
                harmOsc.frequency.value = (params.frequency ?? 440) * (idx + 2);
                const harmGain = audioCtx.createGain();
                harmGain.gain.value = harmGainVal * volume;
                harmOsc.connect(harmGain);
                harmGain.connect(audioCtx.destination);
                harmOsc.start(now);
                harmOsc.stop(now + duration + 0.05);
              });
            }

            if (params.lfoRate && params.lfoDepth) {
              const lfo = audioCtx.createOscillator();
              const lfoGain = audioCtx.createGain();
              lfo.frequency.value = params.lfoRate;
              lfoGain.gain.value = params.lfoDepth;
              lfo.connect(lfoGain);
              lfoGain.connect(osc.frequency);
              lfo.start(now);
              lfo.stop(now + duration + 0.05);
            }

            osc.connect(gainNode);
            osc.start(now);
            osc.stop(now + duration + 0.05);
          }
        } catch {
          // ignore audio errors silently
        }
      }, delay);

      timeoutsRef.current.push(t);
      offset += step.duration;
    }

    return stop;
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return { play, stop };
}

export function useScheduleMorningTone(onTrigger: () => void) {
  const { config } = useMorningToneConfig();
  const firedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!config.enabled) return;

    const check = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const current = `${hh}:${mm}`;
      const key = `${current}-${now.toDateString()}`;
      if (current === config.alarmTime && firedRef.current !== key) {
        firedRef.current = key;
        onTrigger();
      }
    };

    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [config.enabled, config.alarmTime, onTrigger]);
}
