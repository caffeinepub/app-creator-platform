import React, { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Flame, Loader2 } from 'lucide-react';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveProfile({ name: name.trim() });
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
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="
                w-full px-4 py-3 rounded-xl bg-surface border border-border
                text-text-primary placeholder:text-text-muted
                input-glow transition-all duration-200
                focus:border-cyan/60
              "
              autoFocus
            />
          </div>

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
