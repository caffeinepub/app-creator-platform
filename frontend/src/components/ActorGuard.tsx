import React, { useEffect, useRef, useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useInitializeSystem } from '../hooks/useQueries';
import { Flame, AlertTriangle, RefreshCw } from 'lucide-react';

interface ActorGuardProps {
  children: React.ReactNode;
}

export default function ActorGuard({ children }: ActorGuardProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const initializeSystem = useInitializeSystem();
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!actor || actorFetching || hasInitialized.current) return;

    hasInitialized.current = true;
    setIsInitializing(true);
    setInitError(null);

    initializeSystem.mutate(undefined, {
      onSuccess: () => {
        setIsInitializing(false);
        setIsReady(true);
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : String(err);
        // If already initialized or unauthorized (non-admin), treat as ready
        if (
          msg.includes('already initialized') ||
          msg.includes('Unauthorized') ||
          msg.includes('not ready') // system was already ready
        ) {
          setIsInitializing(false);
          setIsReady(true);
          return;
        }
        setIsInitializing(false);
        setInitError(msg);
      },
    });
  }, [actor, actorFetching]);

  // Still loading actor
  if (actorFetching || (!actor && !initError)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center animate-pulse">
              <Flame className="w-8 h-8 text-brand" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-brand/30 animate-spin border-t-brand" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-semibold text-lg font-display">Noventra.ai</p>
            <p className="text-muted-foreground text-sm mt-1">Connecting to backend…</p>
          </div>
        </div>
      </div>
    );
  }

  // Initializing system
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
              <Flame className="w-8 h-8 text-brand animate-flame-flicker" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-brand/30 animate-spin border-t-brand" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-semibold text-lg font-display">Noventra.ai</p>
            <p className="text-muted-foreground text-sm mt-1">Initializing system…</p>
          </div>
        </div>
      </div>
    );
  }

  // Init error
  if (initError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground font-display">Initialization Failed</h2>
            <p className="text-muted-foreground text-sm mt-2">
              The system could not be initialized. Please try refreshing the page.
            </p>
            <p className="text-destructive/80 text-xs mt-2 font-mono bg-destructive/5 rounded p-2">
              {initError}
            </p>
          </div>
          <button
            onClick={() => {
              hasInitialized.current = false;
              setInitError(null);
              setIsReady(false);
            }}
            className="btn-primary flex items-center gap-2 mx-auto px-6 py-2 rounded-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center animate-pulse">
              <Flame className="w-8 h-8 text-brand" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Starting up…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
