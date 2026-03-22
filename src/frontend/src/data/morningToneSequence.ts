import type { SynthParams } from "./soundLibrary";

export interface AudioTuningParams {
  volume?: number;
  pitch?: number;
}

export interface SequenceStep {
  soundId: string;
  duration: number;
  tuningOverrides?: AudioTuningParams;
  synthParams?: SynthParams;
}

export interface MorningToneConfig {
  alarmTime: string; // HH:MM
  enabled: boolean;
}

export const MORNING_TONE_SEQUENCE: SequenceStep[] = [
  {
    soundId: "bell-soft",
    duration: 3000,
    tuningOverrides: { volume: 0.7, pitch: 1.0 },
  },
  {
    soundId: "nature-forest",
    duration: 5000,
    tuningOverrides: { volume: 0.5, pitch: 1.0 },
  },
  {
    soundId: "chord-major",
    duration: 4000,
    tuningOverrides: { volume: 0.8, pitch: 1.0 },
  },
];

export const DEFAULT_MORNING_TONE_CONFIG: MorningToneConfig = {
  alarmTime: "07:00",
  enabled: false,
};
