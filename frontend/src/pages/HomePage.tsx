import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    Layers,
    Smartphone,
    Layout,
    Sparkles,
    Code2,
    MessageSquare,
    Download,
    ArrowRight,
    Zap,
    Shield,
    GitBranch,
} from 'lucide-react';

const features = [
    {
        icon: <Layers size={22} />,
        title: 'Full-Stack Apps',
        desc: 'React frontends, Node.js/FastAPI backends, and databases — complete production-ready applications.',
    },
    {
        icon: <Smartphone size={22} />,
        title: 'Mobile Apps',
        desc: 'React Native applications with navigation, state management, and polished UI components.',
    },
    {
        icon: <Layout size={22} />,
        title: 'Landing Pages',
        desc: 'Conversion-optimized landing pages with animations, responsive design, and modern aesthetics.',
    },
    {
        icon: <MessageSquare size={22} />,
        title: 'Persistent Sessions',
        desc: 'Every conversation is saved. Return to any project and continue exactly where you left off.',
    },
    {
        icon: <Download size={22} />,
        title: 'Download Projects',
        desc: 'Export all generated files as a single package, ready to use in your development environment.',
    },
    {
        icon: <Code2 size={22} />,
        title: 'Multi-File Generation',
        desc: 'Generates complete project structures — not just snippets, but entire working codebases.',
    },
];

const stats = [
    { value: '4', label: 'Project Types' },
    { value: '∞', label: 'Sessions' },
    { value: '100%', label: 'On-Chain' },
];

function useFadeIn(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        const timer = setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);
    return ref;
}

export default function HomePage() {
    const navigate = useNavigate();
    const heroRef = useFadeIn(50);
    const featuresRef = useFadeIn(200);
    const ctaRef = useFadeIn(100);

    useEffect(() => {
        document.title = 'Noventra.Ai | Elite AI Coding Agent';
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-0)' }}>
            {/* Background glow blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
                <div
                    className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-20 animate-glow-pulse"
                    style={{
                        background: 'radial-gradient(circle, oklch(0.55 0.22 264) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                    }}
                />
                <div
                    className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-15 animate-glow-pulse"
                    style={{
                        background: 'radial-gradient(circle, oklch(0.72 0.17 200) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        animationDelay: '1.2s',
                    }}
                />
            </div>

            {/* Navigation */}
            <header className="relative z-10 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div
                        className="flex items-center gap-3"
                        style={{ animation: 'fade-in 0.4s ease forwards' }}
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--indigo)' }}
                        >
                            <Sparkles size={16} color="white" />
                        </div>
                        <span
                            className="text-xl font-bold tracking-tight"
                            style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                        >
                            Noventra<span style={{ color: 'var(--cyan)' }}>.Ai</span>
                        </span>
                    </div>

                    <div
                        className="flex items-center gap-3"
                        style={{ animation: 'fade-in 0.4s ease forwards' }}
                    >
                        <button
                            onClick={() => navigate({ to: '/sessions' })}
                            className="btn-secondary text-sm"
                        >
                            My Sessions
                        </button>
                        <button
                            onClick={() => navigate({ to: '/sessions/new' })}
                            className="btn-primary text-sm"
                        >
                            <Sparkles size={15} />
                            New Project
                        </button>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <main className="relative z-10 max-w-7xl mx-auto px-6">
                <section className="pt-24 pb-20 text-center">
                    <div ref={heroRef}>
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
                            style={{
                                background: 'oklch(0.55 0.22 264 / 12%)',
                                border: '1px solid oklch(0.55 0.22 264 / 25%)',
                                color: 'oklch(0.75 0.18 264)',
                            }}
                        >
                            <Zap size={13} />
                            Your Personal AI Coding Agent
                        </div>

                        <h1
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                            style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                        >
                            Build anything with
                            <br />
                            <span className="gradient-text">Noventra.Ai</span>
                        </h1>

                        <p
                            className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
                            style={{ color: 'var(--text-dim)' }}
                        >
                            An elite AI coding agent that generates full-stack apps, mobile applications,
                            and landing pages — complete with multi-file project structures, persistent
                            sessions, and instant downloads.
                        </p>

                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <button
                                onClick={() => navigate({ to: '/sessions/new' })}
                                className="btn-primary text-base px-8 py-3"
                                style={{ transition: 'box-shadow 0.25s ease, transform 0.15s ease' }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                }}
                            >
                                <Sparkles size={18} />
                                Start Building
                                <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={() => navigate({ to: '/sessions' })}
                                className="btn-secondary text-base px-8 py-3"
                                style={{ transition: 'background 0.2s ease, transform 0.15s ease' }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                }}
                            >
                                View Sessions
                            </button>
                        </div>
                    </div>

                    {/* Hero image */}
                    <div
                        className="mt-16 relative mx-auto max-w-4xl"
                        style={{ animation: 'fade-up 0.7s ease 0.3s both' }}
                    >
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{
                                border: '1px solid oklch(0.93 0 0 / 10%)',
                                boxShadow: '0 40px 80px -20px oklch(0 0 0 / 60%)',
                            }}
                        >
                            <img
                                src="/assets/generated/hero-bg.dim_1920x1080.png"
                                alt="Noventra.Ai coding interface"
                                className="w-full object-cover"
                                style={{ maxHeight: '420px' }}
                            />
                            <div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                    background:
                                        'linear-gradient(to bottom, transparent 40%, var(--surface-0) 100%)',
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-12 border-y" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <div
                                    className="text-4xl font-bold mb-1"
                                    style={{ fontFamily: 'Space Grotesk', color: 'var(--indigo)' }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-sm" style={{ color: 'var(--text-dim)' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="py-20">
                    <div className="text-center mb-14">
                        <h2
                            className="text-3xl md:text-4xl font-bold mb-4"
                            style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                        >
                            Everything you need to build
                        </h2>
                        <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-dim)' }}>
                            Noventra.Ai handles the full development lifecycle — from architecture to
                            deployment-ready code.
                        </p>
                    </div>

                    <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="glass-card p-6 group cursor-default"
                                style={{ transition: 'border-color 0.2s ease, transform 0.2s ease' }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                                    (e.currentTarget as HTMLDivElement).style.borderColor =
                                        'oklch(0.55 0.22 264 / 30%)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLDivElement).style.borderColor =
                                        'oklch(0.93 0 0 / 10%)';
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{
                                        background: 'oklch(0.55 0.22 264 / 15%)',
                                        color: 'var(--indigo)',
                                        border: '1px solid oklch(0.55 0.22 264 / 20%)',
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <h3
                                    className="text-base font-semibold mb-2"
                                    style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                                >
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20">
                    <div
                        ref={ctaRef}
                        className="glass-card p-12 text-center relative overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(ellipse at center, oklch(0.55 0.22 264 / 8%) 0%, transparent 70%)',
                            }}
                        />
                        <div className="relative z-10">
                            <Shield
                                size={36}
                                className="mx-auto mb-4"
                                style={{ color: 'var(--indigo)' }}
                            />
                            <h2
                                className="text-3xl font-bold mb-3"
                                style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                            >
                                Ready to build your next project?
                            </h2>
                            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-dim)' }}>
                                Start a new session and describe what you want to build. Noventra.Ai will
                                generate the complete codebase for you.
                            </p>
                            <button
                                onClick={() => navigate({ to: '/sessions/new' })}
                                className="btn-primary text-base px-10 py-3"
                                style={{ transition: 'box-shadow 0.25s ease, transform 0.15s ease' }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                }}
                            >
                                <Sparkles size={18} />
                                Start New Project
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer
                className="relative z-10 border-t py-8"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ background: 'var(--indigo)' }}
                        >
                            <Sparkles size={12} color="white" />
                        </div>
                        <span
                            className="text-sm font-semibold"
                            style={{ fontFamily: 'Space Grotesk', color: 'var(--text-dim)' }}
                        >
                            Noventra<span style={{ color: 'var(--cyan)' }}>.Ai</span>
                        </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        © {new Date().getFullYear()} Noventra.Ai — Elite AI Coding Agent
                    </p>
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
