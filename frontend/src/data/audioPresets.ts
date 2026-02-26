export interface AudioTuningParams {
  pitch: number;        // semitones -24 to +24
  speed: number;        // 0.25 to 4.0
  volume: number;       // 0 to 200
  reverbWet: number;    // 0 to 100
  reverbRoomSize: number; // 0 to 100
  echoDelay: number;    // 0 to 2000 ms
  echoFeedback: number; // 0 to 100
  lowpassFreq: number;  // 20 to 20000
  highpassFreq: number; // 20 to 20000
  distortion: number;   // 0 to 100
  panning: number;      // -100 to 100
  bassGain: number;     // -20 to +20 dB
  midGain: number;      // -20 to +20 dB
  trebleGain: number;   // -20 to +20 dB
  compThreshold: number; // -60 to 0 dB
  compRatio: number;    // 1 to 20
  compAttack: number;   // 0 to 1000 ms
  compRelease: number;  // 0 to 1000 ms
}

export const DEFAULT_PARAMS: AudioTuningParams = {
  pitch: 0,
  speed: 1.0,
  volume: 100,
  reverbWet: 0,
  reverbRoomSize: 30,
  echoDelay: 0,
  echoFeedback: 0,
  lowpassFreq: 20000,
  highpassFreq: 20,
  distortion: 0,
  panning: 0,
  bassGain: 0,
  midGain: 0,
  trebleGain: 0,
  compThreshold: -24,
  compRatio: 4,
  compAttack: 30,
  compRelease: 250,
};

export const AUDIO_PRESETS: Record<string, AudioTuningParams> = {
  Default: { ...DEFAULT_PARAMS },

  "Game SFX": {
    pitch: 2,
    speed: 1.2,
    volume: 130,
    reverbWet: 10,
    reverbRoomSize: 20,
    echoDelay: 80,
    echoFeedback: 15,
    lowpassFreq: 18000,
    highpassFreq: 80,
    distortion: 5,
    panning: 0,
    bassGain: 4,
    midGain: 2,
    trebleGain: 6,
    compThreshold: -18,
    compRatio: 6,
    compAttack: 5,
    compRelease: 100,
  },

  "Voice Changer": {
    pitch: -8,
    speed: 0.9,
    volume: 110,
    reverbWet: 20,
    reverbRoomSize: 40,
    echoDelay: 120,
    echoFeedback: 25,
    lowpassFreq: 4000,
    highpassFreq: 200,
    distortion: 15,
    panning: 0,
    bassGain: 6,
    midGain: -3,
    trebleGain: -4,
    compThreshold: -20,
    compRatio: 8,
    compAttack: 10,
    compRelease: 200,
  },

  "Deep Bass": {
    pitch: -12,
    speed: 0.85,
    volume: 140,
    reverbWet: 15,
    reverbRoomSize: 50,
    echoDelay: 200,
    echoFeedback: 20,
    lowpassFreq: 800,
    highpassFreq: 20,
    distortion: 8,
    panning: 0,
    bassGain: 12,
    midGain: -4,
    trebleGain: -8,
    compThreshold: -12,
    compRatio: 10,
    compAttack: 20,
    compRelease: 300,
  },

  "High Pitch": {
    pitch: 12,
    speed: 1.3,
    volume: 90,
    reverbWet: 5,
    reverbRoomSize: 15,
    echoDelay: 50,
    echoFeedback: 10,
    lowpassFreq: 20000,
    highpassFreq: 500,
    distortion: 0,
    panning: 0,
    bassGain: -6,
    midGain: 2,
    trebleGain: 8,
    compThreshold: -30,
    compRatio: 3,
    compAttack: 5,
    compRelease: 150,
  },

  Robot: {
    pitch: 0,
    speed: 1.0,
    volume: 110,
    reverbWet: 30,
    reverbRoomSize: 60,
    echoDelay: 150,
    echoFeedback: 40,
    lowpassFreq: 3000,
    highpassFreq: 300,
    distortion: 40,
    panning: 0,
    bassGain: 3,
    midGain: 8,
    trebleGain: -2,
    compThreshold: -15,
    compRatio: 12,
    compAttack: 2,
    compRelease: 80,
  },

  "Echo Chamber": {
    pitch: 0,
    speed: 1.0,
    volume: 90,
    reverbWet: 70,
    reverbRoomSize: 90,
    echoDelay: 500,
    echoFeedback: 60,
    lowpassFreq: 12000,
    highpassFreq: 80,
    distortion: 0,
    panning: 0,
    bassGain: 2,
    midGain: 0,
    trebleGain: -2,
    compThreshold: -24,
    compRatio: 4,
    compAttack: 50,
    compRelease: 400,
  },

  "Underwater": {
    pitch: -4,
    speed: 0.8,
    volume: 80,
    reverbWet: 50,
    reverbRoomSize: 70,
    echoDelay: 300,
    echoFeedback: 30,
    lowpassFreq: 600,
    highpassFreq: 20,
    distortion: 0,
    panning: 0,
    bassGain: 4,
    midGain: -6,
    trebleGain: -12,
    compThreshold: -20,
    compRatio: 5,
    compAttack: 30,
    compRelease: 300,
  },

  "Telephone": {
    pitch: 0,
    speed: 1.0,
    volume: 100,
    reverbWet: 5,
    reverbRoomSize: 10,
    echoDelay: 0,
    echoFeedback: 0,
    lowpassFreq: 3400,
    highpassFreq: 300,
    distortion: 20,
    panning: 0,
    bassGain: -10,
    midGain: 6,
    trebleGain: -8,
    compThreshold: -10,
    compRatio: 15,
    compAttack: 1,
    compRelease: 50,
  },
};
