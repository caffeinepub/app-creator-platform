import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetup from './components/ProfileSetup';
import Logo from './components/Logo';
import LoginButton from './components/LoginButton';
import ShareButton from './components/ShareButton';
import HomePage from './pages/HomePage';
import SessionsPage from './pages/SessionsPage';
import NewSessionPage from './pages/NewSessionPage';
import ChatPage from './pages/ChatPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function RootLayout() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
      <nav className="nav-bar sticky top-0 z-50 px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center">
            <Logo size="small" />
          </a>
        </div>
        <div className="flex items-center gap-3">
          <ShareButton />
          <LoginButton />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetup />}
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const sessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sessions',
  component: SessionsPage,
});

const newSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-session',
  component: NewSessionPage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$sessionId',
  component: ChatPage,
});

const routeTree = rootRoute.addChildren([homeRoute, sessionsRoute, newSessionRoute, chatRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <RouterProvider router={router} />
        <Toaster position="top-right" theme="dark" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
