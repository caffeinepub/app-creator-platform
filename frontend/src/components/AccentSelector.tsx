import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Play, Square, AlertCircle, Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

interface AccentGroup {
  region: string;
  emoji: string;
  langCodes: string[];
  samplePhrase: string;
}

const ACCENT_GROUPS: AccentGroup[] = [
  { region: "American English", emoji: "🇺🇸", langCodes: ["en-US"], samplePhrase: "Hello! The quick brown fox jumps over the lazy dog." },
  { region: "British English", emoji: "🇬🇧", langCodes: ["en-GB"], samplePhrase: "Brilliant! Shall we have a spot of tea this afternoon?" },
  { region: "Australian English", emoji: "🇦🇺", langCodes: ["en-AU"], samplePhrase: "G'day mate! How are you going today?" },
  { region: "Indian English", emoji: "🇮🇳", langCodes: ["en-IN"], samplePhrase: "Kindly do the needful and revert at the earliest." },
  { region: "Irish English", emoji: "🇮🇪", langCodes: ["en-IE"], samplePhrase: "It's a grand soft day, thanks be to God." },
  { region: "Scottish English", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", langCodes: ["en-GB-scotland", "en-GB"], samplePhrase: "Och aye, it's a braw bricht moonlit nicht the nicht." },
  { region: "French", emoji: "🇫🇷", langCodes: ["fr-FR", "fr"], samplePhrase: "Bonjour! Comment allez-vous aujourd'hui?" },
  { region: "Spanish", emoji: "🇪🇸", langCodes: ["es-ES", "es"], samplePhrase: "¡Hola! ¿Cómo estás hoy? El cielo es azul." },
  { region: "German", emoji: "🇩🇪", langCodes: ["de-DE", "de"], samplePhrase: "Guten Tag! Wie geht es Ihnen heute?" },
  { region: "Japanese", emoji: "🇯🇵", langCodes: ["ja-JP", "ja"], samplePhrase: "こんにちは！今日はいい天気ですね。" },
  { region: "Mandarin Chinese", emoji: "🇨🇳", langCodes: ["zh-CN", "zh"], samplePhrase: "你好！今天天气怎么样？" },
  { region: "Arabic", emoji: "🇸🇦", langCodes: ["ar-SA", "ar"], samplePhrase: "مرحبا! كيف حالك اليوم؟" },
  { region: "Portuguese", emoji: "🇧🇷", langCodes: ["pt-BR", "pt"], samplePhrase: "Olá! Como você está hoje?" },
  { region: "Russian", emoji: "🇷🇺", langCodes: ["ru-RU", "ru"], samplePhrase: "Привет! Как дела сегодня?" },
  { region: "Italian", emoji: "🇮🇹", langCodes: ["it-IT", "it"], samplePhrase: "Ciao! Come stai oggi? Che bella giornata!" },
  { region: "Korean", emoji: "🇰🇷", langCodes: ["ko-KR", "ko"], samplePhrase: "안녕하세요! 오늘 날씨가 어떤가요?" },
];

export default function AccentSelector() {
  const { availableVoices, selectedVoice, setSelectedVoice, speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();
  const [speakingGroup, setSpeakingGroup] = useState<string | null>(null);
  const [pitchMod, setPitchMod] = useState(1.0);
  const [rateMod, setRateMod] = useState(1.0);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
        <p className="text-sm text-yellow-300">Speech Synthesis is not supported in this browser.</p>
      </div>
    );
  }

  const getVoicesForGroup = (group: AccentGroup): SpeechSynthesisVoice[] => {
    return availableVoices.filter((v) =>
      group.langCodes.some((code) => v.lang.toLowerCase().startsWith(code.toLowerCase()))
    );
  };

  const handleSpeak = (group: AccentGroup) => {
    if (isSpeaking && speakingGroup === group.region) {
      stop();
      setSpeakingGroup(null);
      return;
    }
    const voices = getVoicesForGroup(group);
    const voice = voices[0] ?? null;
    setSpeakingGroup(group.region);
    speak(group.samplePhrase, voice, rateMod, pitchMod);
    setTimeout(() => setSpeakingGroup(null), 5000);
  };

  const handleSelectVoice = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-white/10 bg-white/3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Speech Rate</span>
            <span className="text-foreground font-mono">{rateMod.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rateMod}
            onChange={(e) => setRateMod(parseFloat(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Pitch</span>
            <span className="text-foreground font-mono">{pitchMod.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitchMod}
            onChange={(e) => setPitchMod(parseFloat(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
      </div>

      {/* Selected voice info */}
      {selectedVoice && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand/10 border border-brand/20">
          <Volume2 className="w-4 h-4 text-brand shrink-0" />
          <span className="text-xs text-brand font-medium truncate">
            Active: {selectedVoice.name} ({selectedVoice.lang})
          </span>
        </div>
      )}

      {/* Accent groups */}
      <ScrollArea className="h-72">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-2">
          {ACCENT_GROUPS.map((group) => {
            const voices = getVoicesForGroup(group);
            const isAvailable = voices.length > 0;
            const isSpeakingThis = speakingGroup === group.region && isSpeaking;

            return (
              <div
                key={group.region}
                className={`p-3 rounded-xl border transition-all ${
                  isAvailable
                    ? "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
                    : "border-white/5 bg-white/2 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{group.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{group.region}</p>
                      <p className="text-xs text-muted-foreground">
                        {isAvailable ? `${voices.length} voice${voices.length !== 1 ? "s" : ""}` : "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!isAvailable && (
                      <Badge variant="outline" className="text-[10px] border-white/10 text-muted-foreground">
                        N/A
                      </Badge>
                    )}
                    <button
                      onClick={() => handleSpeak(group)}
                      disabled={!isAvailable}
                      className={`p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        isSpeakingThis
                          ? "bg-brand/20 text-brand"
                          : "bg-white/5 hover:bg-brand/20 text-muted-foreground hover:text-brand"
                      }`}
                    >
                      {isSpeakingThis ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Voice selector */}
                {isAvailable && voices.length > 1 && (
                  <select
                    className="mt-2 w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-foreground"
                    value={selectedVoice?.name ?? ""}
                    onChange={(e) => {
                      const v = voices.find((v) => v.name === e.target.value);
                      if (v) handleSelectVoice(v);
                    }}
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name} className="bg-card">
                        {v.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
