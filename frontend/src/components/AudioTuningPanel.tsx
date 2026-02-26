import React, { useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, Zap } from "lucide-react";
import { AudioTuningParams, AUDIO_PRESETS, DEFAULT_PARAMS } from "../data/audioPresets";

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  color?: string;
}

function SliderRow({ label, value, min, max, step = 1, unit = "", onChange, color = "text-brand" }: SliderRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-xs font-mono font-semibold ${color}`}>
          {typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value}{unit}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
    </div>
  );
}

interface AudioTuningPanelProps {
  params: AudioTuningParams;
  onChange: (params: AudioTuningParams) => void;
}

export default function AudioTuningPanel({ params, onChange }: AudioTuningPanelProps) {
  const set = useCallback(
    <K extends keyof AudioTuningParams>(key: K, value: AudioTuningParams[K]) => {
      onChange({ ...params, [key]: value });
    },
    [params, onChange]
  );

  const applyPreset = (name: string) => {
    const preset = AUDIO_PRESETS[name];
    if (preset) onChange({ ...preset });
  };

  return (
    <div className="space-y-6">
      {/* Preset buttons */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Presets</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(AUDIO_PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/5 hover:border-brand/40 hover:bg-brand/10 hover:text-brand text-muted-foreground transition-all"
            >
              {name}
            </button>
          ))}
          <button
            onClick={() => onChange({ ...DEFAULT_PARAMS })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/5 hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-400 text-muted-foreground transition-all flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Pitch & Speed ── */}
        <div className="space-y-4 p-4 rounded-xl border border-white/10 bg-white/3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-brand" /> Pitch & Speed
          </p>
          <SliderRow label="Pitch Shift" value={params.pitch} min={-24} max={24} unit=" st" onChange={(v) => set("pitch", v)} />
          <SliderRow label="Speed / Tempo" value={params.speed} min={0.25} max={4} step={0.05} unit="x" onChange={(v) => set("speed", v)} />
          <SliderRow label="Volume" value={params.volume} min={0} max={200} unit="%" onChange={(v) => set("volume", v)} />
        </div>

        {/* ── Reverb & Echo ── */}
        <div className="space-y-4 p-4 rounded-xl border border-white/10 bg-white/3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reverb & Echo</p>
          <SliderRow label="Reverb Wet" value={params.reverbWet} min={0} max={100} unit="%" onChange={(v) => set("reverbWet", v)} color="text-cyan-400" />
          <SliderRow label="Room Size" value={params.reverbRoomSize} min={0} max={100} unit="%" onChange={(v) => set("reverbRoomSize", v)} color="text-cyan-400" />
          <SliderRow label="Echo Delay" value={params.echoDelay} min={0} max={2000} unit="ms" onChange={(v) => set("echoDelay", v)} color="text-cyan-400" />
          <SliderRow label="Echo Feedback" value={params.echoFeedback} min={0} max={100} unit="%" onChange={(v) => set("echoFeedback", v)} color="text-cyan-400" />
        </div>

        {/* ── Filters ── */}
        <div className="space-y-4 p-4 rounded-xl border border-white/10 bg-white/3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filters</p>
          <SliderRow label="Low-pass Cutoff" value={params.lowpassFreq} min={20} max={20000} step={10} unit=" Hz" onChange={(v) => set("lowpassFreq", v)} color="text-purple-400" />
          <SliderRow label="High-pass Cutoff" value={params.highpassFreq} min={20} max={20000} step={10} unit=" Hz" onChange={(v) => set("highpassFreq", v)} color="text-purple-400" />
          <SliderRow label="Distortion" value={params.distortion} min={0} max={100} unit="%" onChange={(v) => set("distortion", v)} color="text-red-400" />
          <SliderRow label="Stereo Pan" value={params.panning} min={-100} max={100} unit="" onChange={(v) => set("panning", v)} color="text-green-400" />
        </div>

        {/* ── EQ ── */}
        <div className="space-y-4 p-4 rounded-xl border border-white/10 bg-white/3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Equalizer</p>
          <SliderRow label="Bass (200Hz)" value={params.bassGain} min={-20} max={20} unit=" dB" onChange={(v) => set("bassGain", v)} color="text-yellow-400" />
          <SliderRow label="Mid (1kHz)" value={params.midGain} min={-20} max={20} unit=" dB" onChange={(v) => set("midGain", v)} color="text-yellow-400" />
          <SliderRow label="Treble (4kHz)" value={params.trebleGain} min={-20} max={20} unit=" dB" onChange={(v) => set("trebleGain", v)} color="text-yellow-400" />
        </div>

        {/* ── Compressor ── */}
        <div className="space-y-4 p-4 rounded-xl border border-white/10 bg-white/3 md:col-span-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Compressor</p>
          <div className="grid grid-cols-2 gap-4">
            <SliderRow label="Threshold" value={params.compThreshold} min={-60} max={0} unit=" dB" onChange={(v) => set("compThreshold", v)} color="text-orange-400" />
            <SliderRow label="Ratio" value={params.compRatio} min={1} max={20} step={0.5} unit=":1" onChange={(v) => set("compRatio", v)} color="text-orange-400" />
            <SliderRow label="Attack" value={params.compAttack} min={0} max={1000} unit="ms" onChange={(v) => set("compAttack", v)} color="text-orange-400" />
            <SliderRow label="Release" value={params.compRelease} min={0} max={1000} unit="ms" onChange={(v) => set("compRelease", v)} color="text-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
