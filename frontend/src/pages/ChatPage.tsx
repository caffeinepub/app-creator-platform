import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSession, useAddMessage, useUpdateFiles } from '../hooks/useQueries';
import { generateAIResponse } from '../services/llmService';
import MessageBubble from '../components/MessageBubble';
import LivePreview from '../components/LivePreview';
import { Send, Loader2, Monitor, Code, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Message } from '../backend';

type TabType = 'chat' | 'preview';

export default function ChatPage() {
  const { sessionId } = useParams({ from: '/chat/$sessionId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: session, isLoading: sessionLoading, error: sessionError } = useGetSession(sessionId);
  const { mutateAsync: addMessage } = useAddMessage();
  const { mutateAsync: updateFiles } = useUpdateFiles();

  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync local messages with session data on first load
  useEffect(() => {
    if (session?.messages && !initialized) {
      setInitialized(true);
      setLocalMessages([...session.messages]);
      // Find latest HTML in messages
      for (let i = session.messages.length - 1; i >= 0; i--) {
        const msg = session.messages[i];
        const htmlMatch = msg.content.match(/```html(?:\s+[^\n]+)?\n([\s\S]*?)```/);
        if (htmlMatch) {
          setPreviewHtml(htmlMatch[1].trim());
          break;
        }
      }
      // Also check files
      if (session.files) {
        const htmlFile = [...session.files].reverse().find(f => f.filename.endsWith('.html'));
        if (htmlFile) setPreviewHtml(htmlFile.content);
      }
    }
  }, [session, initialized]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isSending]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isSending || !session) return;

    const userContent = input.trim();
    setInput('');
    setIsSending(true);

    // Optimistically add user message
    const userMsg: Message = {
      role: 'user',
      content: userContent,
      timestamp: BigInt(Date.now() * 1_000_000),
    };
    setLocalMessages(prev => [...prev, userMsg]);

    try {
      // Persist user message (non-blocking)
      addMessage({ sessionId, role: 'user', content: userContent }).catch(() => {});

      // Build previous messages context
      const previousMessages = localMessages.map(m => ({ role: m.role, content: m.content }));

      // Generate AI response
      const aiResponseText = await generateAIResponse({
        sessionName: session.name,
        projectType: session.projectType as any,
        userMessage: userContent,
        previousMessages,
        existingHtml: previewHtml || undefined,
      });

      // Optimistically add AI message
      const aiMsg: Message = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: BigInt(Date.now() * 1_000_000),
      };
      setLocalMessages(prev => [...prev, aiMsg]);

      // Extract HTML if present
      const htmlMatch = aiResponseText.match(/```html(?:\s+[^\n]+)?\n([\s\S]*?)```/);
      if (htmlMatch) {
        const newHtml = htmlMatch[1].trim();
        setPreviewHtml(newHtml);
        setActiveTab('preview');
        // Persist file (non-blocking)
        updateFiles({ sessionId, filename: 'index.html', content: newHtml }).catch(() => {});
      }

      // Persist AI message (non-blocking)
      addMessage({ sessionId, role: 'assistant', content: aiResponseText }).catch(() => {});

    } catch {
      toast.error('Failed to generate response. Please try again.');
      // Remove optimistic user message on error
      setLocalMessages(prev => prev.filter(m => m !== userMsg));
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, session, sessionId, localMessages, previewHtml, addMessage, updateFiles]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md border border-border/40">
          <AlertCircle className="w-12 h-12 text-brand mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-text-muted">Please log in to access this session.</p>
        </div>
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
          <p className="text-text-muted">Loading session...</p>
        </div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md border border-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Session Not Found</h2>
          <p className="text-text-muted mb-4">This session doesn't exist or you don't have access.</p>
          <button
            onClick={() => navigate({ to: '/sessions' })}
            className="btn-primary px-6 py-2.5 rounded-xl font-semibold"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 glass border-b border-border/40 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/sessions' })}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-semibold text-text-primary text-sm">{session.name}</h2>
            <p className="text-xs text-text-muted capitalize">{session.projectType}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 glass rounded-lg p-1 border border-border/40">
          <button
            onClick={() => setActiveTab('chat')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
              transition-all duration-200
              ${activeTab === 'chat'
                ? 'bg-brand/20 text-brand border border-brand/40 shadow-brand-glow-sm'
                : 'text-text-muted hover:text-text-primary'
              }
            `}
          >
            <Code className="w-3.5 h-3.5" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            disabled={!previewHtml}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
              transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
              ${activeTab === 'preview'
                ? 'bg-cyan/20 text-cyan border border-cyan/40 shadow-cyan-glow-sm'
                : 'text-text-muted hover:text-text-primary'
              }
            `}
          >
            <Monitor className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {localMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-2xl glass border border-brand/30 flex items-center justify-center mb-6 shadow-brand-glow">
                    <Code className="w-8 h-8 text-brand" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Start Building</h3>
                  <p className="text-text-muted max-w-sm text-sm">
                    Describe what you want to build and Noventra.ai will generate the code for you instantly.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {[
                      'Build a modern landing page',
                      'Create a dashboard app',
                      'Make a mobile app UI',
                      'Generate API documentation',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full glass border border-border/60 text-text-muted hover:text-text-primary hover:border-brand/40 transition-all duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                localMessages.map((msg, i) => (
                  <MessageBubble
                    key={i}
                    message={msg}
                    onShowPreview={(html) => {
                      setPreviewHtml(html);
                      setActiveTab('preview');
                    }}
                  />
                ))
              )}

              {/* Sending indicator */}
              {isSending && (
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-brand/40 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, oklch(0.65 0.22 25 / 0.3), oklch(0.72 0.18 195 / 0.2))' }}
                  >
                    <Loader2 className="w-4 h-4 text-brand animate-spin" />
                  </div>
                  <div className="glass border border-border/40 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 px-4 pb-4 pt-2">
              <div className="glass-card border border-border/60 focus-within:border-cyan/50 focus-within:shadow-cyan-glow-sm transition-all duration-200">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Describe what to build for "${session.name}"...`}
                  disabled={isSending}
                  rows={2}
                  className="
                    w-full bg-transparent px-4 pt-4 pb-2 text-sm text-text-primary
                    placeholder:text-text-muted resize-none focus:outline-none
                    min-h-[60px] max-h-[160px] disabled:opacity-60
                  "
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <span className="text-xs text-text-muted">
                    Enter to send · Shift+Enter for new line
                  </span>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-xl btn-primary
                      text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed
                    "
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="h-full flex flex-col">
            {previewHtml ? (
              <LivePreview html={previewHtml} />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="glass-card p-10 text-center border border-border/40 max-w-sm">
                  <Monitor className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
                  <p className="text-text-muted text-sm">No preview yet. Send a message to generate your page.</p>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="mt-4 text-xs text-cyan hover:text-cyan-light transition-colors"
                  >
                    ← Back to chat
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
