import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Download, Send, ArrowLeft, FileCode, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGetSession, useAddMessage, useUpdateFiles } from '../hooks/useQueries';
import { generateAIResponse, extractFilesFromResponse, GeneratedFile } from '../services/llmService';
import MessageBubble from '../components/MessageBubble';

export default function ChatPage() {
  const { sessionId } = useParams({ from: '/sessions/$sessionId/chat' });
  const navigate = useNavigate();

  const { data: session, isLoading: sessionLoading, error: sessionError } = useGetSession(sessionId);
  const addMessageMutation = useAddMessage();
  const updateFilesMutation = useUpdateFiles();

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [localFiles, setLocalFiles] = useState<Record<string, string>>({});
  const [optimisticMessages, setOptimisticMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; timestamp: bigint }>
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync local files from session
  useEffect(() => {
    if (session?.files) {
      const fileMap: Record<string, string> = {};
      session.files.forEach(f => {
        fileMap[f.filename] = f.content;
      });
      setLocalFiles(fileMap);
    }
  }, [session?.files]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, optimisticMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const sessionMessages = (session?.messages ?? []).map(m => ({
    role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
    content: m.content,
    timestamp: m.timestamp,
  }));

  const allMessages = [...sessionMessages, ...optimisticMessages];

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setInput('');
    setIsSending(true);

    // Optimistic user message
    const userOptimistic: { role: 'user' | 'assistant'; content: string; timestamp: bigint } = {
      role: 'user',
      content: trimmed,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };
    setOptimisticMessages(prev => [...prev, userOptimistic]);

    try {
      // Persist user message to backend
      await addMessageMutation.mutateAsync({
        sessionId,
        role: 'user',
        content: trimmed,
      });

      // Build message history for context
      const history = allMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Generate AI response using the project type
      const projectType = session?.projectType ?? 'Custom';
      let aiResponse: string;

      try {
        aiResponse = generateAIResponse(trimmed, projectType, history);
      } catch (genError) {
        console.error('Error generating AI response:', genError);
        aiResponse = `I encountered an issue generating a response. Please try again.\n\nProject type: ${projectType}\nYour request: ${trimmed}`;
      }

      if (!aiResponse || aiResponse.trim() === '') {
        aiResponse = `I'm ready to help you build your ${projectType}! Please describe what you'd like to create or modify, and I'll generate the code for you.`;
      }

      // Optimistic assistant message
      const assistantOptimistic: { role: 'user' | 'assistant'; content: string; timestamp: bigint } = {
        role: 'assistant',
        content: aiResponse,
        timestamp: BigInt(Date.now() + 1) * BigInt(1_000_000),
      };
      setOptimisticMessages(prev => [...prev, assistantOptimistic]);

      // Persist assistant message to backend
      await addMessageMutation.mutateAsync({
        sessionId,
        role: 'assistant',
        content: aiResponse,
      });

      // Extract files from the AI response
      let extractedFiles: GeneratedFile[] = [];
      try {
        extractedFiles = extractFilesFromResponse(aiResponse);
      } catch (extractError) {
        console.error('Error extracting files:', extractError);
      }

      // Update files in backend and local state
      if (extractedFiles.length > 0) {
        const newFileMap: Record<string, string> = { ...localFiles };

        for (const file of extractedFiles) {
          try {
            await updateFilesMutation.mutateAsync({
              sessionId,
              filename: file.filename,
              content: file.content,
            });
            newFileMap[file.filename] = file.content;
          } catch (fileError) {
            console.error(`Error saving file ${file.filename}:`, fileError);
          }
        }

        setLocalFiles(newFileMap);
        toast.success(`${extractedFiles.length} file${extractedFiles.length !== 1 ? 's' : ''} generated`);
      }

      // Clear optimistic messages (backend now has them)
      setOptimisticMessages([]);
    } catch (error) {
      console.error('Error in handleSend:', error);
      toast.error('Failed to send message. Please try again.');
      // Remove the optimistic user message on error
      setOptimisticMessages([]);
      setInput(trimmed);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDownloadAll = () => {
    const files = Object.entries(localFiles);
    if (files.length === 0) {
      toast.error('No files to download yet.');
      return;
    }

    files.forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast.success(`Downloaded ${files.length} file${files.length !== 1 ? 's' : ''}`);
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted font-inter">Loading session...</p>
        </div>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="font-grotesk text-xl font-bold text-text mb-2">Session Not Found</h2>
          <p className="text-muted mb-6">
            {sessionError instanceof Error ? sessionError.message : 'This session could not be loaded.'}
          </p>
          <button
            onClick={() => navigate({ to: '/sessions' })}
            className="btn-primary px-6 py-2 rounded-lg font-grotesk font-semibold"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const fileCount = Object.keys(localFiles).length;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate({ to: '/sessions' })}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors flex-shrink-0"
              aria-label="Back to sessions"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="font-grotesk font-bold text-text truncate text-sm sm:text-base">
                {session.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-inter">
                  {session.projectType}
                </span>
                {fileCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-primary">
                    <FileCode className="w-3 h-3" />
                    {fileCount} file{fileCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadAll}
            disabled={fileCount === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-grotesk font-semibold text-sm
              bg-primary/10 text-primary border border-primary/20
              hover:bg-primary/20 transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">
              {fileCount > 0 ? `Download (${fileCount})` : 'Download'}
            </span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {allMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <FileCode className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-grotesk text-xl font-bold text-text mb-2">
                Start Building
              </h2>
              <p className="text-muted font-inter max-w-sm">
                Describe what you want to build for your{' '}
                <span className="text-primary font-medium">{session.projectType}</span> project
                and Noventra.Ai will generate the code.
              </p>
            </div>
          ) : (
            allMessages.map((msg, idx) => (
              <MessageBubble
                key={`${msg.role}-${idx}-${msg.timestamp.toString()}`}
                role={msg.role}
                content={msg.content}
              />
            ))
          )}

          {isSending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">AI</span>
              </div>
              <div className="glass-card px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-muted font-inter">Generating...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="sticky bottom-0 border-t border-border bg-bg/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="glass-card flex items-end gap-3 p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build or modify... (Enter to send, Shift+Enter for new line)"
              rows={1}
              disabled={isSending}
              className="flex-1 bg-transparent text-text placeholder-muted font-inter text-sm resize-none outline-none min-h-[24px] max-h-[160px] disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="p-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-muted mt-2 font-inter">
            Noventra.Ai generates complete, production-ready code
          </p>
        </div>
      </footer>
    </div>
  );
}
