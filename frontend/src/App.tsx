import React, { useState } from "react";
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import ActorGuard from "./components/ActorGuard";
import ProfileSetup from "./components/ProfileSetup";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import { useAudioContextInit } from "./hooks/useAudioContextInit";
import HomePage from "./pages/HomePage";
import SessionsPage from "./pages/SessionsPage";
import NewSessionPage from "./pages/NewSessionPage";
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const msg = (error as Error)?.message || "";
        if (msg.includes("Unauthorized") || msg.includes("Session not found")) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});

// ─── Layout with profile setup guard ─────────────────────────────────────────
function AppLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const [profileSetupDone, setProfileSetupDone] = useState(false);

  // Initialize AudioContext on first user interaction (global, app-level)
  useAudioContextInit();

  const showProfileSetup =
    isAuthenticated &&
    !isInitializing &&
    !profileLoading &&
    isFetched &&
    userProfile === null &&
    !profileSetupDone;

  return (
    <>
      <Outlet />
      {showProfileSetup && (
        <ProfileSetup onComplete={() => setProfileSetupDone(true)} />
      )}
    </>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: AppLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const sessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sessions",
  component: SessionsPage,
});

const newSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sessions/new",
  component: NewSessionPage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sessions/$sessionId",
  component: ChatPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  sessionsRoute,
  newSessionRoute,
  chatRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ActorGuard>
          <RouterProvider router={router} />
        </ActorGuard>
        <Toaster position="top-right" theme="dark" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
