import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Play, Square, Volume2 } from "lucide-react";
import React, { useState } from "react";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

interface AccentGroup {
  region: string;
  emoji: string;
  langCodes: string[];
  samplePhrase: string;
}

const ACCENT_GROUPS: AccentGroup[] = [
  {
    region: "American English",
    emoji: "\u{1F1FA}\u{1F1F8}",
    langCodes: ["en-US"],
    samplePhrase: "Hello! The quick brown fox jumps over the lazy dog.",
  },
  {
    region: "British English",
    emoji: "\u{1F1EC}\u{1F1E7}",
    langCodes: ["en-GB"],
    samplePhrase: "Brilliant! Shall we have a spot of tea this afternoon?",
  },
  {
    region: "Australian English",
    emoji: "\u{1F1E6}\u{1F1FA}",
    langCodes: ["en-AU"],
    samplePhrase: "G'day mate! How are you going today?",
  },
  {
    region: "Indian English",
    emoji: "\u{1F1EE}\u{1F1F3}",
    langCodes: ["en-IN"],
    samplePhrase: "Kindly do the needful and revert at the earliest.",
  },
  {
    region: "Irish English",
    emoji: "\u{1F1EE}\u{1F1EA}",
    langCodes: ["en-IE"],
    samplePhrase: "It's a grand soft day, thanks be to God.",
  },
  {
    region: "Scottish English",
    emoji: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
    langCodes: ["en-GB-scotland", "en-GB"],
    samplePhrase: "Och aye, it's a braw bricht moonlit nicht the nicht.",
  },
  {
    region: "French",
    emoji: "\u{1F1EB}\u{1F1F7}",
    langCodes: ["fr-FR", "fr"],
    samplePhrase: "Bonjour! Comment allez-vous aujourd'hui?",
  },
  {
    region: "Spanish",
    emoji: "\u{1F1EA}\u{1F1F8}",
    langCodes: ["es-ES", "es"],
    samplePhrase:
      "\u00A1Hola! \u00BFC\u00F3mo est\u00E1s hoy? El cielo es azul.",
  },
  {
    region: "German",
    emoji: "\u{1F1E9}\u{1F1EA}",
    langCodes: ["de-DE", "de"],
    samplePhrase: "Guten Tag! Wie geht es Ihnen heute?",
  },
  {
    region: "Japanese",
    emoji: "\u{1F1EF}\u{1F1F5}",
    langCodes: ["ja-JP", "ja"],
    samplePhrase:
      "\u3053\u3093\u306B\u3061\u306F\uFF01\u4ECA\u65E5\u306F\u3044\u3044\u5929\u6C17\u3067\u3059\u306D\u3002",
  },
  {
    region: "Mandarin Chinese",
    emoji: "\u{1F1E8}\u{1F1F3}",
    langCodes: ["zh-CN", "zh"],
    samplePhrase:
      "\u4F60\u597D\uFF01\u4ECA\u5929\u5929\u6C14\u600E\u4E48\u6837\uFF1F",
  },
  {
    region: "Arabic",
    emoji: "\u{1F1F8}\u{1F1E6}",
    langCodes: ["ar-SA", "ar"],
    samplePhrase:
      "\u0645\u0631\u062D\u0628\u0627! \u0643\u064A\u0641 \u062D\u0627\u0644\u0643 \u0627\u0644\u064A\u0648\u0645\u061F",
  },
  {
    region: "Portuguese",
    emoji: "\u{1F1E7}\u{1F1F7}",
    langCodes: ["pt-BR", "pt"],
    samplePhrase: "Ol\u00E1! Como voc\u00EA est\u00E1 hoje?",
  },
  {
    region: "Russian",
    emoji: "\u{1F1F7}\u{1F1FA}",
    langCodes: ["ru-RU", "ru"],
    samplePhrase:
      "\u041F\u0440\u0438\u0432\u0435\u0442! \u041A\u0430\u043A \u0434\u0435\u043B\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F?",
  },
  {
    region: "Italian",
    emoji: "\u{1F1EE}\u{1F1F9}",
    langCodes: ["it-IT", "it"],
    samplePhrase: "Ciao! Come stai oggi? Che bella giornata!",
  },
  {
    region: "Korean",
    emoji: "\u{1F1F0}\u{1F1F7}",
    langCodes: ["ko-KR", "ko"],
    samplePhrase:
      "\uC548\uB155\uD558\uC138\uC694! \uC624\uB298 \uB0A0\uC528\uAC00 \uC5B4\uB5A4\uAC00\uC694?",
  },
];

export default function AccentSelector() {
  const {
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop,
    isSpeaking,
    isSupported,
  } = useSpeechSynthesis();
  const [speakingGroup, setSpeakingGroup] = useState<string | null>(null);
  const [pitchMod, setPitchMod] = useState(1.0);
  const [rateMod, setRateMod] = useState(1.0);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
        <p className="text-sm text-yellow-300">
          Speech Synthesis is not supported in this browser.
        </p>
      </div>
    );
  }

  const getVoicesForGroup = (group: AccentGroup): SpeechSynthesisVoice[] =>
    availableVoices.filter((v) =>
      group.langCodes.some((code) =>
        v.lang.toLowerCase().startsWith(code.toLowerCase()),
      ),
    );

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

  const handleSelectVoice = (voice: SpeechSynthesisVoice) =>
    setSelectedVoice(voice);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-white/10 bg-white/3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Speech Rate</span>
            <span className="text-foreground font-mono">
              {rateMod.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rateMod}
            onChange={(e) => setRateMod(Number.parseFloat(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Pitch</span>
            <span className="text-foreground font-mono">
              {pitchMod.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitchMod}
            onChange={(e) => setPitchMod(Number.parseFloat(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
      </div>

      {selectedVoice && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand/10 border border-brand/20">
          <Volume2 className="w-4 h-4 text-brand shrink-0" />
          <span className="text-xs text-brand font-medium truncate">
            Active: {selectedVoice.name} ({selectedVoice.lang})
          </span>
        </div>
      )}

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
                      <p className="text-sm font-medium text-foreground truncate">
                        {group.region}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isAvailable
                          ? `${voices.length} voice${voices.length !== 1 ? "s" : ""}`
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!isAvailable && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-white/10 text-muted-foreground"
                      >
                        N/A
                      </Badge>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSpeak(group)}
                      disabled={!isAvailable}
                      className={`p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        isSpeakingThis
                          ? "bg-brand/20 text-brand"
                          : "bg-white/5 hover:bg-brand/20 text-muted-foreground hover:text-brand"
                      }`}
                    >
                      {isSpeakingThis ? (
                        <Square className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                {isAvailable && voices.length > 1 && (
                  <select
                    className="mt-2 w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-foreground"
                    value={selectedVoice?.name ?? ""}
                    onChange={(e) => {
                      const v = voices.find((vx) => vx.name === e.target.value);
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
