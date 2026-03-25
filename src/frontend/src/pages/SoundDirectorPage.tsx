import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Download, Loader2, Music, Play, Square, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const MOOD_PRESETS = [
  { id: "thriller", label: "Thriller", bpm: 95, key: "D", mode: "minor" },
  { id: "happy", label: "Happy", bpm: 128, key: "G", mode: "major" },
  { id: "sad", label: "Sad", bpm: 72, key: "A", mode: "minor" },
  { id: "epic", label: "Epic", bpm: 140, key: "E", mode: "minor" },
  { id: "ambient", label: "Ambient", bpm: 60, key: "C", mode: "major" },
  { id: "horror", label: "Horror", bpm: 80, key: "B", mode: "minor" },
  { id: "romance", label: "Romance", bpm: 88, key: "F", mode: "major" },
  { id: "action", label: "Action", bpm: 160, key: "G", mode: "minor" },
  { id: "meditation", label: "Meditation", bpm: 52, key: "C", mode: "major" },
  { id: "scifi", label: "Sci-Fi", bpm: 110, key: "E", mode: "minor" },
];

const KEYS = ["C", "D", "E", "F", "G", "A", "B"];

// Scales: major and minor
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function getScale(root: string, mode: string, octave = 4): number[] {
  const rootIdx = NOTE_NAMES.indexOf(root);
  const intervals = mode === "major" ? MAJOR_INTERVALS : MINOR_INTERVALS;
  const baseFreq = 440 * 2 ** ((rootIdx - 9 + (octave - 4) * 12) / 12);
  return intervals.map((i) => baseFreq * 2 ** (i / 12));
}

interface LayerConfig {
  enabled: boolean;
  volume: number;
}

interface Layers {
  drone: LayerConfig;
  melody: LayerConfig;
  bass: LayerConfig;
  rhythm: LayerConfig;
  atmosphere: LayerConfig;
  sfx: LayerConfig;
}

const DEFAULT_LAYERS: Layers = {
  drone: { enabled: true, volume: 0.4 },
  melody: { enabled: true, volume: 0.6 },
  bass: { enabled: true, volume: 0.5 },
  rhythm: { enabled: true, volume: 0.5 },
  atmosphere: { enabled: true, volume: 0.3 },
  sfx: { enabled: false, volume: 0.3 },
};

const LAYER_INFO: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  drone: { label: "Drone", icon: "〰", color: "text-violet-400" },
  melody: { label: "Melody", icon: "♪", color: "text-cyan-400" },
  bass: { label: "Bass Line", icon: "⬇", color: "text-blue-400" },
  rhythm: { label: "Rhythm", icon: "♦", color: "text-orange-400" },
  atmosphere: { label: "Atmosphere", icon: "☁", color: "text-teal-400" },
  sfx: { label: "SFX", icon: "✦", color: "text-pink-400" },
};

export default function SoundDirectorPage() {
  const [scene, setScene] = useState("");
  const [mood, setMood] = useState("ambient");
  const [bpm, setBpm] = useState(60);
  const [key, setKey] = useState("C");
  const [mode, setMode] = useState("major");
  const [layers, setLayers] = useState<Layers>(DEFAULT_LAYERS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDirecting, setIsDirecting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const allNodesRef = useRef<AudioNode[]>([]);
  const rafRef = useRef<number>(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const stopAll = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current);
    for (const n of allNodesRef.current) {
      try {
        (n as OscillatorNode).stop?.();
      } catch {
        /* already stopped */
      }
      try {
        n.disconnect();
      } catch {
        /* already disconnected */
      }
    }
    allNodesRef.current = [];
    setIsPlaying(false);
    setProgress(0);
  }, []);

  useEffect(
    () => () => {
      stopAll();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [stopAll],
  );

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  const drawSpectrum = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const bufLen = analyser.frequencyBinCount;
    const buf = new Uint8Array(bufLen);
    analyser.getByteFrequencyData(buf);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, W, H);

    const barW = Math.max(2, (W / bufLen) * 2.5);
    let x = 0;
    for (let i = 0; i < bufLen; i++) {
      const v = buf[i] / 255;
      const barH = v * H * 0.9;
      const hue = 260 + v * 80;
      const grad = ctx.createLinearGradient(x, H, x, H - barH);
      grad.addColorStop(0, `hsla(${hue},80%,30%,0.9)`);
      grad.addColorStop(1, `hsla(${hue + 40},90%,70%,0.95)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, H - barH, barW - 1, barH);
      x += barW + 1;
      if (x > W) break;
    }
    rafRef.current = requestAnimationFrame(drawSpectrum);
  }, []);

  const buildNote = useCallback(
    (
      ctx: AudioContext,
      freq: number,
      start: number,
      dur: number,
      vol: number,
      type: OscillatorType = "sine",
    ) => {
      if (freq <= 0) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(analyserRef.current ?? ctx.destination);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.02);
      gain.gain.setValueAtTime(vol, start + dur - 0.05);
      gain.gain.linearRampToValueAtTime(0, start + dur);
      osc.start(start);
      osc.stop(start + dur + 0.01);
      allNodesRef.current.push(osc, gain);
    },
    [],
  );

  const buildNoise = useCallback(
    (
      ctx: AudioContext,
      start: number,
      dur: number,
      filterFreq: number,
      vol: number,
    ) => {
      const bufSize = Math.ceil(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      filter.type = "bandpass";
      filter.frequency.value = filterFreq;
      filter.Q.value = 1.5;
      src.buffer = buf;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(analyserRef.current ?? ctx.destination);
      gain.gain.setValueAtTime(vol, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      src.start(start);
      src.stop(start + dur + 0.01);
      allNodesRef.current.push(src, filter, gain);
    },
    [],
  );

  const handleDirect = useCallback(async () => {
    setIsDirecting(true);
    stopAll();
    await new Promise((r) => setTimeout(r, 600));
    setIsDirecting(false);

    const ctx = getCtx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;

    const beatSec = 60 / bpm;
    const now = ctx.currentTime + 0.05;
    const duration = 32; // seconds
    const scale = getScale(key, mode, 4);
    const bassScale = getScale(key, mode, 3);
    startTimeRef.current = now;

    // --- Drone ---
    if (layers.drone.enabled) {
      const rootFreq = bassScale[0] / 2; // sub-octave
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      drone.type = "sawtooth";
      drone.frequency.value = rootFreq;
      lfo.type = "sine";
      lfo.frequency.value = 0.3;
      lfoGain.gain.value = rootFreq * 0.005;
      lfo.connect(lfoGain);
      lfoGain.connect(drone.frequency);
      drone.connect(droneGain);
      droneGain.connect(analyser);
      droneGain.gain.setValueAtTime(0, now);
      droneGain.gain.linearRampToValueAtTime(
        layers.drone.volume * 0.4,
        now + 2,
      );
      droneGain.gain.setValueAtTime(
        layers.drone.volume * 0.4,
        now + duration - 2,
      );
      droneGain.gain.linearRampToValueAtTime(0, now + duration);
      drone.start(now);
      drone.stop(now + duration);
      lfo.start(now);
      lfo.stop(now + duration);
      allNodesRef.current.push(drone, droneGain, lfo, lfoGain);
    }

    // --- Melody ---
    if (layers.melody.enabled) {
      const melPatterns: number[][] = [
        [0, 2, 4, 2, 1, 3, 5, 4],
        [0, 4, 2, 5, 3, 6, 4, 0],
        [5, 3, 1, 0, 2, 4, 3, 5],
      ];
      const pat = melPatterns[Math.floor(Math.random() * melPatterns.length)];
      for (let beat = 0; beat < Math.floor(duration / beatSec); beat++) {
        const scaleIdx = pat[beat % pat.length];
        const freq = scale[scaleIdx % scale.length];
        buildNote(
          ctx,
          freq,
          now + beat * beatSec,
          beatSec * 0.85,
          layers.melody.volume * 0.35,
          "triangle",
        );
      }
    }

    // --- Bass ---
    if (layers.bass.enabled) {
      for (let beat = 0; beat < Math.floor(duration / beatSec); beat++) {
        const isOdd = beat % 2 === 1;
        const freq = isOdd ? bassScale[4] : bassScale[0]; // root / fifth
        buildNote(
          ctx,
          freq,
          now + beat * beatSec,
          beatSec * 0.7,
          layers.bass.volume * 0.5,
          "sawtooth",
        );
      }
    }

    // --- Rhythm ---
    if (layers.rhythm.enabled) {
      const beats = Math.floor(duration / beatSec);
      for (let b = 0; b < beats; b++) {
        // Kick on beats 0,2 (quarter note pattern)
        if (b % 2 === 0)
          buildNote(
            ctx,
            80,
            now + b * beatSec,
            0.18,
            layers.rhythm.volume * 0.8,
            "sine",
          );
        // Snare on beats 1,3
        if (b % 2 === 1)
          buildNoise(
            ctx,
            now + b * beatSec,
            0.12,
            2500,
            layers.rhythm.volume * 0.5,
          );
        // Hi-hat every 8th note
        buildNoise(
          ctx,
          now + b * beatSec + beatSec / 2,
          0.04,
          8000,
          layers.rhythm.volume * 0.2,
        );
      }
    }

    // --- Atmosphere ---
    if (layers.atmosphere.enabled) {
      const atmoNotes = [scale[0], scale[2], scale[4], scale[6] ?? scale[5]];
      atmoNotes.forEach((freq, i) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.value = freq;
        osc2.type = "sine";
        osc2.frequency.value = freq * 1.005; // slight detune
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(analyser);
        const delay = i * 1.5;
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(
          layers.atmosphere.volume * 0.15,
          now + delay + 3,
        );
        gain.gain.setValueAtTime(
          layers.atmosphere.volume * 0.15,
          now + duration - 3,
        );
        gain.gain.linearRampToValueAtTime(0, now + duration);
        osc1.start(now + delay);
        osc1.stop(now + duration);
        osc2.start(now + delay);
        osc2.stop(now + duration);
        allNodesRef.current.push(osc1, osc2, gain);
      });
    }

    // --- SFX ---
    if (layers.sfx.enabled) {
      for (let i = 0; i < 6; i++) {
        const t = now + Math.random() * duration;
        const startFreq = 200 + Math.random() * 1200;
        const endFreq = startFreq * (Math.random() > 0.5 ? 2 : 0.5);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.4);
        osc.connect(gain);
        gain.connect(analyser);
        gain.gain.setValueAtTime(layers.sfx.volume * 0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.45);
        allNodesRef.current.push(osc, gain);
      }
    }

    setIsPlaying(true);
    drawSpectrum();

    // Progress bar
    progressRef.current = setInterval(() => {
      const elapsed = ctx.currentTime - startTimeRef.current;
      setProgress(Math.min(100, (elapsed / duration) * 100));
      if (elapsed >= duration) {
        stopAll();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      }
    }, 100);
  }, [
    bpm,
    key,
    mode,
    layers,
    getCtx,
    stopAll,
    buildNote,
    buildNoise,
    drawSpectrum,
  ]);

  const handleStop = useCallback(() => {
    stopAll();
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx2 = canvas.getContext("2d");
      if (ctx2) {
        ctx2.fillStyle = "#050510";
        ctx2.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [stopAll]);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      const duration = 30;
      const offlineCtx = new OfflineAudioContext(2, 44100 * duration, 44100);
      const scale = getScale(key, mode, 4);
      const bassScale = getScale(key, mode, 3);
      const beatSec = 60 / bpm;

      const renderNote = (
        freq: number,
        start: number,
        dur: number,
        vol: number,
        type: OscillatorType = "sine",
      ) => {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(offlineCtx.destination);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(vol, start + 0.02);
        gain.gain.setValueAtTime(vol, start + dur - 0.05);
        gain.gain.linearRampToValueAtTime(0, start + dur);
        osc.start(start);
        osc.stop(start + dur + 0.01);
      };

      if (layers.melody.enabled) {
        const pat = [0, 2, 4, 2, 1, 3, 5, 4];
        for (let b = 0; b < Math.floor(duration / beatSec); b++) {
          renderNote(
            scale[pat[b % pat.length] % scale.length],
            b * beatSec,
            beatSec * 0.85,
            layers.melody.volume * 0.35,
            "triangle",
          );
        }
      }
      if (layers.bass.enabled) {
        for (let b = 0; b < Math.floor(duration / beatSec); b++) {
          renderNote(
            b % 2 ? bassScale[4] : bassScale[0],
            b * beatSec,
            beatSec * 0.7,
            layers.bass.volume * 0.5,
            "sawtooth",
          );
        }
      }

      const rendered = await offlineCtx.startRendering();
      const numFrames = rendered.length;
      const numChannels = rendered.numberOfChannels;
      const byteRate = 44100 * numChannels * 2;
      const blockAlign = numChannels * 2;
      const dataSize = numFrames * blockAlign;
      const buffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(buffer);
      const write = (off: number, str: string) => {
        for (let i = 0; i < str.length; i++)
          view.setUint8(off + i, str.charCodeAt(i));
      };
      write(0, "RIFF");
      view.setUint32(4, 36 + dataSize, true);
      write(8, "WAVE");
      write(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, 44100, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, 16, true);
      write(36, "data");
      view.setUint32(40, dataSize, true);
      let offset = 44;
      for (let i = 0; i < numFrames; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const sample = Math.max(
            -1,
            Math.min(1, rendered.getChannelData(ch)[i]),
          );
          view.setInt16(
            offset,
            sample < 0 ? sample * 0x8000 : sample * 0x7fff,
            true,
          );
          offset += 2;
        }
      }
      const blob = new Blob([buffer], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `noventra-sound-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }, [bpm, key, mode, layers]);

  const applyMoodPreset = useCallback((id: string) => {
    const preset = MOOD_PRESETS.find((m) => m.id === id);
    if (!preset) return;
    setMood(id);
    setBpm(preset.bpm);
    setKey(preset.key);
    setMode(preset.mode);
  }, []);

  const updateLayer = useCallback(
    (layer: keyof Layers, patch: Partial<LayerConfig>) => {
      setLayers((prev) => ({ ...prev, [layer]: { ...prev[layer], ...patch } }));
    },
    [],
  );

  return (
    <div
      className="min-h-[calc(100vh-4rem)] bg-background flex flex-col"
      data-ocid="sounddir.page"
    >
      {/* Header */}
      <div className="border-b border-border/30 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">
            Automatic Sound Director
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-composed layered soundscapes using Web Audio API
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Controls */}
        <div className="w-80 shrink-0 border-r border-border/30 flex flex-col gap-5 p-5 overflow-y-auto">
          {/* Scene description */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Scene Description
            </Label>
            <Textarea
              value={scene}
              onChange={(e) => setScene(e.target.value)}
              placeholder="A tense thriller chase through rainy neon streets..."
              className="h-20 resize-none bg-white/[0.03] border-white/10 text-sm focus:border-cyan-500/50 placeholder:text-muted-foreground/40"
              data-ocid="sounddir.textarea"
            />
          </div>

          {/* Mood presets */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Mood
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_PRESETS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => applyMoodPreset(m.id)}
                  data-ocid={`sounddir.${m.id}.toggle`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    mood === m.id
                      ? "bg-cyan-600/30 border-cyan-500/50 text-cyan-300"
                      : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-white/20"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* BPM */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              BPM — <span className="text-cyan-400 font-mono">{bpm}</span>
            </Label>
            <Slider
              value={[bpm]}
              onValueChange={([v]) => setBpm(v)}
              min={40}
              max={200}
              step={1}
              className="[&_[role=slider]]:bg-cyan-500"
              data-ocid="sounddir.bpm.input"
            />
          </div>

          {/* Key & Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-foreground/70">Key</Label>
              <Select value={key} onValueChange={setKey}>
                <SelectTrigger
                  className="bg-white/[0.03] border-white/10 h-9"
                  data-ocid="sounddir.key.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KEYS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-foreground/70">Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger
                  className="bg-white/[0.03] border-white/10 h-9"
                  data-ocid="sounddir.mode.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Layer controls */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Layers
            </Label>
            {(Object.keys(layers) as (keyof Layers)[]).map((layerKey) => {
              const info = LAYER_INFO[layerKey];
              const layer = layers[layerKey];
              return (
                <div
                  key={layerKey}
                  className={`rounded-xl border p-3 space-y-2 transition-all ${
                    layer.enabled
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-white/5 bg-white/[0.01] opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${info.color} flex items-center gap-1.5`}
                    >
                      <span>{info.icon}</span>
                      {info.label}
                    </span>
                    <Switch
                      checked={layer.enabled}
                      onCheckedChange={(v) =>
                        updateLayer(layerKey, { enabled: v })
                      }
                      data-ocid={`sounddir.${layerKey}.switch`}
                    />
                  </div>
                  {layer.enabled && (
                    <Slider
                      value={[Math.round(layer.volume * 100)]}
                      onValueChange={([v]) =>
                        updateLayer(layerKey, { volume: v / 100 })
                      }
                      min={0}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-violet-500 h-4"
                      data-ocid={`sounddir.${layerKey}.input`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Sound button */}
          <Button
            onClick={handleDirect}
            disabled={isDirecting || isPlaying}
            className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 border-0 text-white h-11 font-semibold"
            data-ocid="sounddir.primary_button"
          >
            {isDirecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Composing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Direct Sound
              </>
            )}
          </Button>
        </div>

        {/* Right — Visualizer & Transport */}
        <div className="flex-1 flex flex-col p-6 gap-5 bg-[#050510]">
          {/* Spectrum analyzer */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#050510] relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="w-full h-full"
              style={{ display: "block" }}
            />
            {!isPlaying && !isDirecting && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                data-ocid="sounddir.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-900/40 to-violet-900/40 border border-white/10 flex items-center justify-center">
                  <Music className="w-7 h-7 text-cyan-400/50" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure your composition and click{" "}
                  <span className="text-cyan-400">Direct Sound</span>
                </p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div
              className="h-2 bg-white/5 rounded-full overflow-hidden"
              data-ocid="sounddir.loading_state"
            >
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>{Math.round(progress * 0.32)}s</span>
              <span>32s</span>
            </div>
          </div>

          {/* Transport */}
          <div className="flex items-center justify-center gap-3">
            {isPlaying ? (
              <Button
                onClick={handleStop}
                size="lg"
                className="bg-red-600/80 hover:bg-red-600 border-0 text-white gap-2 w-36"
                data-ocid="sounddir.secondary_button"
              >
                <Square className="w-4 h-4 fill-current" /> Stop
              </Button>
            ) : (
              <Button
                onClick={handleDirect}
                disabled={isDirecting}
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 border-0 text-white gap-2 w-36"
                data-ocid="sounddir.play.button"
              >
                {isDirecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                {isDirecting ? "Composing..." : "Play"}
              </Button>
            )}

            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              size="lg"
              className="border-white/10 hover:border-cyan-500/50 gap-2"
              data-ocid="sounddir.download_button"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? "Rendering..." : "Download WAV"}
            </Button>
          </div>

          {/* Composition summary */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs font-semibold text-cyan-400 mb-2">
              Current Composition
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Mood</span>
                <br />
                <span className="text-foreground capitalize">{mood}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Key</span>
                <br />
                <span className="font-mono text-foreground">
                  {key} {mode}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">BPM</span>
                <br />
                <span className="font-mono text-foreground">{bpm}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
