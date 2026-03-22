import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Search, Trash2, X } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
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

interface SoundPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (sound: SoundEntry) => void;
  currentSoundId?: string | null;
}

export default function SoundPickerModal({
  open,
  onClose,
  onSelect,
  currentSoundId,
}: SoundPickerModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { playSound } = useAudioEngine();
  const { data: uploadedSounds = [] } = useUploadedSounds();
  const deleteUploaded = useDeleteUploadedSound();

  const allCategories = ["All", ...SOUND_CATEGORIES, "Uploaded"];

  const uploadedEntries: SoundEntry[] = uploadedSounds.map((u) => ({
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
  }));

  const allSounds = [...SOUND_LIBRARY, ...uploadedEntries];

  // biome-ignore lint/correctness/useExhaustiveDependencies: uploadedSounds is a dep via uploadedEntries->allSounds
  const filtered = useMemo(
    () =>
      allSounds.filter((s) => {
        const matchCat =
          activeCategory === "All" || s.category === activeCategory;
        const matchSearch =
          !search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.category.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      }),
    [search, activeCategory, uploadedSounds],
  );

  const handlePlay = (sound: SoundEntry, e: React.MouseEvent) => {
    e.stopPropagation();
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
          })
          .catch(() => {});
      } catch {
        /* ignore */
      }
    } else {
      playSound(sound.synthParams);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-white/10 text-foreground p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-lg font-display font-bold gradient-text">
            Sound Library
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-3 pb-1">
          <AudioUploadButton />
        </div>

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
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-2 border-b border-white/10 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-brand text-background"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {cat}
                {cat === "Uploaded" && uploadedSounds.length > 0 && (
                  <span className="ml-1 opacity-70">
                    ({uploadedSounds.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="h-72">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map((sound) => (
              <button
                key={sound.id}
                type="button"
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group text-left ${
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
                  <p className="text-sm font-medium text-foreground truncate">
                    {sound.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {sound.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {sound.uploadedData && (
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
                    onClick={(e) => handlePlay(sound, e)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-brand/20 text-muted-foreground hover:text-brand transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
                {search
                  ? `No sounds found for "${search}"`
                  : "No sounds in this category."}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {filtered.length} sounds
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
