import React, { useEffect, useState, useCallback } from 'react';
import { useActor } from '../hooks/useActor';
import Logo from './Logo';

const STATUS_MESSAGES = [
  'Connecting to the Internet Computer...',
  'Initializing secure session...',
  'Loading your workspace...',
  'Almost ready...',
];

export default function ActorGuard({ children }: { children: React.ReactNode }) {
  const { actor } = useActor();
  const [statusIndex, setStatusIndex] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Cycle status messages every 2 seconds
  useEffect(() => {
    if (actor) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [actor]);

  // Track elapsed time and set timeout flag after 8 seconds
  useEffect(() => {
    if (actor) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= 8) setTimedOut(true);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [actor]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Actor is ready — render children immediately
  if (actor) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-sm w-full text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Logo size="large" />
        </div>

        {timedOut ? (
          /* Timeout / error state */
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <p className="text-foreground font-medium">Taking longer than expected</p>
              <p className="text-muted-foreground text-sm">
                The backend is taking too long to respond. This may be a temporary issue — please
                try again.
              </p>
            </div>

            <button
              onClick={handleRetry}
              className="btn-primary px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-95"
            >
              Retry
            </button>
          </div>
        ) : (
          /* Loading state */
          <div className="flex flex-col items-center gap-5">
            {/* Spinner */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
            </div>

            {/* Status message */}
            <div className="space-y-1">
              <p className="text-foreground/80 text-sm font-medium transition-all duration-500">
                {STATUS_MESSAGES[statusIndex]}
              </p>
              {elapsedSeconds >= 4 && (
                <p className="text-muted-foreground text-xs animate-fade-in">
                  Still connecting… ({elapsedSeconds}s)
                </p>
              )}
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce-dot"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
