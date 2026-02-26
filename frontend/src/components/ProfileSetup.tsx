import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import Logo from './Logo';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 50) {
      setError('Name must be 50 characters or fewer.');
      return;
    }

    setError('');
    try {
      await saveProfile.mutateAsync({ name: trimmed });
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Unauthorized') || message.includes('401')) {
        setError('Authentication error. Please log out and log back in.');
      } else if (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('connect')
      ) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to save profile. Please try again.');
      }
    }
  };

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 glass-card rounded-2xl p-8 w-full max-w-md shadow-2xl border border-border/50">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Logo size="small" />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground mt-2">
              Welcome to Noventra
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Let's set up your profile to get started.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-foreground"
            >
              Your Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your name"
              autoFocus
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-lg bg-background/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            {error && (
              <p className="text-destructive text-sm flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saveProfile.isPending || !name.trim()}
            className="btn-primary w-full py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saveProfile.isPending ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving…
              </>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
