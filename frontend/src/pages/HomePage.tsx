import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Zap, Shield, Eye, Code2, Layers, Globe, ArrowRight, ChevronRight } from 'lucide-react';
import Logo from '../components/Logo';
import LoginButton from '../components/LoginButton';

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'AI-Powered Generation',
    description: 'Describe your vision and watch Noventra.ai build complete, production-ready code instantly.',
    color: 'brand',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Live Preview',
    description: 'See your app come to life in real-time with our sandboxed preview across desktop, tablet, and mobile.',
    color: 'cyan',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Session Management',
    description: 'Organize your projects into sessions. Pick up where you left off, anytime.',
    color: 'brand',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Decentralized & Secure',
    description: 'Built on the Internet Computer. Your data is yours — secured by cryptography, not promises.',
    color: 'cyan',
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'Multiple Project Types',
    description: 'Landing pages, dashboards, mobile UIs, API docs — Noventra.ai handles every project type.',
    color: 'brand',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Always Available',
    description: 'No servers to maintain. Runs on the decentralized cloud — 100% uptime guaranteed.',
    color: 'cyan',
  },
];

const STATS = [
  { value: '10x', label: 'Faster Development' },
  { value: '100%', label: 'On-Chain Storage' },
  { value: '∞', label: 'Project Types' },
  { value: '0', label: 'Server Costs' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/noventra-hero-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 0%, oklch(0.65 0.22 25 / 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, oklch(0.72 0.18 195 / 0.1) 0%, transparent 50%)',
        }} />
        {/* Scanline effect */}
        <div className="absolute inset-0 scanline opacity-30" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan/30 text-cyan text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            Built on the Internet Computer
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            <span className="gradient-text">Build apps with AI</span>
            <br />
            <span className="text-text-primary">on the decentralized cloud</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe your idea. Noventra.ai generates complete, beautiful code instantly.
            No setup. No servers. Just build.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate({ to: '/new-session' })}
                  className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold"
                >
                  Start Building <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate({ to: '/sessions' })}
                  className="glass border border-border hover:border-cyan/50 flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-medium text-text-secondary hover:text-text-primary transition-all duration-200"
                >
                  My Sessions <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate({ to: '/new-session' })}
                  className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </button>
                <div className="glass border border-border rounded-xl overflow-hidden">
                  <LoginButton />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted text-xs animate-bounce">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-border/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold gradient-text-brand mb-2">{stat.value}</div>
              <div className="text-text-muted text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Everything you need</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Noventra.ai combines AI code generation with decentralized infrastructure for a truly next-gen development experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-6 group hover:border-brand/40 transition-all duration-300 hover:-translate-y-1"
                style={{ '--hover-glow': feature.color === 'brand' ? 'oklch(0.65 0.22 25 / 0.15)' : 'oklch(0.72 0.18 195 / 0.15)' } as React.CSSProperties}
              >
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  ${feature.color === 'brand'
                    ? 'bg-brand/10 text-brand border border-brand/20 group-hover:shadow-brand-glow-sm'
                    : 'bg-cyan/10 text-cyan border border-cyan/20 group-hover:shadow-cyan-glow-sm'
                  }
                  transition-all duration-300
                `}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 border border-brand/20 shadow-brand-glow">
            <Logo size="large" />
            <h2 className="text-4xl font-bold mt-8 mb-4 gradient-text">
              Ready to build something amazing?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Join the future of AI-powered development on the decentralized cloud.
            </p>
            <button
              onClick={() => navigate({ to: '/new-session' })}
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-semibold"
            >
              Start Your First Project <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <Logo size="small" />
          </div>
          <p>© {new Date().getFullYear()} Noventra.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
