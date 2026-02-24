import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import SessionsPage from './pages/SessionsPage';
import NewSessionPage from './pages/NewSessionPage';
import ChatPage from './pages/ChatPage';
import ProfileSetup from './components/ProfileSetup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <ProfileSetup />
    </>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const sessionsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sessions', component: SessionsPage });
const newSessionRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sessions/new', component: NewSessionPage });
const chatRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sessions/$sessionId/chat', component: ChatPage });

const routeTree = rootRoute.addChildren([homeRoute, sessionsRoute, newSessionRoute, chatRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" theme="dark" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
