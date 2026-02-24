import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
    Sparkles,
    ArrowLeft,
    Send,
    Download,
    FileCode,
    Loader2,
    AlertCircle,
    Layers,
    Smartphone,
    Layout,
    Code2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetSession, useAddMessage, useUpdateFiles } from '@/hooks/useQueries';
import { generateAIResponse, extractFilesFromResponse } from '@/services/llmService';
import type { Message } from '../backend';
import MessageBubble from '@/components/MessageBubble';

function getProjectTypeIcon(type: string) {
    switch (type) {
        case 'fullstack':
            return <Layers size={16} />;
        case 'mobile':
            return <Smartphone size={16} />;
        case 'landing':
            return <Layout size={16} />;
        default:
            return <Code2 size={16} />;
    }
}

function getProjectTypeLabel(type: string): string {
    switch (type) {
        case 'fullstack':
            return 'Full-Stack App';
        case 'mobile':
            return 'Mobile App';
        case 'landing':
            return 'Landing Page';
        default:
            return 'Custom Project';
    }
}

function getStarterPrompts(projectType: string): string[] {
    switch (projectType) {
        case 'fullstack':
            return [
                'Build a todo app with user auth',
                'Create a blog platform with CRUD',
                'Make an e-commerce store',
            ];
        case 'mobile':
            return [
                'Build a fitness tracker app',
                'Create a recipe app with search',
                'Make a notes app with categories',
            ];
        case 'landing':
            return [
                'Create a SaaS product landing page',
                'Build a portfolio landing page',
                'Make a startup landing page',
            ];
        default:
            return [
                'Build a full-stack web app',
                'Create a REST API with authentication',
                'Make a React dashboard with charts',
            ];
    }
}

export default function ChatPage() {
    const { sessionId } = useParams({ from: '/sessions/$sessionId/chat' });
    const navigate = useNavigate();
    const { data: session, isLoading, error, refetch } = useGetSession(sessionId);
    const addMessage = useAddMessage();
    const updateFiles = useUpdateFiles();

    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [localMessages, setLocalMessages] = useState<Message[]>([]);
    const [localFiles, setLocalFiles] = useState<Record<string, string>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync local state from session data
    useEffect(() => {
        if (session) {
            setLocalMessages(session.messages);
            const filesMap: Record<string, string> = {};
            session.files.forEach((f) => {
                filesMap[f.filename] = f.content;
            });
            setLocalFiles(filesMap);
        }
    }, [session]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages, isGenerating]);

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        const ta = e.currentTarget;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    };

    const handleSend = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || isGenerating || !session) return;

        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        // Optimistically add user message to local state
        const userMsg: Message = {
            role: 'user',
            content: trimmed,
            timestamp: BigInt(Date.now()) * BigInt(1_000_000),
        };
        setLocalMessages((prev) => [...prev, userMsg]);
        setIsGenerating(true);

        try {
            // Persist user message to backend
            await addMessage.mutateAsync({
                sessionId,
                role: 'user',
                content: trimmed,
            });

            // Build message history for LLM
            const history = localMessages
                .filter((m) => m.role === 'user' || m.role === 'assistant')
                .map((m) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                }));

            // Add the current user message to history
            history.push({ role: 'user', content: trimmed });

            // Call LLM — generateAIResponse(messages, projectType)
            const aiResponse = await generateAIResponse(history, session.projectType);

            // Optimistically add assistant message
            const assistantMsg: Message = {
                role: 'assistant',
                content: aiResponse,
                timestamp: BigInt(Date.now()) * BigInt(1_000_000),
            };
            setLocalMessages((prev) => [...prev, assistantMsg]);

            // Persist assistant message to backend
            await addMessage.mutateAsync({
                sessionId,
                role: 'assistant',
                content: aiResponse,
            });

            // Extract and save files — returns Array<{filename, content}>
            const extractedFilesArray = extractFilesFromResponse(aiResponse);
            if (extractedFilesArray.length > 0) {
                // Convert array to Record<string, string> for local state
                const extractedFilesMap: Record<string, string> = {};
                extractedFilesArray.forEach(({ filename, content }) => {
                    extractedFilesMap[filename] = content;
                });

                setLocalFiles((prev) => ({ ...prev, ...extractedFilesMap }));

                // Persist each file to backend
                await Promise.all(
                    extractedFilesArray.map(({ filename, content }) =>
                        updateFiles.mutateAsync({ sessionId, filename, content })
                    )
                );

                toast.success(
                    `${extractedFilesArray.length} file${
                        extractedFilesArray.length > 1 ? 's' : ''
                    } generated`
                );
            }

            // Refetch to sync
            refetch();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            toast.error(`Failed: ${message}`);
            // Remove optimistic user message on error
            setLocalMessages((prev) => prev.filter((m) => m !== userMsg));
        } finally {
            setIsGenerating(false);
        }
    }, [input, isGenerating, session, sessionId, localMessages, addMessage, updateFiles, refetch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleDownloadAll = () => {
        const fileCount = Object.keys(localFiles).length;
        if (fileCount === 0) {
            toast.error('No files to download yet');
            return;
        }

        let content = `# ${session?.name ?? 'Project'}\n`;
        content += `# Generated by Noventra.Ai\n`;
        content += `# Project Type: ${getProjectTypeLabel(session?.projectType ?? 'custom')}\n`;
        content += `# Files: ${fileCount}\n\n`;

        Object.entries(localFiles).forEach(([filename, code]) => {
            content += `${'='.repeat(60)}\n`;
            content += `FILE: ${filename}\n`;
            content += `${'='.repeat(60)}\n\n`;
            content += code;
            content += '\n\n';
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(session?.name ?? 'project')
            .replace(/\s+/g, '-')
            .toLowerCase()}-noventra-ai.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Downloaded ${fileCount} files`);
    };

    const fileCount = Object.keys(localFiles).length;

    if (isLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface-0)' }}
            >
                <div className="flex flex-col items-center gap-4">
                    <Loader2
                        size={32}
                        className="animate-spin"
                        style={{ color: 'var(--indigo)' }}
                    />
                    <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                        Loading session...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface-0)' }}
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <AlertCircle size={32} style={{ color: 'oklch(0.65 0.22 25)' }} />
                    <p className="font-semibold" style={{ color: 'var(--text-bright)' }}>
                        Session not found
                    </p>
                    <button
                        onClick={() => navigate({ to: '/sessions' })}
                        className="btn-secondary text-sm"
                    >
                        Back to Sessions
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--surface-0)' }}
        >
            {/* Header */}
            <header
                className="flex-shrink-0 border-b z-10"
                style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'oklch(0.08 0 0 / 90%)',
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                }}
            >
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
                    {/* Back */}
                    <button
                        onClick={() => navigate({ to: '/sessions' })}
                        className="flex items-center gap-1.5 text-sm flex-shrink-0"
                        style={{ color: 'var(--text-dim)', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-bright)')
                        }
                        onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)')
                        }
                    >
                        <ArrowLeft size={15} />
                    </button>

                    {/* Session info */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--indigo)' }}
                        >
                            <Sparkles size={13} color="white" />
                        </div>
                        <div className="min-w-0">
                            <div
                                className="font-semibold text-sm truncate"
                                style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                            >
                                {session.name}
                            </div>
                            <div
                                className="flex items-center gap-1 text-xs"
                                style={{ color: 'var(--text-dim)' }}
                            >
                                {getProjectTypeIcon(session.projectType)}
                                {getProjectTypeLabel(session.projectType)}
                            </div>
                        </div>
                    </div>

                    {/* File counter */}
                    {fileCount > 0 && (
                        <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs flex-shrink-0"
                            style={{
                                background: 'oklch(0.55 0.22 264 / 12%)',
                                border: '1px solid oklch(0.55 0.22 264 / 20%)',
                                color: 'oklch(0.75 0.18 264)',
                            }}
                        >
                            <FileCode size={12} />
                            {fileCount} file{fileCount !== 1 ? 's' : ''}
                        </div>
                    )}

                    {/* Download */}
                    <button
                        onClick={handleDownloadAll}
                        disabled={fileCount === 0}
                        className="btn-cyan text-xs px-3 py-2 flex-shrink-0"
                        style={{ opacity: fileCount === 0 ? 0.35 : 1 }}
                        title={fileCount === 0 ? 'No files yet' : `Download ${fileCount} files`}
                    >
                        <Download size={14} />
                        Download
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {localMessages.length === 0 ? (
                        <div
                            className="text-center py-20"
                            style={{ animation: 'fade-in 0.4s ease both' }}
                        >
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                style={{
                                    background: 'oklch(0.55 0.22 264 / 10%)',
                                    border: '1px solid oklch(0.55 0.22 264 / 20%)',
                                }}
                            >
                                <Sparkles size={28} style={{ color: 'var(--indigo)' }} />
                            </div>
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)' }}
                            >
                                Ready to build
                            </h3>
                            <p
                                className="text-sm max-w-sm mx-auto"
                                style={{ color: 'var(--text-dim)' }}
                            >
                                Describe what you want to create. I'll generate the complete codebase
                                for you — files, structure, and all.
                            </p>

                            {/* Starter prompts */}
                            <div className="mt-8 flex flex-wrap gap-2 justify-center">
                                {getStarterPrompts(session.projectType).map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => setInput(prompt)}
                                        className="text-xs px-3 py-2 rounded-lg"
                                        style={{
                                            background: 'oklch(0.93 0 0 / 5%)',
                                            border: '1px solid oklch(0.93 0 0 / 10%)',
                                            color: 'var(--text-dim)',
                                            transition: 'background 0.2s ease, color 0.2s ease',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.background =
                                                'oklch(0.93 0 0 / 10%)';
                                            (e.currentTarget as HTMLButtonElement).style.color =
                                                'var(--text-bright)';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.background =
                                                'oklch(0.93 0 0 / 5%)';
                                            (e.currentTarget as HTMLButtonElement).style.color =
                                                'var(--text-dim)';
                                        }}
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {localMessages.map((message, index) => (
                                <div
                                    key={`${message.role}-${index}`}
                                    style={{ animation: 'fade-up 0.3s ease both' }}
                                >
                                    <MessageBubble
                                        role={message.role as 'user' | 'assistant'}
                                        content={message.content}
                                    />
                                </div>
                            ))}

                            {/* Generating indicator */}
                            {isGenerating && (
                                <div style={{ animation: 'fade-up 0.3s ease both' }}>
                                    <div
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                            style={{
                                                background: 'var(--indigo)',
                                            }}
                                        >
                                            <Sparkles size={13} color="white" />
                                        </div>
                                        <div
                                            className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"
                                            style={{
                                                background: 'oklch(0.93 0 0 / 6%)',
                                                border: '1px solid oklch(0.93 0 0 / 10%)',
                                            }}
                                        >
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                                style={{ color: 'var(--indigo)' }}
                                            />
                                            <span
                                                className="text-sm"
                                                style={{ color: 'var(--text-dim)' }}
                                            >
                                                Generating code...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div
                className="flex-shrink-0 border-t"
                style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'oklch(0.08 0 0 / 80%)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div
                        className="flex items-end gap-3 rounded-2xl px-4 py-3"
                        style={{
                            background: 'oklch(0.93 0 0 / 5%)',
                            border: '1px solid oklch(0.93 0 0 / 12%)',
                            transition: 'border-color 0.2s ease',
                        }}
                        onFocus={() => {}}
                    >
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe what you want to build or modify... (Enter to send, Shift+Enter for new line)"
                            rows={1}
                            disabled={isGenerating}
                            className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed"
                            style={{
                                color: 'var(--text-bright)',
                                fontFamily: 'Inter',
                                minHeight: '24px',
                                maxHeight: '160px',
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isGenerating}
                            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                            style={{
                                background:
                                    input.trim() && !isGenerating
                                        ? 'var(--indigo)'
                                        : 'oklch(0.93 0 0 / 8%)',
                                color:
                                    input.trim() && !isGenerating
                                        ? 'white'
                                        : 'var(--text-faint)',
                                cursor:
                                    input.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                                transition: 'background 0.2s ease',
                            }}
                        >
                            {isGenerating ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Send size={14} />
                            )}
                        </button>
                    </div>
                    <p
                        className="text-center text-xs mt-2"
                        style={{ color: 'var(--text-faint)' }}
                    >
                        Noventra.Ai generates complete, production-ready code
                    </p>
                </div>
            </div>
        </div>
    );
}
