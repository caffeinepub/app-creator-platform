import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateSession } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import LoginButton from '../components/LoginButton';
import { Globe, Layout, Smartphone, Server, ArrowLeft, Loader2, Sparkles, Heart } from 'lucide-react';
import { toast } from 'sonner';

const projectTypes = [
  {
    id: 'Landing Page',
    label: 'Landing Page',
    desc: 'Conversion-optimized React + Tailwind landing page.',
    icon: <Globe className="w-6 h-6" />,
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/40',
    bgColor: 'bg-indigo-500/10',
  },
  {
    id: 'Full-Stack App',
    label: 'Full-Stack App',
    desc: 'React frontend with Node.js/Express backend.',
    icon: <Layout className="w-6 h-6" />,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'Mobile App',
    label: 'Mobile App',
    desc: 'React Native with navigation and polished UI.',
    icon: <Smartphone className="w-6 h-6" />,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'API Backend',
    label: 'API Backend',
    desc: 'RESTful API with authentication and database.',
    icon: <Server className="w-6 h-6" />,
    color: 'text-green-400',
    borderColor: 'border-green-500/40',
    bgColor: 'bg-green-500/10',
  },
];

export default function NewSessionPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { isFetching: actorLoading } = useActor();
  const createSession = useCreateSession();

  const [projectName, setProjectName] = useState('');
  const [selectedType, setSelectedType] = useState('Landing Page');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = projectName.trim();
    if (!name) {
      toast.error('Please enter a project name');
      return;
    }
    if (!identity) {
      toast.error('Please login first');
      return;
    }

    try {
      const sessionId = await createSession.mutateAsync({ name, projectType: selectedType });
      navigate({ to: '/sessions/$sessionId/chat', params: { sessionId } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create session';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      {/* Header — sticky only, no relative */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src="/assets/generated/noventra-logo-icon.dim_128x128.png" alt="Noventra.Ai" className="w-8 h-8 rounded-lg" />
          <span className="font-display font-bold text-xl gradient-text">Noventra.Ai</span>
        </button>
        <div className="flex items-center gap-3">
          <LoginButton compact />
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate({ to: '/sessions' })}
          className="flex items-center gap-2 text-text-muted hover:text-text text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sessions
        </button>

        <div className="glass-card rounded-2xl p-8 border border-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">New Session</h1>
              <p className="text-text-muted text-sm">Configure your AI project</p>
            </div>
          </div>

          {!identity ? (
            <div className="text-center py-8">
              <p className="text-text-muted mb-4">Please login to create a session.</p>
              <LoginButton />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project name */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. My Awesome SaaS"
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  maxLength={80}
                  autoFocus
                />
              </div>

              {/* Project type */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-3">
                  Project Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                        selectedType === type.id
                          ? `${type.borderColor} ${type.bgColor}`
                          : 'border-border hover:border-border/80 bg-surface-2/50 hover:bg-surface-2'
                      }`}
                    >
                      <div className={`mt-0.5 ${type.color}`}>{type.icon}</div>
                      <div>
                        <div className={`font-semibold text-sm ${selectedType === type.id ? type.color : 'text-text'}`}>
                          {type.label}
                        </div>
                        <div className="text-text-muted text-xs mt-0.5 leading-relaxed">{type.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createSession.isPending || actorLoading || !projectName.trim()}
                className="w-full btn-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createSession.isPending || actorLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{actorLoading ? 'Connecting...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Session</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 md:px-12 py-6 mt-8">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <p className="text-text-muted text-sm flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
