# Specification

## Summary
**Goal:** Fix alarm sound playback in Noventra by implementing a Web Audio API-based sound engine and resolving misconfigured media elements.

**Planned changes:**
- Replace any external audio file dependencies with programmatic tone generation using Web Audio API (AudioContext + OscillatorNode) that produces a repeating beep pattern when an alarm fires.
- Add a user-gesture guard that creates/resumes the AudioContext on the first user interaction (click, keydown, or pointer event).
- Display a toast/banner prompting "Click anywhere to enable alarm sound" if AudioContext is suspended when an alarm triggers, while still showing the visual alarm indicator.
- Add a "Stop Alarm" / dismiss button that halts the audio and clears the repeat interval.
- Audit and fix any HTML5 audio/video elements with broken external URLs or incorrect MIME types, replacing them with local/blob sources or graceful fallbacks.
- Update the LivePreview iframe sandbox attribute to include `allow-scripts allow-same-origin` if needed for media functionality.

**User-visible outcome:** Alarms play a reliable audible tone immediately when triggered without console errors, users are prompted to interact with the page if audio is blocked, and all media elements across the app function without broken-URL or permission errors.
