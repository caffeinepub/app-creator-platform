# Specification

## Summary
**Goal:** Reduce app startup loading time from ~2 minutes to under 10 seconds, optimize backend initialization, and improve error handling for 401 API errors in the chat page.

**Planned changes:**
- Reduce ActorGuard retry delays by capping exponential backoff at a low value (e.g., max 2 seconds per retry)
- Lower the ActorGuard hard timeout to no more than 10 seconds
- Ensure the app proceeds to render as soon as a minimal viable connection is established, avoiding unnecessary sequential awaits
- Display a meaningful progress indicator or status message on the loading screen during startup
- Optimize the backend `initialize()` function in main.mo to return quickly without blocking or expensive operations
- Replace the raw red "API error 401: User not found" banner in the chat page with a user-friendly message: "Session expired. Please try again or log out and log back in."
- Add a "Retry" button to re-send the failed request on 401 errors
- Add a "Logout" shortcut link in the 401 error state

**User-visible outcome:** The app becomes interactive in under 10 seconds on a normal connection, and users who encounter a 401 error see a friendly message with actionable options instead of a raw error banner.
