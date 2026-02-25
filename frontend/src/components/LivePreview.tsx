import React, { useEffect, useRef, useState } from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink } from "lucide-react";

interface LivePreviewProps {
  htmlContent: string;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportWidths: Record<ViewportSize, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export default function LivePreview({ htmlContent }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const prevBlobUrlRef = useRef<string>("");

  // Update blob URL whenever htmlContent or refreshKey changes
  useEffect(() => {
    // Revoke previous blob URL to prevent memory leaks
    if (prevBlobUrlRef.current) {
      URL.revokeObjectURL(prevBlobUrlRef.current);
      prevBlobUrlRef.current = "";
    }

    if (!htmlContent || htmlContent.trim().length === 0) {
      setBlobUrl("");
      return;
    }

    try {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      prevBlobUrlRef.current = url;
      setBlobUrl(url);
    } catch (err) {
      console.error("Failed to create blob URL for preview:", err);
      setBlobUrl("");
    }

    // Cleanup on unmount
    return () => {
      if (prevBlobUrlRef.current) {
        URL.revokeObjectURL(prevBlobUrlRef.current);
        prevBlobUrlRef.current = "";
      }
    };
  }, [htmlContent, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleOpenInNewTab = () => {
    if (!htmlContent || htmlContent.trim().length === 0) return;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    // Revoke after a short delay to allow the tab to load
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const isEmpty = !htmlContent || htmlContent.trim().length === 0;

  return (
    <div className="flex flex-col h-full bg-surface-1 rounded-xl overflow-hidden border border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-2 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewport("desktop")}
            title="Desktop"
            className={`p-1.5 rounded transition-colors ${
              viewport === "desktop"
                ? "text-brand bg-brand/10"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewport("tablet")}
            title="Tablet"
            className={`p-1.5 rounded transition-colors ${
              viewport === "tablet"
                ? "text-brand bg-brand/10"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setViewport("mobile")}
            title="Mobile"
            className={`p-1.5 rounded transition-colors ${
              viewport === "mobile"
                ? "text-brand bg-brand/10"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Smartphone size={16} />
          </button>
        </div>

        <span className="text-xs text-text-muted font-mono">
          {isEmpty ? "No preview" : `${viewport} view`}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            disabled={isEmpty}
            title="Refresh preview"
            className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleOpenInNewTab}
            disabled={isEmpty}
            title="Open in new tab"
            className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-zinc-900 flex items-start justify-center p-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full w-full text-center gap-3 py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center">
              <Monitor size={28} className="text-text-muted" />
            </div>
            <p className="text-text-muted text-sm font-medium">Live preview will appear here</p>
            <p className="text-text-muted/60 text-xs max-w-xs">
              Send a message to generate your application and see it rendered in real time.
            </p>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
            style={{
              width: viewportWidths[viewport],
              maxWidth: "100%",
              minHeight: "500px",
              height: "100%",
            }}
          >
            {blobUrl && (
              <iframe
                ref={iframeRef}
                key={blobUrl}
                src={blobUrl}
                title="Live Preview"
                className="w-full h-full border-0"
                style={{ minHeight: "500px", display: "block" }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
