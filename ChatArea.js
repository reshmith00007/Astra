import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import WelcomeScreen from "./WelcomeScreen";
import { Zap } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3 msg-animate">
      <div className="shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pulse to-glow flex items-center justify-center animate-pulse">
          <Zap size={14} className="text-white" fill="white" />
        </div>
      </div>
      <div className="flex flex-col items-start max-w-[75%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-moonbeam">Nova</span>
          <span className="text-[10px] text-twilight">thinking…</span>
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-nebula border border-stardust/60 px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pulse typing-dot" />
            <span className="w-2 h-2 rounded-full bg-glow typing-dot" />
            <span className="w-2 h-2 rounded-full bg-flare typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatArea({
  messages,
  isStreaming,
  streamingContent,
  onDelete,
  onRegenerate,
  onSuggestion,
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingContent]);

  const isEmpty = !messages || messages.length === 0;
  const showTyping = isStreaming && !streamingContent;
  const hasStreamingMsg = isStreaming && !!streamingContent;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto chat-scroll"
    >
      {isEmpty && !isStreaming ? (
        <WelcomeScreen onSuggestion={onSuggestion} />
      ) : (
        <div className="max-w-3xl mx-auto py-4 pb-6">
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onDelete={(id) => onDelete && onDelete(id)}
              onRegenerate={
                msg.role === "assistant" && i === messages.length - 1
                  ? onRegenerate
                  : undefined
              }
              isLast={i === messages.length - 1}
            />
          ))}

          {/* Typing indicator — when streaming starts but no content yet */}
          {showTyping && <TypingIndicator />}

          {/* Live streaming message */}
          {hasStreamingMsg && (
            <MessageBubble
              message={{
                id: "streaming",
                role: "assistant",
                content: streamingContent,
                timestamp: Date.now(),
              }}
              isStreaming={true}
              streamingContent={streamingContent}
            />
          )}

          <div ref={bottomRef} className="h-2" />
        </div>
      )}
    </div>
  );
}
