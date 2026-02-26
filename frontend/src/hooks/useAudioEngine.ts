import { useRef, useCallback, useEffect } from "react";
import { AudioTuningParams, DEFAULT_PARAMS } from "../data/audioPresets";
import { SynthParams } from "../data/soundLibrary";

// Shared AudioContext singleton
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioContext();
  }
  return sharedAudioContext;
}

// Generate noise buffer
function createNoiseBuffer(ctx: AudioContext, type: "white" | "pink" | "brown", duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const frameCount = Math.ceil(sampleRate * duration);
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "white") {
    for (let i = 0; i < frameCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === "pink") {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < frameCount; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  } else {
    let lastOut = 0;
    for (let i = 0; i < frameCount; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  }
  return buffer;
}

// Create a simple reverb impulse response
function createReverbIR(ctx: AudioContext, roomSize: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const duration = 0.5 + (roomSize / 100) * 3.5;
  const frameCount = Math.ceil(sampleRate * duration);
  const buffer = ctx.createBuffer(2, frameCount, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < frameCount; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frameCount, 2);
    }
  }
  return buffer;
}

// Create distortion curve — use explicit ArrayBuffer to satisfy Float32Array<ArrayBuffer> type
function createDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const n = 256;
  const ab = new ArrayBuffer(n * Float32Array.BYTES_PER_ELEMENT);
  const curve = new Float32Array(ab);
  const deg = Math.PI / 180;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export interface AudioEngineRef {
  playSound: (params: SynthParams, tuning?: Partial<AudioTuningParams>) => void;
  stopAll: () => void;
  resumeContext: () => Promise<void>;
}

export function useAudioEngine(): AudioEngineRef {
  const activeSourcesRef = useRef<AudioNode[]>([]);

  useEffect(() => {
    return () => {
      activeSourcesRef.current.forEach((node) => {
        try {
          (node as AudioBufferSourceNode).stop?.();
          (node as OscillatorNode).stop?.();
        } catch (_) {}
      });
    };
  }, []);

  const resumeContext = useCallback(async () => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
  }, []);

  const stopAll = useCallback(() => {
    activeSourcesRef.current.forEach((node) => {
      try {
        (node as AudioBufferSourceNode).stop?.();
        (node as OscillatorNode).stop?.();
      } catch (_) {}
    });
    activeSourcesRef.current = [];
  }, []);

  const playSound = useCallback((params: SynthParams, tuning: Partial<AudioTuningParams> = {}) => {
    const merged: AudioTuningParams = { ...DEFAULT_PARAMS, ...tuning };
    const ctx = getAudioContext();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const duration = params.duration ?? 1.0;
    const attack = params.attack ?? 0.01;
    const decay = params.decay ?? 0.1;
    const sustain = params.sustain ?? 0.7;
    const release = params.release ?? 0.3;

    // ── Build processing chain ──────────────────────────────────────────────
    const masterGain = ctx.createGain();
    masterGain.gain.value = (merged.volume / 100) * (params.gainStart ?? 0.5);

    // Panning
    const panner = ctx.createStereoPanner();
    panner.pan.value = merged.panning / 100;

    // EQ
    const bassEQ = ctx.createBiquadFilter();
    bassEQ.type = "lowshelf";
    bassEQ.frequency.value = 200;
    bassEQ.gain.value = merged.bassGain;

    const midEQ = ctx.createBiquadFilter();
    midEQ.type = "peaking";
    midEQ.frequency.value = 1000;
    midEQ.Q.value = 1;
    midEQ.gain.value = merged.midGain;

    const trebleEQ = ctx.createBiquadFilter();
    trebleEQ.type = "highshelf";
    trebleEQ.frequency.value = 4000;
    trebleEQ.gain.value = merged.trebleGain;

    // Low-pass filter
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = "lowpass";
    lpFilter.frequency.value = Math.min(merged.lowpassFreq, ctx.sampleRate / 2 - 1);
    lpFilter.Q.value = params.filterQ ?? 1;

    // High-pass filter
    const hpFilter = ctx.createBiquadFilter();
    hpFilter.type = "highpass";
    hpFilter.frequency.value = merged.highpassFreq;

    // Distortion
    const distortion = ctx.createWaveShaper();
    distortion.curve = createDistortionCurve(merged.distortion);
    distortion.oversample = "4x";

    // Compressor
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = merged.compThreshold;
    compressor.ratio.value = merged.compRatio;
    compressor.attack.value = merged.compAttack / 1000;
    compressor.release.value = merged.compRelease / 1000;

    // Echo/Delay
    const delay = ctx.createDelay(2.1);
    delay.delayTime.value = merged.echoDelay / 1000;
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = merged.echoFeedback / 100;
    const delayWet = ctx.createGain();
    delayWet.gain.value = merged.echoDelay > 0 ? 0.5 : 0;

    // Reverb
    const convolver = ctx.createConvolver();
    convolver.buffer = createReverbIR(ctx, merged.reverbRoomSize);
    const reverbWet = ctx.createGain();
    reverbWet.gain.value = merged.reverbWet / 100;
    const reverbDry = ctx.createGain();
    reverbDry.gain.value = 1 - merged.reverbWet / 100;

    // Connect chain: source → lpFilter → hpFilter → bassEQ → midEQ → trebleEQ → distortion → compressor → panner
    const chainNodes = [lpFilter, hpFilter, bassEQ, midEQ, trebleEQ, distortion, compressor, panner];
    for (let i = 0; i < chainNodes.length - 1; i++) {
      chainNodes[i].connect(chainNodes[i + 1] as AudioNode);
    }

    // Reverb split
    panner.connect(reverbDry);
    panner.connect(convolver);
    convolver.connect(reverbWet);
    reverbDry.connect(masterGain);
    reverbWet.connect(masterGain);

    // Echo split
    panner.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(delayWet);
    delayWet.connect(masterGain);

    masterGain.connect(ctx.destination);

    // ── Create source ───────────────────────────────────────────────────────
    const totalDuration = duration + release;

    if (params.noiseType) {
      const buffer = createNoiseBuffer(ctx, params.noiseType, totalDuration + 0.1);
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Apply LFO if specified
      if (params.lfoRate && params.lfoDepth) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = params.lfoRate;
        lfoGain.gain.value = params.lfoDepth;
        lfo.connect(lfoGain);
        lfoGain.connect(lpFilter.frequency);
        lfo.start(now);
        lfo.stop(now + totalDuration);
        activeSourcesRef.current.push(lfo);
      }

      // Envelope on masterGain
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime((merged.volume / 100) * (params.gainStart ?? 0.3), now + attack);
      if (decay > 0) {
        masterGain.gain.linearRampToValueAtTime((merged.volume / 100) * (params.gainStart ?? 0.3) * sustain, now + attack + decay);
      }
      masterGain.gain.setValueAtTime((merged.volume / 100) * (params.gainStart ?? 0.3) * sustain, now + duration - release);
      masterGain.gain.linearRampToValueAtTime(0, now + totalDuration);

      source.connect(lpFilter);
      source.start(now);
      source.stop(now + totalDuration + 0.05);
      activeSourcesRef.current.push(source);
    } else {
      const osc = ctx.createOscillator();
      osc.type = params.oscillatorType ?? "sine";
      osc.frequency.value = params.frequency ?? 440;

      if (params.detune) osc.detune.value = params.detune;

      // Pitch shift via detune
      const pitchDetune = merged.pitch * 100;
      osc.detune.value = (params.detune ?? 0) + pitchDetune;

      // Frequency sweep
      if (params.frequencyEnd !== undefined) {
        osc.frequency.setValueAtTime(params.frequency ?? 440, now);
        osc.frequency.linearRampToValueAtTime(params.frequencyEnd, now + duration);
      }

      // LFO vibrato
      if (params.lfoRate && params.lfoDepth) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = params.lfoRate;
        lfoGain.gain.value = params.lfoDepth;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + totalDuration);
        activeSourcesRef.current.push(lfo);
      }

      // Envelope
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime((merged.volume / 100) * (params.gainStart ?? 0.5), now + attack);
      if (decay > 0) {
        masterGain.gain.linearRampToValueAtTime((merged.volume / 100) * (params.gainStart ?? 0.5) * sustain, now + attack + decay);
      }
      masterGain.gain.setValueAtTime((merged.volume / 100) * (params.gainStart ?? 0.5) * sustain, now + duration - release);
      masterGain.gain.linearRampToValueAtTime(0, now + totalDuration);

      osc.connect(lpFilter);
      osc.start(now);
      osc.stop(now + totalDuration + 0.05);
      activeSourcesRef.current.push(osc);
    }
  }, []);

  return { playSound, stopAll, resumeContext };
}
