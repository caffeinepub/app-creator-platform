import React, { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Flame, Loader2, AlertCircle } from 'lucide-react';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setErrorMsg(null);
    try {
      await saveProfile({ name: name.trim() });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // Provide a user-friendly message for common backend errors
      if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('only users')) {
        setErrorMsg(
          'Your account does not have permission to save a profile yet. Please try logging out and back in, or contact support.'
        );
      } else if (msg.toLowerCase().includes('not ready') || msg.toLowerCase().includes('system is not ready')) {
        setErrorMsg('The system is still starting up. Please wait a moment and try again.');
      } else if (msg.toLowerCase().includes('actor not available')) {
        setErrorMsg('Connection to the backend is not ready. Please refresh the page and try again.');
      } else {
        setErrorMsg(msg || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative glass-card p-8 w-full max-w-md border border-cyan/30 shadow-cyan-glow">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl glass border border-brand/40 flex items-center justify-center shadow-brand-glow">
            <Flame className="w-8 h-8 text-brand" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold gradient-text mb-2">Welcome to Noventra.ai</h2>
            <p className="text-text-muted text-sm">Set up your profile to get started</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Enter your name..."
              className="
                w-full px-4 py-3 rounded-xl bg-surface border border-border
                text-text-primary placeholder:text-text-muted
                input-glow transition-all duration-200
                focus:border-cyan/60
              "
              autoFocus
              disabled={isPending}
            />
          </div>

          {/* Inline error message */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim() || isPending}
            className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Get Started</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
