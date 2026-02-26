import React, { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveCallerUserProfile } from "../hooks/useQueries";
import { User, Loader2, Sparkles } from "lucide-react";

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setError("");
    try {
      await saveProfile.mutateAsync({ name: trimmed });
      onComplete();
    } catch (err: unknown) {
      const e = err as Error;
      if (e?.message?.includes("Unauthorized") || e?.message?.includes("not ready")) {
        setError("Authentication error. Please try logging out and back in.");
      } else if (e?.message?.includes("connection") || e?.message?.includes("network")) {
        setError("Connection error. Please check your internet and try again.");
      } else {
        setError("Failed to save profile. Please try again.");
      }
    }
  };

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? principal.slice(0, 5) + "..." + principal.slice(-3)
    : "";

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md border border-brand/20 shadow-2xl shadow-brand/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-brand" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Noventra.ai</h2>
          <p className="text-muted-foreground text-sm">
            Let's set up your profile to get started
          </p>
          {shortPrincipal && (
            <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
              ID: {shortPrincipal}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <User className="w-4 h-4 text-brand" />
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter your name..."
              disabled={saveProfile.isPending}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 transition-all disabled:opacity-60"
            />
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <span>⚠</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saveProfile.isPending || !name.trim()}
            className="w-full btn-primary py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get Started
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
