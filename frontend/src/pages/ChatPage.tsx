import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetSession, useAddMessage } from "../hooks/useQueries";
import { generateAIResponse, hasApiKey, LLMError } from "../services/llmService";
import Logo from "../components/Logo";
import LoginButton from "../components/LoginButton";
import MessageBubble from "../components/MessageBubble";
import LivePreview from "../components/LivePreview";
import ShareButton from "../components/ShareButton";
import ApiKeySetup from "../components/ApiKeySetup";
import AlarmNotification from "../components/AlarmNotification";
import AudioEnablePrompt from "../components/AudioEnablePrompt";
import {
  ArrowLeft,
  Send,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Key,
  Code2,
  Eye,
  X,
  Bell,
} from "lucide-react";
import { Message } from "../backend";

// ─── Alarm state type ─────────────────────────────────────────────────────────
interface ActiveAlarm {
  id: string;
  message: string;
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
function ErrorBanner({
  message,
  isApiKeyError,
  onRetry,
  onOpenSettings,
  onDismiss,
}: {
  message: string;
  isApiKeyError: boolean;
  onRetry: () => void;
  onOpenSettings: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="mx-4 mb-3 rounded-xl border border-red-500/20 bg-red-500/8 p-3 flex items-start gap-3">
      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-300 leading-relaxed">{message}</p>
        <div className="flex items-center gap-3 mt-2">
          {isApiKeyError ? (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 text-xs text-brand hover:text-brand/80 font-medium transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              Configure API Key
            </button>
          ) : (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 text-xs text-brand hover:text-brand/80 font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── API Key Modal ─────────────────────────────────────────────────────────────
function ApiKeyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl border border-brand/20 shadow-2xl shadow-brand/10 w-full max-w-md">
        <ApiKeySetup isModal onClose={onClose} onSaved={onClose} />
      </div>
    </div>
  );
}

// ─── Alarm detector: scans AI-generated HTML for alarm triggers ───────────────
function detectAlarmInHtml(html: string): string | null {
  if (!html) return null;
  // Look for common alarm-related patterns in the generated HTML
  // The AI might generate a page that includes alarm functionality
  // We detect if the HTML contains alarm trigger markers
  const alarmPatterns = [
    /data-alarm-trigger="([^"]+)"/i,
    /id="alarm-trigger"[^>]*data-message="([^"]+)"/i,
  ];
  for (const pattern of alarmPatterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// ─── Main ChatPage ─────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { sessionId } = useParams({ from: "/sessions/$sessionId" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: session, isLoading: sessionLoading, error: sessionError } = useGetSession(sessionId);
  const addMessage = useAddMessage();

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastHtml, setLastHtml] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [apiError, setApiError] = useState<LLMError | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(!hasApiKey());

  // Alarm state
  const [activeAlarm, setActiveAlarm] = useState<ActiveAlarm | null>(null);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Suppress unused variable warning — identity used for auth context
  void identity;

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages, isGenerating]);

  // Extract latest HTML from session messages
  useEffect(() => {
    if (!session?.messages) return;
    const assistantMessages = session.messages.filter((m) => m.role === "assistant");
    if (assistantMessages.length > 0) {
      const latest = assistantMessages[assistantMessages.length - 1];
      setLastHtml(latest.content);
    }
  }, [session?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  // Listen for alarm messages from the iframe via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      if (event.data.type === "ALARM_TRIGGER") {
        const alarmMessage = event.data.message || "Alarm triggered!";
        setActiveAlarm({ id: Date.now().toString(), message: alarmMessage });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isGenerating || !session) return;

      const text = messageText.trim();
      setLastUserMessage(text);
      setApiError(null);
      setInput("");

      // Save user message to backend
      try {
        await addMessage.mutateAsync({ sessionId, role: "user", content: text });
      } catch (err) {
        console.error("Failed to save user message:", err);
      }

      setIsGenerating(true);

      try {
        // Build conversation history
        const history = (session.messages || []).map((m: Message) => ({
          role: m.role,
          content: m.content,
        }));
        history.push({ role: "user", content: text });

        const html = await generateAIResponse(history, session.projectType, session.name);
        setLastHtml(html);

        // Save assistant response
        await addMessage.mutateAsync({ sessionId, role: "assistant", content: html });
        setActiveTab("preview");
      } catch (err: unknown) {
        const llmErr = err as LLMError;
        setApiError({
          message: llmErr?.message || "Could not reach the AI service. Please retry.",
          isApiKeyError: llmErr?.isApiKeyError || false,
          status: llmErr?.status,
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, session, sessionId, addMessage]
  );

  const handleRetry = useCallback(() => {
    if (lastUserMessage) {
      sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Test alarm button handler (for development/demo)
  const handleTestAlarm = () => {
    setActiveAlarm({ id: Date.now().toString(), message: "Test alarm — your scheduled reminder is active!" });
  };

  // ── Loading state ──
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading session...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (sessionError) {
    const errMsg = (sessionError as Error)?.message || "";
    const isNotFound = errMsg.includes("not found") || errMsg.includes("Access denied");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {isNotFound ? "Session Not Found" : "Failed to Load Session"}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {isNotFound
              ? "This session doesn't exist or you don't have access to it."
              : "Something went wrong loading this session. Please try again."}
          </p>
          <button
            onClick={() => navigate({ to: "/sessions" })}
            className="btn-primary px-6 py-3 rounded-xl font-medium text-sm"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const messages = session?.messages || [];
  const codeContent = lastHtml;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-white/5 bg-background/80 backdrop-blur-xl z-30">
        <div className="h-14 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/sessions" })}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate({ to: "/" })}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo size="small" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-foreground truncate">
                {session?.name}
              </h1>
              {session?.projectType && (
                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/10 hidden sm:block">
                  {session.projectType}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Test alarm button */}
            <button
              onClick={handleTestAlarm}
              title="Test Alarm Sound"
              className="p-2 rounded-lg text-muted-foreground hover:text-brand hover:bg-brand/10 transition-all"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowApiKeyModal(true)}
              title="API Key Settings"
              className={`p-2 rounded-lg transition-all ${
                hasApiKey()
                  ? "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  : "text-brand bg-brand/10 hover:bg-brand/20"
              }`}
            >
              <Key className="w-4 h-4" />
            </button>
            {session && <ShareButton sessionId={session.id} />}
            <LoginButton />
          </div>
        </div>
      </header>

      {/* API Key Banner */}
      {showApiKeyBanner && (
        <div className="shrink-0 bg-brand/10 border-b border-brand/20 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-brand">
            <Key className="w-4 h-4 shrink-0" />
            <span>
              Add your{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-brand/80"
              >
                OpenRouter API key
              </a>{" "}
              to start generating apps.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="text-xs font-medium text-brand bg-brand/20 hover:bg-brand/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              Add Key
            </button>
            <button
              onClick={() => setShowApiKeyBanner(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Chat panel */}
        <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 flex flex-col border-r border-white/5 min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
            {messages.length === 0 && !isGenerating && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-brand/60" />
                </div>
                <h3 className="text-base font-medium text-foreground/70 mb-2">Start building</h3>
                <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
                  Describe what you want to create and the AI will build it for you.
                </p>
              </div>
            )}

            {messages.map((message, i) => (
              <MessageBubble key={i} message={message} />
            ))}

            {isGenerating && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 text-brand animate-spin" />
                  </div>
                  <div className="glass-card border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((idx) => (
                        <div
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full bg-brand/60 animate-bounce"
                          style={{ animationDelay: `${idx * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error banner */}
          {apiError && (
            <ErrorBanner
              message={apiError.message}
              isApiKeyError={apiError.isApiKeyError}
              onRetry={handleRetry}
              onOpenSettings={() => {
                setShowApiKeyModal(true);
                setApiError(null);
              }}
              onDismiss={() => setApiError(null)}
            />
          )}

          {/* Input area */}
          <div className="shrink-0 p-4 border-t border-white/5">
            <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-brand/40 focus-within:ring-1 focus-within:ring-brand/20 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what to build or modify..."
                disabled={isGenerating}
                rows={1}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none disabled:opacity-60 leading-relaxed min-h-[24px]"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isGenerating || !input.trim()}
                className="shrink-0 w-8 h-8 rounded-xl btn-primary flex items-center justify-center disabled:opacity-40 transition-all"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground/40 mt-2 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Preview panel — only visible on md+ screens */}
        <div className="flex-1 flex-col min-h-0 hidden md:flex">
          {/* Tab bar */}
          <div className="shrink-0 flex items-center gap-1 px-4 py-2 border-b border-white/5 bg-background/50">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "preview"
                  ? "bg-brand/15 text-brand border border-brand/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "code"
                  ? "bg-brand/15 text-brand border border-brand/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "preview" ? (
            <LivePreview htmlContent={lastHtml} onViewCode={() => setActiveTab("code")} />
          ) : (
            <div className="flex-1 overflow-auto p-4 min-h-0">
              {codeContent ? (
                <div className="rounded-xl overflow-hidden border border-white/10 bg-zinc-950">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">index.html</span>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(codeContent)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 overflow-auto text-xs font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap break-words">
                    {codeContent}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Code2 className="w-10 h-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground/50">No code generated yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && <ApiKeyModal onClose={() => setShowApiKeyModal(false)} />}

      {/* Alarm Notification */}
      {activeAlarm && (
        <AlarmNotification
          message={activeAlarm.message}
          onDismiss={() => setActiveAlarm(null)}
        />
      )}

      {/* Audio Enable Prompt */}
      {showAudioPrompt && (
        <AudioEnablePrompt
          onEnabled={() => setShowAudioPrompt(false)}
          onDismiss={() => setShowAudioPrompt(false)}
        />
      )}
    </div>
  );
}
