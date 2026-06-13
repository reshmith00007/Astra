import { useState } from "react";
import { X, Zap, Trash2, Save, Key, Sliders, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsModal({ settings, onUpdate, onClose, onClearAll, conversationCount }) {
  const [form, setForm] = useState({ ...settings });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  function save() {
    onUpdate(form);
    toast.success("Settings saved");
    onClose();
  }

  function handleClearAll() {
    onClearAll();
    toast.success("All conversations cleared");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-nebula border border-stardust rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stardust">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pulse to-glow flex items-center justify-center">
              <Sliders size={15} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-starlight text-base">Settings</h2>
              <p className="text-[11px] text-twilight">Customize your Nova experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/8 text-moonbeam transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-6">
          {/* API Key reminder */}
          <div className="rounded-xl p-4 bg-aurora border border-stardust/60">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-pulse/20 flex items-center justify-center shrink-0 mt-0.5">
                <Key size={13} className="text-flare" />
              </div>
              <div>
                <p className="text-sm font-semibold text-starlight mb-1">API Key</p>
                <p className="text-xs text-twilight leading-relaxed">
                  Set <code className="bg-stardust px-1 py-0.5 rounded text-flare">API_KEY</code> in your{" "}
                  <code className="bg-stardust px-1 py-0.5 rounded text-flare">.env.local</code> file or Vercel environment variables.
                  Get a free key at{" "}
                  <a
                    href="https://"
                    target="_blank"
                    rel="noreferrer"
                    className="text-flare underline hover:text-shimmer"
                  >
                    
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Default model */}
          <div>
            <label className="block text-sm font-semibold text-starlight mb-2">
              Default Model
            </label>
            <select
              value={form.model}
              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              className="w-full bg-aurora border border-stardust rounded-xl px-3 py-2.5 text-sm text-moonbeam outline-none focus:border-pulse/50 transition-colors"
            >
              <option value="llama-3.3-70b-versatile">Nova Pro — Best overall</option>
              <option value="llama-3.1-8b-instant">Nova Lite — Fastest</option>
              <option value="mixtral-8x7b-32768">Nova Code — Great for coding</option>
              <option value="gemma2-9b-it">Nova Mini — Efficient</option>
              <option value="llama-3.3-70b-specdec">Nova Turbo — Experimental</option>
            </select>
          </div>

          {/* System prompt */}
          <div>
            <label className="block text-sm font-semibold text-starlight mb-1">
              Custom System Prompt
            </label>
            <p className="text-xs text-twilight mb-2">
              Override Nova's default personality. Leave blank to use default.
            </p>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
              placeholder="e.g. You are a helpful coding assistant who always explains code line-by-line..."
              rows={4}
              className="w-full bg-aurora border border-stardust rounded-xl px-3 py-2.5 text-sm text-moonbeam placeholder-twilight outline-none focus:border-pulse/50 transition-colors resize-none"
            />
          </div>

          {/* Advanced */}
          <div>
            <button
              onClick={() => setAdvancedOpen((p) => !p)}
              className="flex items-center gap-2 text-sm font-semibold text-moonbeam hover:text-starlight transition-colors"
            >
              Advanced settings
              {advancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {advancedOpen && (
              <div className="mt-4 space-y-4 pl-1">
                {/* Temperature */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-starlight">
                      Temperature
                    </label>
                    <span className="text-sm font-mono text-flare bg-pulse/10 px-2 py-0.5 rounded-md">
                      {form.temperature ?? 0.7}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={form.temperature ?? 0.7}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, temperature: parseFloat(e.target.value) }))
                    }
                    className="w-full accent-pulse"
                  />
                  <div className="flex justify-between text-[10px] text-twilight mt-1">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div className="rounded-xl border border-red-500/20 p-4 bg-red-500/5">
            <p className="text-sm font-semibold text-red-400 mb-1">Danger zone</p>
            <p className="text-xs text-twilight mb-3">
              {conversationCount} conversation{conversationCount !== 1 ? "s" : ""} stored locally.
              This cannot be undone.
            </p>
            {showClearConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-400 transition-colors"
                >
                  Yes, delete all
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-aurora border border-stardust text-moonbeam text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                disabled={conversationCount === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
                Clear all conversations
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stardust flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-stardust text-moonbeam text-sm hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="flex-1 py-2.5 rounded-xl btn-primary text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-purple-500/30 relative z-10"
          >
            <Save size={14} />
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
