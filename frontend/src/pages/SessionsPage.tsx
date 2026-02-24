import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSessions, useDeleteSession } from '../hooks/useQueries';
import LoginButton from '../components/LoginButton';
import {
  Plus, Trash2, MessageSquare, Globe, Smartphone, Server, Layout,
  Clock, Loader2, AlertCircle, Heart, Sparkles
} from 'lucide-react';

const projectTypeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  'Landing Page': { icon: <Globe className="w-5 h-5" />, color: 'text-indigo-400', label: 'Landing Page' },
  'landing':      { icon: <Globe className="w-5 h-5" />, color: 'text-indigo-400', label: 'Landing Page' },
  'Full-Stack App': { icon: <Layout className="w-5 h-5" />, color: 'text-cyan-400', label: 'Full-Stack App' },
  'fullstack':    { icon: <Layout className="w-5 h-5" />, color: 'text-cyan-400', label: 'Full-Stack App' },
  'Mobile App':   { icon: <Smartphone className="w-5 h-5" />, color: 'text-purple-400', label: 'Mobile App' },
  'mobile':       { icon: <Smartphone className="w-5 h-5" />, color: 'text-purple-400', label: 'Mobile App' },
  'API Backend':  { icon: <Server className="w-5 h-5" />, color: 'text-green-400', label: 'API Backend' },
  'api':          { icon: <Server className="w-5 h-5" />, color: 'text-green-400', label: 'API Backend' },
};

function getProjectConfig(type: string) {
  return projectTypeConfig[type] || { icon: <Layout className="w-5 h-5" />, color: 'text-text-muted', label: type };
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function SessionsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: sessions, isLoading, error } = useGetSessions();
  const deleteSession = useDeleteSession();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setDeletingId(sessionId);
    try {
      await deleteSession.mutateAsync(sessionId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl" />
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

      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-10">
        {/* Page header */}
        <div className={`flex items-center justify-between mb-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">My Sessions</h1>
            <p className="text-text-muted text-sm">
              {sessions ? `${sessions.length} project${sessions.length !== 1 ? 's' : ''}` : 'Loading...'}
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/sessions/new' })}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>

        {/* Not logged in */}
        {!identity && (
          <div className="glass-card rounded-2xl p-12 text-center border border-border">
            <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">Login to View Sessions</h2>
            <p className="text-text-muted text-sm mb-6">Sign in to access your AI-powered project sessions.</p>
            <LoginButton />
          </div>
        )}

        {/* Loading */}
        {identity && isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {/* Error */}
        {identity && error && (
          <div className="glass-card rounded-2xl p-8 text-center border border-red-500/20">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium">Failed to load sessions</p>
            <p className="text-text-muted text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* Empty state */}
        {identity && !isLoading && !error && sessions && sessions.length === 0 && (
          <div className="glass-card rounded-2xl p-16 text-center border border-border">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">No sessions yet</h2>
            <p className="text-text-muted text-sm mb-8 max-w-sm mx-auto">
              Create your first session to start building with AI-powered code generation.
            </p>
            <button
              onClick={() => navigate({ to: '/sessions/new' })}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create First Session
            </button>
          </div>
        )}

        {/* Sessions grid */}
        {identity && !isLoading && sessions && sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session, i) => {
              const config = getProjectConfig(session.projectType);
              const isDeleting = deletingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => navigate({ to: '/sessions/$sessionId/chat', params: { sessionId: session.id } })}
                  className={`glass-card rounded-2xl p-5 border border-border hover:border-indigo-500/30 cursor-pointer transition-all duration-300 group ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center ${config.color} group-hover:scale-110 transition-transform`}>
                      {config.icon}
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, session.id)}
                      disabled={isDeleting}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-display font-semibold text-base mb-1 truncate">{session.name}</h3>
                  <p className={`text-xs font-medium mb-3 ${config.color}`}>{config.label}</p>

                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{session.messages.length} message{session.messages.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(session.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 md:px-12 py-6 mt-12">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
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
