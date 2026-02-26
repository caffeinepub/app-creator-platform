import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { PadConfig } from "../hooks/usePresetStorage";
import { getSoundById } from "../data/soundLibrary";
import SoundPickerModal from "./SoundPickerModal";

const PAD_COLORS = [
  "#f59e0b", "#ef4444", "#10b981", "#3b82f6",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
  "#f97316", "#6366f1", "#14b8a6", "#e11d48",
];

interface PadConfigModalProps {
  open: boolean;
  pad: PadConfig | null;
  onClose: () => void;
  onSave: (config: PadConfig) => void;
}

export default function PadConfigModal({ open, pad, onClose, onSave }: PadConfigModalProps) {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState(PAD_COLORS[0]);
  const [soundId, setSoundId] = useState<string | null>(null);
  const [shortcutKey, setShortcutKey] = useState("");
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [capturingKey, setCapturingKey] = useState(false);

  useEffect(() => {
    if (pad) {
      setLabel(pad.label);
      setColor(pad.color);
      setSoundId(pad.soundId);
      setShortcutKey(pad.shortcutKey);
    }
  }, [pad]);

  const handleKeyCapture = (e: React.KeyboardEvent) => {
    if (!capturingKey) return;
    e.preventDefault();
    if (e.key === "Escape") {
      setCapturingKey(false);
      return;
    }
    setShortcutKey(e.key.toLowerCase());
    setCapturingKey(false);
  };

  const selectedSound = soundId ? getSoundById(soundId) : null;

  if (!pad) return null;

  return (
    <>
      <Dialog open={open && !showSoundPicker} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-sm bg-card border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="font-display gradient-text">Configure Pad</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Label */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Pad name..."
                className="bg-white/5 border-white/10 text-foreground"
                maxLength={12}
              />
            </div>

            {/* Color */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="flex flex-wrap gap-2">
                {PAD_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-lg transition-all ${color === c ? "ring-2 ring-white ring-offset-1 ring-offset-card scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Sound */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Sound</Label>
              <button
                onClick={() => setShowSoundPicker(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 transition-all text-left"
              >
                <Music2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate">
                  {selectedSound ? `${selectedSound.emoji} ${selectedSound.name}` : "Select a sound..."}
                </span>
              </button>
            </div>

            {/* Keyboard shortcut */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Keyboard Shortcut</Label>
              <div className="flex gap-2">
                <div
                  className={`flex-1 flex items-center justify-center h-9 rounded-xl border text-sm font-mono transition-all cursor-pointer ${
                    capturingKey
                      ? "border-brand bg-brand/10 text-brand animate-pulse"
                      : "border-white/10 bg-white/5 text-foreground"
                  }`}
                  onClick={() => setCapturingKey(true)}
                  onKeyDown={handleKeyCapture}
                  tabIndex={0}
                >
                  {capturingKey ? "Press a key..." : shortcutKey ? shortcutKey.toUpperCase() : "Click to set"}
                </div>
                {shortcutKey && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShortcutKey("")}
                    className="text-muted-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave({ ...pad, label, color, soundId, shortcutKey });
                onClose();
              }}
              className="btn-primary"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SoundPickerModal
        open={showSoundPicker}
        onClose={() => setShowSoundPicker(false)}
        onSelect={(sound) => {
          setSoundId(sound.id);
          setShowSoundPicker(false);
        }}
        currentSoundId={soundId}
      />
    </>
  );
}
