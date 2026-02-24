import { useEffect, useRef, useState } from 'react';
import { Bot, User } from 'lucide-react';
import CodeBlock from './CodeBlock';
import LivePreview from './LivePreview';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  showPreview?: boolean;
}

interface ParsedSegment {
  type: 'text' | 'code';
  content: string;
  language?: string;
  filename?: string;
}

function parseContent(content: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const codeBlockRegex = /```(\w+)?(?:\s+(?:filename=|filepath=)?["']?([^\s"'\n]+)["']?)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    segments.push({
      type: 'code',
      language: match[1] || 'text',
      filename: match[2],
      content: match[3].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: 'text', content: content.slice(lastIndex) });
  }

  return segments;
}

function extractHtmlFromContent(content: string): string | null {
  const htmlMatch =
    content.match(/```(?:html)?\s+(?:filename=|filepath=)?["']?([^\s"'\n]*\.html[^\s"'\n]*)["']?\n([\s\S]*?)```/i);
  if (htmlMatch) return htmlMatch[2].trim();

  const genericHtmlMatch = content.match(/```html\n([\s\S]*?)```/i);
  if (genericHtmlMatch) return genericHtmlMatch[1].trim();

  return null;
}

function renderText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="text-text font-semibold">{part}</strong>
          ) : (
            part
          )
        )}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function MessageBubble({ role, content, showPreview = true }: MessageBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isUser = role === 'user';
  const segments = parseContent(content);
  const htmlContent = !isUser && showPreview ? extractHtmlFromContent(content) : null;

  return (
    <div
      ref={ref}
      className={`flex gap-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-indigo-600'
            : 'bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-indigo-500/30'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-indigo-400" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {isUser ? (
          <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-text">
            {content}
          </div>
        ) : (
          <div className="w-full space-y-2">
            {segments.map((seg, i) =>
              seg.type === 'code' ? (
                <CodeBlock
                  key={i}
                  code={seg.content}
                  language={seg.language}
                  filename={seg.filename}
                />
              ) : (
                <div key={i} className="text-sm text-text-muted leading-relaxed">
                  {renderText(seg.content)}
                </div>
              )
            )}

            {htmlContent && (
              <LivePreview html={htmlContent} title="Live Preview" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
