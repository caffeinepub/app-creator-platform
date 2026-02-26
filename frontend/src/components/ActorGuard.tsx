import React, { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import Logo from "./Logo";

interface ActorGuardProps {
  children: React.ReactNode;
}

const STATUS_MESSAGES = [
  "Connecting…",
  "Authenticating…",
  "Almost ready…",
  "Hang tight…",
];

export default function ActorGuard({ children }: ActorGuardProps) {
  const { actor } = useActor();
  const [timedOut, setTimedOut] = useState(false);
  const [dots, setDots] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const isReady = !!actor;

  // Timeout: show retry after 4 seconds if actor not available
  useEffect(() => {
    if (isReady) return;

    const timeout = setTimeout(() => {
      setTimedOut(true);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [isReady]);

  // Animated dots
  useEffect(() => {
    if (isReady) return;
    const interval = setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, [isReady]);

  // Cycle status messages every 2 seconds
  useEffect(() => {
    if (isReady) return;
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isReady]);

  // Stale-while-revalidate: if actor is already available, render children immediately
  if (isReady) {
    return <>{children}</>;
  }

  const handleRetry = () => {
    window.location.reload();
  };

  if (timedOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden border border-white/10">
            <img
              src="/assets/generated/noventra-logo-icon.dim_128x128.png"
              alt="Noventra.ai"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Connection Timeout</h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Could not connect to the backend. This may be a temporary issue — please try again.
          </p>
          <button
            onClick={handleRetry}
            className="btn-primary px-8 py-3 rounded-xl font-medium text-sm"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden border border-brand/20 shadow-lg shadow-brand/10">
          <img
            src="/assets/generated/noventra-logo-icon.dim_128x128.png"
            alt="Noventra.ai"
            className="w-full h-full object-cover"
          />
        </div>
        <Logo size="large" />
        <div className="mt-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-brand transition-all duration-300"
              style={{
                opacity: dots === i ? 1 : 0.25,
                transform: dots === i ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
        <p
          key={statusIndex}
          className="mt-4 text-sm text-muted-foreground transition-opacity duration-500 animate-fade-in"
        >
          {STATUS_MESSAGES[statusIndex]}
        </p>
      </div>
    </div>
  );
}
