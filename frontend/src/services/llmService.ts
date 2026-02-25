export type ProjectType = 'landing' | 'fullstack' | 'mobile' | 'api';

interface GenerateOptions {
  sessionName: string;
  projectType: ProjectType;
  userMessage: string;
  previousMessages?: Array<{ role: string; content: string }>;
  existingHtml?: string;
}

function scaffoldLandingPage(name: string, description: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0a0a0f;
      --surface: #12121a;
      --primary: #ff6b35;
      --accent: #00d4ff;
      --text: #e8e8f0;
      --muted: #6b6b80;
    }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; }
    header {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      background: rgba(10,10,15,0.9);
      z-index: 100;
    }
    .logo { font-size: 1.4rem; font-weight: 700; color: var(--primary); }
    nav a { color: var(--muted); text-decoration: none; margin-left: 2rem; transition: color 0.2s; }
    nav a:hover { color: var(--text); }
    .hero {
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 2rem;
      background: radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.15) 0%, transparent 60%);
    }
    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #ff6b35, #ff9a6c, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero p { font-size: 1.2rem; color: var(--muted); max-width: 600px; margin-bottom: 2.5rem; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 2rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      border: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, #ff6b35, #e55a28);
      color: white;
      box-shadow: 0 0 30px rgba(255,107,53,0.4);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(255,107,53,0.6); }
    .features {
      padding: 6rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .features h2 { text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 3rem; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
    .feature-card {
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.3s;
    }
    .feature-card:hover { border-color: rgba(255,107,53,0.4); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .feature-card h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--text); }
    .feature-card p { color: var(--muted); font-size: 0.95rem; }
    footer {
      text-align: center;
      padding: 3rem 2rem;
      border-top: 1px solid rgba(255,255,255,0.08);
      color: var(--muted);
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">${name}</div>
    <nav>
      <a href="#features">Features</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  <section class="hero">
    <h1>${description || name}</h1>
    <p>The next generation platform built for the future. Fast, reliable, and beautifully designed.</p>
    <a href="#features" class="btn btn-primary">Get Started →</a>
  </section>
  <section class="features" id="features">
    <h2>Why Choose Us</h2>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>Lightning Fast</h3>
        <p>Optimized for performance with sub-second load times and smooth interactions.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Secure by Default</h3>
        <p>Enterprise-grade security built in from the ground up, not bolted on.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>Beautiful Design</h3>
        <p>Crafted with attention to detail for an exceptional user experience.</p>
      </div>
    </div>
  </section>
  <footer>
    <p>© ${new Date().getFullYear()} ${name}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

function scaffoldFullstack(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} App</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; color: #e8e8f0; font-family: 'Inter', system-ui, sans-serif; display: flex; height: 100vh; overflow: hidden; }
    .sidebar { width: 240px; background: #12121a; border-right: 1px solid rgba(255,255,255,0.08); padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-logo { font-size: 1.2rem; font-weight: 700; color: #ff6b35; padding: 0.5rem; margin-bottom: 1rem; }
    .nav-item { padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; color: #6b6b80; transition: all 0.2s; font-size: 0.9rem; }
    .nav-item:hover, .nav-item.active { background: rgba(255,107,53,0.1); color: #ff6b35; }
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar { padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; }
    .topbar h1 { font-size: 1.2rem; font-weight: 600; }
    .content { flex: 1; padding: 2rem; overflow-y: auto; }
    .card { background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }
    .card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .card p { color: #6b6b80; font-size: 0.9rem; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat { background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; text-align: center; }
    .stat-value { font-size: 2rem; font-weight: 700; color: #ff6b35; }
    .stat-label { color: #6b6b80; font-size: 0.85rem; margin-top: 0.25rem; }
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="sidebar-logo">${name}</div>
    <div class="nav-item active">📊 Dashboard</div>
    <div class="nav-item">👥 Users</div>
    <div class="nav-item">📦 Products</div>
    <div class="nav-item">📈 Analytics</div>
    <div class="nav-item">⚙️ Settings</div>
  </aside>
  <div class="main">
    <div class="topbar">
      <h1>Dashboard</h1>
      <button style="background: linear-gradient(135deg, #ff6b35, #e55a28); color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 8px; cursor: pointer; font-weight: 600;">+ New</button>
    </div>
    <div class="content">
      <div class="stats">
        <div class="stat"><div class="stat-value">1,284</div><div class="stat-label">Total Users</div></div>
        <div class="stat"><div class="stat-value">$48.2K</div><div class="stat-label">Revenue</div></div>
        <div class="stat"><div class="stat-value">98.5%</div><div class="stat-label">Uptime</div></div>
      </div>
      <div class="card"><h3>Recent Activity</h3><p>Your latest updates and notifications will appear here.</p></div>
      <div class="card"><h3>Quick Actions</h3><p>Manage your ${name} application from this dashboard.</p></div>
    </div>
  </div>
</body>
</html>`;
}

function scaffoldMobile(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; color: #e8e8f0; font-family: 'Inter', system-ui, sans-serif; max-width: 390px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; }
    .status-bar { padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; font-size: 0.8rem; color: #6b6b80; }
    .header { padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }
    .header h1 { font-size: 1.5rem; font-weight: 700; }
    .content { flex: 1; padding: 1rem 1.5rem; overflow-y: auto; }
    .card { background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.25rem; margin-bottom: 1rem; }
    .card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .card p { color: #6b6b80; font-size: 0.875rem; }
    .tab-bar { padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-around; background: #12121a; }
    .tab { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; color: #6b6b80; font-size: 0.75rem; cursor: pointer; transition: color 0.2s; }
    .tab.active { color: #ff6b35; }
    .tab-icon { font-size: 1.4rem; }
    .hero-card { background: linear-gradient(135deg, rgba(255,107,53,0.2), rgba(0,212,255,0.1)); border: 1px solid rgba(255,107,53,0.3); border-radius: 20px; padding: 2rem; margin-bottom: 1.5rem; text-align: center; }
    .hero-card h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .hero-card p { color: #6b6b80; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="status-bar"><span>9:41</span><span>●●●</span></div>
  <div class="header"><h1>${name}</h1><span style="font-size: 1.5rem; cursor: pointer;">🔔</span></div>
  <div class="content">
    <div class="hero-card">
      <h2>Welcome Back!</h2>
      <p>Here's what's happening with your ${name} today.</p>
    </div>
    <div class="card"><h3>📊 Today's Stats</h3><p>Your activity summary for today.</p></div>
    <div class="card"><h3>🎯 Quick Actions</h3><p>Tap to perform common tasks quickly.</p></div>
    <div class="card"><h3>📱 Recent Updates</h3><p>Latest changes and notifications.</p></div>
  </div>
  <div class="tab-bar">
    <div class="tab active"><div class="tab-icon">🏠</div><span>Home</span></div>
    <div class="tab"><div class="tab-icon">🔍</div><span>Search</span></div>
    <div class="tab"><div class="tab-icon">➕</div><span>Add</span></div>
    <div class="tab"><div class="tab-icon">💬</div><span>Chat</span></div>
    <div class="tab"><div class="tab-icon">👤</div><span>Profile</span></div>
  </div>
</body>
</html>`;
}

function scaffoldApi(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} API Docs</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; color: #e8e8f0; font-family: 'JetBrains Mono', 'Fira Code', monospace; }
    .header { padding: 2rem; border-bottom: 1px solid rgba(255,255,255,0.08); background: #12121a; }
    .header h1 { font-size: 1.8rem; font-weight: 700; color: #ff6b35; }
    .header p { color: #6b6b80; margin-top: 0.5rem; font-size: 0.9rem; }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
    .endpoint { background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; margin-bottom: 1.5rem; overflow: hidden; }
    .endpoint-header { padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .method { padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700; }
    .get { background: rgba(0,212,255,0.2); color: #00d4ff; }
    .post { background: rgba(255,107,53,0.2); color: #ff6b35; }
    .put { background: rgba(255,200,0,0.2); color: #ffc800; }
    .delete { background: rgba(255,50,50,0.2); color: #ff3232; }
    .path { font-size: 0.95rem; color: #e8e8f0; }
    .endpoint-body { padding: 1.5rem; }
    .endpoint-body p { color: #6b6b80; font-size: 0.875rem; margin-bottom: 1rem; }
    .code-block { background: #0a0a0f; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 1rem; font-size: 0.8rem; color: #00d4ff; overflow-x: auto; }
    .base-url { background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.3); border-radius: 8px; padding: 1rem 1.5rem; margin-bottom: 2rem; font-size: 0.9rem; }
    .base-url span { color: #ff6b35; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${name} API</h1>
    <p>RESTful API documentation — v1.0.0</p>
  </div>
  <div class="container">
    <div class="base-url">Base URL: <span>https://api.${name.toLowerCase().replace(/\s+/g, '')}.com/v1</span></div>
    <div class="endpoint">
      <div class="endpoint-header"><span class="method get">GET</span><span class="path">/users</span></div>
      <div class="endpoint-body"><p>Returns a list of all users in the system.</p><div class="code-block">{ "users": [...], "total": 100, "page": 1 }</div></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-header"><span class="method post">POST</span><span class="path">/users</span></div>
      <div class="endpoint-body"><p>Creates a new user account.</p><div class="code-block">{ "name": "string", "email": "string", "role": "user" }</div></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-header"><span class="method put">PUT</span><span class="path">/users/:id</span></div>
      <div class="endpoint-body"><p>Updates an existing user by ID.</p><div class="code-block">{ "id": "string", "name": "string", "email": "string" }</div></div>
    </div>
    <div class="endpoint">
      <div class="endpoint-header"><span class="method delete">DELETE</span><span class="path">/users/:id</span></div>
      <div class="endpoint-body"><p>Deletes a user account permanently.</p><div class="code-block">{ "success": true, "message": "User deleted" }</div></div>
    </div>
  </div>
</body>
</html>`;
}

export function applyModificationToHtml(existingHtml: string, instruction: string): string {
  const lower = instruction.toLowerCase();

  // Color changes
  if (lower.includes('dark') && !existingHtml.includes('background: #0a0a0f')) {
    return existingHtml.replace(/background:\s*#[a-fA-F0-9]{3,6}/g, 'background: #0a0a0f')
      .replace(/background-color:\s*#[a-fA-F0-9]{3,6}/g, 'background-color: #0a0a0f');
  }

  // Add animations
  if (lower.includes('animat') || lower.includes('transition')) {
    const animStyle = `
    <style>
      * { transition: all 0.3s ease; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      section, .card, .feature-card { animation: fadeIn 0.6s ease forwards; }
    </style>`;
    return existingHtml.replace('</head>', animStyle + '</head>');
  }

  // Add pricing section
  if (lower.includes('pricing') || lower.includes('plan')) {
    const pricingSection = `
  <section style="padding: 6rem 2rem; background: #0d0d14;">
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Simple Pricing</h2>
      <p style="color: #6b6b80; margin-bottom: 3rem;">Choose the plan that works for you</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 900px; margin: 0 auto;">
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem;">
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">Starter</h3>
          <div style="font-size: 2.5rem; font-weight: 800; color: #ff6b35; margin: 1rem 0;">$0<span style="font-size: 1rem; color: #6b6b80;">/mo</span></div>
          <p style="color: #6b6b80; font-size: 0.9rem;">Perfect for getting started</p>
        </div>
        <div style="background: linear-gradient(135deg, rgba(255,107,53,0.15), rgba(0,212,255,0.1)); border: 1px solid rgba(255,107,53,0.4); border-radius: 16px; padding: 2rem;">
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">Pro</h3>
          <div style="font-size: 2.5rem; font-weight: 800; color: #ff6b35; margin: 1rem 0;">$29<span style="font-size: 1rem; color: #6b6b80;">/mo</span></div>
          <p style="color: #6b6b80; font-size: 0.9rem;">For growing teams</p>
        </div>
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem;">
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">Enterprise</h3>
          <div style="font-size: 2.5rem; font-weight: 800; color: #ff6b35; margin: 1rem 0;">Custom</div>
          <p style="color: #6b6b80; font-size: 0.9rem;">For large organizations</p>
        </div>
      </div>
    </div>
  </section>`;
    return existingHtml.replace('</body>', pricingSection + '</body>');
  }

  // Add testimonials
  if (lower.includes('testimonial') || lower.includes('review')) {
    const testimonialsSection = `
  <section style="padding: 6rem 2rem; background: #0d0d14;">
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">What People Say</h2>
      <p style="color: #6b6b80; margin-bottom: 3rem;">Trusted by thousands of developers worldwide</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem; text-align: left;">
          <p style="color: #e8e8f0; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem;">"This is absolutely incredible. It changed the way I build products entirely."</p>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35, #e55a28); display: flex; align-items: center; justify-content: center; font-weight: 700;">A</div>
            <div><div style="font-weight: 600; font-size: 0.9rem;">Alex Johnson</div><div style="color: #6b6b80; font-size: 0.8rem;">Senior Developer</div></div>
          </div>
        </div>
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem; text-align: left;">
          <p style="color: #e8e8f0; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem;">"The speed and quality of output is unmatched. Our team ships 10x faster now."</p>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #00d4ff, #0099cc); display: flex; align-items: center; justify-content: center; font-weight: 700;">S</div>
            <div><div style="font-weight: 600; font-size: 0.9rem;">Sarah Chen</div><div style="color: #6b6b80; font-size: 0.8rem;">Product Manager</div></div>
          </div>
        </div>
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem; text-align: left;">
          <p style="color: #e8e8f0; font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem;">"I went from idea to deployed product in a single afternoon. Mind-blowing."</p>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35, #00d4ff); display: flex; align-items: center; justify-content: center; font-weight: 700;">M</div>
            <div><div style="font-weight: 600; font-size: 0.9rem;">Marcus Williams</div><div style="color: #6b6b80; font-size: 0.8rem;">Startup Founder</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
    return existingHtml.replace('</body>', testimonialsSection + '</body>');
  }

  // Add FAQ section
  if (lower.includes('faq') || lower.includes('question')) {
    const faqSection = `
  <section style="padding: 6rem 2rem;">
    <div style="max-width: 800px; margin: 0 auto;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; text-align: center;">Frequently Asked Questions</h2>
      <p style="color: #6b6b80; margin-bottom: 3rem; text-align: center;">Everything you need to know</p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: #ff6b35;">How does it work?</h3>
          <p style="color: #6b6b80; font-size: 0.9rem; line-height: 1.6;">Simply describe what you want to build, and our AI generates complete, production-ready code instantly.</p>
        </div>
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: #ff6b35;">Is it free to use?</h3>
          <p style="color: #6b6b80; font-size: 0.9rem; line-height: 1.6;">We offer a generous free tier to get you started. Upgrade for unlimited projects and advanced features.</p>
        </div>
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: #ff6b35;">Can I export my code?</h3>
          <p style="color: #6b6b80; font-size: 0.9rem; line-height: 1.6;">Yes! All generated code is yours to keep. Export, modify, and deploy anywhere you like.</p>
        </div>
      </div>
    </div>
  </section>`;
    return existingHtml.replace('</body>', faqSection + '</body>');
  }

  // Add stats/numbers section
  if (lower.includes('stat') || lower.includes('number') || lower.includes('metric')) {
    const statsSection = `
  <section style="padding: 4rem 2rem; background: #0d0d14; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06);">
    <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
      <div><div style="font-size: 3rem; font-weight: 800; color: #ff6b35; line-height: 1;">10K+</div><div style="color: #6b6b80; margin-top: 0.5rem; font-size: 0.9rem;">Active Users</div></div>
      <div><div style="font-size: 3rem; font-weight: 800; color: #ff6b35; line-height: 1;">50K+</div><div style="color: #6b6b80; margin-top: 0.5rem; font-size: 0.9rem;">Projects Built</div></div>
      <div><div style="font-size: 3rem; font-weight: 800; color: #ff6b35; line-height: 1;">99.9%</div><div style="color: #6b6b80; margin-top: 0.5rem; font-size: 0.9rem;">Uptime</div></div>
      <div><div style="font-size: 3rem; font-weight: 800; color: #ff6b35; line-height: 1;">4.9★</div><div style="color: #6b6b80; margin-top: 0.5rem; font-size: 0.9rem;">User Rating</div></div>
    </div>
  </section>`;
    return existingHtml.replace('</body>', statsSection + '</body>');
  }

  // Add contact section
  if (lower.includes('contact') || lower.includes('form') || lower.includes('email')) {
    const contactSection = `
  <section style="padding: 6rem 2rem;" id="contact">
    <div style="max-width: 600px; margin: 0 auto; text-align: center;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Get In Touch</h2>
      <p style="color: #6b6b80; margin-bottom: 3rem;">Have questions? We'd love to hear from you.</p>
      <form style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #e8e8f0;">Name</label>
          <input type="text" placeholder="Your name" style="width: 100%; padding: 0.875rem 1rem; background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e8e8f0; font-size: 0.95rem; outline: none;" />
        </div>
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #e8e8f0;">Email</label>
          <input type="email" placeholder="your@email.com" style="width: 100%; padding: 0.875rem 1rem; background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e8e8f0; font-size: 0.95rem; outline: none;" />
        </div>
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #e8e8f0;">Message</label>
          <textarea placeholder="Your message..." rows="5" style="width: 100%; padding: 0.875rem 1rem; background: #12121a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e8e8f0; font-size: 0.95rem; outline: none; resize: vertical;"></textarea>
        </div>
        <button type="submit" style="background: linear-gradient(135deg, #ff6b35, #e55a28); color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s;">Send Message</button>
      </form>
    </div>
  </section>`;
    return existingHtml.replace('</body>', contactSection + '</body>');
  }

  // Add how it works section
  if (lower.includes('how it works') || lower.includes('steps') || lower.includes('process')) {
    const howItWorksSection = `
  <section style="padding: 6rem 2rem; background: #0d0d14;">
    <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">How It Works</h2>
      <p style="color: #6b6b80; margin-bottom: 4rem;">Get started in three simple steps</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
        <div style="position: relative;">
          <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35, #e55a28); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; margin: 0 auto 1.5rem;">1</div>
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.75rem;">Describe Your Idea</h3>
          <p style="color: #6b6b80; font-size: 0.9rem; line-height: 1.6;">Tell us what you want to build in plain English. No technical jargon needed.</p>
        </div>
        <div>
          <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35, #e55a28); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; margin: 0 auto 1.5rem;">2</div>
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.75rem;">AI Generates Code</h3>
          <p style="color: #6b6b80; font-size: 0.9rem; line-height: 1.6;">Our AI instantly creates complete, production-ready code tailored to your needs.</p>
        </div>
        <div>
          <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35, #e55a28); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; margin: 0 auto 1.5rem;">3</div>
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.75rem;">Launch & Iterate</h3>
          <p style="color: #6b6b80; font-size: 0.9rem; line-height: 1.6;">Preview, refine, and deploy your project. Keep iterating with AI assistance.</p>
        </div>
      </div>
    </div>
  </section>`;
    return existingHtml.replace('</body>', howItWorksSection + '</body>');
  }

  // Add developer/technical features section
  if (lower.includes('developer') || lower.includes('technical') || lower.includes('api') || lower.includes('integration')) {
    const devSection = `
  <section style="padding: 6rem 2rem;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
        <div>
          <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">Built for Developers</h2>
          <p style="color: #6b6b80; margin-bottom: 2rem; line-height: 1.7;">Everything you need to build, deploy, and scale modern applications with confidence.</p>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 1rem;">
            <li style="display: flex; align-items: center; gap: 0.75rem; color: #e8e8f0;"><span style="color: #ff6b35; font-size: 1.2rem;">✓</span> RESTful API with full documentation</li>
            <li style="display: flex; align-items: center; gap: 0.75rem; color: #e8e8f0;"><span style="color: #ff6b35; font-size: 1.2rem;">✓</span> TypeScript & JavaScript SDKs</li>
            <li style="display: flex; align-items: center; gap: 0.75rem; color: #e8e8f0;"><span style="color: #ff6b35; font-size: 1.2rem;">✓</span> Webhooks & real-time events</li>
            <li style="display: flex; align-items: center; gap: 0.75rem; color: #e8e8f0;"><span style="color: #ff6b35; font-size: 1.2rem;">✓</span> CI/CD pipeline integrations</li>
          </ul>
        </div>
        <div style="background: #12121a; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 2rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">
          <div style="color: #6b6b80; margin-bottom: 1rem;">// Quick start</div>
          <div style="color: #00d4ff;">import</div><span style="color: #e8e8f0;"> { Client } </span><div style="color: #00d4ff; display: inline;">from</div><span style="color: #ff6b35;"> 'sdk'</span><span style="color: #e8e8f0;">;</span>
          <br/><br/>
          <div style="color: #e8e8f0;"><span style="color: #00d4ff;">const</span> client = <span style="color: #00d4ff;">new</span> <span style="color: #ff6b35;">Client</span>({</div>
          <div style="color: #e8e8f0; padding-left: 1rem;">apiKey: <span style="color: #ff6b35;">'your-key'</span></div>
          <div style="color: #e8e8f0;">});</div>
          <br/>
          <div style="color: #e8e8f0;"><span style="color: #00d4ff;">await</span> client.<span style="color: #ff6b35;">build</span>({</div>
          <div style="color: #e8e8f0; padding-left: 1rem;">prompt: <span style="color: #ff6b35;">'Build a dashboard'</span></div>
          <div style="color: #e8e8f0;">});</div>
        </div>
      </div>
    </div>
  </section>`;
    return existingHtml.replace('</body>', devSection + '</body>');
  }

  // Generic enhancement: add a new section based on the instruction
  const genericSection = `
  <section style="padding: 6rem 2rem; background: #0d0d14;">
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
      <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">${instruction.length > 50 ? 'New Section' : instruction}</h2>
      <p style="color: #6b6b80; margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">Enhanced with the latest features and improvements for a better experience.</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
        <div style="background: #12121a; border: 1px solid rgba(255,107,53,0.2); border-radius: 16px; padding: 2rem;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">🚀</div>
          <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Fast & Reliable</h3>
          <p style="color: #6b6b80; font-size: 0.875rem;">Built for performance and reliability at scale.</p>
        </div>
        <div style="background: #12121a; border: 1px solid rgba(255,107,53,0.2); border-radius: 16px; padding: 2rem;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">💡</div>
          <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Smart & Intuitive</h3>
          <p style="color: #6b6b80; font-size: 0.875rem;">Designed to be easy to use from day one.</p>
        </div>
        <div style="background: #12121a; border: 1px solid rgba(255,107,53,0.2); border-radius: 16px; padding: 2rem;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">🔐</div>
          <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Secure by Design</h3>
          <p style="color: #6b6b80; font-size: 0.875rem;">Your data is protected with enterprise-grade security.</p>
        </div>
      </div>
    </div>
  </section>`;
  return existingHtml.replace('</body>', genericSection + '</body>');
}

export async function generateAIResponse(options: GenerateOptions): Promise<string> {
  const { sessionName, projectType, userMessage, previousMessages = [], existingHtml } = options;

  // If we have existing HTML and this is a follow-up message, apply modifications
  if (existingHtml && previousMessages.length > 0) {
    const modified = applyModificationToHtml(existingHtml, userMessage);
    return `I've updated your ${sessionName} project based on your request: "${userMessage}". The changes have been applied to your live preview.`;
  }

  // First message - scaffold based on project type
  let html: string;
  switch (projectType) {
    case 'landing':
      html = scaffoldLandingPage(sessionName, userMessage);
      break;
    case 'fullstack':
      html = scaffoldFullstack(sessionName);
      break;
    case 'mobile':
      html = scaffoldMobile(sessionName);
      break;
    case 'api':
      html = scaffoldApi(sessionName);
      break;
    default:
      html = scaffoldLandingPage(sessionName, userMessage);
  }

  return `I've created your ${sessionName} ${projectType} project! Here's what I built:\n\n\`\`\`html\n${html}\n\`\`\`\n\nYou can see the live preview on the right. Let me know if you'd like any changes!`;
}

export function extractHtmlFromMessage(content: string): string | null {
  const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/);
  if (htmlMatch) return htmlMatch[1];

  // Check if content itself is HTML
  if (content.trim().startsWith('<!DOCTYPE html>') || content.trim().startsWith('<html')) {
    return content.trim();
  }

  return null;
}
