import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useQueryClient } from "@tanstack/react-query";
import { useGetSessions, useDeleteSession } from "../hooks/useQueries";
import Logo from "../components/Logo";
import LoginButton from "../components/LoginButton";
import {
  Plus,
  Trash2,
  Globe,
  LayoutDashboard,
  Smartphone,
  Server,
  Code2,
  Gamepad2,
  Clock,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { SessionView } from "../backend";

const projectTypeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  landing: { icon: <Globe className="w-4 h-4" />, label: "Landing Page", color: "text-blue-400" },
  fullstack: { icon: <Code2 className="w-4 h-4" />, label: "Full Stack", color: "text-purple-400" },
  mobile: { icon: <Smartphone className="w-4 h-4" />, label: "Mobile UI", color: "text-green-400" },
  api: { icon: <Server className="w-4 h-4" />, label: "API Docs", color: "text-yellow-400" },
  dashboard: { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", color: "text-brand" },
  game: { icon: <Gamepad2 className="w-4 h-4" />, label: "Game", color: "text-pink-400" },
};

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) {
    const hours = Math.floor(diff / 3600000);
    if (hours === 0) {
      const mins = Math.floor(diff / 60000);
      return mins <= 1 ? "Just now" : `${mins}m ago`;
    }
    return `${hours}h ago`;
  }
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function SessionCard({
  session,
  onOpen,
  onDelete,
  isDeleting,
}: {
  session: SessionView;
  onOpen: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const typeConfig = projectTypeConfig[session.projectType] || projectTypeConfig.fullstack;
  const messageCount = session.messages.length;

  return (
    <div
      className="glass-card rounded-2xl border border-white/10 hover:border-brand/20 transition-all duration-300 group cursor-pointer overflow-hidden"
      onClick={onOpen}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand to-brand/40" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`${typeConfig.color} bg-white/5 rounded-lg p-1.5`}>
              {typeConfig.icon}
            </div>
            <span className="text-xs text-muted-foreground">{typeConfig.label}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground text-base mb-3 line-clamp-1 group-hover:text-brand transition-colors">
          {session.name}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{messageCount} message{messageCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(session.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: sessions, isLoading, error } = useGetSessions();
  const deleteSession = useDeleteSession();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeletingId(sessionId);
    try {
      await deleteSession.mutateAsync(sessionId);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-brand" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Login Required</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in to view your sessions.
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate({ to: "/" })} className="hover:opacity-80 transition-opacity">
            <Logo size="small" />
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/sessions/new" })}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              New Session
            </button>
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">My Sessions</h1>
          <p className="text-muted-foreground text-sm">
            {sessions?.length
              ? `${sessions.length} project${sessions.length !== 1 ? "s" : ""}`
              : "Your AI-generated projects will appear here"}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl border border-white/10 overflow-hidden animate-pulse">
                <div className="h-1 bg-white/10" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/10 rounded-lg w-1/3" />
                  <div className="h-5 bg-white/10 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/10 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-300 text-sm mb-4">Failed to load sessions. Please try again.</p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ["sessions"] })}
              className="text-sm text-brand hover:text-brand/80 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && sessions?.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-brand/60" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No sessions yet</h3>
            <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
              Create your first session to start building with AI.
            </p>
            <button
              onClick={() => navigate({ to: "/sessions/new" })}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Create First Session
            </button>
          </div>
        )}

        {/* Sessions grid */}
        {!isLoading && !error && sessions && sessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onOpen={() => navigate({ to: "/sessions/$sessionId", params: { sessionId: session.id } })}
                onDelete={() => handleDelete(session.id)}
                isDeleting={deletingId === session.id}
              />
            ))}
            {/* Add new card */}
            <button
              onClick={() => navigate({ to: "/sessions/new" })}
              className="glass-card rounded-2xl border border-dashed border-white/20 hover:border-brand/40 transition-all duration-300 p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-brand group min-h-[140px]"
            >
              <div className="w-10 h-10 rounded-xl border border-dashed border-current flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">New Session</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Noventra.ai · Built with{" "}
            <span className="text-brand">♥</span> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
