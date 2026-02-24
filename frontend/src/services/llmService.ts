export interface GeneratedFile {
  filename: string;
  content: string;
}

export interface AIResponse {
  message: string;
  files: GeneratedFile[];
}

function buildLandingPageScaffold(userPrompt: string): string {
  return `Here's your complete landing page scaffold for Noventra.Ai! This includes a Hero section, Features, How It Works, and a CTA section.

\`\`\`html filename=index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Noventra.Ai — Build Any App with AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #030712;
      --surface: #111827;
      --surface-2: #1f2937;
      --border: #1f2937;
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.35);
      --accent: #06b6d4;
      --accent-glow: rgba(6, 182, 212, 0.3);
      --text: #f9fafb;
      --text-muted: #6b7280;
      --radius: 12px;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      overflow-x: hidden;
    }

    h1, h2, h3, h4 {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      line-height: 1.2;
    }

    /* ── NAV ── */
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: rgba(3, 7, 18, 0.8);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(99, 102, 241, 0.15);
    }

    .nav-logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }

    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-links a:hover { color: var(--text); }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.4rem;
      border-radius: 8px;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), #818cf8);
      color: #fff;
      box-shadow: 0 0 20px var(--primary-glow);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 32px var(--primary-glow);
    }

    .btn-outline {
      background: transparent;
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-outline:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .btn-lg {
      padding: 0.85rem 2rem;
      font-size: 1rem;
    }

    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 8rem 2rem 4rem;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 1rem;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #a5b4fc;
      margin-bottom: 1.5rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 5rem);
      margin-bottom: 1.5rem;
      max-width: 900px;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero p {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: var(--text-muted);
      max-width: 600px;
      margin-bottom: 2.5rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .hero-stats {
      display: flex;
      gap: 3rem;
      margin-top: 4rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    /* ── SECTION COMMON ── */
    section {
      padding: 6rem 2rem;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .section-label {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 0.75rem;
    }

    .section-title {
      font-size: clamp(1.75rem, 3.5vw, 2.75rem);
      margin-bottom: 1rem;
    }

    .section-subtitle {
      font-size: 1.05rem;
      color: var(--text-muted);
      max-width: 560px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-header .section-subtitle {
      margin: 0 auto;
    }

    /* ── FEATURES ── */
    .features { background: var(--bg); }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 2rem;
      transition: border-color 0.3s, transform 0.3s;
    }

    .feature-card:hover {
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-4px);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
    }

    .feature-card h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.7;
    }

    /* ── HOW IT WORKS ── */
    .how-it-works { background: var(--surface); }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2rem;
      position: relative;
    }

    .step {
      text-align: center;
      padding: 2rem 1.5rem;
    }

    .step-number {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin: 0 auto 1.25rem;
      box-shadow: 0 0 24px var(--primary-glow);
    }

    .step h3 {
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
    }

    .step p {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* ── PROJECT TYPES ── */
    .project-types { background: var(--bg); }

    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    .type-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.75rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transition: border-color 0.3s, transform 0.3s;
    }

    .type-card:hover {
      border-color: rgba(6, 182, 212, 0.4);
      transform: translateY(-3px);
    }

    .type-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .type-card h3 {
      font-size: 1rem;
      margin-bottom: 0.35rem;
    }

    .type-card p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* ── CTA ── */
    .cta {
      background: var(--surface);
      text-align: center;
    }

    .cta-box {
      background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.08));
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 20px;
      padding: 4rem 2rem;
      position: relative;
      overflow: hidden;
    }

    .cta-box::before {
      content: '';
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .cta-box h2 {
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      margin-bottom: 1rem;
    }

    .cta-box p {
      font-size: 1.05rem;
      color: var(--text-muted);
      max-width: 500px;
      margin: 0 auto 2rem;
    }

    .cta-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* ── FOOTER ── */
    footer {
      background: var(--bg);
      border-top: 1px solid var(--border);
      padding: 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    footer a {
      color: var(--primary);
      text-decoration: none;
    }

    footer a:hover { text-decoration: underline; }

    /* ── RESPONSIVE ── */
    @media (max-width: 640px) {
      nav { padding: 1rem; }
      .nav-links { display: none; }
      .hero-stats { gap: 1.5rem; }
    }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .fade-up {
      animation: fadeUp 0.6s ease forwards;
    }

    .delay-1 { animation-delay: 0.1s; opacity: 0; }
    .delay-2 { animation-delay: 0.2s; opacity: 0; }
    .delay-3 { animation-delay: 0.3s; opacity: 0; }
    .delay-4 { animation-delay: 0.4s; opacity: 0; }
  </style>
</head>
<body>

  <!-- NAV -->
  <nav>
    <a href="#" class="nav-logo">Noventra.Ai</a>
    <ul class="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#how-it-works">How It Works</a></li>
      <li><a href="#project-types">What We Build</a></li>
    </ul>
    <a href="#cta" class="btn btn-primary">Get Started</a>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-badge fade-up">✦ AI-Powered App Builder</div>
    <h1 class="fade-up delay-1">
      Build <span class="gradient-text">Any App</span><br/>with a Single Prompt
    </h1>
    <p class="fade-up delay-2">
      Noventra.Ai turns your ideas into production-ready full-stack apps, mobile apps, and landing pages — instantly, with no code required.
    </p>
    <div class="hero-actions fade-up delay-3">
      <a href="#cta" class="btn btn-primary btn-lg">Start Building Free</a>
      <a href="#how-it-works" class="btn btn-outline btn-lg">See How It Works</a>
    </div>
    <div class="hero-stats fade-up delay-4">
      <div class="stat">
        <div class="stat-value">10x</div>
        <div class="stat-label">Faster Development</div>
      </div>
      <div class="stat">
        <div class="stat-value">3</div>
        <div class="stat-label">Project Types</div>
      </div>
      <div class="stat">
        <div class="stat-value">∞</div>
        <div class="stat-label">Possibilities</div>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="features" id="features">
    <div class="container">
      <div class="section-header">
        <div class="section-label">Features</div>
        <h2 class="section-title">Everything You Need to <span class="gradient-text">Ship Fast</span></h2>
        <p class="section-subtitle">From idea to deployed app in minutes. Noventra.Ai handles the complexity so you can focus on what matters.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Instant Scaffolding</h3>
          <p>Describe your app and get a complete, production-ready codebase in seconds — not hours.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🧠</div>
          <h3>AI-Powered Intelligence</h3>
          <p>Our AI understands context, best practices, and modern frameworks to generate clean, maintainable code.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Beautiful by Default</h3>
          <p>Every generated app comes with a polished UI, dark mode support, and responsive design out of the box.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔄</div>
          <h3>Iterative Refinement</h3>
          <p>Chat with the AI to refine, extend, and customize your app — just like working with a senior developer.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📦</div>
          <h3>Download & Deploy</h3>
          <p>Download all generated files at once and deploy to any platform — Vercel, Netlify, or your own server.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Secure by Design</h3>
          <p>Built on the Internet Computer with decentralized identity — your sessions and data stay private.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="how-it-works" id="how-it-works">
    <div class="container">
      <div class="section-header">
        <div class="section-label">Process</div>
        <h2 class="section-title">From Idea to App in <span class="gradient-text">4 Steps</span></h2>
        <p class="section-subtitle">No setup, no configuration, no boilerplate. Just describe what you want and watch it come to life.</p>
      </div>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Choose Project Type</h3>
          <p>Select from Full-Stack App, Mobile App, Landing Page, or Custom — whatever fits your vision.</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Describe Your Idea</h3>
          <p>Type a prompt describing what you want to build. Be as detailed or as brief as you like.</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>AI Generates Code</h3>
          <p>Noventra.Ai instantly produces a complete, working codebase tailored to your requirements.</p>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <h3>Refine & Download</h3>
          <p>Chat to iterate, then download all files and deploy your app anywhere in minutes.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- PROJECT TYPES -->
  <section class="project-types" id="project-types">
    <div class="container">
      <div class="section-header">
        <div class="section-label">What We Build</div>
        <h2 class="section-title">Any Project, <span class="gradient-text">Any Platform</span></h2>
        <p class="section-subtitle">Noventra.Ai supports every major project type — from complex full-stack apps to polished landing pages.</p>
      </div>
      <div class="types-grid">
        <div class="type-card">
          <div class="type-icon">🖥️</div>
          <div>
            <h3>Full-Stack Apps</h3>
            <p>React frontend + Motoko backend with authentication, database, and API — fully wired up.</p>
          </div>
        </div>
        <div class="type-card">
          <div class="type-icon">📱</div>
          <div>
            <h3>Mobile Apps</h3>
            <p>React Native scaffolds with navigation, state management, and native device integrations.</p>
          </div>
        </div>
        <div class="type-card">
          <div class="type-icon">🌐</div>
          <div>
            <h3>Landing Pages</h3>
            <p>Conversion-optimized landing pages with hero, features, testimonials, and CTA sections.</p>
          </div>
        </div>
        <div class="type-card">
          <div class="type-icon">⚙️</div>
          <div>
            <h3>Custom Projects</h3>
            <p>Describe anything — dashboards, tools, APIs, games — and Noventra.Ai will build it.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta" id="cta">
    <div class="container">
      <div class="cta-box">
        <h2>Ready to Build <span class="gradient-text">Something Amazing?</span></h2>
        <p>Join thousands of builders using Noventra.Ai to ship apps faster than ever before. No credit card required.</p>
        <div class="cta-actions">
          <a href="#" class="btn btn-primary btn-lg">Start Building Free →</a>
          <a href="#features" class="btn btn-outline btn-lg">Learn More</a>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <p>© <span id="year"></span> Noventra.Ai — Built with ❤️ using <a href="https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=noventra-ai" target="_blank" rel="noopener">caffeine.ai</a></p>
  </footer>

  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
  </script>

</body>
</html>
\`\`\`

\`\`\`css filename=styles.css
/* Additional custom styles — extend as needed */

/* Glassmorphism card utility */
.glass-card {
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
}

/* Glow button */
.btn-glow {
  box-shadow: 0 0 24px rgba(99, 102, 241, 0.4), 0 0 48px rgba(99, 102, 241, 0.15);
}

/* Gradient border */
.gradient-border {
  position: relative;
  border-radius: 12px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  z-index: -1;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #030712; }
::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #374151; }
\`\`\`

\`\`\`json filename=package.json
{
  "name": "noventra-landing-page",
  "version": "1.0.0",
  "description": "Landing page generated by Noventra.Ai",
  "scripts": {
    "start": "npx serve .",
    "build": "echo 'Static site — no build step needed'"
  },
  "keywords": ["landing-page", "noventra-ai"],
  "license": "MIT"
}
\`\`\`

Your landing page is ready! It includes:
- **Hero** — Bold headline with gradient text, stats, and dual CTAs
- **Features** — 6-card grid highlighting Noventra.Ai's capabilities  
- **How It Works** — 4-step process with numbered indicators
- **What We Build** — Project type cards (Full-Stack, Mobile, Landing Page, Custom)
- **CTA** — Conversion-focused call-to-action with glassmorphism styling
- **Footer** — With dynamic year

What would you like to customize? I can adjust the copy, colors, add testimonials, a pricing section, or any other section you need.`;
}

function buildFollowUpResponse(userPrompt: string): string {
  const prompt = userPrompt.toLowerCase();

  if (prompt.includes('hero') || prompt.includes('headline') || prompt.includes('title')) {
    return `Here's an updated Hero section with a more compelling headline:

\`\`\`html filename=hero-section.html
<!-- Replace the existing .hero section in index.html -->
<section class="hero">
  <div class="hero-badge fade-up">✦ Now in Public Beta</div>
  <h1 class="fade-up delay-1">
    Your Next App,<br/>
    <span class="gradient-text">Built in Minutes</span>
  </h1>
  <p class="fade-up delay-2">
    Stop spending weeks on boilerplate. Noventra.Ai generates complete, production-ready apps from a single prompt — full-stack, mobile, or landing page.
  </p>
  <div class="hero-actions fade-up delay-3">
    <a href="#cta" class="btn btn-primary btn-lg">Build Your App Free →</a>
    <a href="#how-it-works" class="btn btn-outline btn-lg">Watch Demo</a>
  </div>
</section>
\`\`\`

What else would you like to update — colors, fonts, or another section?`;
  }

  if (prompt.includes('color') || prompt.includes('theme') || prompt.includes('dark') || prompt.includes('light')) {
    return `Here's a color theme update for your landing page:

\`\`\`css filename=theme.css
/* Paste these variables into the :root block in index.html */
:root {
  /* Dark theme (default) */
  --bg: #030712;
  --surface: #0f172a;
  --surface-2: #1e293b;
  --border: #1e293b;
  --primary: #6366f1;       /* indigo-500 */
  --primary-glow: rgba(99, 102, 241, 0.35);
  --accent: #06b6d4;        /* cyan-500 */
  --accent-glow: rgba(6, 182, 212, 0.3);
  --text: #f8fafc;
  --text-muted: #64748b;
  --radius: 12px;
}

/* Light theme override */
@media (prefers-color-scheme: light) {
  :root {
    --bg: #f8fafc;
    --surface: #ffffff;
    --surface-2: #f1f5f9;
    --border: #e2e8f0;
    --text: #0f172a;
    --text-muted: #64748b;
  }
}
\`\`\`

What else would you like to customize?`;
  }

  if (prompt.includes('testimonial') || prompt.includes('review') || prompt.includes('social proof')) {
    return `Here's a Testimonials section to add social proof:

\`\`\`html filename=testimonials-section.html
<!-- Add this section after the Features section in index.html -->
<section style="background: var(--surface); padding: 6rem 2rem;">
  <div class="container">
    <div class="section-header">
      <div class="section-label">Testimonials</div>
      <h2 class="section-title">Loved by <span class="gradient-text">Builders</span></h2>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
      <div class="feature-card">
        <p style="color: var(--text-muted); margin-bottom: 1.25rem; font-style: italic;">"Noventra.Ai saved me 3 weeks of boilerplate work. I described my SaaS idea and had a working prototype in 20 minutes."</p>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent));"></div>
          <div>
            <div style="font-weight: 600; font-size: 0.9rem;">Alex Chen</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Indie Hacker</div>
          </div>
        </div>
      </div>
      <div class="feature-card">
        <p style="color: var(--text-muted); margin-bottom: 1.25rem; font-style: italic;">"The landing page generator is incredible. I went from zero to a polished, deployed page in under 10 minutes."</p>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #ec4899, #f97316);"></div>
          <div>
            <div style="font-weight: 600; font-size: 0.9rem;">Sarah Kim</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Product Designer</div>
          </div>
        </div>
      </div>
      <div class="feature-card">
        <p style="color: var(--text-muted); margin-bottom: 1.25rem; font-style: italic;">"As a non-technical founder, Noventra.Ai is a game-changer. I can now build and iterate on my MVP without hiring a dev team."</p>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #06b6d4);"></div>
          <div>
            <div style="font-weight: 600; font-size: 0.9rem;">Marcus Johnson</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">Startup Founder</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
\`\`\`

What else would you like to add?`;
  }

  if (prompt.includes('pricing') || prompt.includes('plan') || prompt.includes('price')) {
    return `Here's a Pricing section for your landing page:

\`\`\`html filename=pricing-section.html
<!-- Add this section before the CTA section in index.html -->
<section style="background: var(--bg); padding: 6rem 2rem;">
  <div class="container">
    <div class="section-header">
      <div class="section-label">Pricing</div>
      <h2 class="section-title">Simple, <span class="gradient-text">Transparent Pricing</span></h2>
      <p class="section-subtitle" style="margin: 0 auto;">Start free, scale as you grow. No hidden fees, no surprises.</p>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 900px; margin: 0 auto;">
      <div class="feature-card">
        <h3 style="margin-bottom: 0.5rem;">Free</h3>
        <div style="font-size: 2.5rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; margin: 1rem 0;">$0<span style="font-size: 1rem; color: var(--text-muted);">/mo</span></div>
        <ul style="list-style: none; color: var(--text-muted); font-size: 0.9rem; line-height: 2;">
          <li>✓ 5 projects/month</li>
          <li>✓ All project types</li>
          <li>✓ Download files</li>
          <li>✗ Priority generation</li>
        </ul>
        <a href="#" class="btn btn-outline" style="width: 100%; justify-content: center; margin-top: 1.5rem;">Get Started</a>
      </div>
      <div class="feature-card" style="border-color: rgba(99,102,241,0.5); position: relative;">
        <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 1rem; border-radius: 999px; white-space: nowrap;">MOST POPULAR</div>
        <h3 style="margin-bottom: 0.5rem;">Pro</h3>
        <div style="font-size: 2.5rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif; margin: 1rem 0;">$19<span style="font-size: 1rem; color: var(--text-muted);">/mo</span></div>
        <ul style="list-style: none; color: var(--text-muted); font-size: 0.9rem; line-height: 2;">
          <li>✓ Unlimited projects</li>
          <li>✓ All project types</li>
          <li>✓ Download files</li>
          <li>✓ Priority generation</li>
        </ul>
        <a href="#" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1.5rem;">Start Pro Trial</a>
      </div>
    </div>
  </div>
</section>
\`\`\`

What else would you like to customize?`;
  }

  // Generic follow-up
  return `I can help you customize your landing page further! Here are some things I can update:

**Sections:**
- 🦸 **Hero** — Headline, subtext, CTA buttons, stats
- ✨ **Features** — Add, remove, or rewrite feature cards
- 📋 **How It Works** — Steps and descriptions
- 💬 **Testimonials** — Add social proof section
- 💰 **Pricing** — Add a pricing table
- 📣 **CTA** — Update the call-to-action copy

**Styling:**
- 🎨 **Colors** — Change the color palette or add light mode
- 🔤 **Typography** — Adjust fonts, sizes, weights
- 📐 **Layout** — Change grid columns, spacing, section order
- ✨ **Animations** — Add scroll-triggered animations

**Content:**
- ✍️ **Copy** — Rewrite any section's text
- 🖼️ **Images** — Add placeholder images or icon sets
- 🔗 **Navigation** — Update nav links and logo

Just tell me what you'd like to change and I'll generate the updated code!`;
}

export function generateAIResponse(
  userMessage: string,
  projectType: string,
  messageHistory: Array<{ role: string; content: string }>
): string {
  const isFirstMessage = messageHistory.filter(m => m.role === 'assistant').length === 0;
  const normalizedType = projectType.toLowerCase().trim();

  // Landing page project type — check all possible variations
  const isLandingPage =
    normalizedType === 'landing page' ||
    normalizedType === 'landing' ||
    normalizedType === 'landingpage' ||
    normalizedType.includes('landing');

  if (isLandingPage) {
    if (isFirstMessage) {
      return buildLandingPageScaffold(userMessage);
    } else {
      return buildFollowUpResponse(userMessage);
    }
  }

  // Full-stack app
  const isFullStack =
    normalizedType === 'full-stack app' ||
    normalizedType === 'fullstack' ||
    normalizedType === 'full stack' ||
    normalizedType.includes('full');

  if (isFullStack) {
    if (isFirstMessage) {
      return buildFullStackResponse(userMessage);
    } else {
      return buildFollowUpResponse(userMessage);
    }
  }

  // Mobile app
  const isMobile =
    normalizedType === 'mobile app' ||
    normalizedType === 'mobile' ||
    normalizedType.includes('mobile');

  if (isMobile) {
    if (isFirstMessage) {
      return buildMobileResponse(userMessage);
    } else {
      return buildFollowUpResponse(userMessage);
    }
  }

  // Custom / default
  if (isFirstMessage) {
    return buildCustomResponse(userMessage);
  } else {
    return buildFollowUpResponse(userMessage);
  }
}

function buildFullStackResponse(userPrompt: string): string {
  return `Here's your full-stack app scaffold! This includes a React frontend with TypeScript and a Motoko backend.

\`\`\`typescript filename=src/App.tsx
import { useState } from 'react';

interface Item {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setIsLoading(true);
    try {
      const newItem: Item = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date(),
      };
      setItems(prev => [newItem, ...prev]);
      setTitle('');
      setDescription('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      color: '#f9fafb',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          My Full-Stack App
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Built with Noventra.Ai — React + Motoko on the Internet Computer
        </p>

        {/* Create Form */}
        <div style={{
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', marginBottom: '1rem' }}>
            Create New Item
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
              fontSize: '0.9rem',
              marginBottom: '0.75rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleCreate}
            disabled={isLoading || !title.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              background: isLoading || !title.trim()
                ? '#374151'
                : 'linear-gradient(135deg, #6366f1, #818cf8)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isLoading || !title.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Creating...' : 'Create Item'}
          </button>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280',
            background: '#111827',
            border: '1px dashed #1f2937',
            borderRadius: '12px',
          }}>
            No items yet. Create your first one above!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div key={item.id} style={{
                background: '#111827',
                border: '1px solid #1f2937',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
              }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: '0.35rem' }}>
                  {item.title}
                </h3>
                {item.description && (
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {item.description}
                  </p>
                )}
                <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                  {item.createdAt.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
\`\`\`

\`\`\`motoko filename=backend/main.mo
import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Principal "mo:base/Principal";

actor {
  type Item = {
    id: Text;
    title: Text;
    description: Text;
    createdAt: Int;
    owner: Principal;
  };

  var items: [Item] = [];

  public shared ({ caller }) func createItem(title: Text, description: Text) : async Text {
    let id = Text.concat(Principal.toText(caller), Int.toText(Time.now()));
    let newItem: Item = {
      id;
      title;
      description;
      createdAt = Time.now();
      owner = caller;
    };
    items := Array.append(items, [newItem]);
    id
  };

  public query ({ caller }) func getItems() : async [Item] {
    Array.filter(items, func(item: Item) : Bool {
      item.owner == caller
    })
  };

  public shared ({ caller }) func deleteItem(id: Text) : async () {
    items := Array.filter(items, func(item: Item) : Bool {
      item.id != id or item.owner != caller
    });
  };
}
\`\`\`

\`\`\`json filename=package.json
{
  "name": "my-fullstack-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@dfinity/agent": "^0.20.0",
    "@dfinity/candid": "^0.20.0",
    "@dfinity/principal": "^0.20.0"
  }
}
\`\`\`

Your full-stack scaffold is ready! What would you like to customize — the data model, UI design, or backend logic?`;
}

function buildMobileResponse(userPrompt: string): string {
  return `Here's your React Native mobile app scaffold!

\`\`\`typescript filename=App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface Item {
  id: string;
  title: string;
  completed: boolean;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState('');

  const addItem = () => {
    if (!input.trim()) return;
    setItems(prev => [
      { id: Date.now().toString(), title: input.trim(), completed: false },
      ...prev,
    ]);
    setInput('');
  };

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      <View style={styles.header}>
        <Text style={styles.title}>My Mobile App</Text>
        <Text style={styles.subtitle}>Built with Noventra.Ai</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add new item..."
          placeholderTextColor="#6b7280"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addItem}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addItem}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, item.completed && styles.itemDone]}
            onPress={() => toggleItem(item.id)}
          >
            <Text style={[styles.itemText, item.completed && styles.itemTextDone]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No items yet. Add one above!</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  header: { padding: 24, paddingBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: '#6b7280' },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f9fafb',
    fontSize: 15,
  },
  addBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list: { paddingHorizontal: 16, gap: 10 },
  item: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    padding: 16,
  },
  itemDone: { opacity: 0.5 },
  itemText: { color: '#f9fafb', fontSize: 15 },
  itemTextDone: { textDecorationLine: 'line-through', color: '#6b7280' },
  empty: { textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 15 },
});
\`\`\`

\`\`\`json filename=package.json
{
  "name": "my-mobile-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/stack": "^6.0.0"
  }
}
\`\`\`

Your mobile app scaffold is ready! What would you like to customize — navigation, screens, or the data model?`;
}

function buildCustomResponse(userPrompt: string): string {
  return `Here's a custom project scaffold based on your description!

\`\`\`typescript filename=src/App.tsx
import { useState, useEffect } from 'react';

interface AppState {
  isLoading: boolean;
  data: unknown[];
  error: string | null;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    data: [],
    error: null,
  });

  useEffect(() => {
    // Initialize your app here
    console.log('App initialized');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      color: '#f9fafb',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '2.5rem',
        fontWeight: 700,
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
      }}>
        Custom Project
      </h1>
      <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '500px', marginBottom: '2rem' }}>
        Built with Noventra.Ai — describe what you want to build and I'll generate the code.
      </p>
      {state.isLoading && (
        <div style={{ color: '#6366f1' }}>Loading...</div>
      )}
      {state.error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          color: '#fca5a5',
        }}>
          {state.error}
        </div>
      )}
    </div>
  );
}
\`\`\`

\`\`\`css filename=src/styles.css
/* Custom project styles */
* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #030712;
  --surface: #111827;
  --primary: #6366f1;
  --accent: #06b6d4;
  --text: #f9fafb;
  --muted: #6b7280;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
}
\`\`\`

What would you like to build? Describe the features, data model, or UI you have in mind and I'll generate the complete implementation!`;
}

export function extractFilesFromResponse(response: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Match fenced code blocks with filename annotation
  // Supports: ```lang filename=foo.ext, ```lang filepath=foo.ext, or just ```filename=foo.ext
  const fenceRegex = /```(?:\w+\s+)?(?:filename|filepath)=([^\s\n]+)\n([\s\S]*?)```/g;
  let match;

  while ((match = fenceRegex.exec(response)) !== null) {
    const filename = match[1].trim();
    const content = match[2].trim();
    if (filename && content) {
      files.push({ filename, content });
    }
  }

  // Fallback: match ```lang\n...``` blocks without filename and assign generic names
  if (files.length === 0) {
    const genericRegex = /```(\w+)\n([\s\S]*?)```/g;
    let idx = 0;
    while ((match = genericRegex.exec(response)) !== null) {
      const lang = match[1].toLowerCase();
      const content = match[2].trim();
      if (content && lang !== 'bash' && lang !== 'sh' && lang !== 'shell') {
        const ext: Record<string, string> = {
          typescript: 'ts', tsx: 'tsx', javascript: 'js', jsx: 'jsx',
          html: 'html', css: 'css', json: 'json', motoko: 'mo',
        };
        const extension = ext[lang] || lang;
        files.push({ filename: `file-${idx++}.${extension}`, content });
      }
    }
  }

  return files;
}
