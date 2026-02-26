import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useQueryClient } from "@tanstack/react-query";
import Logo from "../components/Logo";
import {
  Sparkles,
  Zap,
  Code2,
  Eye,
  ArrowRight,
  LogIn,
  Loader2,
  Globe,
  Smartphone,
  LayoutDashboard,
  Server,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "AI-Powered Generation",
    desc: "Describe your app in plain English and watch it come to life instantly.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Live Preview",
    desc: "See your application rendered in real time as the AI builds it.",
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Clean Code Output",
    desc: "Get production-ready HTML, CSS, and JavaScript you can use anywhere.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Multiple Project Types",
    desc: "Landing pages, dashboards, mobile UIs, APIs — build anything.",
  },
];

const projectTypes = [
  { icon: <Globe className="w-5 h-5" />, label: "Landing Pages" },
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboards" },
  { icon: <Smartphone className="w-5 h-5" />, label: "Mobile UIs" },
  { icon: <Server className="w-5 h-5" />, label: "API Docs" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleCTA = async () => {
    if (isAuthenticated) {
      navigate({ to: "/sessions" });
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === "User is already authenticated") {
          await clear();
          queryClient.clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo size="small" />
          <button
            onClick={handleCTA}
            disabled={isLoggingIn}
            className="btn-primary flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-60 transition-all"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : isAuthenticated ? (
              <>
                <ArrowRight className="w-4 h-4" />
                Open App
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.72 0.19 45 / 0.12) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered App Builder
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Build apps with{" "}
              <span className="gradient-text">natural language</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Describe what you want to build, and Noventra.ai generates a complete,
              functional application in seconds. No coding required.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCTA}
                disabled={isLoggingIn}
                className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold disabled:opacity-60 transition-all shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : isAuthenticated ? (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Go to My Sessions
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Get Started Free
                  </>
                )}
              </button>
            </div>

            {/* Project type pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
              {projectTypes.map((pt) => (
                <div
                  key={pt.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground"
                >
                  <span className="text-brand">{pt.icon}</span>
                  {pt.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Everything you need to build faster
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From idea to working prototype in minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-brand/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-4 group-hover:bg-brand/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA section */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="glass-card rounded-3xl p-12 border border-brand/20 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.72 0.19 45 / 0.08) 0%, transparent 70%)",
              }}
            />
            <h2 className="text-3xl font-display font-bold text-foreground mb-4 relative">
              Ready to build something amazing?
            </h2>
            <p className="text-muted-foreground mb-8 relative">
              Join thousands of builders using AI to create faster.
            </p>
            <button
              onClick={handleCTA}
              disabled={isLoggingIn}
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold disabled:opacity-60 transition-all shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5 relative"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : isAuthenticated ? (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Open My Sessions
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start Building Now
                </>
              )}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="small" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Noventra.ai. Built with{" "}
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
