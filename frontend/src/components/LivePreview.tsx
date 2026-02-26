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
 * Injects a comprehensive polyfill/override script into HTML content so that:
 * - alert() / confirm() / prompt() dialogs are suppressed (they block the parent page)
 * - new Audio() calls with file paths silently no-op instead of throwing errors
 * - <audio>/<video> element errors are caught and replaced with a placeholder
 * - AudioContext is auto-resumed on first user interaction
 */
function sanitizeHtmlForPreview(html: string): string {
  if (!html) return html;

  const injectedScript = `
<script>
(function() {
  // ── 1. Suppress all dialog calls that would block the parent page ──────────
  window.alert   = function(msg) { console.warn('[preview] alert suppressed:', msg); };
  window.confirm = function(msg) { console.warn('[preview] confirm suppressed:', msg); return true; };
  window.prompt  = function(msg) { console.warn('[preview] prompt suppressed:', msg); return null; };

  // ── 2. Replace file-based Audio with a silent Web Audio API synthesizer ────
  //    This prevents "Error loading sound" errors when the AI generates code
  //    that tries to load .mp3/.wav files that don't exist in the preview.
  var _OrigAudio = window.Audio;
  window.Audio = function(src) {
    // If no src or src is a data URI / blob URL, use the real Audio element
    if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
      return new _OrigAudio(src);
    }
    // Otherwise return a silent no-op stub so file-not-found errors are swallowed
    var stub = {
      src: src,
      volume: 1,
      loop: false,
      paused: true,
      currentTime: 0,
      duration: 0,
      muted: false,
      autoplay: false,
      controls: false,
      _listeners: {},
      play: function() {
        stub.paused = false;
        // Try to synthesize a short beep via Web Audio API as a best-effort fallback
        try {
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            var ctx = new AudioCtx();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.22);
          }
        } catch(e) {}
        return Promise.resolve();
      },
      pause: function() { stub.paused = true; },
      load: function() {},
      addEventListener: function(type, fn) {
        stub._listeners[type] = stub._listeners[type] || [];
        stub._listeners[type].push(fn);
      },
      removeEventListener: function(type, fn) {
        if (stub._listeners[type]) {
          stub._listeners[type] = stub._listeners[type].filter(function(f) { return f !== fn; });
        }
      },
      dispatchEvent: function() { return true; },
      setAttribute: function() {},
      getAttribute: function() { return null; },
      cloneNode: function() { return stub; },
    };
    return stub;
  };
  // Copy static properties from the original Audio constructor
  try {
    Object.keys(_OrigAudio).forEach(function(k) {
      try { window.Audio[k] = _OrigAudio[k]; } catch(e) {}
    });
  } catch(e) {}

  // ── 3. Gracefully handle <audio>/<video> element load errors ──────────────
  document.addEventListener('error', function(e) {
    var el = e.target;
    if (el && (el.tagName === 'AUDIO' || el.tagName === 'VIDEO')) {
      console.warn('[preview] Media load error suppressed for:', el.src || el.currentSrc);
      // Replace broken media element with a styled placeholder
      var placeholder = document.createElement('div');
      placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;background:#1a1a2e;border:1px solid #333;border-radius:8px;padding:12px 16px;color:#888;font-family:sans-serif;font-size:12px;min-height:48px;';
      placeholder.textContent = '🔇 Audio unavailable in preview (Web Audio API is active)';
      if (el.parentNode) el.parentNode.replaceChild(placeholder, el);
    }
  }, true);

  // ── 4. Auto-resume AudioContext on first user interaction ─────────────────
  function resumeAllContexts() {
    if (window._previewAudioCtx && window._previewAudioCtx.state === 'suspended') {
      window._previewAudioCtx.resume().catch(function(){});
    }
  }
  document.addEventListener('click', resumeAllContexts, { passive: true });
  document.addEventListener('keydown', resumeAllContexts, { passive: true });
  document.addEventListener('touchstart', resumeAllContexts, { passive: true });

  // ── 5. Patch XMLHttpRequest and fetch to silently fail for audio file requests ──
  //    Prevents net::ERR_FILE_NOT_FOUND errors from audio file fetches
  var audioExtensions = /\.(mp3|wav|ogg|aac|flac|m4a|opus|weba)(\?.*)?$/i;
  var _origFetch = window.fetch;
  window.fetch = function(input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (audioExtensions.test(url)) {
      console.warn('[preview] Audio file fetch suppressed:', url);
      return Promise.reject(new Error('Audio file not available in preview'));
    }
    return _origFetch.apply(this, arguments);
  };

  var _origXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string' && audioExtensions.test(url)) {
      console.warn('[preview] Audio XHR suppressed:', url);
      this._suppressedAudio = true;
    }
    return _origXHROpen.apply(this, arguments);
  };
  var _origXHRSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    if (this._suppressedAudio) return;
    return _origXHRSend.apply(this, arguments);
  };
})();
</script>`;

  // Insert right after <head> tag if present, otherwise prepend before everything
  if (/<head[\s>]/i.test(html)) {
    return html.replace(/(<head[^>]*>)/i, `$1${injectedScript}`);
  }
  return injectedScript + html;
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
