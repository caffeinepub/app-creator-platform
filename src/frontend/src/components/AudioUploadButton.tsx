import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Loader2, Upload } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useUploadAudioFile } from "../hooks/useUploadedSounds";

interface AudioUploadButtonProps {
  onSuccess?: (name: string) => void;
}

export default function AudioUploadButton({
  onSuccess,
}: AudioUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync, isPending } = useUploadAudioFile();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccessMsg(null);
    try {
      const sound = await mutateAsync(file);
      setSuccessMsg(`"${sound.name}" uploaded!`);
      onSuccess?.(sound.name);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    }
    // Reset input so same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isPending ? "Processing..." : "Upload Sound"}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload MP3, WAV, or OGG files (max 5MB).</p>
              <p>Sounds are stored locally in your browser.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {successMsg && <p className="text-xs text-green-500">{successMsg}</p>}
    </div>
  );
}
