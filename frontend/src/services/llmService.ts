export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// ---------------------------------------------------------------------------
// Template-based response generators — no external API calls required
// ---------------------------------------------------------------------------

function buildFullstackResponse(userMessage: string): string {
    return `Great idea! Here's a complete full-stack starter scaffold based on your request: **"${userMessage}"**

I've structured this as a React + TypeScript frontend with an Express/Node.js backend and a clean API layer.

---

### 📁 Project Structure
\`\`\`
my-app/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api/index.ts
│   │   └── components/Dashboard.tsx
│   └── package.json
└── backend/
    ├── src/
    │   ├── index.ts
    │   └── routes/items.ts
    └── package.json
\`\`\`

---

\`\`\`filename: frontend/src/App.tsx
import React, { useEffect, useState } from 'react';
import { fetchItems } from './api';
import Dashboard from './components/Dashboard';

interface Item {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My App</h1>
        <span className="text-sm text-gray-400">Powered by Noventra.Ai</span>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}
        {!loading && !error && <Dashboard items={items} />}
      </main>
    </div>
  );
}
\`\`\`

\`\`\`filename: frontend/src/api/index.ts
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export async function fetchItems() {
  const res = await fetch(\`\${BASE_URL}/api/items\`);
  if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
  return res.json();
}

export async function createItem(data: { title: string; description: string }) {
  const res = await fetch(\`\${BASE_URL}/api/items\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
  return res.json();
}

export async function deleteItem(id: number) {
  const res = await fetch(\`\${BASE_URL}/api/items/\${id}\`, { method: 'DELETE' });
  if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
}
\`\`\`

\`\`\`filename: frontend/src/components/Dashboard.tsx
import React from 'react';

interface Item {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

interface Props {
  items: Item[];
}

export default function Dashboard({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No items yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-indigo-500 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-white">{item.title}</h3>
            <span
              className={\`text-xs px-2 py-0.5 rounded-full \${
                item.status === 'active'
                  ? 'bg-green-900 text-green-300'
                  : 'bg-gray-800 text-gray-400'
              }\`}
            >
              {item.status}
            </span>
          </div>
          <p className="text-sm text-gray-400">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
\`\`\`

\`\`\`filename: frontend/package.json
{
  "name": "my-app-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
\`\`\`

\`\`\`filename: backend/src/index.ts
import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());
app.use('/api/items', itemsRouter);

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

\`\`\`filename: backend/src/routes/items.ts
import { Router } from 'express';

const router = Router();

interface Item {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

let items: Item[] = [
  { id: 1, title: 'Sample Item', description: 'This is a sample item.', status: 'active' },
];
let nextId = 2;

router.get('/', (_req, res) => {
  res.json(items);
});

router.post('/', (req, res) => {
  const { title, description } = req.body as { title: string; description: string };
  const item: Item = { id: nextId++, title, description, status: 'active' };
  items.push(item);
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  items = items.filter((i) => i.id !== id);
  res.status(204).send();
});

export default router;
\`\`\`

\`\`\`filename: backend/package.json
{
  "name": "my-app-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
\`\`\`

---

### 🚀 Getting Started

**Frontend:**
\`\`\`bash
cd frontend && npm install && npm run dev
\`\`\`

**Backend:**
\`\`\`bash
cd backend && npm install && npm run dev
\`\`\`

Run both servers and open the application in your browser. Let me know what you'd like to customize next!`;
}

function buildLandingResponse(userMessage: string): string {
    return `Here's a complete, conversion-optimized landing page for: **"${userMessage}"**

Built with React + Tailwind CSS — fully responsive with hero, features, and CTA sections.

---

\`\`\`filename: src/App.tsx
import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
\`\`\`

\`\`\`filename: src/components/Hero.tsx
import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(99,102,241,0.3),_transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium tracking-wide">
          Now in Public Beta
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
          Learn Every Language
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            At Your Own Pace
          </span>
        </h1>
        <p className="text-xl text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
          Master programming languages with interactive lessons, real-world projects, and
          AI-powered feedback — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#get-started"
            className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-lg transition-colors shadow-lg shadow-indigo-500/30"
          >
            Start for Free
          </a>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-lg transition-colors"
          >
            See How It Works
          </a>
        </div>
        <p className="mt-6 text-sm text-indigo-300/70">No credit card required · Free forever plan</p>
      </div>
    </section>
  );
}
\`\`\`

\`\`\`filename: src/components/Features.tsx
import React from 'react';

const features = [
  {
    icon: '🎯',
    title: 'Structured Learning Paths',
    description:
      'Follow curated paths from beginner to advanced for Python, JavaScript, Rust, Go, and 20+ more languages.',
  },
  {
    icon: '⚡',
    title: 'Interactive Code Editor',
    description:
      'Write and run code directly in your browser with instant feedback and syntax highlighting.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Hints',
    description:
      'Stuck on a problem? Get contextual hints and explanations without spoiling the solution.',
  },
  {
    icon: '🏆',
    title: 'Real-World Projects',
    description:
      'Build portfolio-worthy projects that demonstrate your skills to potential employers.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description:
      'Visualize your learning journey with detailed stats, streaks, and skill assessments.',
  },
  {
    icon: '👥',
    title: 'Community & Mentors',
    description:
      'Join a thriving community of learners and get guidance from experienced developers.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            A complete learning platform designed to take you from zero to job-ready.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
\`\`\`

\`\`\`filename: src/components/Pricing.tsx
import React from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['5 courses', 'Basic editor', 'Community access', 'Progress tracking'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    features: ['Unlimited courses', 'AI hints & feedback', 'All projects', 'Certificate of completion', 'Priority support'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: 'per month',
    features: ['Everything in Pro', 'Up to 10 seats', 'Team dashboard', 'Custom learning paths', 'Dedicated mentor'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-500">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={\`rounded-2xl p-8 border-2 flex flex-col \${
                plan.highlight
                  ? 'border-indigo-500 bg-indigo-950 text-white shadow-xl shadow-indigo-500/20'
                  : 'border-gray-200 bg-white text-gray-900'
              }\`}
            >
              <div className="mb-6">
                <p className={\`text-sm font-semibold uppercase tracking-widest mb-2 \${plan.highlight ? 'text-indigo-300' : 'text-indigo-600'}\`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={\`text-sm mb-1 \${plan.highlight ? 'text-indigo-300' : 'text-gray-400'}\`}>/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#get-started"
                className={\`block text-center py-3 rounded-xl font-semibold transition-colors \${
                  plan.highlight
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }\`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
\`\`\`

\`\`\`filename: src/components/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">© {new Date().getFullYear()} LearnCode. All rights reserved.</p>
        <nav className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
\`\`\`

\`\`\`filename: src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

html {
  scroll-behavior: smooth;
}
\`\`\`

\`\`\`filename: package.json
{
  "name": "landing-page",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
\`\`\`

---

### 🚀 Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Run the development server and open the application in your browser. Let me know what copy, colors, or sections you'd like to adjust!`;
}

function buildMobileResponse(userMessage: string): string {
    return `Here's a complete React Native starter for: **"${userMessage}"**

Includes navigation, a home screen, and a detail screen — ready to run with Expo.

---

\`\`\`filename: App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Detail: { itemId: number; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#1e1b4b' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My App' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
\`\`\`

\`\`\`filename: src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const ITEMS = [
  { id: 1, title: 'Getting Started', subtitle: 'Learn the basics of the app' },
  { id: 2, title: 'Features', subtitle: 'Explore what you can do' },
  { id: 3, title: 'Settings', subtitle: 'Customize your experience' },
  { id: 4, title: 'Help & Support', subtitle: 'Get assistance when needed' },
];

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome Back 👋</Text>
        <Text style={styles.headerSubtitle}>What would you like to do today?</Text>
      </View>
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { itemId: item.id, title: item.title })}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e1a' },
  header: { padding: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 15, color: '#a5b4fc' },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#312e81',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#818cf8' },
  arrow: { fontSize: 24, color: '#6366f1', marginLeft: 8 },
});
\`\`\`

\`\`\`filename: src/screens/DetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Detail'>;
  route: RouteProp<RootStackParamList, 'Detail'>;
};

export default function DetailScreen({ navigation, route }: Props) {
  const { title } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>
          This is the detail view for {title}. Add your content here.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.sectionText}>
          Customize this screen with the specific content and functionality you need for this section.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0e1a' },
  content: { padding: 24 },
  hero: {
    backgroundColor: '#1e1b4b',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#312e81',
  },
  heroTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 8 },
  heroSubtitle: { fontSize: 15, color: '#a5b4fc', lineHeight: 22 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 8 },
  sectionText: { fontSize: 14, color: '#94a3b8', lineHeight: 22 },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
\`\`\`

\`\`\`filename: package.json
{
  "name": "my-mobile-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-screens": "~3.22.0",
    "react-native-safe-area-context": "4.6.3"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14",
    "typescript": "^5.1.3"
  }
}
\`\`\`

---

### 🚀 Getting Started

\`\`\`bash
npm install
npx expo start
\`\`\`

Scan the QR code with the **Expo Go** app on your device, or press \`a\` for Android emulator / \`i\` for iOS simulator. Let me know what features you'd like to add!`;
}

function buildCustomResponse(userMessage: string): string {
    return `Here's a custom project scaffold tailored to your request: **"${userMessage}"**

I've set up a clean, extensible React + TypeScript foundation you can build on.

---

\`\`\`filename: src/App.tsx
import React, { useState } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import './index.css';

export interface AppState {
  activeView: 'dashboard' | 'list' | 'settings';
  sidebarOpen: boolean;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    activeView: 'dashboard',
    sidebarOpen: true,
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header
        onMenuToggle={() => setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }))}
      />
      <div className="flex flex-1 overflow-hidden">
        {state.sidebarOpen && (
          <Sidebar
            activeView={state.activeView}
            onNavigate={(view) => setState((s) => ({ ...s, activeView: view }))}
          />
        )}
        <MainContent activeView={state.activeView} />
      </div>
    </div>
  );
}
\`\`\`

\`\`\`filename: src/components/Header.tsx
import React from 'react';

interface Props {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: Props) {
  return (
    <header className="h-14 border-b border-gray-800 bg-gray-950 flex items-center px-4 gap-4 shrink-0">
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <h1 className="text-lg font-semibold tracking-tight">My App</h1>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
          Powered by Noventra.Ai
        </span>
      </div>
    </header>
  );
}
\`\`\`

\`\`\`filename: src/components/Sidebar.tsx
import React from 'react';
import { AppState } from '../App';

interface Props {
  activeView: AppState['activeView'];
  onNavigate: (view: AppState['activeView']) => void;
}

const NAV_ITEMS: { id: AppState['activeView']; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'list', label: 'Items', icon: '≡' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar({ activeView, onNavigate }: Props) {
  return (
    <aside className="w-56 border-r border-gray-800 bg-gray-950 flex flex-col py-4 shrink-0">
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors \${
              activeView === item.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }\`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
\`\`\`

\`\`\`filename: src/components/MainContent.tsx
import React from 'react';
import { AppState } from '../App';

interface Props {
  activeView: AppState['activeView'];
}

export default function MainContent({ activeView }: Props) {
  return (
    <main className="flex-1 overflow-auto p-6">
      {activeView === 'dashboard' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {['Total Items', 'Active', 'Completed'].map((label, i) => (
              <div key={label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <p className="text-sm text-gray-400 mb-1">{label}</p>
                <p className="text-3xl font-bold text-white">{(i + 1) * 12}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-400 text-sm">No recent activity yet. Start adding items!</p>
          </div>
        </div>
      )}
      {activeView === 'list' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Items</h2>
          <div className="bg-gray-900 rounded-xl border border-gray-800 divide-y divide-gray-800">
            {['Item One', 'Item Two', 'Item Three'].map((item) => (
              <div key={item} className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-medium">{item}</span>
                <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeView === 'settings' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Settings</h2>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-lg">
            <p className="text-gray-400 text-sm">Configure your application settings here.</p>
          </div>
        </div>
      )}
    </main>
  );
}
\`\`\`

\`\`\`filename: src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
\`\`\`

\`\`\`filename: package.json
{
  "name": "custom-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
\`\`\`

---

### 🚀 Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Run the development server and open the application in your browser. Tell me what specific features or pages you'd like to build next!`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateAIResponse(
    messages: ChatMessage[],
    projectType: string
): Promise<string> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const userText = lastUserMessage?.content ?? 'Build me a project';

    // Simulate a short async delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

    switch (projectType) {
        case 'fullstack':
            return buildFullstackResponse(userText);
        case 'landing':
            return buildLandingResponse(userText);
        case 'mobile':
            return buildMobileResponse(userText);
        default:
            return buildCustomResponse(userText);
    }
}

// ---------------------------------------------------------------------------
// File extraction utility — unchanged
// ---------------------------------------------------------------------------

export function extractFilesFromResponse(
    response: string
): Array<{ filename: string; content: string }> {
    const files: Array<{ filename: string; content: string }> = [];
    const regex = /```(?:\w+)?\s+filename:\s*([^\n]+)\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(response)) !== null) {
        const filename = match[1].trim();
        const content = match[2].trim();
        if (filename && content) {
            files.push({ filename, content });
        }
    }
    return files;
}
