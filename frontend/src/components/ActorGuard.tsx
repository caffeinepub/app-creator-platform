import React, { useEffect, useRef, useState } from 'react';
import { useActor } from '../hooks/useActor';
import { Flame, AlertTriangle, RefreshCw } from 'lucide-react';

interface ActorGuardProps {
  children: React.ReactNode;
}

type GuardState = 'loading' | 'ready' | 'error';

// Hard timeout: if actor hasn't resolved in 8s, just proceed
const HARD_TIMEOUT_MS = 8000;

export default function ActorGuard({ children }: ActorGuardProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const [guardState, setGuardState] = useState<GuardState>('loading');
  const [statusMsg, setStatusMsg] = useState('Connecting…');
  const hardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedRef = useRef(false);

  const startHardTimeout = () => {
    if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
    hardTimeoutRef.current = setTimeout(() => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        setGuardState('ready');
      }
    }, HARD_TIMEOUT_MS);
  };

  useEffect(() => {
    startHardTimeout();
    return () => {
      if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resolvedRef.current) return;

    if (actorFetching) {
      setStatusMsg('Connecting…');
      return;
    }

    // Actor is done fetching (either available or not)
    resolvedRef.current = true;
    if (hardTimeoutRef.current) clearTimeout(hardTimeoutRef.current);
    setStatusMsg('Ready!');
    setGuardState('ready');
  }, [actor, actorFetching]);

  const handleRetry = () => {
    resolvedRef.current = false;
    setGuardState('loading');
    setStatusMsg('Reconnecting…');
    startHardTimeout();
    // The actor hook will re-evaluate on its own; just reset our state
  };

  if (guardState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
              <Flame className="w-8 h-8 text-brand animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-brand/20 animate-spin border-t-brand" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-foreground font-semibold text-lg font-display">Noventra.ai</p>
            <p className="text-muted-foreground text-sm">{statusMsg}</p>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-brand/40 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (guardState === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground font-display">Connection Failed</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Unable to reach the backend. Please check your connection and try again.
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="btn-primary flex items-center gap-2 mx-auto px-6 py-2 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
