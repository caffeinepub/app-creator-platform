# Specification

## Summary
**Goal:** Fix session creation failure, remove localhost URL references from AI template responses, and fix navigation links on the Home page.

**Planned changes:**
- Audit and fix the Motoko actor's `createSession` function and the `useQueries.ts` frontend hook to resolve the mismatch causing "Failed to create session. Please try again." errors; ensure successful session creation navigates to the Chat page
- Remove all `localhost` and `127.0.0.1` URL references from template responses in `frontend/src/services/llmService.ts` across all four project type templates, replacing them with generic "follow the Getting Started steps in your local environment" instructions
- Fix navigation links in `HomePage.tsx` so that "My Sessions" routes to `/sessions` and "Start New Project" routes to `/sessions/new` using React Router, with no hardcoded localhost or absolute URLs

**User-visible outcome:** Users can successfully create a new session from the New Session page without errors, AI-generated responses no longer instruct users to open a localhost URL, and all Home page navigation buttons route correctly within the deployed app.
