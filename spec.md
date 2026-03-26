# Noventra.Ai — Full Rebuild (v38)

## Current State
The app is a React + Motoko ICP app where users log in via Internet Identity, create AI coding sessions, and generate self-contained HTML/CSS/JS apps via OpenRouter API. The core stack works but has UX issues:
- ActorGuard blocks app for 2+ minutes with "system not ready" message
- Startup spinner is anxiety-inducing; no timeout recovery
- Chat/preview layout lacks polish
- Model is hardcoded to gemini-2.0-flash-001; users can't switch models
- Sound in generated previews unreliable
- No theme switcher
- Home page is minimal; no visual wow factor
- Sessions page lacks sorting/search

## Requested Changes (Diff)

### Add
- Animated particle/gradient hero on HomePage
- Model selector in chat header (allow user to pick OpenRouter models: gemini-2.0-flash, claude-sonnet-4-5, gpt-4o-mini, deepseek-chat)
- Theme color switcher (indigo/cyan default, red/orange option, emerald/teal option)
- Download button for generated HTML in preview panel
- Full-screen preview toggle button
- Better empty state in chat with quick-start prompts
- Session search/filter on SessionsPage
- Sound sandbox improvements: inject AudioContext resume script into LivePreview iframe

### Modify
- ActorGuard: reduce timeout to 5s, show "retry" much faster; improve copy
- HomePage: animated background (CSS particles/gradient animation), bold hero, visual project type grid
- ChatPage: add model selector dropdown in toolbar, add download button, better empty states with quick-start suggestions
- llmService.ts: make model configurable from localStorage; support multiple models
- LivePreview: inject AudioContext auto-resume shim into iframe srcdoc
- NewSessionPage: add more project type options (sound, 4d, avatar, sounddirection)
- App.tsx: add theme switcher in header

### Remove
- Test alarm button from chat header (clutter)
- Home.tsx (duplicate/unused file)

## Implementation Plan
1. Update llmService.ts to support model selection from localStorage
2. Improve ActorGuard (faster timeout, better messaging)
3. Rebuild HomePage with animated hero and visual project grid
4. Update ChatPage with model selector, download button, quick-start prompts, full-screen preview
5. Update NewSessionPage with all project types
6. Improve LivePreview with AudioContext shim injection
7. Update SessionsPage with search/filter
8. Add theme switcher to App.tsx header
9. Add CSS theme variables for color themes
