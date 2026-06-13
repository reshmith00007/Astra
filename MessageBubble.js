import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  Copy,
  Check,
  Trash2,
  RefreshCw,
  User,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Volume2,
} from "lucide-react";
import toast from "react-hot-toast";

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-stardust/60">
      <div className="flex items-center justify-between px-4 py-2 bg-aurora/80 border-b border-stardust/60">
        <span className="text-xs font-mono text-twilight uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-moonbeam hover:text-starlight transition-colors px-2 py-1 rounded-md hover:bg-white/10"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "#0D1117",
          fontSize: "0.8rem",
          lineHeight: "1.6",
        }}
        showLineNumbers={value.split("\n").length > 5}
        lineNumberStyle={{ color: "#3D4A5C", minWidth: "2.5rem" }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

const MODELS_SHORT = {
  "llama-3.3-70b-versatile": "Nova Pro",
  "llama-3.1-8b-instant": "Nova Lite",
  "mixtral-8x7b-32768": "Nova Code",
  "gemma2-9b-it": "Nova Mini",
  "llama-3.3-70b-specdec": "Nova Turbo",
};

export default function MessageBubble({
  message,
  isStreaming = false,
  streamingContent = "",
  onDelete,
  onRegenerate,
  isLast,
}) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);

  const isUser = message.role === "user";
  const content = isStreaming ? streamingContent : message.content;

  async function copyMessage() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  function speak() {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(content.replace(/[#*`]/g, ""));
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <div
      className={`group msg-animate flex gap-3 px-4 py-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className={`shrink-0 mt-0.5 ${isUser ? "ml-1" : "mr-1"}`}>
        {isUser ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <User size={14} className="text-white" />
          </div>
        ) : (
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${
              isStreaming
                ? "bg-gradient-to-br from-pulse to-glow animate-pulse"
                : "bg-gradient-to-br from-pulse to-glow"
            }`}
          >
            <Zap size={14} className="text-white" fill="white" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Sender label */}
        <div className={`flex items-center gap-2 mb-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-xs font-semibold text-moonbeam">
            {isUser ? "You" : "Nova"}
          </span>
          {!isUser && message.model && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pulse/20 text-flare border border-pulse/20">
              {MODELS_SHORT[message.model] || message.model}
            </span>
          )}
          <span className="text-[10px] text-twilight">
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>

        {/* Content */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-purple-600/80 to-purple-700/80 text-white border border-purple-500/30 rounded-tr-sm"
              : "bg-nebula border border-stardust/60 text-moonbeam rounded-tl-sm"
          }`}
        >
          {/* Image */}
          {message.imageBase64 && (
            <img
              src={`data:image/jpeg;base64,${message.imageBase64}`}
              alt="Uploaded"
              className="rounded-xl mb-2 max-w-xs max-h-60 object-cover"
            />
          )}

          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const value = String(children).replace(/\n$/, "");
                    if (!inline && (match || value.includes("\n"))) {
                      return (
                        <CodeBlock
                          language={match ? match[1] : ""}
                          value={value}
                        />
                      );
                    }
                    return <code className={className} {...props}>{children}</code>;
                  },
                }}
              >
                {content}
              </ReactMarkdown>

              {/* Streaming cursor */}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-flare/80 ml-0.5 animate-pulse rounded-sm" />
              )}
            </div>
          )}
        </div>

        {/* Token info */}
        {!isUser && !isStreaming && message.tokens > 0 && (
          <span className="text-[10px] text-twilight mt-1 px-1">
            {message.tokens} tokens
          </span>
        )}

        {/* Action buttons */}
        {!isStreaming && (
          <div
            className={`flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
              isUser ? "flex-row-reverse" : ""
            }`}
          >
            <button
              onClick={copyMessage}
              className="p-1.5 rounded-lg hover:bg-white/8 text-twilight hover:text-moonbeam transition-colors"
              title="Copy"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>

            {!isUser && (
              <>
                <button
                  onClick={speak}
                  className="p-1.5 rounded-lg hover:bg-white/8 text-twilight hover:text-moonbeam transition-colors"
                  title="Read aloud"
                >
                  <Volume2 size={13} />
                </button>
                <button
                  onClick={() => setLiked(true)}
                  className={`p-1.5 rounded-lg hover:bg-white/8 transition-colors ${
                    liked === true ? "text-emerald-400" : "text-twilight hover:text-moonbeam"
                  }`}
                  title="Good response"
                >
                  <ThumbsUp size={13} />
                </button>
                <button
                  onClick={() => setLiked(false)}
                  className={`p-1.5 rounded-lg hover:bg-white/8 transition-colors ${
                    liked === false ? "text-red-400" : "text-twilight hover:text-moonbeam"
                  }`}
                  title="Bad response"
                >
                  <ThumbsDown size={13} />
                </button>
                {isLast && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="p-1.5 rounded-lg hover:bg-white/8 text-twilight hover:text-moonbeam transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw size={13} />
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => onDelete && onDelete(message.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-twilight hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
