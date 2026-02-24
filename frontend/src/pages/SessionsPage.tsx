import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    Sparkles,
    ArrowLeft,
    Plus,
    Trash2,
    MessageSquare,
    FileCode,
    Clock,
    Layers,
    Smartphone,
    Layout,
    Code2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetSessions, useDeleteSession } from '@/hooks/useQueries';
import type { SessionView } from '../backend';

function formatDate(nanoseconds: bigint): string {
    const ms = Number(nanoseconds / BigInt(1_000_000));
    const date = new Date(ms);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

function getProjectTypeIcon(type: string) {
    switch (type) {
        case 'fullstack':
            return <Layers size={18} />;
        case 'mobile':
            return <Smartphone size={18} />;
        case 'landing':
            return <Layout size={18} />;
        default:
            return <Code2 size={18} />;
    }
}

function getProjectTypeLabel(type: string): string {
    switch (type) {
        case 'fullstack':
            return 'Full-Stack App';
        case 'mobile':
            return 'Mobile App';
        case 'landing':
            return 'Landing Page';
        default:
            return 'Custom Project';
    }
}

function SessionCard({
    session,
    onDelete,
    onClick,
    index,
}: {
    session: SessionView;
    onDelete: (id: string) => void;
    onClick: (id: string) => void;
    index: number;
}) {
    return (
        <div
            onClick={() => onClick(session.id)}
            className="glass-card p-5 cursor-pointer group relative"
            style={{
                transition: 'border-color 0.2s ease, transform 0.2s ease',
                animation: `fade-up 0.4s ease ${index * 0.06}s both`,
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLDivElement).style.borderColor =
                    'oklch(0.55 0.22 264 / 30%)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.93 0 0 / 10%)';
            }}
        >
            {/* Delete button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-100"
                style={{
                    color: 'oklch(0.65 0.20 25)',
                    background: 'oklch(0.65 0.20 25 / 10%)',
                    transition: 'opacity 0.2s ease',
                }}
                title="Delete session"
            >
                <Trash2 size={14} />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3 mb-4 pr-8">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                        background: 'oklch(0.55 0.22 264 / 15%)',
                        color: 'var(--indigo)',
                        border: '1px solid oklch(0.55 0.22 264 / 20%)',
                    }}
                >
                    {getProjectTypeIcon(session.projectType)}
                </div>
                <div className="min-w-0">
                    <h3
                        className="font-semibold text-sm truncate"
                        style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                    >
                        {session.name}
                    </h3>
                    <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                        {getProjectTypeLabel(session.projectType)}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-dim)' }}>
                    <MessageSquare size={12} />
                    <span>{session.messages.length} messages</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-dim)' }}>
                    <FileCode size={12} />
                    <span>{session.files.length} files</span>
                </div>
                <div
                    className="flex items-center gap-1.5 text-xs ml-auto"
                    style={{ color: 'var(--text-faint)' }}
                >
                    <Clock size={11} />
                    <span>{formatDate(session.updatedAt)}</span>
                </div>
            </div>

            {/* Hover indicator */}
            <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100"
                style={{
                    background: 'linear-gradient(90deg, var(--indigo), var(--cyan))',
                    transition: 'opacity 0.2s ease',
                }}
            />
        </div>
    );
}

export default function SessionsPage() {
    const navigate = useNavigate();
    const { data: sessions, isLoading } = useGetSessions();
    const deleteSession = useDeleteSession();

    useEffect(() => {
        document.title = 'My Sessions — Noventra.Ai';
    }, []);

    const handleDelete = async (sessionId: string) => {
        try {
            await deleteSession.mutateAsync(sessionId);
            toast.success('Session deleted');
        } catch {
            toast.error('Failed to delete session');
        }
    };

    const handleOpen = (sessionId: string) => {
        navigate({ to: '/sessions/$sessionId/chat', params: { sessionId } });
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-0)' }}>
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
                <div
                    className="absolute top-[-5%] right-[10%] w-[400px] h-[400px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, oklch(0.55 0.22 264) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
            </div>

            {/* Header */}
            <header
                className="relative z-10 border-b"
                style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'oklch(0.08 0 0 / 80%)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate({ to: '/' })}
                            className="flex items-center gap-2 text-sm"
                            style={{ color: 'var(--text-dim)', transition: 'color 0.2s ease' }}
                            onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLButtonElement).style.color =
                                    'var(--text-bright)')
                            }
                            onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)')
                            }
                        >
                            <ArrowLeft size={16} />
                            Home
                        </button>
                        <div
                            className="w-px h-4"
                            style={{ backgroundColor: 'var(--border-default)' }}
                        />
                        <div className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: 'var(--indigo)' }}
                            >
                                <Sparkles size={13} color="white" />
                            </div>
                            <span
                                className="font-bold text-base"
                                style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                            >
                                Noventra<span style={{ color: 'var(--cyan)' }}>.Ai</span>
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate({ to: '/sessions/new' })}
                        className="btn-primary text-sm"
                    >
                        <Plus size={15} />
                        New Project
                    </button>
                </nav>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div style={{ animation: 'fade-up 0.4s ease both' }}>
                    <div className="mb-10">
                        <h1
                            className="text-3xl font-bold mb-2"
                            style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                        >
                            My Sessions
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                            Continue building your projects or start something new.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="glass-card p-5 h-28"
                                    style={{ opacity: 0.4, animation: 'glow-pulse 1.5s ease infinite' }}
                                />
                            ))}
                        </div>
                    ) : !sessions || sessions.length === 0 ? (
                        <div
                            className="text-center py-24"
                            style={{ animation: 'fade-in 0.4s ease both' }}
                        >
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                style={{
                                    background: 'oklch(0.55 0.22 264 / 10%)',
                                    border: '1px solid oklch(0.55 0.22 264 / 20%)',
                                }}
                            >
                                <Code2 size={28} style={{ color: 'var(--indigo)' }} />
                            </div>
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                            >
                                No sessions yet
                            </h3>
                            <p className="text-sm mb-8" style={{ color: 'var(--text-dim)' }}>
                                Create your first project and start building with AI.
                            </p>
                            <button
                                onClick={() => navigate({ to: '/sessions/new' })}
                                className="btn-primary"
                            >
                                <Plus size={16} />
                                Create First Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {sessions
                                .slice()
                                .sort((a, b) => Number(b.updatedAt - a.updatedAt))
                                .map((session, index) => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onDelete={handleDelete}
                                        onClick={handleOpen}
                                        index={index}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer
                className="relative z-10 border-t py-6 mt-auto"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        © {new Date().getFullYear()} Noventra.Ai
                    </span>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        Built with{' '}
                        <span style={{ color: 'oklch(0.65 0.22 25)' }}>♥</span>{' '}
                        using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                                typeof window !== 'undefined' ? window.location.hostname : 'noventra-ai'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--cyan)', textDecoration: 'none' }}
                        >
                            caffeine.ai
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
