# Specification

## Summary
**Goal:** Diagnose and fix the Noventra app startup and launch issues so the application loads correctly without hanging, crashing, or showing a permanent loading state.

**Planned changes:**
- Fix the ActorGuard initialization flow so it does not hang on the loading screen, including ensuring the retry mechanism works correctly
- Fix ICP actor creation and initialization so it succeeds on page load for both authenticated and anonymous users
- Fix the InternetIdentityProvider bootstrap sequence to avoid startup errors
- Audit and fix the TanStack Router route setup in App.tsx so all four routes (home, sessions, new session, chat) resolve correctly on initial navigation and hard refresh
- Ensure the ProfileSetup guard only triggers when a profile is genuinely missing, not on every load
- Verify the frontend correctly resolves the backend canister ID in both local and production environments
- Ensure anonymous and authenticated query calls to the backend canister during initialization return valid responses or clear error messages

**User-visible outcome:** The Noventra app loads successfully without hanging or crashing, all routes are accessible, and users can reach the home/landing page within a reasonable time after page load.
