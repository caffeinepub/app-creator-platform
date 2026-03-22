import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Palette } from "lucide-react";
import type React from "react";
import { useState } from "react";
import IconBuilder, { type IconConfig } from "./IconBuilder";

interface IconBuilderModalProps {
  trigger?: React.ReactNode;
  onSave?: (config: IconConfig) => void;
}

export default function IconBuilderModal({
  trigger,
  onSave,
}: IconBuilderModalProps) {
  const [open, setOpen] = useState(false);

  const handleSave = (config: IconConfig) => {
    onSave?.(config);
    setTimeout(() => setOpen(false), 800);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Palette className="w-4 h-4" />
            Customize Icon
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Create Your Icon
          </DialogTitle>
        </DialogHeader>
        <IconBuilder onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}
