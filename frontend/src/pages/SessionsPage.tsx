import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSessions, useDeleteSession } from '../hooks/useQueries';
import { Plus, Trash2, Globe, Layers, Smartphone, Code2, Clock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import type { SessionView } from '../backend';

const PROJECT_TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  landing: { icon: <Globe className="w-5 h-5" />, label: 'Landing Page', color: 'text-cyan' },
  fullstack: { icon: <Layers className="w-5 h-5" />, label: 'Fullstack App', color: 'text-brand' },
  mobile: { icon: <Smartphone className="w-5 h-5" />, label: 'Mobile App', color: 'text-cyan' },
  api: { icon: <Code2 className="w-5 h-5" />, label: 'API', color: 'text-brand' },
};

function getProjectConfig(type: string) {
  return PROJECT_TYPE_CONFIG[type] || PROJECT_TYPE_CONFIG['landing'];
}

function formatTimestamp(ts: bigint): string {
  try {
    const ms = Number(ts) / 1_000_000;
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  } catch {
    return 'recently';
  }
}

interface SessionCardProps {
  session: SessionView;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function SessionCard({ session, onDelete, isDeleting }: SessionCardProps) {
  const navigate = useNavigate();
  const config = getProjectConfig(session.projectType);

  return (
    <div
      className="glass-card p-5 group cursor-pointer hover:border-brand/40 hover:shadow-brand-glow transition-all duration-300 hover:-translate-y-0.5"
      onClick={() => navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id } })}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
            glass border border-border/60 ${config.color}
            group-hover:border-brand/40 transition-all duration-300
          `}>
            {config.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate group-hover:text-brand transition-colors duration-200">
              {session.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-text-muted">{config.label}</span>
              <span className="text-text-muted/40">·</span>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(session.updatedAt)}
              </span>
            </div>
            <div className="text-xs text-text-muted mt-1">
              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(session.id);
          }}
          disabled={isDeleting}
          className="flex-shrink-0 p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: sessions, isLoading, error } = useGetSessions();
  const { mutateAsync: deleteSession, isPending: isDeleting, variables: deletingId } = useDeleteSession();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md border border-border/40">
          <AlertCircle className="w-12 h-12 text-brand mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-text-muted">Please log in to view your sessions.</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      toast.success('Session deleted');
    } catch {
      toast.error('Failed to delete session');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text-brand">My Sessions</h1>
            <p className="text-text-muted mt-1">
              {sessions ? `${sessions.length} project${sessions.length !== 1 ? 's' : ''}` : 'Loading...'}
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/sessions/new' })}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-brand animate-spin" />
              <p className="text-text-muted">Loading sessions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card p-8 text-center border border-red-500/20">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-text-secondary">Failed to load sessions. Please try again.</p>
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={handleDelete}
                isDeleting={isDeleting && deletingId === session.id}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-16 text-center border border-border/40">
            <div className="w-16 h-16 rounded-2xl glass border border-brand/30 flex items-center justify-center mx-auto mb-6 shadow-brand-glow">
              <Plus className="w-8 h-8 text-brand" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No sessions yet</h3>
            <p className="text-text-muted mb-6">Create your first project to get started with Noventra.ai</p>
            <button
              onClick={() => navigate({ to: '/sessions/new' })}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
            >
              <Plus className="w-4 h-4" />
              Create First Session
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 px-4 mt-8">
        <div className="max-w-4xl mx-auto text-center text-text-muted text-sm">
          <p>
            Built with <span className="text-brand">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'noventra-ai')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:text-cyan-light transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
