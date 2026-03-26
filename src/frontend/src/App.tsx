import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { Camera, Music, Sunrise, User } from "lucide-react";
import { ThemeProvider } from "next-themes";
import React, { useState, useCallback } from "react";
import ActorGuard from "./components/ActorGuard";
import AlarmNotification from "./components/AlarmNotification";
import IconBuilderModal from "./components/IconBuilderModal";
import LoginButton from "./components/LoginButton";
import Logo from "./components/Logo";
import ProfileSetup from "./components/ProfileSetup";
import UserAvatar from "./components/UserAvatar";
import { useAudioContextInit } from "./hooks/useAudioContextInit";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useScheduleMorningTone } from "./hooks/useMorningTone";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import AvatarCreatorPage from "./pages/AvatarCreatorPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import ImageGenPage from "./pages/ImageGenPage";
import MorningTonePage from "./pages/MorningTonePage";
import NewSessionPage from "./pages/NewSessionPage";
import SessionsPage from "./pages/SessionsPage";
import SoundDirectorPage from "./pages/SoundDirectorPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
    mutations: { retry: 0 },
  },
});

const THEMES = ["indigo", "red", "emerald"] as const;
type Theme = (typeof THEMES)[number];

function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    return (localStorage.getItem("noventra_theme") as Theme) || "indigo";
  });
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("noventra_theme", theme);
  }, [theme]);
  const next = () =>
    setTheme((t) => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]);
  const label =
    theme === "indigo"
      ? "\uD83D\uDD35"
      : theme === "red"
        ? "\uD83D\uDD34"
        : "\uD83D\uDFE2";
  return (
    <button
      type="button"
      onClick={next}
      title={`Theme: ${theme}`}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-sm"
      data-ocid="nav.theme_switcher.toggle"
    >
      {label}
    </button>
  );
}

function AppLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const [morningAlarmVisible, setMorningAlarmVisible] = useState(false);

  useAudioContextInit();

  const handleMorningTrigger = useCallback(() => {
    setMorningAlarmVisible(true);
  }, []);

  useScheduleMorningTone(handleMorningTrigger);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo size="small" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated && (
              <>
                <Link
                  to="/sessions"
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  data-ocid="nav.sessions.link"
                >
                  Sessions
                </Link>
                <Link
                  to="/morning-tone"
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                  data-ocid="nav.morning_tone.link"
                >
                  <Sunrise className="w-3.5 h-3.5" />
                  Morning Tone
                </Link>
                <Link
                  to="/image-gen"
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                  data-ocid="nav.imagegen.link"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Image Gen
                </Link>
                <Link
                  to="/avatar-creator"
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                  data-ocid="nav.avatar.link"
                >
                  <User className="w-3.5 h-3.5" />
                  Avatar
                </Link>
                <Link
                  to="/sound-director"
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                  data-ocid="nav.sounddir.link"
                >
                  <Music className="w-3.5 h-3.5" />
                  Sound Director
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <IconBuilderModal
                  trigger={
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border border-border/50"
                    >
                      <span className="hidden sm:inline">Icon</span>
                    </button>
                  }
                />
                <UserAvatar
                  size="small"
                  fallbackInitials={userProfile?.name ?? "?"}
                />
              </>
            )}
            <ThemeSwitcher />
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/30 py-6 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Noventra.Ai — Elite AI App Builder</p>
      </footer>

      {showProfileSetup && <ProfileSetup />}

      {morningAlarmVisible && (
        <AlarmNotification
          message="Morning Manifestation Tone — Start your day with intention \uD83C\uDF…"
          onDismiss={() => setMorningAlarmVisible(false)}
        />
      )}

      <Toaster />
    </div>
  );
}

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

const morningToneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/morning-tone",
  component: MorningTonePage,
});

const imageGenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/image-gen",
  component: ImageGenPage,
});

const avatarCreatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/avatar-creator",
  component: AvatarCreatorPage,
});

const soundDirectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sound-director",
  component: SoundDirectorPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  sessionsRoute,
  newSessionRoute,
  chatRoute,
  morningToneRoute,
  imageGenRoute,
  avatarCreatorRoute,
  soundDirectorRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ActorGuard>
          <RouterProvider router={router} />
        </ActorGuard>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
