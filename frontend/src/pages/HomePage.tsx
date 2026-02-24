import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from '../components/LoginButton';
import { Sparkles, Zap, Code2, Globe, ArrowRight, Star, Heart } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI-Powered Generation',
    desc: 'Describe your project and watch Noventra.Ai generate production-ready code in seconds.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Live Preview',
    desc: 'See your landing page rendered live as the AI generates it — no build step required.',
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'Clean Code Output',
    desc: 'Get well-structured HTML, CSS, and JavaScript with syntax highlighting and copy support.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Multiple Project Types',
    desc: 'Landing pages, full-stack apps, mobile apps, and API backends — all in one platform.',
  },
];

const stats = [
  { value: '10x', label: 'Faster Development' },
  { value: '4+', label: 'Project Types' },
  { value: '100%', label: 'On-Chain Storage' },
  { value: '∞', label: 'Iterations' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleGetStarted = () => {
    navigate({ to: '/sessions' });
  };

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header — sticky only, no relative */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/noventra-logo-icon.dim_128x128.png" alt="Noventra.Ai" className="w-8 h-8 rounded-lg" />
          <span className="font-display font-bold text-xl gradient-text">Noventra.Ai</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-text-muted hover:text-text transition-colors">Features</a>
          <a href="#stats" className="text-sm text-text-muted hover:text-text transition-colors">Stats</a>
          {identity && (
            <button
              onClick={() => navigate({ to: '/sessions' })}
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              My Sessions
            </button>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {identity && (
            <button
              onClick={() => navigate({ to: '/sessions' })}
              className="hidden md:flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
            >
              Dashboard
            </button>
          )}
          <LoginButton />
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="text-center px-6 md:px-12 pt-24 pb-20">
          <div
            className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Code Generation
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
              Build Landing Pages{' '}
              <span className="gradient-text">10x Faster</span>{' '}
              with AI
            </h1>

            <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Noventra.Ai generates complete, production-ready landing pages from a single description.
              Preview them live, iterate instantly, and ship faster than ever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="btn-primary flex items-center gap-2 px-8 py-4 text-base rounded-xl"
              >
                <Sparkles className="w-5 h-5" />
                Start Building Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate({ to: '/sessions' })}
                className="flex items-center gap-2 px-8 py-4 text-base rounded-xl border border-border hover:border-indigo-500/50 text-text-muted hover:text-text transition-all"
              >
                View Sessions
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div
            className={`mt-16 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
              <div className="glass-card rounded-2xl overflow-hidden border border-indigo-500/20 shadow-2xl">
                <img
                  src="/assets/generated/hero-bg.dim_1920x1080.png"
                  alt="Noventra.Ai Interface"
                  className="w-full object-cover opacity-80"
                  style={{ maxHeight: '480px' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section id="stats" className="px-6 md:px-12 py-16 border-y border-border/30">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`text-center transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-display text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-text-muted text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 md:px-12 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl font-bold mb-4">
                Everything You Need to{' '}
                <span className="gradient-text">Ship Faster</span>
              </h2>
              <p className="text-text-muted text-lg max-w-xl mx-auto">
                From AI generation to live preview — Noventra.Ai has every tool you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className={`glass-card rounded-2xl p-6 border border-border hover:border-indigo-500/30 transition-all duration-300 group ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${i * 100 + 200}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-12 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/10 rounded-3xl blur-3xl" />
              <div className="relative glass-card rounded-3xl p-12 border border-indigo-500/20">
                <Star className="w-10 h-10 text-indigo-400 mx-auto mb-6" />
                <h2 className="font-display text-4xl font-bold mb-4">
                  Ready to Build?
                </h2>
                <p className="text-text-muted text-lg mb-8">
                  Join developers who are shipping landing pages 10x faster with Noventra.Ai.
                </p>
                <button
                  onClick={handleGetStarted}
                  className="btn-primary flex items-center gap-2 px-8 py-4 text-base rounded-xl mx-auto"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/assets/generated/noventra-logo-icon.dim_128x128.png" alt="Noventra.Ai" className="w-6 h-6 rounded" />
            <span className="font-display font-semibold text-sm gradient-text">Noventra.Ai</span>
          </div>
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
          <p className="text-text-muted text-xs">© {new Date().getFullYear()} Noventra.Ai</p>
        </div>
      </footer>
    </div>
  );
}
