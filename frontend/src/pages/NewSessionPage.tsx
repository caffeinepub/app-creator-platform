import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    Sparkles,
    ArrowLeft,
    Layers,
    Smartphone,
    Layout,
    Code2,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCreateSession } from '@/hooks/useQueries';
import { useActor } from '@/hooks/useActor';

const PROJECT_TYPES = [
    {
        id: 'custom',
        label: 'Custom Project',
        description: 'Build anything — I adapt to your exact requirements.',
        icon: <Code2 size={22} />,
        color: 'oklch(0.55 0.22 264)',
        colorDim: 'oklch(0.55 0.22 264 / 15%)',
        colorBorder: 'oklch(0.55 0.22 264 / 25%)',
    },
    {
        id: 'fullstack',
        label: 'Full-Stack App',
        description: 'React frontend + Node.js/FastAPI backend + database.',
        icon: <Layers size={22} />,
        color: 'oklch(0.72 0.17 200)',
        colorDim: 'oklch(0.72 0.17 200 / 15%)',
        colorBorder: 'oklch(0.72 0.17 200 / 25%)',
    },
    {
        id: 'mobile',
        label: 'Mobile App',
        description: 'React Native with navigation and polished UI.',
        icon: <Smartphone size={22} />,
        color: 'oklch(0.70 0.18 162)',
        colorDim: 'oklch(0.70 0.18 162 / 15%)',
        colorBorder: 'oklch(0.70 0.18 162 / 25%)',
    },
    {
        id: 'landing',
        label: 'Landing Page',
        description: 'Conversion-optimized React + Tailwind landing page.',
        icon: <Layout size={22} />,
        color: 'oklch(0.65 0.25 303)',
        colorDim: 'oklch(0.65 0.25 303 / 15%)',
        colorBorder: 'oklch(0.65 0.25 303 / 25%)',
    },
];

export default function NewSessionPage() {
    const navigate = useNavigate();
    const createSession = useCreateSession();
    const { actor, isFetching: actorLoading } = useActor();
    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState('custom');

    useEffect(() => {
        document.title = 'New Project — Noventra.Ai';
    }, []);

    const isReady = !!actor && !actorLoading;
    const isDisabled = createSession.isPending || !name.trim() || !isReady;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) {
            toast.error('Please enter a project name');
            return;
        }
        if (!isReady) {
            toast.error('Still connecting to the network. Please wait a moment.');
            return;
        }

        try {
            const sessionId = await createSession.mutateAsync({
                name: trimmedName,
                projectType: selectedType,
            });
            toast.success('Session created!');
            navigate({ to: '/sessions/$sessionId/chat', params: { sessionId } });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            toast.error(`Failed to create session: ${message}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--surface-0)' }}>
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
                <div
                    className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
                    style={{
                        background:
                            'radial-gradient(ellipse, oklch(0.55 0.22 264) 0%, transparent 70%)',
                        filter: 'blur(80px)',
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
                <nav className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate({ to: '/sessions' })}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: 'var(--text-dim)', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-bright)')
                        }
                        onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)')
                        }
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
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
                    <div className="w-16" />
                </nav>
            </header>

            {/* Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
                <div
                    className="w-full max-w-2xl"
                    style={{ animation: 'fade-up 0.5s ease both' }}
                >
                    <div className="text-center mb-10">
                        <h1
                            className="text-3xl font-bold mb-2"
                            style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                        >
                            Start a New Project
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                            Name your project and choose a type to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Project Name */}
                        <div>
                            <label
                                htmlFor="project-name"
                                className="block text-sm font-medium mb-3"
                                style={{ color: 'var(--text-bright)' }}
                            >
                                Project Name
                            </label>
                            <input
                                id="project-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. My Todo App, E-commerce Store, Portfolio..."
                                autoFocus
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                style={{
                                    background: 'oklch(0.93 0 0 / 5%)',
                                    border: '1px solid oklch(0.93 0 0 / 12%)',
                                    color: 'var(--text-bright)',
                                    fontFamily: 'Inter',
                                    transition: 'border-color 0.2s ease',
                                }}
                                onFocus={(e) =>
                                    (e.currentTarget.style.borderColor =
                                        'oklch(0.55 0.22 264 / 50%)')
                                }
                                onBlur={(e) =>
                                    (e.currentTarget.style.borderColor = 'oklch(0.93 0 0 / 12%)')
                                }
                            />
                        </div>

                        {/* Project Type */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-3"
                                style={{ color: 'var(--text-bright)' }}
                            >
                                Project Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {PROJECT_TYPES.map((type) => {
                                    const isSelected = selectedType === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setSelectedType(type.id)}
                                            className="p-4 rounded-xl text-left"
                                            style={{
                                                background: isSelected
                                                    ? type.colorDim
                                                    : 'oklch(0.93 0 0 / 4%)',
                                                border: `1px solid ${
                                                    isSelected
                                                        ? type.colorBorder
                                                        : 'oklch(0.93 0 0 / 10%)'
                                                }`,
                                                transition:
                                                    'background 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
                                                boxShadow: isSelected
                                                    ? `0 0 20px -6px ${type.color}40`
                                                    : 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.transform =
                                                    'scale(1.02)';
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLButtonElement).style.transform =
                                                    'scale(1)';
                                            }}
                                        >
                                            <div
                                                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                                                style={{
                                                    background: isSelected
                                                        ? type.colorDim
                                                        : 'oklch(0.93 0 0 / 6%)',
                                                    color: isSelected
                                                        ? type.color
                                                        : 'var(--text-dim)',
                                                    border: `1px solid ${
                                                        isSelected
                                                            ? type.colorBorder
                                                            : 'oklch(0.93 0 0 / 10%)'
                                                    }`,
                                                }}
                                            >
                                                {type.icon}
                                            </div>
                                            <div
                                                className="font-semibold text-sm mb-1"
                                                style={{
                                                    fontFamily: 'Space Grotesk',
                                                    color: isSelected
                                                        ? type.color
                                                        : 'var(--text-bright)',
                                                }}
                                            >
                                                {type.label}
                                            </div>
                                            <div
                                                className="text-xs leading-relaxed"
                                                style={{ color: 'var(--text-dim)' }}
                                            >
                                                {type.description}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actor loading notice */}
                        {actorLoading && (
                            <div
                                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                                style={{
                                    background: 'oklch(0.55 0.22 264 / 10%)',
                                    border: '1px solid oklch(0.55 0.22 264 / 20%)',
                                    color: 'var(--text-dim)',
                                }}
                            >
                                <Loader2 size={12} className="animate-spin" />
                                Connecting to the network…
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isDisabled}
                            className="w-full btn-primary py-3 text-base justify-center"
                            style={{
                                transition:
                                    'box-shadow 0.25s ease, transform 0.15s ease, opacity 0.2s ease',
                                opacity: isDisabled ? 0.6 : 1,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                if (!isDisabled) {
                                    (e.currentTarget as HTMLButtonElement).style.transform =
                                        'scale(1.02)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                            }}
                        >
                            {createSession.isPending ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating Session...
                                </>
                            ) : actorLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Create Project
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
