import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateSession } from '../hooks/useQueries';
import { Globe, Layers, Smartphone, Code2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type ProjectType = 'landing' | 'fullstack' | 'mobile' | 'api';

const PROJECT_TYPES: Array<{
  id: ProjectType;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}> = [
  {
    id: 'landing',
    icon: <Globe className="w-6 h-6" />,
    label: 'Landing Page',
    description: 'Marketing site, portfolio, or product page',
    color: 'cyan',
  },
  {
    id: 'fullstack',
    icon: <Layers className="w-6 h-6" />,
    label: 'Fullstack App',
    description: 'Dashboard, SaaS app, or web application',
    color: 'brand',
  },
  {
    id: 'mobile',
    icon: <Smartphone className="w-6 h-6" />,
    label: 'Mobile App',
    description: 'Mobile-first UI or progressive web app',
    color: 'cyan',
  },
  {
    id: 'api',
    icon: <Code2 className="w-6 h-6" />,
    label: 'API / Docs',
    description: 'REST API documentation or developer portal',
    color: 'brand',
  },
];

export default function NewSessionPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { mutateAsync: createSession, isPending } = useCreateSession();

  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('landing');

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md border border-border/40">
          <AlertCircle className="w-12 h-12 text-brand mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-text-muted">Please log in to create a session.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Please enter a project name.');
      return;
    }

    try {
      const session = await createSession({ name: trimmedName, projectType });

      const sessionId = session.id;
      if (!sessionId) {
        toast.error('Session was created but returned an invalid ID. Please try again.');
        return;
      }

      toast.success('Session created!');
      navigate({ to: '/sessions/$sessionId', params: { sessionId } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create session. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text-brand mb-3">New Session</h1>
          <p className="text-text-secondary">Set up your project and start building with AI</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 border border-border/40">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-3">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Awesome App, Portfolio Site..."
                className="
                  w-full px-4 py-3.5 rounded-xl bg-surface border border-border
                  text-text-primary placeholder:text-text-muted text-base
                  input-glow transition-all duration-200
                  focus:border-cyan/60
                "
                autoFocus
                disabled={isPending}
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-3">
                Project Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setProjectType(type.id)}
                    disabled={isPending}
                    className={`
                      flex items-start gap-4 p-4 rounded-xl border text-left
                      transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                      ${projectType === type.id
                        ? type.color === 'brand'
                          ? 'border-brand/60 bg-brand/10 shadow-brand-glow-sm'
                          : 'border-cyan/60 bg-cyan/10 shadow-cyan-glow-sm'
                        : 'border-border/60 glass hover:border-border'
                      }
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                      ${projectType === type.id
                        ? type.color === 'brand'
                          ? 'bg-brand/20 text-brand'
                          : 'bg-cyan/20 text-cyan'
                        : 'bg-surface-raised text-text-muted'
                      }
                      transition-all duration-200
                    `}>
                      {type.icon}
                    </div>
                    <div>
                      <div className={`font-semibold text-sm ${projectType === type.id ? (type.color === 'brand' ? 'text-brand' : 'text-cyan') : 'text-text-primary'}`}>
                        {type.label}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim() || isPending}
              className="w-full btn-primary py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Session...
                </>
              ) : (
                <>
                  Start Building
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate({ to: '/sessions' })}
            disabled={isPending}
            className="text-text-muted hover:text-text-secondary text-sm transition-colors disabled:opacity-50"
          >
            ← Back to Sessions
          </button>
        </div>
      </div>
    </div>
  );
}
