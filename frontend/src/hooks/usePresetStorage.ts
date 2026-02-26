import { useState, useCallback } from "react";
import { AudioTuningParams } from "../data/audioPresets";

export interface PadConfig {
  id: number;
  label: string;
  color: string;
  soundId: string | null;
  shortcutKey: string;
}

export interface StudioPreset {
  name: string;
  tuning: AudioTuningParams;
  selectedVoiceName: string | null;
  pads: PadConfig[];
  createdAt: number;
}

const STORAGE_KEY = "noventra_studio_presets";

function loadFromStorage(): Record<string, StudioPreset> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(presets: Record<string, StudioPreset>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // Storage full or unavailable
  }
}

export function usePresetStorage() {
  const [presets, setPresets] = useState<Record<string, StudioPreset>>(() => loadFromStorage());

  const savePreset = useCallback((name: string, preset: Omit<StudioPreset, "name" | "createdAt">) => {
    const newPreset: StudioPreset = { ...preset, name, createdAt: Date.now() };
    setPresets((prev) => {
      const updated = { ...prev, [name]: newPreset };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const loadPreset = useCallback(
    (name: string): StudioPreset | null => {
      return presets[name] ?? null;
    },
    [presets]
  );

  const deletePreset = useCallback((name: string) => {
    setPresets((prev) => {
      const updated = { ...prev };
      delete updated[name];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const renamePreset = useCallback((oldName: string, newName: string) => {
    setPresets((prev) => {
      if (!prev[oldName] || prev[newName]) return prev;
      const updated = { ...prev };
      updated[newName] = { ...updated[oldName], name: newName };
      delete updated[oldName];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const listPresets = useCallback((): string[] => {
    return Object.keys(presets).sort((a, b) => (presets[b].createdAt ?? 0) - (presets[a].createdAt ?? 0));
  }, [presets]);

  return { presets, savePreset, loadPreset, deletePreset, renamePreset, listPresets };
}
