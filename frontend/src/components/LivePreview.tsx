import React, { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink, Code2 } from "lucide-react";

interface LivePreviewProps {
  htmlContent: string;
  onViewCode?: () => void;
}

type ViewMode = "desktop" | "tablet" | "mobile";

const viewModeConfig: Record<ViewMode, { width: string; icon: React.ReactNode; label: string }> = {
  desktop: { width: "100%", icon: <Monitor className="w-4 h-4" />, label: "Desktop" },
  tablet: { width: "768px", icon: <Tablet className="w-4 h-4" />, label: "Tablet" },
  mobile: { width: "390px", icon: <Smartphone className="w-4 h-4" />, label: "Mobile" },
};

/**
 * Injects an error handler script into HTML content so that media errors
 * inside the iframe are caught gracefully instead of bubbling up as unhandled
 * MediaError / net::ERR_BLOCKED_BY_RESPONSE errors.
 */
function sanitizeHtmlForPreview(html: string): string {
  if (!html) return html;

  // Inject a small error-handler script right after <head> (or at the top)
  const errorHandlerScript = `
<script>
(function() {
  // Gracefully handle media errors inside the preview iframe
  document.addEventListener('error', function(e) {
    var el = e.target;
    if (el && (el.tagName === 'AUDIO' || el.tagName === 'VIDEO')) {
      // Replace broken media with a styled placeholder
      var placeholder = document.createElement('div');
      placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;background:#1a1a2e;border:1px solid #333;border-radius:8px;padding:16px;color:#888;font-family:sans-serif;font-size:13px;min-height:60px;';
      placeholder.textContent = '⚠ Media unavailable in preview';
      if (el.parentNode) el.parentNode.replaceChild(placeholder, el);
    }
  }, true);

  // Override AudioContext to prevent "not allowed to start" warnings
  // by auto-resuming on any user interaction
  var _AudioContext = window.AudioContext || window.webkitAudioContext;
  if (_AudioContext) {
    var _orig = _AudioContext.prototype.constructor;
    document.addEventListener('click', function resumeCtx() {
      document.querySelectorAll('audio, video').forEach(function(m) {
        if (m.paused) { try { m.play().catch(function(){}); } catch(e){} }
      });
    }, { once: true });
  }
})();
</script>`;

  // Insert after <head> tag if present, otherwise prepend
  if (/<head[\s>]/i.test(html)) {
    return html.replace(/(<head[^>]*>)/i, `$1${errorHandlerScript}`);
  }
  return errorHandlerScript + html;
}

export default function LivePreview({ htmlContent, onViewCode }: LivePreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const prevUrlRef = useRef<string>("");

  useEffect(() => {
    if (!htmlContent) {
      setBlobUrl("");
      return;
    }
    const sanitized = sanitizeHtmlForPreview(htmlContent);
    const blob = new Blob([sanitized], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
    }
    prevUrlRef.current = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [htmlContent, refreshKey]);

  if (!htmlContent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background/50">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Monitor className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <h3 className="text-base font-medium text-foreground/60 mb-2">Live preview will appear here</h3>
        <p className="text-sm text-muted-foreground/40 max-w-xs leading-relaxed">
          Send a message to generate your application and see it rendered in real time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-background/50 shrink-0">
        {/* View mode toggles */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={viewModeConfig[mode].label}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                viewMode === mode
                  ? "bg-brand/20 text-brand"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {viewModeConfig[mode].icon}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {onViewCode && (
            <button
              onClick={onViewCode}
              title="View Code"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <Code2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            title="Refresh preview"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {blobUrl && (
            <a
              href={blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-zinc-950 flex justify-center min-h-0 p-4">
        <div
          className="h-full transition-all duration-300 rounded-lg overflow-hidden border border-white/10 shadow-2xl"
          style={{ width: viewModeConfig[viewMode].width, minHeight: "100%" }}
        >
          {blobUrl && (
            <iframe
              key={`${blobUrl}-${refreshKey}`}
              src={blobUrl}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-pointer-lock"
              allow="autoplay; microphone; camera"
              title="Live Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
}
