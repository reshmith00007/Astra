import { Menu, Settings, Plus, Download, Zap } from "lucide-react";

const MODELS_SHORT = {
  "llama-3.3-70b-versatile": "Nova Pro",
  "llama-3.1-8b-instant": "Nova Lite",
  "mixtral-8x7b-32768": "Nova Code",
  "gemma2-9b-it": "Nova Mini",
  "llama-3.3-70b-specdec": "Nova Turbo",
};

export default function TopBar({
  conversation,
  onMenuToggle,
  onNewChat,
  onSettings,
  onExport,
  isStreaming,
}) {
  return (
    <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-stardust/40 bg-cosmos/80 backdrop-blur-xl z-10">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl hover:bg-white/8 text-moonbeam transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="md:hidden flex items-center gap-2">
          {!conversation ? (
            <>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pulse to-glow flex items-center justify-center">
                <Zap size={13} className="text-white" fill="white" />
              </div>
              <span className="font-bold text-starlight text-sm">Nova</span>
            </>
          ) : (
            <p className="font-semibold text-starlight text-sm truncate max-w-[160px]">
              {conversation.title}
            </p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {conversation ? (
            <>
              <p className="font-semibold text-starlight truncate max-w-xs">
                {conversation.title}
              </p>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-pulse/15 text-flare border border-pulse/20">
                {MODELS_SHORT[conversation.model] || "Nova"}
              </span>
              {conversation.messages.length > 0 && (
                <span className="text-xs text-twilight">
                  {conversation.messages.length} messages
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pulse to-glow flex items-center justify-center">
                <Zap size={13} className="text-white" fill="white" />
              </div>
              <span className="font-bold text-starlight">Nova AI</span>
            </div>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {isStreaming && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-pulse/15 border border-pulse/30 mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pulse animate-pulse" />
            <span className="text-xs text-flare font-medium">Generating…</span>
          </div>
        )}

        {conversation && conversation.messages.length > 0 && (
          <button
            onClick={() => onExport(conversation.id)}
            className="p-2 rounded-xl hover:bg-white/8 text-moonbeam hover:text-starlight transition-colors"
            title="Export conversation"
          >
            <Download size={16} />
          </button>
        )}

        <button
          onClick={onNewChat}
          className="p-2 rounded-xl hover:bg-white/8 text-moonbeam hover:text-starlight transition-colors"
          title="New conversation"
        >
          <Plus size={18} />
        </button>

        <button
          onClick={onSettings}
          className="p-2 rounded-xl hover:bg-white/8 text-moonbeam hover:text-starlight transition-colors"
          title="Settings"
        >
          <Settings size={17} />
        </button>
      </div>
    </div>
  );
}
