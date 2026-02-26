import React, { useState } from "react";
import { Key, ExternalLink, Eye, EyeOff, CheckCircle, X } from "lucide-react";
import { setStoredApiKey, getStoredApiKey, clearStoredApiKey } from "../services/llmService";

interface ApiKeySetupProps {
  onClose?: () => void;
  onSaved?: () => void;
  isModal?: boolean;
}

export default function ApiKeySetup({ onClose, onSaved, isModal = false }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError("Please enter an API key.");
      return;
    }
    if (!trimmed.startsWith("sk-or-")) {
      setError("OpenRouter API keys start with 'sk-or-'. Please check your key.");
      return;
    }
    setStoredApiKey(trimmed);
    setSaved(true);
    setError("");
    setTimeout(() => {
      setSaved(false);
      onSaved?.();
    }, 1200);
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKey("");
    setSaved(false);
  };

  const currentKey = getStoredApiKey();
  const maskedKey = currentKey
    ? currentKey.slice(0, 10) + "••••••••••••••••••••" + currentKey.slice(-4)
    : "";

  return (
    <div className={isModal ? "" : "p-6"}>
      {isModal && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center">
              <Key className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">API Key Settings</h2>
              <p className="text-sm text-muted-foreground">Configure your OpenRouter API key</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Info box */}
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Noventra.ai uses{" "}
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand/80 underline underline-offset-2"
            >
              OpenRouter
            </a>{" "}
            to power AI generation. Get a free API key at{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand/80 inline-flex items-center gap-1 underline underline-offset-2"
            >
              openrouter.ai/keys <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        {/* Current key display */}
        {currentKey && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current key</p>
              <p className="text-sm font-mono text-foreground/80">{maskedKey}</p>
            </div>
            <button
              onClick={handleClear}
              className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
            >
              Remove
            </button>
          </div>
        )}

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">
            {currentKey ? "Update API Key" : "Enter API Key"}
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
                setSaved(false);
              }}
              placeholder="sk-or-v1-..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saved}
          className="w-full btn-primary py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Key className="w-4 h-4" />
              Save API Key
            </>
          )}
        </button>
      </div>
    </div>
  );
}
