import React, { useState, useCallback } from "react";
import { Settings2, Music2, Play } from "lucide-react";
import { PadConfig } from "../hooks/usePresetStorage";
import { getSoundById } from "../data/soundLibrary";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { AudioTuningParams } from "../data/audioPresets";
import PadConfigModal from "./PadConfigModal";

const DEFAULT_PAD_KEYS = [
  "q","w","e","r",
  "a","s","d","f",
  "z","x","c","v",
  "1","2","3","4",
];

const DEFAULT_PAD_COLORS = [
  "#f59e0b","#ef4444","#10b981","#3b82f6",
  "#8b5cf6","#ec4899","#06b6d4","#84cc16",
  "#f97316","#6366f1","#14b8a6","#e11d48",
  "#fbbf24","#f87171","#34d399","#60a5fa",
];

function createDefaultPads(): PadConfig[] {
  return Array.from({ length: 16 }, (_, i) => ({
    id: i,
    label: `Pad ${i + 1}`,
    color: DEFAULT_PAD_COLORS[i],
    soundId: null,
    shortcutKey: DEFAULT_PAD_KEYS[i],
  }));
}

interface GesturePadGridProps {
  pads: PadConfig[];
  onPadsChange: (pads: PadConfig[]) => void;
  tuning: Partial<AudioTuningParams>;
  editMode: boolean;
}

export default function GesturePadGrid({ pads, onPadsChange, tuning, editMode }: GesturePadGridProps) {
  const { playSound } = useAudioEngine();
  const [activePad, setActivePad] = useState<number | null>(null);
  const [configPad, setConfigPad] = useState<PadConfig | null>(null);

  const triggerPad = useCallback(
    (pad: PadConfig) => {
      if (!pad.soundId) return;
      const sound = getSoundById(pad.soundId);
      if (!sound) return;
      setActivePad(pad.id);
      playSound(sound.synthParams, tuning);
      setTimeout(() => setActivePad((prev) => (prev === pad.id ? null : prev)), 200);
    },
    [playSound, tuning]
  );

  // Build keyboard shortcut map
  const shortcutMap: Record<string, () => void> = {};
  pads.forEach((pad) => {
    if (pad.shortcutKey) {
      shortcutMap[pad.shortcutKey] = () => triggerPad(pad);
    }
  });
  useKeyboardShortcuts(shortcutMap, !editMode);

  const handlePadClick = (pad: PadConfig) => {
    if (editMode) {
      setConfigPad(pad);
    } else {
      triggerPad(pad);
    }
  };

  const handleSavePad = (updated: PadConfig) => {
    onPadsChange(pads.map((p) => (p.id === updated.id ? updated : p)));
    setConfigPad(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {pads.map((pad) => {
          const sound = pad.soundId ? getSoundById(pad.soundId) : null;
          const isActive = activePad === pad.id;

          return (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad)}
              className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-100 select-none overflow-hidden group ${
                isActive
                  ? "scale-95 brightness-150"
                  : "hover:scale-[1.02] hover:brightness-110"
              } ${editMode ? "cursor-pointer" : pad.soundId ? "cursor-pointer active:scale-95" : "cursor-not-allowed opacity-50"}`}
              style={{
                borderColor: isActive ? pad.color : `${pad.color}60`,
                backgroundColor: isActive ? `${pad.color}30` : `${pad.color}12`,
                boxShadow: isActive ? `0 0 20px ${pad.color}60, 0 0 40px ${pad.color}30` : "none",
              }}
            >
              {/* Glow overlay on active */}
              {isActive && (
                <div
                  className="absolute inset-0 opacity-20 rounded-2xl"
                  style={{ backgroundColor: pad.color }}
                />
              )}

              {/* Edit icon */}
              {editMode && (
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Settings2 className="w-3 h-3 text-white/60" />
                </div>
              )}

              {/* Shortcut key badge */}
              {pad.shortcutKey && (
                <div className="absolute top-1.5 left-1.5 text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-black/40 text-white/60 uppercase">
                  {pad.shortcutKey}
                </div>
              )}

              {/* Sound emoji or icon */}
              <div className="text-xl">
                {sound ? (
                  <span>{sound.emoji}</span>
                ) : (
                  <Music2 className="w-5 h-5 opacity-30" style={{ color: pad.color }} />
                )}
              </div>

              {/* Label */}
              <span
                className="text-[10px] font-semibold text-center leading-tight px-1 truncate w-full text-center"
                style={{ color: pad.color }}
              >
                {pad.label}
              </span>

              {/* Sound name */}
              {sound && (
                <span className="text-[9px] text-white/40 truncate w-full text-center px-1">
                  {sound.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Config modal */}
      <PadConfigModal
        open={!!configPad}
        pad={configPad}
        onClose={() => setConfigPad(null)}
        onSave={handleSavePad}
      />
    </div>
  );
}

export { createDefaultPads };
