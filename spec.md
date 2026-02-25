# Specification

## Summary
**Goal:** Fix the app getting stuck on a "system not ready yet, please wait" loading state by correcting the ActorGuard initialization detection logic and ensuring the backend properly signals readiness.

**Planned changes:**
- Update the `ActorGuard` component to correctly detect when the backend actor is available and the `initialize()` call has succeeded, transitioning out of the loading state
- Treat "already initialized" and "Unauthorized" responses from `initialize()` as ready states in the frontend guard
- Add an appropriate error state if the backend is genuinely unavailable instead of an infinite wait
- Review and fix the backend `main.mo` actor initialization logic to ensure `isReady` is set correctly and `initialize()` returns a response the frontend can recognize as success
- Eliminate any race conditions or stuck states in the backend initialization flow

**User-visible outcome:** The app no longer gets stuck on the loading/waiting message on page load; the main UI renders normally once the actor is ready.
