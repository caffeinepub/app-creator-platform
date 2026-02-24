import { useEffect, useRef } from 'react';
import CodeBlock from './CodeBlock';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
}

function parseMessageContent(content: string): React.ReactNode[] {
    // Split by code blocks with optional filename tag
    const parts = content.split(/(```(?:filename:\s*[^\n]+\n)?[\s\S]*?```)/g);

    return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
            // Extract filename if present
            const filenameMatch = part.match(/^```filename:\s*([^\n]+)\n/);
            const filename = filenameMatch ? filenameMatch[1].trim() : undefined;

            // Extract language and code
            let inner = part.slice(3, -3); // remove ``` delimiters
            if (filenameMatch) {
                inner = inner.replace(/^filename:\s*[^\n]+\n/, '');
            }

            const langMatch = inner.match(/^(\w[\w-]*)\n/);
            const language = langMatch ? langMatch[1] : 'text';
            const code = langMatch ? inner.slice(langMatch[0].length) : inner;

            return (
                <CodeBlock
                    key={index}
                    code={code.trim()}
                    language={language}
                    filename={filename}
                />
            );
        }

        if (!part.trim()) return null;

        return (
            <div key={index} className="whitespace-pre-wrap leading-relaxed text-sm">
                {part}
            </div>
        );
    });
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = role === 'user' ? 'translateX(10px)' : 'translateX(-10px)';
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        });
    }, [role]);

    if (role === 'user') {
        return (
            <div className="flex justify-end">
                <div
                    ref={ref}
                    className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
                    style={{
                        background: 'var(--indigo)',
                        color: 'oklch(0.97 0 0)',
                        fontFamily: 'Inter',
                    }}
                >
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start">
            <div
                ref={ref}
                className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{
                    background: 'oklch(0.93 0 0 / 5%)',
                    border: '1px solid oklch(0.93 0 0 / 10%)',
                    color: 'var(--text-bright)',
                    fontFamily: 'Inter',
                }}
            >
                {parseMessageContent(content)}
            </div>
        </div>
    );
}
