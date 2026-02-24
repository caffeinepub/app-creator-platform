# Specification

## Summary
**Goal:** Fix the landing page generation flow in `llmService.ts` so that selecting "Landing Page" as a project type and submitting a prompt produces a complete, visually polished scaffold for Noventra.Ai.

**Planned changes:**
- Fix `llmService.ts` so the landing page project type branch returns a non-empty response with code files instead of failing silently.
- Implement a landing page template in `llmService.ts` that generates a complete scaffold including Hero, Features, How It Works, and CTA sections.
- Ensure generated copy describes Noventra.Ai as a platform that can build any project type (full-stack apps, mobile apps, landing pages).
- Apply Noventra.Ai's dark theme styling (OKLCH color tokens, glassmorphism, Space Grotesk font) to the generated landing page scaffold.
- Wire the fixed landing page template into the ChatPage flow so responses appear correctly when the landing page project type is selected.

**User-visible outcome:** When a user selects "Landing Page" in NewSessionPage and submits a prompt in ChatPage, they receive a complete, renderable landing page scaffold with Hero, Features, How It Works, and CTA sections styled with Noventra.Ai's dark theme — with no blank responses or console errors.
