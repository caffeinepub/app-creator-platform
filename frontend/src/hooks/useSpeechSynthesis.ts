import { useState, useEffect, useCallback, useRef } from "react";

export interface VoiceInfo {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isAvailable: boolean;
}

export function useSpeechSynthesis() {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => "speechSynthesis" in window);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const loadVoices = useCallback(() => {
    if (!isSupported) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setAvailableVoices(voices);
      if (!selectedVoice) {
        const defaultVoice = voices.find((v) => v.default) || voices[0];
        setSelectedVoice(defaultVoice || null);
      }
    }
  }, [isSupported, selectedVoice]);

  useEffect(() => {
    if (!isSupported) return;
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [isSupported, loadVoices]);

  const speak = useCallback(
    (text: string, voice?: SpeechSynthesisVoice | null, rate = 1, pitch = 1) => {
      if (!isSupported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice ?? selectedVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, selectedVoice]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return {
    availableVoices,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
}
