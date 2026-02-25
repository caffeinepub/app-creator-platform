import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from 'lucide-react';

interface LivePreviewProps {
  html: string;
}

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function LivePreview({ html }: LivePreviewProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const blobUrl = React.useMemo(() => {
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [html, refreshKey]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const handleOpenNew = () => {
    window.open(blobUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 glass border-b border-border/40">
        {/* Viewport Buttons */}
        <div className="flex items-center gap-1 glass rounded-lg p-1 border border-border/40">
          {(['desktop', 'tablet', 'mobile'] as Viewport[]).map((v) => {
            const Icon = v === 'desktop' ? Monitor : v === 'tablet' ? Tablet : Smartphone;
            return (
              <button
                key={v}
                onClick={() => setViewport(v)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                  transition-all duration-200
                  ${viewport === v
                    ? 'bg-cyan/20 text-cyan border border-cyan/40 shadow-cyan-glow-sm'
                    : 'text-text-muted hover:text-text-primary'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline capitalize">{v}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md text-text-muted hover:text-brand hover:bg-brand/10 transition-all duration-200"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenNew}
            className="p-1.5 rounded-md text-text-muted hover:text-cyan hover:bg-cyan/10 transition-all duration-200"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-auto bg-surface flex items-start justify-center p-4">
        <div
          className="transition-all duration-300 h-full"
          style={{ width: VIEWPORT_WIDTHS[viewport], minHeight: '400px' }}
        >
          <iframe
            ref={iframeRef}
            key={refreshKey}
            src={blobUrl}
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full min-h-[400px] rounded-lg border border-border/40"
            style={{ boxShadow: '0 0 20px oklch(0.72 0.18 195 / 0.15)' }}
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );
}
