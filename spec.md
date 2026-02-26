# Specification

## Summary
**Goal:** Add a dedicated Sound Studio page at `/studio` that serves as a central hub integrating all existing sound features into a single cohesive interface.

**Planned changes:**
- Create a `/studio` route and link it from the main navigation
- Build a Sound Studio page that composes the existing `SoundLibrary`, `AccentSelector`, `AudioTuningPanel`, `GesturePadGrid`, and `WaveformVisualizer` components into a unified layout
- Add audio recording controls (start, stop, export) using the existing `useAudioRecorder` hook, with elapsed time display and live waveform animation from the microphone
- Add a preset management panel using the existing `usePresetStorage` hook to save, load, rename, and delete named presets that capture tuning, pad, and accent state (persisted via localStorage)
- Initialize and share a single `AudioContext` across all components on the page using `useAudioContextInit` and `useAudioEngine`, displaying `AudioEnablePrompt` when the context is suspended

**User-visible outcome:** Users can navigate to the Sound Studio page to access all sound features in one place — browse and preview sounds, adjust accents and tuning, trigger gesture pads, visualize audio, record and export audio, and manage named studio presets.
