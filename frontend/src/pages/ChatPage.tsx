import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSession, useAddMessage, useUpdateFiles } from '../hooks/useQueries';
import { generateAIResponse } from '../services/llmService';
import MessageBubble from '../components/MessageBubble';
import LoginButton from '../components/LoginButton';
import {
  ArrowLeft, Send, Loader2, Download, AlertCircle,
  Globe, Layout, Smartphone, Server, Heart, Eye, Code2
} from 'lucide-react';
import { toast } from 'sonner';

const projectTypeIcons: Record<string, React.ReactNode> = {
  'Landing Page': <Globe className="w-4 h-4" />,
  'landing':      <Globe className="w-4 h-4" />,
  'Full-Stack App': <Layout className="w-4 h-4" />,
  'fullstack':    <Layout className="w-4 h-4" />,
  'Mobile App':   <Smartphone className="w-4 h-4" />,
  'mobile':       <Smartphone className="w-4 h-4" />,
  'API Backend':  <Server className="w-4 h-4" />,
  'api':          <Server className="w-4 h-4" />,
};

type LocalMessage = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
};

export default function ChatPage() {
  const { sessionId } = useParams({ from: '/sessions/$sessionId/chat' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: session, isLoading, error } = useGetSession(sessionId);
  const addMessage = useAddMessage();
  const updateFiles = useUpdateFiles();

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'preview'>('chat');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialized = useRef(false);

  // Sync backend messages to local on first load
  useEffect(() => {
    if (session && !initialized.current) {
      initialized.current = true;
      const msgs: LocalMessage[] = session.messages.map((m, i) => ({
        role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
        id: `backend-${i}`,
      }));
      setLocalMessages(msgs);

      // Extract preview HTML from existing messages
      const lastAssistant = [...session.messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistant) {
        const htmlMatch =
          lastAssistant.content.match(/```(?:html)?\s+(?:filename=|filepath=)?["']?([^\s"'\n]*\.html[^\s"'\n]*)["']?\n([\s\S]*?)```/i) ||
          lastAssistant.content.match(/```html\n([\s\S]*?)```/i);
        if (htmlMatch) {
          setPreviewHtml(htmlMatch[htmlMatch.length - 1].trim());
        }
      }

      // Also check files
      const htmlFile = session.files.find(f => f.filename.endsWith('.html'));
      if (htmlFile) setPreviewHtml(htmlFile.content);
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isGenerating]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isGenerating) return;

    const userMsg: LocalMessage = { role: 'user', content: text, id: `user-${Date.now()}` };
    setLocalMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    // Persist user message
    try {
      await addMessage.mutateAsync({ sessionId, role: 'user', content: text });
    } catch {
      // Non-blocking
    }

    // Generate AI response
    try {
      const projectName = session?.name || 'My Project';
      const projectType = session?.projectType || 'Landing Page';
      const response = generateAIResponse(text, projectName, projectType);

      const assistantMsg: LocalMessage = {
        role: 'assistant',
        content: response.message,
        id: `assistant-${Date.now()}`,
      };
      setLocalMessages(prev => [...prev, assistantMsg]);

      // Persist assistant message
      await addMessage.mutateAsync({ sessionId, role: 'assistant', content: response.message });

      // Handle generated files
      if (response.files.length > 0) {
        for (const file of response.files) {
          try {
            await updateFiles.mutateAsync({ sessionId, filename: file.filename, content: file.content });
          } catch {
            // Non-blocking
          }
          if (file.filename.endsWith('.html')) {
            setPreviewHtml(file.content);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate response';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDownloadAll = () => {
    if (!session?.files.length) {
      toast.error('No files to download');
      return;
    }
    session.files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
    toast.success(`Downloaded ${session.files.length} file(s)`);
  };

  const projectIcon = session ? (projectTypeIcons[session.projectType] || <Layout className="w-4 h-4" />) : null;

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-cyan-500/6 rounded-full blur-3xl" />
      </div>

      {/* Header — sticky only, no relative */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/sessions' })}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          {isLoading ? (
            <div className="h-5 w-32 bg-surface-2 rounded animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-2">
              <span className="text-indigo-400">{projectIcon}</span>
              <span className="font-display font-semibold text-sm truncate max-w-[200px]">{session.name}</span>
              <span className="text-xs text-text-muted hidden sm:block">· {session.projectType}</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          {previewHtml && (
            <div className="flex items-center gap-0.5 bg-surface-2 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:text-text'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-text-muted hover:text-text'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>
          )}

          {session?.files && session.files.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text border border-border hover:border-indigo-500/40 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Download</span>
            </button>
          )}
          <LoginButton compact />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 md:px-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center border border-red-500/20 max-w-md">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-red-400 font-medium">Failed to load session</p>
              <p className="text-text-muted text-sm mt-1">{error.message}</p>
            </div>
          </div>
        )}

        {/* Not logged in */}
        {!identity && !isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="glass-card rounded-2xl p-10 text-center border border-border max-w-sm">
              <p className="text-text-muted mb-4">Please login to access this session.</p>
              <LoginButton />
            </div>
          </div>
        )}

        {/* Chat view */}
        {identity && session && !isLoading && activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {localMessages.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">
                      {session.projectType.includes('Landing') ? '🌐'
                        : session.projectType.includes('Mobile') ? '📱'
                        : session.projectType.includes('API') ? '⚡'
                        : '🚀'}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{session.name}</h3>
                  <p className="text-text-muted text-sm max-w-sm mx-auto">
                    Start by describing what you want to build. I'll generate the code for you instantly.
                  </p>
                </div>
              )}

              {localMessages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  showPreview={false}
                />
              ))}

              {isGenerating && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  </div>
                  <div className="glass-card rounded-2xl px-4 py-3 text-sm text-text-muted border border-border">
                    <span className="animate-pulse">Generating...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="pb-6 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
              <div className="glass-card rounded-2xl border border-border focus-within:border-indigo-500/50 transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Describe what you want to build for ${session.name}...`}
                  className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-text placeholder:text-text-muted resize-none focus:outline-none min-h-[60px] max-h-[160px]"
                  rows={2}
                  disabled={isGenerating}
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <span className="text-xs text-text-muted">Enter to send · Shift+Enter for new line</span>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isGenerating}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Preview view */}
        {identity && session && !isLoading && activeTab === 'preview' && previewHtml && (
          <div className="flex-1 py-6">
            <div className="glass-card rounded-2xl overflow-hidden border border-indigo-500/20">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2/50">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-text-muted">Live Preview — {session.name}</span>
                </div>
                <button
                  onClick={() => {
                    const blob = new Blob([previewHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    setTimeout(() => URL.revokeObjectURL(url), 5000);
                  }}
                  className="text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1"
                >
                  Open in new tab ↗
                </button>
              </div>
              <div className="p-4">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full rounded-xl border border-border/50"
                  style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
                  sandbox="allow-scripts allow-same-origin"
                  title="Live Preview"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <p className="text-text-muted text-xs flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-indigo-400 fill-indigo-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
