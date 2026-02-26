import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Play, Square } from "lucide-react";
import { SOUND_LIBRARY, SOUND_CATEGORIES, SoundCategory, SoundEntry } from "../data/soundLibrary";
import { useAudioEngine } from "../hooks/useAudioEngine";

interface SoundLibraryProps {
  onSelectSound?: (sound: SoundEntry) => void;
  selectedSoundId?: string | null;
}

const CATEGORY_COLORS: Record<SoundCategory, string> = {
  "Human Voices": "text-pink-400 border-pink-400/30 bg-pink-400/10",
  "Animal Sounds": "text-green-400 border-green-400/30 bg-green-400/10",
  "Nature Sounds": "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  "Musical Instruments": "text-purple-400 border-purple-400/30 bg-purple-400/10",
  "Game & UI SFX": "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  "Ambient & Environment": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "Electronic & Synth": "text-brand border-brand/30 bg-brand/10",
  "Percussion & Beats": "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function SoundLibrary({ onSelectSound, selectedSoundId }: SoundLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<SoundCategory>(SOUND_CATEGORIES[0]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { playSound, stopAll } = useAudioEngine();

  const categorySounds = SOUND_LIBRARY.filter((s) => s.category === activeCategory);

  const handlePlay = (sound: SoundEntry) => {
    stopAll();
    if (playingId === sound.id) {
      setPlayingId(null);
      return;
    }
    setPlayingId(sound.id);
    playSound(sound.synthParams);
    const dur = (sound.synthParams.duration ?? 1) + (sound.synthParams.release ?? 0.3) + 0.1;
    setTimeout(() => setPlayingId((prev) => (prev === sound.id ? null : prev)), dur * 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {SOUND_CATEGORIES.map((cat) => {
          const colorClass = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeCategory === cat
                  ? colorClass
                  : "border-white/10 text-muted-foreground bg-white/3 hover:bg-white/8 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sound grid */}
      <ScrollArea className="h-72">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pr-2">
          {categorySounds.map((sound) => {
            const isPlaying = playingId === sound.id;
            const isSelected = selectedSoundId === sound.id;
            return (
              <div
                key={sound.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                  isSelected
                    ? "border-brand/50 bg-brand/10"
                    : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
                }`}
                onClick={() => onSelectSound?.(sound)}
              >
                <span className="text-2xl shrink-0">{sound.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{sound.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{sound.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(sound);
                  }}
                  className={`shrink-0 p-1.5 rounded-lg transition-all ${
                    isPlaying
                      ? "bg-brand/20 text-brand"
                      : "bg-white/5 hover:bg-brand/20 text-muted-foreground hover:text-brand opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <p className="text-xs text-muted-foreground">
        {categorySounds.length} sounds in <span className="text-foreground">{activeCategory}</span> · {SOUND_LIBRARY.length} total
      </p>
    </div>
  );
}
