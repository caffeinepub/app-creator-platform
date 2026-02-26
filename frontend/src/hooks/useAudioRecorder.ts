import { useState, useRef, useCallback } from "react";

export type PermissionStatus = "idle" | "granted" | "denied" | "requesting";

export interface AudioRecorderState {
  isRecording: boolean;
  recordingTime: number;
  permissionStatus: PermissionStatus;
  error: string | null;
  recordedBlob: Blob | null;
  analyserNode: AnalyserNode | null;
}

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    recordingTime: 0,
    permissionStatus: "idle",
    error: null,
    recordedBlob: null,
    analyserNode: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startRecording = useCallback(async () => {
    setState((s) => ({ ...s, error: null, permissionStatus: "requesting" }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up analyser
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setState((s) => ({ ...s, recordedBlob: blob, isRecording: false }));
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();
      };

      recorder.start(100);

      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setState((s) => ({ ...s, recordingTime: elapsed }));
      }, 1000);

      setState((s) => ({
        ...s,
        isRecording: true,
        permissionStatus: "granted",
        analyserNode: analyser,
        recordedBlob: null,
        recordingTime: 0,
      }));
    } catch (err) {
      const msg = (err as Error).message || "Microphone access denied";
      setState((s) => ({
        ...s,
        permissionStatus: "denied",
        error: msg,
        isRecording: false,
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const exportRecording = useCallback(
    (filename = "recording.webm") => {
      if (!state.recordedBlob) return;
      const url = URL.createObjectURL(state.recordedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    [state.recordedBlob]
  );

  const clearRecording = useCallback(() => {
    setState((s) => ({ ...s, recordedBlob: null, recordingTime: 0, error: null }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    exportRecording,
    clearRecording,
  };
}
