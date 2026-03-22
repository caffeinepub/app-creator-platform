import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, Play, Sparkles, Square } from "lucide-react";
import React, { useState } from "react";
import { MORNING_TONE_SEQUENCE } from "../data/morningToneSequence";
import { SOUND_LIBRARY } from "../data/soundLibrary";
import {
  useMorningToneConfig,
  useMorningTonePlayer,
} from "../hooks/useMorningTone";

export default function MorningToneSettings() {
  const { config, updateConfig } = useMorningToneConfig();
  const { play, stop } = useMorningTonePlayer();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePreview = async () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    await play();
    const totalDuration = MORNING_TONE_SEQUENCE.reduce(
      (sum, s) => sum + s.duration,
      0,
    );
    setTimeout(() => setIsPlaying(false), totalDuration + 500);
  };

  return (
    <div className="space-y-6">
      {/* Enable Toggle */}
      <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Daily Morning Alarm</p>
            <p className="text-sm text-muted-foreground">
              {config.enabled
                ? `Alarm set for ${config.alarmTime} daily`
                : "Alarm disabled"}
            </p>
          </div>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(enabled) => updateConfig({ enabled })}
        />
      </div>

      {/* Time Picker */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <Label className="text-sm font-semibold">Alarm Time</Label>
        </div>
        <input
          type="time"
          value={config.alarmTime}
          onChange={(e) => updateConfig({ alarmTime: e.target.value })}
          className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Sequence Preview */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="font-semibold text-sm">Morning Tone Sequence</p>
        </div>
        <div className="space-y-2">
          {MORNING_TONE_SEQUENCE.map((step, i) => {
            const sound = SOUND_LIBRARY.find((s) => s.id === step.soundId);
            return (
              <div
                key={step.soundId}
                className="flex items-center gap-3 p-3 rounded-xl bg-background/30 border border-border/50"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <span className="text-lg">{sound?.emoji ?? "🎵"}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {sound?.name ?? step.soundId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(step.duration / 1000).toFixed(0)}s
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Button */}
      <Button
        onClick={handlePreview}
        variant={isPlaying ? "destructive" : "default"}
        className="w-full gap-2"
        size="lg"
      >
        {isPlaying ? (
          <>
            <Square className="w-4 h-4" /> Stop Preview
          </>
        ) : (
          <>
            <Play className="w-4 h-4" /> Preview Morning Tone
          </>
        )}
      </Button>
    </div>
  );
}
