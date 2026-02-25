# Specification

## Summary
**Goal:** Fix the "actor not available to start" error by ensuring the backend actor is fully initialized before any frontend queries or mutations attempt to use it.

**Planned changes:**
- Add a guard/wrapper in the actor access layer that waits for the actor to be ready before allowing calls
- Display a meaningful loading state while the actor is initializing
- Display a clear error message to the user if the actor fails to initialize, instead of crashing
- Ensure the fix applies consistently on both initial page load and after Internet Identity authentication

**User-visible outcome:** The application no longer crashes or shows "actor not available to start" errors; users see a loading indicator while the actor initializes and a clear error message if initialization fails.
