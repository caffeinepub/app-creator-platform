# Noventra.Ai — Pro Features: Realistic Image Generator, Clone Avatar Creator, Automatic Sound Director

## Current State
Noventra.Ai is a full-stack AI coding agent platform with:
- Session-based chat UI (ChatPage, SessionsPage, NewSessionPage)
- LLM service (llmService.ts) that calls an Emergent backend
- Sound library, icon builder, morning tone, gesture pad features
- Live HTML/CSS/JS preview in iframe
- Authorization + blob-storage backend on ICP
- Dark "Blade Runner" aesthetic, theme switcher

## Requested Changes (Diff)

### Add
- **Realistic Image Generator page** (`/image-gen`): A dedicated full-page studio where users describe an image in natural language. The UI renders a prompt input with style presets (photorealistic, cinematic, oil painting, anime, 3D render, etc.), aspect ratio selector, and a canvas-based result panel. Since direct image generation APIs are not available, this page generates complete standalone HTML+CSS+JS code (using canvas, SVG gradients, CSS art, procedural generation with noise algorithms) that renders visually rich realistic-looking artwork, which is shown in the live preview iframe. Includes a "Download" button.
- **Clone Avatar Creator page** (`/avatar-creator`): An interactive 3D avatar builder where users can customize a humanoid figure (skin tone, hair color/style, facial features, clothing, accessories). Built with Three.js rendered inline via a canvas element. Users can orbit/zoom the avatar. Includes export-as-image button (canvas.toDataURL). The avatar is built from Three.js geometry (sphere head, box torso, cylinder limbs) with MeshPhongMaterial for realistic shading. Users can tweak all parameters via sliders/pickers in a side panel.
- **Automatic Sound Director page** (`/sound-director`): An intelligent sound direction studio. Users describe a "scene" (e.g. "tense thriller moment", "happy morning jingle", "alien landscape ambience"). The app auto-generates a layered Web Audio API composition: background drone, melodic layer, rhythm layer, SFX layer — all synthesized in-browser using OscillatorNode, BiquadFilterNode, ConvolverNode, DynamicsCompressorNode. Shows a real-time spectrum analyzer (canvas FFT). Includes Play/Stop, BPM control, key selector, mood presets, and Download as WAV (via AudioBuffer + Blob).
- Navigation links in header for all three new pages
- New session project types: "Image Generation", "Avatar Creation", "Sound Direction"

### Modify
- `App.tsx`: Add routes for `/image-gen`, `/avatar-creator`, `/sound-director`; add nav links in header
- `NewSessionPage.tsx`: Add new project type cards for the three new features
- `llmService.ts`: Add system prompt instructions for image gen (canvas/SVG art code), avatar (Three.js humanoid), sound direction (Web Audio layered composition)

### Remove
- Nothing removed

## Implementation Plan
1. Create `ImageGenPage.tsx` — prompt input, style presets, aspect ratio, live preview iframe of generated canvas/SVG code
2. Create `AvatarCreatorPage.tsx` — Three.js avatar builder with customization panel and orbit controls inline
3. Create `SoundDirectorPage.tsx` — Web Audio scene composer with spectrum visualizer, mood presets, layered synthesis, WAV export
4. Update `App.tsx` with new routes and nav links
5. Update `NewSessionPage.tsx` with new project type cards
6. Update `llmService.ts` system prompt with templates for all three new capabilities
