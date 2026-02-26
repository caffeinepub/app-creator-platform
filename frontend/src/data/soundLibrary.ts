export type SoundCategory =
  | "Human Voices"
  | "Animal Sounds"
  | "Nature Sounds"
  | "Musical Instruments"
  | "Game & UI SFX"
  | "Ambient & Environment"
  | "Electronic & Synth"
  | "Percussion & Beats";

export interface SoundEntry {
  id: string;
  name: string;
  category: SoundCategory;
  type: "synthesized";
  synthParams: SynthParams;
  description: string;
  emoji: string;
}

export interface SynthParams {
  oscillatorType?: OscillatorType;
  frequency?: number;
  frequencyEnd?: number;
  duration?: number;
  gainStart?: number;
  gainEnd?: number;
  detune?: number;
  filterType?: BiquadFilterType;
  filterFreq?: number;
  filterQ?: number;
  delayTime?: number;
  delayFeedback?: number;
  reverbAmount?: number;
  distortion?: number;
  lfoRate?: number;
  lfoDepth?: number;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  noiseType?: "white" | "pink" | "brown";
  harmonics?: number[];
  sweepStart?: number;
  sweepEnd?: number;
  sweepTime?: number;
  pulseWidth?: number;
  chorus?: boolean;
  bitcrush?: number;
}

export const SOUND_LIBRARY: SoundEntry[] = [
  // ── Human Voices ──────────────────────────────────────────────────────────
  {
    id: "voice-male-deep",
    name: "Deep Male Hum",
    category: "Human Voices",
    type: "synthesized",
    emoji: "🎙️",
    description: "Low resonant male vocal tone",
    synthParams: { oscillatorType: "sawtooth", frequency: 110, duration: 1.5, gainStart: 0.4, gainEnd: 0, filterType: "lowpass", filterFreq: 800, filterQ: 2, attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.5 },
  },
  {
    id: "voice-female-high",
    name: "Female Soprano",
    category: "Human Voices",
    type: "synthesized",
    emoji: "🎤",
    description: "High bright female vocal tone",
    synthParams: { oscillatorType: "sine", frequency: 440, duration: 1.5, gainStart: 0.5, gainEnd: 0, filterType: "bandpass", filterFreq: 2000, filterQ: 3, attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.4, harmonics: [1, 0.5, 0.25] },
  },
  {
    id: "voice-child",
    name: "Child Voice",
    category: "Human Voices",
    type: "synthesized",
    emoji: "👦",
    description: "Light, airy child-like tone",
    synthParams: { oscillatorType: "sine", frequency: 660, duration: 1.2, gainStart: 0.45, gainEnd: 0, filterType: "highpass", filterFreq: 300, filterQ: 1, attack: 0.03, decay: 0.1, sustain: 0.7, release: 0.3 },
  },
  {
    id: "voice-whisper",
    name: "Whisper",
    category: "Human Voices",
    type: "synthesized",
    emoji: "🤫",
    description: "Breathy whisper-like noise",
    synthParams: { noiseType: "white", duration: 1.0, gainStart: 0.15, gainEnd: 0, filterType: "bandpass", filterFreq: 3000, filterQ: 8, attack: 0.05, release: 0.3 },
  },
  {
    id: "voice-robot",
    name: "Robot Voice",
    category: "Human Voices",
    type: "synthesized",
    emoji: "🤖",
    description: "Metallic robotic vocal",
    synthParams: { oscillatorType: "square", frequency: 220, duration: 1.5, gainStart: 0.4, gainEnd: 0, filterType: "bandpass", filterFreq: 1200, filterQ: 5, lfoRate: 8, lfoDepth: 50, attack: 0.01, release: 0.2 },
  },
  {
    id: "voice-choir",
    name: "Choir Ahh",
    category: "Human Voices",
    type: "synthesized",
    emoji: "🎶",
    description: "Warm choir vowel sound",
    synthParams: { oscillatorType: "sawtooth", frequency: 330, duration: 2.0, gainStart: 0.35, gainEnd: 0, filterType: "bandpass", filterFreq: 1500, filterQ: 2, chorus: true, attack: 0.2, decay: 0.3, sustain: 0.6, release: 0.8 },
  },

  // ── Animal Sounds ─────────────────────────────────────────────────────────
  {
    id: "animal-dog-bark",
    name: "Dog Bark",
    category: "Animal Sounds",
    type: "synthesized",
    emoji: "🐕",
    description: "Sharp dog bark",
    synthParams: { noiseType: "brown", duration: 0.3, gainStart: 0.8, gainEnd: 0, filterType: "bandpass", filterFreq: 800, filterQ: 3, attack: 0.01, release: 0.15, sweepStart: 600, sweepEnd: 200, sweepTime: 0.2 },
  },
  {
    id: "animal-cat-meow",
    name: "Cat Meow",
    category: "Animal Sounds",
    type: "synthesized",
    emoji: "🐱",
    description: "Soft cat meow",
    synthParams: { oscillatorType: "sawtooth", frequency: 800, frequencyEnd: 400, duration: 0.8, gainStart: 0.5, gainEnd: 0, filterType: "bandpass", filterFreq: 1500, filterQ: 4, attack: 0.05, release: 0.3 },
  },
  {
    id: "animal-bird-tweet",
    name: "Bird Tweet",
    category: "Animal Sounds",
    type: "synthesized",
    emoji: "🐦",
    description: "Chirpy bird tweet",
    synthParams: { oscillatorType: "sine", frequency: 2000, frequencyEnd: 2800, duration: 0.4, gainStart: 0.6, gainEnd: 0, attack: 0.01, decay: 0.05, sustain: 0.5, release: 0.15 },
  },
  {
    id: "animal-frog",
    name: "Frog Croak",
    category: "Animal Sounds",
    type: "synthesized",
    emoji: "🐸",
    description: "Deep frog croak",
    synthParams: { oscillatorType: "square", frequency: 180, frequencyEnd: 120, duration: 0.5, gainStart: 0.6, gainEnd: 0, filterType: "lowpass", filterFreq: 600, filterQ: 5, attack: 0.02, release: 0.2 },
  },
  {
    id: "animal-wolf-howl",
    name: "Wolf Howl",
    category: "Animal Sounds",
    type: "synthesized",
    emoji: "🐺",
    description: "Eerie wolf howl",
    synthParams: { oscillatorType: "sawtooth", frequency: 300, frequencyEnd: 600, duration: 2.5, gainStart: 0.5, gainEnd: 0, filterType: "bandpass", filterFreq: 800, filterQ: 2, attack: 0.3, release: 1.0 },
  },
  {
    id: "animal-bee-buzz",
    name: "Bee Buzz",
    category: "Animal Sounds",
    type: "synthesized",
    emoji: "🐝",
    description: "Buzzing bee sound",
    synthParams: { oscillatorType: "sawtooth", frequency: 240, duration: 1.0, gainStart: 0.3, gainEnd: 0.3, filterType: "bandpass", filterFreq: 1200, filterQ: 6, lfoRate: 12, lfoDepth: 30, attack: 0.05, release: 0.2 },
  },

  // ── Nature Sounds ─────────────────────────────────────────────────────────
  {
    id: "nature-rain",
    name: "Rain Drops",
    category: "Nature Sounds",
    type: "synthesized",
    emoji: "🌧️",
    description: "Gentle rain shower",
    synthParams: { noiseType: "white", duration: 2.0, gainStart: 0.2, gainEnd: 0.2, filterType: "bandpass", filterFreq: 4000, filterQ: 0.5, attack: 0.5, release: 0.5 },
  },
  {
    id: "nature-thunder",
    name: "Thunder Crack",
    category: "Nature Sounds",
    type: "synthesized",
    emoji: "⛈️",
    description: "Rumbling thunder",
    synthParams: { noiseType: "brown", duration: 2.5, gainStart: 0.9, gainEnd: 0, filterType: "lowpass", filterFreq: 300, filterQ: 1, attack: 0.01, decay: 0.3, sustain: 0.3, release: 1.5 },
  },
  {
    id: "nature-wind",
    name: "Wind Gust",
    category: "Nature Sounds",
    type: "synthesized",
    emoji: "💨",
    description: "Howling wind",
    synthParams: { noiseType: "pink", duration: 2.0, gainStart: 0.3, gainEnd: 0, filterType: "bandpass", filterFreq: 800, filterQ: 0.8, lfoRate: 0.5, lfoDepth: 200, attack: 0.5, release: 0.8 },
  },
  {
    id: "nature-fire",
    name: "Crackling Fire",
    category: "Nature Sounds",
    type: "synthesized",
    emoji: "🔥",
    description: "Warm crackling fire",
    synthParams: { noiseType: "brown", duration: 2.0, gainStart: 0.25, gainEnd: 0.25, filterType: "bandpass", filterFreq: 600, filterQ: 1.5, lfoRate: 3, lfoDepth: 100, attack: 0.2, release: 0.5 },
  },
  {
    id: "nature-ocean",
    name: "Ocean Wave",
    category: "Nature Sounds",
    type: "synthesized",
    emoji: "🌊",
    description: "Rolling ocean wave",
    synthParams: { noiseType: "pink", duration: 3.0, gainStart: 0.3, gainEnd: 0, filterType: "lowpass", filterFreq: 1200, filterQ: 0.5, lfoRate: 0.3, lfoDepth: 400, attack: 1.0, release: 1.5 },
  },
  {
    id: "nature-forest",
    name: "Forest Ambience",
    category: "Nature Sounds",
    type: "synthesized",
    emoji: "🌲",
    description: "Peaceful forest sounds",
    synthParams: { noiseType: "pink", duration: 2.5, gainStart: 0.15, gainEnd: 0.15, filterType: "bandpass", filterFreq: 2000, filterQ: 0.7, attack: 0.8, release: 0.8 },
  },

  // ── Musical Instruments ───────────────────────────────────────────────────
  {
    id: "instrument-piano",
    name: "Piano Note",
    category: "Musical Instruments",
    type: "synthesized",
    emoji: "🎹",
    description: "Clean piano middle C",
    synthParams: { oscillatorType: "triangle", frequency: 261.63, duration: 2.0, gainStart: 0.7, gainEnd: 0, filterType: "lowpass", filterFreq: 5000, filterQ: 0.5, attack: 0.01, decay: 0.3, sustain: 0.4, release: 1.0, harmonics: [1, 0.5, 0.25, 0.125] },
  },
  {
    id: "instrument-guitar",
    name: "Guitar Pluck",
    category: "Musical Instruments",
    type: "synthesized",
    emoji: "🎸",
    description: "Acoustic guitar pluck",
    synthParams: { oscillatorType: "sawtooth", frequency: 196, duration: 1.5, gainStart: 0.6, gainEnd: 0, filterType: "lowpass", filterFreq: 3000, filterQ: 1, attack: 0.005, decay: 0.2, sustain: 0.3, release: 0.8 },
  },
  {
    id: "instrument-bass",
    name: "Bass Guitar",
    category: "Musical Instruments",
    type: "synthesized",
    emoji: "🎵",
    description: "Deep bass guitar note",
    synthParams: { oscillatorType: "sawtooth", frequency: 82, duration: 1.5, gainStart: 0.7, gainEnd: 0, filterType: "lowpass", filterFreq: 800, filterQ: 2, attack: 0.01, decay: 0.15, sustain: 0.5, release: 0.6 },
  },
  {
    id: "instrument-violin",
    name: "Violin Bow",
    category: "Musical Instruments",
    type: "synthesized",
    emoji: "🎻",
    description: "Bowed violin string",
    synthParams: { oscillatorType: "sawtooth", frequency: 440, duration: 2.0, gainStart: 0.4, gainEnd: 0, filterType: "bandpass", filterFreq: 2500, filterQ: 3, lfoRate: 5, lfoDepth: 8, attack: 0.15, decay: 0.1, sustain: 0.7, release: 0.5 },
  },
  {
    id: "instrument-trumpet",
    name: "Trumpet Blast",
    category: "Musical Instruments",
    type: "synthesized",
    emoji: "🎺",
    description: "Bright trumpet note",
    synthParams: { oscillatorType: "square", frequency: 523, duration: 1.2, gainStart: 0.5, gainEnd: 0, filterType: "bandpass", filterFreq: 3000, filterQ: 2, attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.3, harmonics: [1, 0.7, 0.5, 0.3] },
  },
  {
    id: "instrument-flute",
    name: "Flute Tone",
    category: "Musical Instruments",
    type: "synthesized",
    emoji: "🪈",
    description: "Airy flute note",
    synthParams: { oscillatorType: "sine", frequency: 880, duration: 1.8, gainStart: 0.45, gainEnd: 0, filterType: "highpass", filterFreq: 500, filterQ: 0.5, lfoRate: 5.5, lfoDepth: 5, attack: 0.1, decay: 0.05, sustain: 0.8, release: 0.5 },
  },

  // ── Game & UI SFX ─────────────────────────────────────────────────────────
  {
    id: "game-coin",
    name: "Coin Collect",
    category: "Game & UI SFX",
    type: "synthesized",
    emoji: "🪙",
    description: "Classic coin pickup",
    synthParams: { oscillatorType: "sine", frequency: 988, frequencyEnd: 1319, duration: 0.3, gainStart: 0.7, gainEnd: 0, attack: 0.01, decay: 0.05, sustain: 0.5, release: 0.15 },
  },
  {
    id: "game-jump",
    name: "Jump",
    category: "Game & UI SFX",
    type: "synthesized",
    emoji: "⬆️",
    description: "Platformer jump sound",
    synthParams: { oscillatorType: "square", frequency: 300, frequencyEnd: 600, duration: 0.25, gainStart: 0.6, gainEnd: 0, filterType: "highpass", filterFreq: 200, attack: 0.01, release: 0.15 },
  },
  {
    id: "game-explosion",
    name: "Explosion",
    category: "Game & UI SFX",
    type: "synthesized",
    emoji: "💥",
    description: "Big game explosion",
    synthParams: { noiseType: "brown", duration: 1.2, gainStart: 1.0, gainEnd: 0, filterType: "lowpass", filterFreq: 400, filterQ: 1, attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.8 },
  },
  {
    id: "game-powerup",
    name: "Power Up",
    category: "Game & UI SFX",
    type: "synthesized",
    emoji: "⚡",
    description: "Power-up jingle",
    synthParams: { oscillatorType: "sine", frequency: 440, frequencyEnd: 880, duration: 0.5, gainStart: 0.6, gainEnd: 0, attack: 0.01, decay: 0.1, sustain: 0.6, release: 0.2 },
  },
  {
    id: "game-laser",
    name: "Laser Shot",
    category: "Game & UI SFX",
    type: "synthesized",
    emoji: "🔫",
    description: "Sci-fi laser blast",
    synthParams: { oscillatorType: "sawtooth", frequency: 1200, frequencyEnd: 200, duration: 0.3, gainStart: 0.7, gainEnd: 0, filterType: "highpass", filterFreq: 300, attack: 0.005, release: 0.2 },
  },
  {
    id: "game-click",
    name: "UI Click",
    category: "Game & UI SFX",
    type: "synthesized",
    emoji: "🖱️",
    description: "Crisp UI button click",
    synthParams: { oscillatorType: "sine", frequency: 1000, duration: 0.08, gainStart: 0.5, gainEnd: 0, attack: 0.001, release: 0.05 },
  },
  {
    id: "game-error",
    name: "Error Buzz",
    category: "Game & UI SFX",
    type: "synthesized",
    emoji: "❌",
    description: "Error/wrong answer buzz",
    synthParams: { oscillatorType: "square", frequency: 150, duration: 0.4, gainStart: 0.6, gainEnd: 0, filterType: "lowpass", filterFreq: 500, attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.2 },
  },
  {
    id: "game-success",
    name: "Success Chime",
    category: "Game & UI SFX",
    type: "synthesized",
    emoji: "✅",
    description: "Victory/success chime",
    synthParams: { oscillatorType: "sine", frequency: 523, frequencyEnd: 1047, duration: 0.6, gainStart: 0.6, gainEnd: 0, attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.3 },
  },

  // ── Ambient & Environment ─────────────────────────────────────────────────
  {
    id: "ambient-space",
    name: "Deep Space",
    category: "Ambient & Environment",
    type: "synthesized",
    emoji: "🌌",
    description: "Eerie deep space drone",
    synthParams: { oscillatorType: "sine", frequency: 55, duration: 3.0, gainStart: 0.3, gainEnd: 0, filterType: "lowpass", filterFreq: 200, filterQ: 5, lfoRate: 0.1, lfoDepth: 20, attack: 1.0, release: 1.5 },
  },
  {
    id: "ambient-cave",
    name: "Cave Drip",
    category: "Ambient & Environment",
    type: "synthesized",
    emoji: "🦇",
    description: "Water drip in a cave",
    synthParams: { oscillatorType: "sine", frequency: 800, frequencyEnd: 400, duration: 0.5, gainStart: 0.5, gainEnd: 0, filterType: "bandpass", filterFreq: 1000, filterQ: 8, attack: 0.005, release: 0.3, reverbAmount: 0.7 },
  },
  {
    id: "ambient-city",
    name: "City Hum",
    category: "Ambient & Environment",
    type: "synthesized",
    emoji: "🏙️",
    description: "Urban city background hum",
    synthParams: { noiseType: "pink", duration: 2.5, gainStart: 0.15, gainEnd: 0.15, filterType: "bandpass", filterFreq: 500, filterQ: 0.5, lfoRate: 0.2, lfoDepth: 50, attack: 1.0, release: 1.0 },
  },
  {
    id: "ambient-underwater",
    name: "Underwater",
    category: "Ambient & Environment",
    type: "synthesized",
    emoji: "🌊",
    description: "Muffled underwater ambience",
    synthParams: { noiseType: "pink", duration: 2.5, gainStart: 0.2, gainEnd: 0.2, filterType: "lowpass", filterFreq: 400, filterQ: 2, lfoRate: 0.4, lfoDepth: 100, attack: 0.8, release: 0.8 },
  },
  {
    id: "ambient-horror",
    name: "Horror Drone",
    category: "Ambient & Environment",
    type: "synthesized",
    emoji: "👻",
    description: "Unsettling horror atmosphere",
    synthParams: { oscillatorType: "sawtooth", frequency: 40, duration: 3.0, gainStart: 0.25, gainEnd: 0, filterType: "lowpass", filterFreq: 150, filterQ: 3, lfoRate: 0.05, lfoDepth: 15, attack: 1.5, release: 1.5 },
  },

  // ── Electronic & Synth ────────────────────────────────────────────────────
  {
    id: "synth-lead",
    name: "Synth Lead",
    category: "Electronic & Synth",
    type: "synthesized",
    emoji: "🎛️",
    description: "Classic synth lead tone",
    synthParams: { oscillatorType: "sawtooth", frequency: 440, duration: 1.5, gainStart: 0.5, gainEnd: 0, filterType: "lowpass", filterFreq: 2000, filterQ: 8, lfoRate: 0.5, lfoDepth: 500, attack: 0.05, decay: 0.2, sustain: 0.6, release: 0.4 },
  },
  {
    id: "synth-bass",
    name: "808 Bass",
    category: "Electronic & Synth",
    type: "synthesized",
    emoji: "🔊",
    description: "Deep 808-style bass",
    synthParams: { oscillatorType: "sine", frequency: 55, frequencyEnd: 30, duration: 1.5, gainStart: 0.9, gainEnd: 0, filterType: "lowpass", filterFreq: 200, filterQ: 1, attack: 0.01, decay: 0.5, sustain: 0.3, release: 0.8 },
  },
  {
    id: "synth-arp",
    name: "Arpeggio",
    category: "Electronic & Synth",
    type: "synthesized",
    emoji: "🎼",
    description: "Fast synth arpeggio",
    synthParams: { oscillatorType: "square", frequency: 523, duration: 0.8, gainStart: 0.5, gainEnd: 0, filterType: "bandpass", filterFreq: 2000, filterQ: 4, lfoRate: 8, lfoDepth: 200, attack: 0.01, release: 0.1 },
  },
  {
    id: "synth-pad",
    name: "Ambient Pad",
    category: "Electronic & Synth",
    type: "synthesized",
    emoji: "🌠",
    description: "Lush ambient synth pad",
    synthParams: { oscillatorType: "triangle", frequency: 220, duration: 3.0, gainStart: 0.35, gainEnd: 0, filterType: "lowpass", filterFreq: 1500, filterQ: 2, chorus: true, attack: 0.5, decay: 0.5, sustain: 0.7, release: 1.5 },
  },
  {
    id: "synth-glitch",
    name: "Glitch",
    category: "Electronic & Synth",
    type: "synthesized",
    emoji: "⚡",
    description: "Digital glitch effect",
    synthParams: { oscillatorType: "square", frequency: 880, duration: 0.3, gainStart: 0.7, gainEnd: 0, filterType: "highpass", filterFreq: 1000, bitcrush: 4, lfoRate: 20, lfoDepth: 400, attack: 0.001, release: 0.1 },
  },
  {
    id: "synth-wobble",
    name: "Wobble Bass",
    category: "Electronic & Synth",
    type: "synthesized",
    emoji: "〰️",
    description: "Dubstep wobble bass",
    synthParams: { oscillatorType: "sawtooth", frequency: 110, duration: 2.0, gainStart: 0.6, gainEnd: 0, filterType: "lowpass", filterFreq: 800, filterQ: 10, lfoRate: 4, lfoDepth: 600, attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.5 },
  },

  // ── Percussion & Beats ────────────────────────────────────────────────────
  {
    id: "perc-kick",
    name: "Kick Drum",
    category: "Percussion & Beats",
    type: "synthesized",
    emoji: "🥁",
    description: "Punchy kick drum",
    synthParams: { oscillatorType: "sine", frequency: 150, frequencyEnd: 40, duration: 0.5, gainStart: 1.0, gainEnd: 0, filterType: "lowpass", filterFreq: 300, attack: 0.001, decay: 0.1, sustain: 0.2, release: 0.3 },
  },
  {
    id: "perc-snare",
    name: "Snare",
    category: "Percussion & Beats",
    type: "synthesized",
    emoji: "🪘",
    description: "Crisp snare drum",
    synthParams: { noiseType: "white", duration: 0.3, gainStart: 0.8, gainEnd: 0, filterType: "bandpass", filterFreq: 2000, filterQ: 2, attack: 0.001, decay: 0.05, sustain: 0.2, release: 0.15 },
  },
  {
    id: "perc-hihat",
    name: "Hi-Hat",
    category: "Percussion & Beats",
    type: "synthesized",
    emoji: "🎵",
    description: "Tight closed hi-hat",
    synthParams: { noiseType: "white", duration: 0.1, gainStart: 0.6, gainEnd: 0, filterType: "highpass", filterFreq: 8000, filterQ: 1, attack: 0.001, release: 0.06 },
  },
  {
    id: "perc-openhat",
    name: "Open Hi-Hat",
    category: "Percussion & Beats",
    type: "synthesized",
    emoji: "🎶",
    description: "Open hi-hat shimmer",
    synthParams: { noiseType: "white", duration: 0.6, gainStart: 0.5, gainEnd: 0, filterType: "highpass", filterFreq: 6000, filterQ: 1, attack: 0.001, release: 0.4 },
  },
  {
    id: "perc-clap",
    name: "Clap",
    category: "Percussion & Beats",
    type: "synthesized",
    emoji: "👏",
    description: "Sharp hand clap",
    synthParams: { noiseType: "white", duration: 0.25, gainStart: 0.9, gainEnd: 0, filterType: "bandpass", filterFreq: 1500, filterQ: 3, attack: 0.001, decay: 0.03, sustain: 0.3, release: 0.12 },
  },
  {
    id: "perc-tom",
    name: "Tom Tom",
    category: "Percussion & Beats",
    type: "synthesized",
    emoji: "🥁",
    description: "Mid-range tom drum",
    synthParams: { oscillatorType: "sine", frequency: 200, frequencyEnd: 80, duration: 0.6, gainStart: 0.8, gainEnd: 0, filterType: "lowpass", filterFreq: 500, attack: 0.001, decay: 0.15, sustain: 0.2, release: 0.3 },
  },
  {
    id: "perc-cowbell",
    name: "Cowbell",
    category: "Percussion & Beats",
    type: "synthesized",
    emoji: "🔔",
    description: "Classic cowbell hit",
    synthParams: { oscillatorType: "square", frequency: 562, duration: 0.8, gainStart: 0.7, gainEnd: 0, filterType: "bandpass", filterFreq: 1000, filterQ: 5, attack: 0.001, decay: 0.1, sustain: 0.3, release: 0.5 },
  },
];

export const SOUND_CATEGORIES: SoundCategory[] = [
  "Human Voices",
  "Animal Sounds",
  "Nature Sounds",
  "Musical Instruments",
  "Game & UI SFX",
  "Ambient & Environment",
  "Electronic & Synth",
  "Percussion & Beats",
];

export function getSoundsByCategory(category: SoundCategory): SoundEntry[] {
  return SOUND_LIBRARY.filter((s) => s.category === category);
}

export function getSoundById(id: string): SoundEntry | undefined {
  return SOUND_LIBRARY.find((s) => s.id === id);
}
