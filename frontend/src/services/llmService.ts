export interface GeneratedFile {
  filename: string;
  content: string;
}

export interface AIResponse {
  message: string;
  files: GeneratedFile[];
}

function normalizeProjectType(raw: string): string {
  const lower = raw.toLowerCase().trim();
  if (lower.includes('landing')) return 'landing';
  if (lower.includes('full') || lower.includes('stack')) return 'fullstack';
  if (lower.includes('mobile')) return 'mobile';
  if (lower.includes('api') || lower.includes('backend')) return 'api';
  return 'landing';
}

function buildLandingPageScaffold(projectName: string): GeneratedFile[] {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #050510;
      --surface: #0d0d1f;
      --accent: #6366f1;
      --accent2: #22d3ee;
      --text: #e2e8f0;
      --muted: #64748b;
    }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 5%; border-bottom: 1px solid rgba(99,102,241,0.15); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; background: rgba(5,5,16,0.8); }
    .logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.25rem; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
    .nav-links a:hover { color: var(--text); }
    .btn { display: inline-block; padding: 0.65rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; text-decoration: none; transition: all 0.2s; }
    .btn-primary { background: linear-gradient(135deg, var(--accent), #818cf8); color: #fff; border: none; box-shadow: 0 0 20px rgba(99,102,241,0.4); }
    .btn-primary:hover { box-shadow: 0 0 32px rgba(99,102,241,0.6); transform: translateY(-1px); }
    .btn-outline { background: transparent; color: var(--text); border: 1px solid rgba(99,102,241,0.4); }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
    .hero { text-align: center; padding: 7rem 5% 5rem; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); pointer-events: none; }
    .badge { display: inline-block; padding: 0.35rem 1rem; border-radius: 999px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: var(--accent2); font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; letter-spacing: 0.05em; text-transform: uppercase; }
    .hero h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; line-height: 1.1; margin-bottom: 1.5rem; }
    .hero h1 span { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: 1.15rem; color: var(--muted); max-width: 560px; margin: 0 auto 2.5rem; }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .features { padding: 5rem 5%; }
    .section-title { text-align: center; margin-bottom: 3rem; }
    .section-title h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; margin-bottom: 0.75rem; }
    .section-title p { color: var(--muted); max-width: 480px; margin: 0 auto; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .card { background: rgba(13,13,31,0.8); border: 1px solid rgba(99,102,241,0.15); border-radius: 16px; padding: 2rem; backdrop-filter: blur(12px); transition: border-color 0.2s, transform 0.2s; }
    .card:hover { border-color: rgba(99,102,241,0.4); transform: translateY(-4px); }
    .card-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.2)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1rem; }
    .card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .card p { color: var(--muted); font-size: 0.9rem; }
    .cta { text-align: center; padding: 6rem 5%; background: radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%); }
    .cta h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 1rem; }
    .cta p { color: var(--muted); margin-bottom: 2rem; font-size: 1.05rem; }
    footer { text-align: center; padding: 2rem 5%; border-top: 1px solid rgba(99,102,241,0.1); color: var(--muted); font-size: 0.85rem; }
    footer a { color: var(--accent2); text-decoration: none; }
  </style>
</head>
<body>
  <nav>
    <div class="logo">${projectName}</div>
    <ul class="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#how">How it works</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>
    <a href="#" class="btn btn-primary">Get Started</a>
  </nav>

  <section class="hero">
    <div class="badge">✦ Now in Beta</div>
    <h1>Build <span>Faster</span> Than<br/>Ever Before</h1>
    <p>The all-in-one platform that helps you ship beautiful products with AI-powered tools and seamless workflows.</p>
    <div class="hero-actions">
      <a href="#" class="btn btn-primary">Start for Free →</a>
      <a href="#" class="btn btn-outline">Watch Demo</a>
    </div>
  </section>

  <section class="features" id="features">
    <div class="section-title">
      <h2>Everything You Need</h2>
      <p>Powerful features designed to accelerate your workflow from idea to launch.</p>
    </div>
    <div class="grid-3">
      <div class="card">
        <div class="card-icon">⚡</div>
        <h3>Lightning Fast</h3>
        <p>Optimized performance at every layer. Ship products that users love with blazing speed.</p>
      </div>
      <div class="card">
        <div class="card-icon">🎨</div>
        <h3>Beautiful Design</h3>
        <p>Stunning UI components and design systems that make your product stand out.</p>
      </div>
      <div class="card">
        <div class="card-icon">🔒</div>
        <h3>Secure by Default</h3>
        <p>Enterprise-grade security built in from day one. Your data is always protected.</p>
      </div>
      <div class="card">
        <div class="card-icon">🤖</div>
        <h3>AI-Powered</h3>
        <p>Intelligent automation that learns from your workflow and helps you work smarter.</p>
      </div>
      <div class="card">
        <div class="card-icon">📊</div>
        <h3>Analytics</h3>
        <p>Deep insights into your product's performance with real-time dashboards.</p>
      </div>
      <div class="card">
        <div class="card-icon">🌐</div>
        <h3>Global Scale</h3>
        <p>Deploy anywhere in the world with our distributed infrastructure.</p>
      </div>
    </div>
  </section>

  <section class="cta" id="pricing">
    <h2>Ready to Get Started?</h2>
    <p>Join thousands of teams already building with ${projectName}.</p>
    <a href="#" class="btn btn-primary">Start Building Free →</a>
  </section>

  <footer>
    <p>© ${new Date().getFullYear()} ${projectName}. All rights reserved.</p>
  </footer>
</body>
</html>`;

  return [{ filename: 'index.html', content: html }];
}

function buildFullStackScaffold(projectName: string): GeneratedFile[] {
  return [
    {
      filename: 'App.tsx',
      content: `import React, { useState } from 'react';

// ${projectName} - Full Stack App
export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>${projectName}</h1>
      <p>Your full-stack application is ready to build.</p>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
    </div>
  );
}`,
    },
  ];
}

function buildMobileScaffold(projectName: string): GeneratedFile[] {
  return [
    {
      filename: 'App.tsx',
      content: `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// ${projectName} - Mobile App
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${projectName}</Text>
      <Text style={styles.subtitle}>Your mobile app is ready to build.</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#050510' },
  title: { fontSize: 28, fontWeight: '700', color: '#e2e8f0', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 32 },
  button: { backgroundColor: '#6366f1', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});`,
    },
  ];
}

function buildApiScaffold(projectName: string): GeneratedFile[] {
  return [
    {
      filename: 'server.ts',
      content: `import express from 'express';

// ${projectName} - API Backend
const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: '${projectName}' });
});

app.get('/api/items', (_req, res) => {
  res.json({ items: [], total: 0 });
});

app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  res.status(201).json(item);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`${projectName} running on port \${PORT}\`));`,
    },
  ];
}

export function generateAIResponse(userMessage: string, projectName: string, projectType: string): AIResponse {
  const type = normalizeProjectType(projectType);
  const lowerMsg = userMessage.toLowerCase();

  const isInitialRequest =
    lowerMsg.includes('create') ||
    lowerMsg.includes('build') ||
    lowerMsg.includes('generate') ||
    lowerMsg.includes('make') ||
    lowerMsg.includes('start') ||
    lowerMsg.includes('scaffold') ||
    lowerMsg.includes('hello') ||
    lowerMsg.includes('hi') ||
    lowerMsg.length < 30;

  if (isInitialRequest) {
    let files: GeneratedFile[] = [];
    let description = '';

    switch (type) {
      case 'landing':
        files = buildLandingPageScaffold(projectName);
        description = `I've generated a complete landing page for **${projectName}**! 🎉

The scaffold includes:
- **Sticky navigation** with logo and CTA button
- **Hero section** with gradient headline and call-to-action buttons
- **Features grid** with 6 feature cards and hover effects
- **CTA section** with radial glow background
- **Footer** with copyright

The design uses a dark theme with indigo/cyan accents, glassmorphism cards, and Space Grotesk typography. You can preview it live using the **Preview** tab above.

Feel free to ask me to:
- Change the color scheme
- Add a pricing section
- Update the copy and headlines
- Add animations or interactions`;
        break;

      case 'fullstack':
        files = buildFullStackScaffold(projectName);
        description = `I've scaffolded a full-stack React application for **${projectName}**! 🚀

The scaffold includes a basic React component with state management. Ask me to add:
- Authentication flow
- API integration
- Database models
- UI components`;
        break;

      case 'mobile':
        files = buildMobileScaffold(projectName);
        description = `I've scaffolded a React Native mobile app for **${projectName}**! 📱

The scaffold includes a basic screen with navigation-ready structure. Ask me to add:
- Navigation stack
- Authentication screens
- API integration
- Custom components`;
        break;

      case 'api':
        files = buildApiScaffold(projectName);
        description = `I've scaffolded an Express API backend for **${projectName}**! ⚡

The scaffold includes health check and CRUD endpoints. Ask me to add:
- Authentication middleware
- Database integration
- Input validation
- Rate limiting`;
        break;

      default:
        files = buildLandingPageScaffold(projectName);
        description = `I've generated a landing page scaffold for **${projectName}**! You can preview it in the Preview tab.`;
    }

    return { message: description, files };
  }

  // Conversational response for follow-up messages
  const responses = [
    `Great idea! I can help you enhance **${projectName}**. Could you be more specific about what you'd like to change? For example:\n- Update the hero headline\n- Add a new section\n- Change the color scheme\n- Add animations`,
    `I understand you want to improve **${projectName}**. Let me know the specific section or feature you'd like to modify and I'll generate the updated code for you.`,
    `Happy to help with **${projectName}**! To make the best changes, could you describe:\n1. Which section to modify\n2. What the new content should be\n3. Any specific styling preferences`,
  ];

  return {
    message: responses[Math.floor(Math.random() * responses.length)],
    files: [],
  };
}

export function extractFilesFromResponse(content: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const codeBlockRegex = /```(?:\w+)?\s+(?:filename=|filepath=)?["']?([^\s"'\n]+)["']?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const filename = match[1].trim();
    const fileContent = match[2].trim();
    if (filename && fileContent) {
      files.push({ filename, content: fileContent });
    }
  }

  return files;
}
