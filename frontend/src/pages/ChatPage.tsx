import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Send, Loader2, ArrowLeft, Code2, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useGetSession, useAddMessage, useUpdateFiles } from "../hooks/useQueries";
import { generateAIResponse, extractHtmlFromResponse, ProjectType } from "../services/llmService";
import MessageBubble from "../components/MessageBubble";
import LivePreview from "../components/LivePreview";
import Logo from "../components/Logo";
import LoginButton from "../components/LoginButton";
import type { Message } from "../backend";

export default function ChatPage() {
  const params = useParams({ from: "/sessions/$sessionId" });
  const sessionId = params?.sessionId;
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [currentHtml, setCurrentHtml] = useState("");
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

  const handleSend = useCallback(async () => {
    if (!input.trim() || isGenerating || !sessionId) return;

    const userMessage = input.trim();
    setInput("");
    setIsGenerating(true);

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
    } catch (error: unknown) {
      console.error("Error generating response:", error);
      const message =
        error instanceof Error ? error.message : "Failed to generate response. Please try again.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }, [input, isGenerating, sessionId, session, currentHtml, addMessage, updateFiles]);

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

  if (sessionError || !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <p className="text-text-muted text-lg">
            {sessionError instanceof Error ? sessionError.message : "Session not found."}
          </p>
          <button
            onClick={() => navigate({ to: "/sessions" })}
            className="btn-primary px-6 py-2 rounded-lg"
          >
            Back to Sessions
          </button>
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

          {/* Input area */}
          <div className="p-4 border-t border-border bg-surface-1 shrink-0">
            <div className="flex items-end gap-2 bg-surface-2 rounded-xl border border-border p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
