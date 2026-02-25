import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useActor } from '../hooks/useActor';
import { Flame, AlertTriangle, RefreshCw } from 'lucide-react';

interface ActorGuardProps {
  children: React.ReactNode;
}

type GuardState = 'loading' | 'initializing' | 'ready' | 'error' | 'timeout';

const TIMEOUT_MS = 30_000;

export default function ActorGuard({ children }: ActorGuardProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const [guardState, setGuardState] = useState<GuardState>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const hasRun = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const runInit = useCallback(async (currentActor: typeof actor) => {
    if (!currentActor) return;

    setGuardState('initializing');
    setErrorMsg(null);

    // Set a hard timeout so we never get stuck forever
    timeoutRef.current = setTimeout(() => {
      setGuardState('timeout');
    }, TIMEOUT_MS);

    try {
      // Step 1: Check if the system is already ready
      const ready = await currentActor.getReadyStatus();
      if (ready) {
        clearTimer();
        setGuardState('ready');
        return;
      }

      // Step 2: System not ready — try to initialize (admin path)
      try {
        await currentActor.initialize();
        clearTimer();
        setGuardState('ready');
        return;
      } catch (initErr) {
        const initMsg = initErr instanceof Error ? initErr.message : String(initErr);

        // "already initialized" means ready
        if (initMsg.includes('already initialized')) {
          clearTimer();
          setGuardState('ready');
          return;
        }

        // Non-admin user: "Unauthorized" — re-check ready status
        if (initMsg.includes('Unauthorized') || initMsg.includes('unauthorized')) {
          // The admin may have initialized it between our check and now,
          // or the system may have been initialized on a previous deploy.
          // Re-check the ready status.
          try {
            const readyAgain = await currentActor.getReadyStatus();
            clearTimer();
            if (readyAgain) {
              setGuardState('ready');
            } else {
              // System genuinely not ready and we can't initialize it
              setErrorMsg('The system has not been initialized yet. Please contact an administrator.');
              setGuardState('error');
            }
          } catch {
            clearTimer();
            setErrorMsg('Unable to check system status. Please refresh the page.');
            setGuardState('error');
          }
          return;
        }

        // Some other error from initialize()
        clearTimer();
        setErrorMsg(initMsg);
        setGuardState('error');
      }
    } catch (err) {
      clearTimer();
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setGuardState('error');
    }
  }, []);

  useEffect(() => {
    if (!actor || actorFetching || hasRun.current) return;
    hasRun.current = true;
    runInit(actor);

    return () => clearTimer();
  }, [actor, actorFetching, runInit]);

  const handleRetry = () => {
    hasRun.current = false;
    setGuardState('loading');
    setErrorMsg(null);
    clearTimer();
    // Re-trigger by resetting; the effect will re-run when actor is available
    if (actor && !actorFetching) {
      hasRun.current = true;
      runInit(actor);
    }
  };

  // Still waiting for actor to be created
  if (guardState === 'loading' || actorFetching || (!actor && guardState !== 'error')) {
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
  if (guardState === 'initializing') {
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

  // Timeout state
  if (guardState === 'timeout') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground font-display">Connection Timeout</h2>
            <p className="text-muted-foreground text-sm mt-2">
              The backend is taking too long to respond. Please check your connection and try again.
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

  // Error state
  if (guardState === 'error') {
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
            {errorMsg && (
              <p className="text-destructive/80 text-xs mt-2 font-mono bg-destructive/5 rounded p-2 break-words">
                {errorMsg}
              </p>
            )}
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

  // Ready — render children
  return <>{children}</>;
}
