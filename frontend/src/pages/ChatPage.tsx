import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Send, Loader2, ArrowLeft, Code2, Eye, Sparkles, RefreshCw, LogOut, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useGetSession, useAddMessage, useUpdateFiles, SessionExpiredError } from "../hooks/useQueries";
import { generateAIResponse, extractHtmlFromResponse, ProjectType } from "../services/llmService";
import MessageBubble from "../components/MessageBubble";
import LivePreview from "../components/LivePreview";
import Logo from "../components/Logo";
import LoginButton from "../components/LoginButton";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useQueryClient } from "@tanstack/react-query";
import type { Message } from "../backend";

// Friendly error banner for session/API errors
function SessionErrorBanner({
  error,
  onRetry,
  onLogout,
}: {
  error: Error;
  onRetry: () => void;
  onLogout: () => void;
}) {
  const isSessionExpired = error instanceof SessionExpiredError;

  return (
    <div className="mx-4 mt-3 p-3 rounded-xl border border-destructive/30 bg-destructive/10 flex items-start gap-3">
      <AlertCircle size={16} className="text-destructive shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-destructive font-medium">
          {isSessionExpired
            ? "Session expired"
            : "Something went wrong"}
        </p>
        <p className="text-xs text-destructive/80 mt-0.5">
          {isSessionExpired
            ? "Your session has expired. Please try again or log out and log back in."
            : error.message}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 font-medium transition-colors"
          >
            <RefreshCw size={11} />
            Retry
          </button>
          {isSessionExpired && (
            <>
              <span className="text-destructive/30">·</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 font-medium transition-colors"
              >
                <LogOut size={11} />
                Log out &amp; back in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const params = useParams({ from: "/sessions/$sessionId" });
  const sessionId = params?.sessionId;
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [currentHtml, setCurrentHtml] = useState("");
  const [sendError, setSendError] = useState<Error | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: session, isLoading: sessionLoading, error: sessionError } = useGetSession(
    sessionId ?? ""
  );
  const addMessage = useAddMessage();
  const updateFiles = useUpdateFiles();

  // Load existing HTML from session files on mount
  useEffect(() => {
    if (session?.files && session.files.length > 0) {
      const htmlFile = session.files.find(
        (f) => f.filename === "index.html" || f.filename.endsWith(".html")
      );
      if (htmlFile && htmlFile.content && htmlFile.content.trim().length > 0) {
        setCurrentHtml(htmlFile.content);
      }
    }
  }, [session?.files]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const doSend = useCallback(async (userMessage: string) => {
    if (!sessionId) return;
    setIsGenerating(true);
    setSendError(null);

    try {
      // Save user message to backend
      await addMessage.mutateAsync({
        sessionId,
        role: "user",
        content: userMessage,
      });

      // Build conversation history for LLM
      const history = (session?.messages ?? []).map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

      // Call LLM
      const aiResponse = await generateAIResponse(
        userMessage,
        (session?.projectType ?? "landing") as ProjectType,
        history,
        currentHtml
      );

      // Extract HTML from the response
      const extractedHtml = extractHtmlFromResponse(aiResponse);

      if (extractedHtml && extractedHtml.trim().length > 0) {
        setCurrentHtml(extractedHtml);

        // Save HTML file to backend
        await updateFiles.mutateAsync({
          sessionId,
          filename: "index.html",
          content: extractedHtml,
        });
      }

      // Save AI response message to backend
      await addMessage.mutateAsync({
        sessionId,
        role: "assistant",
        content: aiResponse,
      });

      // Switch to preview tab when we have HTML
      if (extractedHtml && extractedHtml.trim().length > 0) {
        setActiveTab("preview");
      }

      setLastFailedMessage(null);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      setSendError(err);
      setLastFailedMessage(userMessage);
      // Only show toast for non-session errors (session errors shown inline)
      if (!(error instanceof SessionExpiredError)) {
        toast.error(err.message);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [sessionId, session, currentHtml, addMessage, updateFiles]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isGenerating || !sessionId) return;
    const userMessage = input.trim();
    setInput("");
    await doSend(userMessage);
  }, [input, isGenerating, sessionId, doSend]);

  const handleRetry = useCallback(async () => {
    if (!lastFailedMessage || isGenerating) return;
    await doSend(lastFailedMessage);
  }, [lastFailedMessage, isGenerating, doSend]);

  const handleLogout = useCallback(async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  }, [clear, queryClient, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <p className="text-text-muted text-lg">No session ID provided.</p>
          <button
            onClick={() => navigate({ to: "/sessions" })}
            className="btn-primary px-6 py-2 rounded-lg"
          >
            Go to Sessions
          </button>
        </div>
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-brand" size={32} />
          <p className="text-text-muted">Loading session…</p>
        </div>
      </div>
    );
  }

  // Session-level error (e.g. 401 on load)
  if (sessionError || !session) {
    const isExpired = sessionError instanceof SessionExpiredError;
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="max-w-sm w-full mx-4 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertCircle size={24} className="text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground font-display">
              {isExpired ? "Session Expired" : "Session Not Found"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isExpired
                ? "Your session has expired. Please log out and log back in to continue."
                : sessionError instanceof Error
                ? sessionError.message
                : "This session could not be loaded."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {isExpired && (
              <button
                onClick={handleLogout}
                className="btn-primary flex items-center gap-2 justify-center px-6 py-2 rounded-xl w-full"
              >
                <LogOut size={16} />
                Log Out &amp; Back In
              </button>
            )}
            <button
              onClick={() => navigate({ to: "/sessions" })}
              className="px-6 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors text-sm w-full"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-1 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/sessions" })}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <Logo size="small" />
          <div className="hidden sm:block h-5 w-px bg-border" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-text-primary leading-tight">{session.name}</p>
            <p className="text-xs text-text-muted capitalize">{session.projectType}</p>
          </div>
        </div>
        <LoginButton />
      </header>

      {/* Main content: chat + preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className="flex flex-col w-full md:w-[420px] lg:w-[480px] shrink-0 border-r border-border">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {session.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center">
                  <Sparkles size={24} className="text-brand" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold mb-1">Start building</p>
                  <p className="text-text-muted text-sm max-w-xs">
                    Describe what you want to create and Noventra AI will generate it for you.
                  </p>
                </div>
              </div>
            ) : (
              session.messages.map((msg: Message, idx: number) => (
                <MessageBubble
                  key={idx}
                  message={msg}
                  onShowPreview={(html) => {
                    setCurrentHtml(html);
                    setActiveTab("preview");
                  }}
                />
              ))
            )}
            {isGenerating && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-1 border border-border w-fit">
                <Loader2 size={16} className="animate-spin text-brand" />
                <span className="text-sm text-text-muted">Generating…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Inline error banner */}
          {sendError && !isGenerating && (
            <SessionErrorBanner
              error={sendError}
              onRetry={handleRetry}
              onLogout={handleLogout}
            />
          )}

          {/* Input area */}
          <div className="p-4 border-t border-border bg-surface-1 shrink-0">
            <div className="flex items-end gap-2 bg-surface-2 rounded-xl border border-border p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (sendError) setSendError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Describe what to build or modify…"
                rows={1}
                disabled={isGenerating}
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm resize-none outline-none py-1 px-2 min-h-[36px] max-h-[160px] disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                className="p-2 rounded-lg btn-primary disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-all"
              >
                {isGenerating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="text-xs text-text-muted/60 mt-2 text-center">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Preview / Code panel */}
        <div className="hidden md:flex flex-col flex-1 overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-surface-1 shrink-0">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-brand/10 text-brand"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Eye size={14} />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "code"
                  ? "bg-brand/10 text-brand"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Code2 size={14} />
              Code
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "preview" ? (
              <LivePreview htmlContent={currentHtml} />
            ) : (
              <div className="h-full overflow-auto bg-surface p-4">
                {currentHtml ? (
                  <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {currentHtml}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-text-muted text-sm">
                    No code generated yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
