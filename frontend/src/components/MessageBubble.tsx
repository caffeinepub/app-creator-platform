import React from "react";
import { Sparkles, User, AlertTriangle } from "lucide-react";
import { Message } from "../backend";
import CodeBlock from "./CodeBlock";

interface MessageBubbleProps {
  message: Message;
  isError?: boolean;
}

function parseMessageContent(
  content: string
): Array<{ type: "text" | "code"; content: string; language?: string }> {
  const parts: Array<{ type: "text" | "code"; content: string; language?: string }> = [];
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) parts.push({ type: "text", content: text });
    }
    parts.push({ type: "code", content: match[2].trim(), language: match[1] || "text" });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim();
    if (text) parts.push({ type: "text", content: text });
  }

  return parts.length > 0 ? parts : [{ type: "text", content }];
}

export default function MessageBubble({ message, isError = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const parts = parseMessageContent(message.content);

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[75%] flex items-end gap-2">
          <div className="btn-primary px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-lg shadow-brand/20">
            {message.content}
          </div>
          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mb-0.5">
            <User className="w-3.5 h-3.5 text-foreground/70" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[85%] flex items-start gap-2">
          <div className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-red-300 leading-relaxed">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%] flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
        </div>
        <div className="glass-card border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-foreground/90 leading-relaxed space-y-3">
          {parts.map((part, i) =>
            part.type === "code" ? (
              <CodeBlock key={i} code={part.content} language={part.language} />
            ) : (
              <p key={i} className="whitespace-pre-wrap">
                {part.content}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
