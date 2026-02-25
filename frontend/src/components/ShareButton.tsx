import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard!', {
        duration: 2500,
        style: {
          background: 'oklch(0.11 0.015 260)',
          border: '1px solid oklch(0.72 0.18 195 / 0.4)',
          color: 'oklch(0.92 0.02 200)',
        },
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
        glass border transition-all duration-200
        ${copied
          ? 'border-cyan/60 text-cyan shadow-cyan-glow-sm'
          : 'border-border text-text-secondary hover:text-cyan hover:border-cyan/50 hover:shadow-cyan-glow-sm'
        }
      `}
      title="Copy link"
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}
