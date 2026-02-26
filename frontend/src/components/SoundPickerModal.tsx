import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Search, X } from "lucide-react";
import { SOUND_LIBRARY, SOUND_CATEGORIES, SoundEntry, SoundCategory } from "../data/soundLibrary";
import { useAudioEngine } from "../hooks/useAudioEngine";

interface SoundPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (sound: SoundEntry) => void;
  currentSoundId?: string | null;
}

export default function SoundPickerModal({ open, onClose, onSelect, currentSoundId }: SoundPickerModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<SoundCategory | "All">("All");
  const { playSound } = useAudioEngine();

  const filtered = useMemo(() => {
    return SOUND_LIBRARY.filter((s) => {
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-white/10 text-foreground p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-lg font-display font-bold gradient-text">
            Sound Library
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sounds..."
              className="pl-9 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-6 py-2 border-b border-white/10 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {(["All", ...SOUND_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as SoundCategory | "All")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-brand text-background"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sound list */}
        <ScrollArea className="h-80">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map((sound) => (
              <div
                key={sound.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                  currentSoundId === sound.id
                    ? "border-brand/50 bg-brand/10"
                    : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
                }`}
                onClick={() => {
                  onSelect(sound);
                  onClose();
                }}
              >
                <span className="text-2xl shrink-0">{sound.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{sound.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{sound.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound(sound.synthParams);
                  }}
                  className="shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-brand/20 text-muted-foreground hover:text-brand transition-all opacity-0 group-hover:opacity-100"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
                No sounds found for "{search}"
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{filtered.length} sounds</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
