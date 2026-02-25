# Specification

## Summary
**Goal:** Remove the "Made by you" / watermark branding element from the bottom of the app.

**Planned changes:**
- Remove the "Made by you" (or equivalent attribution/watermark) text and any footer badge from the bottom of the app UI
- Remove or clear the Noventra.ai watermark string injected into AI-generated HTML output in `llmService.ts`

**User-visible outcome:** No attribution or watermark text appears at the bottom of any page; all other functionality and layout remain unchanged.
