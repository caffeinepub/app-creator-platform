import React, { useEffect, useState } from "react";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { useAlarmSound } from "../hooks/useAlarmSound";

interface AlarmNotificationProps {
  message: string;
  onDismiss: () => void;
}

export default function AlarmNotification({ message, onDismiss }: AlarmNotificationProps) {
  const { isPlaying, audioReady, playAlarm, stopAlarm, resumeAudioContext } = useAlarmSound();
  const [needsGesture, setNeedsGesture] = useState(false);

  // Attempt to play alarm on mount
  useEffect(() => {
    try {
      const result = playAlarm();
      if (result.needsUserGesture) {
        setNeedsGesture(true);
      }
    } catch (e) {
      console.warn("AlarmNotification: playAlarm failed silently", e);
      setNeedsGesture(true);
    }
    return () => {
      try { stopAlarm(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once audio becomes ready and we needed a gesture, retry playing
  useEffect(() => {
    if (audioReady && needsGesture) {
      try {
        const result = playAlarm();
        if (!result.needsUserGesture) {
          setNeedsGesture(false);
        }
      } catch (e) {
        console.warn("AlarmNotification: retry playAlarm failed silently", e);
      }
    }
  }, [audioReady, needsGesture, playAlarm]);

  const handleEnableAudio = async () => {
    try {
      await resumeAudioContext();
      const result = playAlarm();
      if (!result.needsUserGesture) {
        setNeedsGesture(false);
      }
    } catch (e) {
      console.warn("AlarmNotification: handleEnableAudio failed silently", e);
    }
  };

  const handleDismiss = () => {
    try { stopAlarm(); } catch {}
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md">
      <div className="relative w-full max-w-sm glass-card rounded-2xl border border-brand/30 shadow-2xl shadow-brand/20 overflow-hidden">
        {/* Pulsing top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-brand via-amber-400 to-brand animate-pulse" />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-brand" />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand animate-ping" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Alarm</h2>
              <p className="text-xs text-muted-foreground">
                {isPlaying ? "Sound playing" : "Visual alert active"}
              </p>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-foreground/90 leading-relaxed mb-5 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
            {message}
          </p>

          {/* Audio needs gesture prompt */}
          {needsGesture && (
            <div className="mb-4 flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
              <VolumeX className="w-3.5 h-3.5 shrink-0" />
              <span>
                Audio blocked by browser.{" "}
                <button
                  onClick={handleEnableAudio}
                  className="underline underline-offset-2 hover:text-amber-300 font-medium"
                >
                  Click to enable sound
                </button>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isPlaying ? (
              <button
                onClick={() => { try { stopAlarm(); } catch {} }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-foreground text-sm font-medium transition-all border border-white/10"
              >
                <VolumeX className="w-4 h-4" />
                Mute Sound
              </button>
            ) : (
              <button
                onClick={handleEnableAudio}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-foreground text-sm font-medium transition-all border border-white/10"
              >
                <Volume2 className="w-4 h-4" />
                Play Sound
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm font-medium transition-all"
            >
              <BellOff className="w-4 h-4" />
              Stop Alarm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
