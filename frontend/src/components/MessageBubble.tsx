import React from 'react';
import { Sparkles, User } from 'lucide-react';
import CodeBlock from './CodeBlock';
import type { Message } from '../backend';

interface MessageBubbleProps {
  message: Message;
  onShowPreview?: (html: string) => void;
}

function parseMessageContent(content: string): Array<{ type: 'text' | 'code'; content: string; language?: string; filename?: string }> {
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string; filename?: string }> = [];
  const codeBlockRegex = /```(\w+)?(?:\s+([^\n]+))?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) parts.push({ type: 'text', content: text });
    }
    parts.push({
      type: 'code',
      language: match[1] || 'text',
      filename: match[2],
      content: match[3].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim();
    if (text) parts.push({ type: 'text', content: text });
  }

  return parts.length > 0 ? parts : [{ type: 'text', content }];
}

function extractHtml(content: string): string | null {
  const htmlMatch = content.match(/```html(?:\s+[^\n]+)?\n([\s\S]*?)```/);
  return htmlMatch ? htmlMatch[1].trim() : null;
}

export default function MessageBubble({ message, onShowPreview }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const parts = parseMessageContent(message.content);
  const htmlContent = !isUser ? extractHtml(message.content) : null;

  return (
    <div className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
        ${isUser
          ? 'bg-surface-raised border border-border/60'
          : 'border border-brand/40'
        }
      `}
        style={!isUser ? {
          background: 'linear-gradient(135deg, oklch(0.65 0.22 25 / 0.3), oklch(0.72 0.18 195 / 0.2))',
          boxShadow: '0 0 10px oklch(0.65 0.22 25 / 0.3)',
        } : {}}
      >
        {isUser
          ? <User className="w-4 h-4 text-text-secondary" />
          : <Sparkles className="w-4 h-4 text-brand" />
        }
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {parts.map((part, i) => (
          part.type === 'code' ? (
            <div key={i} className="w-full">
              <CodeBlock
                code={part.content}
                language={part.language}
                filename={part.filename}
              />
            </div>
          ) : (
            <div
              key={i}
              className={`
                px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${isUser
                  ? 'rounded-tr-sm text-white'
                  : 'rounded-tl-sm glass border border-border/40 text-text-primary'
                }
              `}
              style={isUser ? {
                background: 'linear-gradient(135deg, oklch(0.65 0.22 25), oklch(0.55 0.22 20))',
                boxShadow: '0 0 15px oklch(0.65 0.22 25 / 0.3)',
              } : {}}
            >
              {part.content}
            </div>
          )
        ))}

        {/* Preview Button */}
        {htmlContent && onShowPreview && (
          <button
            onClick={() => onShowPreview(htmlContent)}
            className="text-xs text-cyan hover:text-cyan-light border border-cyan/30 hover:border-cyan/60 px-3 py-1.5 rounded-lg glass transition-all duration-200 hover:shadow-cyan-glow-sm"
          >
            👁 Show Live Preview
          </button>
        )}
      </div>
    </div>
  );
}
