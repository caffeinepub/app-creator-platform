# Specification

## Summary
**Goal:** Rebuild the Noventra.Ai landing page generator as a fresh project with a new canister, preserving all existing functionality and visual design from Version 5.

**Planned changes:**
- Rebuild backend (single Motoko actor) with session management: create, list, delete sessions with owner-based access control
- Rebuild chat interface with AI assistant, message persistence, and code block rendering
- Rebuild landing page HTML/CSS scaffold generation for the "Landing Page" project type
- Rebuild live preview of generated landing pages within the session/chat view
- Rebuild New Session flow with project name input and project type selection (Mobile App, Landing Page, etc.)
- Rebuild Sessions list page showing past sessions with project type icons and timestamps
- Preserve dark theme design system: Space Grotesk / Inter / JetBrains Mono fonts, OKLCH color tokens, glassmorphism card styles, and glow effects across all pages (Home, Sessions, New Session, Chat)
- Preserve Noventra.Ai visual identity and branding

**User-visible outcome:** Users can create a new Noventra.Ai session, chat with the AI assistant to generate landing page scaffolds, see a live preview of the generated page, and manage (list/delete) their past sessions — all on a freshly deployed canister with the full Noventra.Ai dark theme intact.
