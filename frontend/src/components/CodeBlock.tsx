import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
}

export default function CodeBlock({ code, language = 'text', filename }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback: select text
        }
    };

    return (
        <div className="terminal-chrome my-3 overflow-hidden">
            {/* Terminal chrome header */}
            <div className="terminal-dots">
                <div className="terminal-dot" style={{ background: '#ff5f56' }} />
                <div className="terminal-dot" style={{ background: '#ffbd2e' }} />
                <div className="terminal-dot" style={{ background: '#27c93f' }} />
                {filename && (
                    <span
                        className="ml-3 text-xs truncate max-w-xs"
                        style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}
                    >
                        {filename}
                    </span>
                )}
                {!filename && language && language !== 'text' && (
                    <span
                        className="ml-3 text-xs"
                        style={{ color: 'var(--text-faint)', fontFamily: 'JetBrains Mono' }}
                    >
                        {language}
                    </span>
                )}
                <button
                    onClick={handleCopy}
                    className="ml-auto flex items-center gap-1.5 text-xs px-2 py-1 rounded-md"
                    style={{
                        color: copied ? 'oklch(0.70 0.18 162)' : 'var(--text-dim)',
                        background: 'oklch(0.93 0 0 / 6%)',
                        border: '1px solid oklch(0.93 0 0 / 10%)',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                    }}
                    title="Copy code"
                >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            {/* Code content */}
            <div className="overflow-x-auto">
                <pre
                    style={{
                        margin: 0,
                        padding: '16px 20px',
                        background: 'transparent',
                        fontSize: '13px',
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineHeight: '1.65',
                        color: 'oklch(0.88 0.03 264)',
                        whiteSpace: 'pre',
                        overflowX: 'auto',
                    }}
                >
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
