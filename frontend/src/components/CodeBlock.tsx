import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = 'html', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName = filename || language;

  return (
    <div className="rounded-xl overflow-hidden border border-border/60 my-3 shadow-glass">
      {/* Terminal Chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-raised border-b border-border/40">
        <div className="flex items-center gap-2">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" style={{ boxShadow: '0 0 6px oklch(0.55 0.22 25 / 0.6)' }} />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" style={{ boxShadow: '0 0 6px oklch(0.75 0.18 80 / 0.6)' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.72 0.18 195)', boxShadow: '0 0 6px oklch(0.72 0.18 195 / 0.6)' }} />
          </div>
          {displayName && (
            <span className="text-xs text-text-muted font-mono ml-2">{displayName}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium
            transition-all duration-200
            ${copied
              ? 'text-cyan border border-cyan/40 bg-cyan/10'
              : 'text-text-muted border border-border/40 hover:text-text-primary hover:border-border hover:bg-surface'
            }
          `}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code Content */}
      <div className="bg-surface overflow-x-auto">
        <pre className="p-4 text-sm font-mono text-text-primary leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
