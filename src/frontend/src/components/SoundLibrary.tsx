import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Square, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  SOUND_CATEGORIES,
  SOUND_LIBRARY,
  type SoundEntry,
} from "../data/soundLibrary";
import { useAudioEngine } from "../hooks/useAudioEngine";
import {
  useDeleteUploadedSound,
  useUploadedSounds,
} from "../hooks/useUploadedSounds";
import { base64ToArrayBuffer } from "../utils/audioUpload";
import AudioUploadButton from "./AudioUploadButton";

interface SoundLibraryProps {
  onSelectSound?: (sound: SoundEntry) => void;
  selectedSoundId?: string | null;
}

const CATEGORY_COLORS: Record<string, string> = {
  Animals: "text-green-400 border-green-400/30 bg-green-400/10",
  Nature: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  Instruments: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  "Human Voice": "text-pink-400 border-pink-400/30 bg-pink-400/10",
  "UI & Game SFX": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "Ambient & Relaxation": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Uploaded: "text-amber-400 border-amber-400/30 bg-amber-400/10",
};

export default function SoundLibrary({
  onSelectSound,
  selectedSoundId,
}: SoundLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    SOUND_CATEGORIES[0],
  );
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { playSound, stopAll } = useAudioEngine();
  const { data: uploadedSounds = [] } = useUploadedSounds();
  const deleteUploaded = useDeleteUploadedSound();

  const allCategories = [...SOUND_CATEGORIES, "Uploaded"];

  const categorySounds: SoundEntry[] =
    activeCategory === "Uploaded"
      ? uploadedSounds.map((u) => ({
          id: u.id,
          name: u.name,
          category: "Uploaded",
          emoji: "\uD83C\uDFB5",
          description: "Uploaded audio file",
          synthParams: {
            oscillatorType: "sine" as OscillatorType,
            frequency: 440,
            duration: 0.5,
            gainStart: 0.5,
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.2,
          },
          uploadedData: { base64Data: u.base64Data, mimeType: u.mimeType },
        }))
      : SOUND_LIBRARY.filter((s) => s.category === activeCategory);

  const handlePlay = (sound: SoundEntry) => {
    stopAll();
    if (playingId === sound.id) {
      setPlayingId(null);
      return;
    }
    setPlayingId(sound.id);
    if (sound.uploadedData) {
      try {
        const arrayBuffer = base64ToArrayBuffer(sound.uploadedData.base64Data);
        const audioCtx = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )();
        audioCtx
          .decodeAudioData(arrayBuffer)
          .then((audioBuffer) => {
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.start();
            setTimeout(
              () => setPlayingId((prev) => (prev === sound.id ? null : prev)),
              audioBuffer.duration * 1000 + 100,
            );
          })
          .catch(() => setPlayingId(null));
      } catch {
        setPlayingId(null);
      }
    } else {
      playSound(sound.synthParams);
      const dur =
        (sound.synthParams.duration ?? 1) +
        (sound.synthParams.release ?? 0.3) +
        0.1;
      setTimeout(
        () => setPlayingId((prev) => (prev === sound.id ? null : prev)),
        dur * 1000,
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <AudioUploadButton />

      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => {
          const colorClass =
            CATEGORY_COLORS[cat] ??
            "text-muted-foreground border-white/10 bg-white/5";
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeCategory === cat
                  ? colorClass
                  : "border-white/10 text-muted-foreground bg-white/3 hover:bg-white/8 hover:text-foreground"
              }`}
            >
              {cat}
              {cat === "Uploaded" && uploadedSounds.length > 0 && (
                <span className="ml-1 text-[10px] opacity-70">
                  ({uploadedSounds.length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      <ScrollArea className="h-72">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pr-2">
          {categorySounds.map((sound) => {
            const isPlaying = playingId === sound.id;
            const isSelected = selectedSoundId === sound.id;
            const isUploaded = !!sound.uploadedData;
            return (
              <button
                key={sound.id}
                type="button"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group text-left ${
                  isSelected
                    ? "border-brand/50 bg-brand/10"
                    : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
                }`}
                onClick={() => onSelectSound?.(sound)}
              >
                <span className="text-2xl shrink-0">{sound.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {sound.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {sound.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isUploaded && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUploaded.mutate(sound.id);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(sound);
                    }}
                    className={`p-1.5 rounded-lg transition-all ${
                      isPlaying
                        ? "bg-brand/20 text-brand"
                        : "bg-white/5 hover:bg-brand/20 text-muted-foreground hover:text-brand opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isPlaying ? (
                      <Square className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </button>
            );
          })}
          {categorySounds.length === 0 && (
            <div className="col-span-3 text-center py-8 text-muted-foreground text-sm">
              {activeCategory === "Uploaded"
                ? "No uploaded sounds yet. Use the Upload button above."
                : "No sounds in this category."}
            </div>
          )}
        </div>
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        {categorySounds.length} sounds in{" "}
        <span className="text-foreground">{activeCategory}</span> \u00b7{" "}
        {SOUND_LIBRARY.length + uploadedSounds.length} total
      </p>
    </div>
  );
}
