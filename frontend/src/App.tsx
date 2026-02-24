import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import HomePage from '@/pages/HomePage';
import SessionsPage from '@/pages/SessionsPage';
import NewSessionPage from '@/pages/NewSessionPage';
import ChatPage from '@/pages/ChatPage';

const rootRoute = createRootRoute({
    component: () => (
        <>
            <Outlet />
            <Toaster richColors position="top-right" theme="dark" />
        </>
    ),
});

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
    path: '/sessions/new',
    component: NewSessionPage,
});

const chatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/sessions/$sessionId/chat',
    component: ChatPage,
});

const routeTree = rootRoute.addChildren([
    homeRoute,
    sessionsRoute,
    newSessionRoute,
    chatRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <RouterProvider router={router} />;
}
