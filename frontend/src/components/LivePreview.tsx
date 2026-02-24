import { useState, useRef, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Eye } from 'lucide-react';

interface LivePreviewProps {
  html: string;
  title?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

const viewportWidths: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function LivePreview({ html, title = 'Preview' }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setKey((k) => k + 1);
  }, [html]);

  const openInNewTab = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-indigo-500/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2/50">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-text-muted">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Viewport controls */}
          <div className="flex items-center gap-0.5 bg-surface-3 rounded-lg p-0.5 mr-2">
            {([
              { id: 'desktop', Icon: Monitor },
              { id: 'tablet', Icon: Tablet },
              { id: 'mobile', Icon: Smartphone },
            ] as { id: ViewportSize; Icon: React.ElementType }[]).map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setViewport(id)}
                className={`p-1.5 rounded-md transition-all ${
                  viewport === id
                    ? 'bg-indigo-600 text-white'
                    : 'text-text-muted hover:text-text'
                }`}
                title={id.charAt(0).toUpperCase() + id.slice(1)}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-md text-text-muted hover:text-text transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={openInNewTab}
            className="p-1.5 rounded-md text-text-muted hover:text-text transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="bg-surface-3/30 p-4 flex justify-center min-h-[500px]">
        <div
          className="transition-all duration-300 w-full"
          style={{ maxWidth: viewportWidths[viewport] }}
        >
          <iframe
            key={key}
            ref={iframeRef}
            srcDoc={html}
            className="w-full rounded-xl border border-border/50 shadow-xl"
            style={{ height: '520px' }}
            sandbox="allow-scripts allow-same-origin"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
