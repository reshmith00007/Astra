import { useState, useRef, useCallback } from "react";
import {
  Send,
  Square,
  Paperclip,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

const MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Nova Pro", tag: "Best" },
  { id: "llama-3.1-8b-instant", name: "Nova Lite", tag: "Fast" },
  { id: "mixtral-8x7b-32768", name: "Nova Code", tag: "Code" },
  { id: "gemma2-9b-it", name: "Nova Mini", tag: "Efficient" },
  { id: "llama-3.3-70b-specdec", name: "Nova Turbo", tag: "Exp" },
];

const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a Python web scraper",
  "Help me debug my code",
  "Plan a 7-day Italy trip",
  "Summarize the latest AI trends",
  "Create a marketing strategy",
];

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  selectedModel,
  onModelChange,
  isEmpty,
}) {
  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const recognitionRef = useRef(null);

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text && !imageBase64) return;
    if (isStreaming) return;
    onSend(text, imageBase64);
    setInput("");
    setImageBase64(null);
    setImagePreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  }

  function processFile(file) {
    if (!file.type.startsWith("image/")) {
      toast.error("Only images are supported");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(",")[1];
      setImageBase64(base64);
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function toggleVoice() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error("Voice recognition error");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  const charCount = input.length;
  const isOverLimit = charCount > 8000;

  return (
    <div className="border-t border-stardust/30 bg-cosmos/80 backdrop-blur-xl">
      {/* Suggestions - only when empty */}
      {isEmpty && (
        <div className="px-4 pt-4 pb-2 flex flex-wrap gap-2 justify-center">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); textareaRef.current?.focus(); }}
              className="text-xs px-3 py-1.5 rounded-full border border-stardust/60 text-moonbeam hover:border-pulse/50 hover:text-flare hover:bg-pulse/10 transition-all duration-150"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        {/* Image preview */}
        {imagePreview && (
          <div className="mb-3 flex items-start gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="h-20 rounded-xl border border-stardust object-cover"
              />
              <button
                onClick={() => { setImageBase64(null); setImagePreview(null); }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-400"
              >
                <X size={10} />
              </button>
            </div>
            <span className="text-xs text-twilight mt-1">Image attached</span>
          </div>
        )}

        {/* Input area */}
        <div
          className={`relative rounded-2xl border transition-all duration-200 ${
            isDragOver
              ? "border-pulse bg-pulse/10"
              : isOverLimit
              ? "border-red-500/50"
              : "border-stardust/60 focus-within:border-pulse/60 focus-within:shadow-lg focus-within:shadow-purple-500/10"
          } bg-nebula`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? "Nova is thinking…" : "Message Nova… (Shift+Enter for new line)"}
            disabled={isStreaming}
            rows={1}
            style={{ maxHeight: "200px", overflowY: "auto" }}
            className="w-full bg-transparent text-starlight placeholder-twilight text-sm px-4 pt-3.5 pb-12 outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed font-sans leading-relaxed"
          />

          {/* Bottom toolbar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
            {/* Left tools */}
            <div className="flex items-center gap-1">
              {/* Image upload */}
              <button
                onClick={() => fileRef.current?.click()}
                className="p-1.5 rounded-xl hover:bg-white/8 text-twilight hover:text-moonbeam transition-colors"
                title="Attach image"
              >
                <ImageIcon size={16} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Voice */}
              <button
                onClick={toggleVoice}
                className={`p-1.5 rounded-xl transition-colors ${
                  listening
                    ? "bg-red-500/20 text-red-400 animate-pulse"
                    : "hover:bg-white/8 text-twilight hover:text-moonbeam"
                }`}
                title={listening ? "Stop recording" : "Voice input"}
              >
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Model selector */}
              <div className="relative ml-1">
                <button
                  onClick={() => setModelOpen((p) => !p)}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-white/8 text-xs text-twilight hover:text-moonbeam transition-colors"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        currentModel.tag === "Best"
                          ? "#7C3AED"
                          : currentModel.tag === "Fast" || currentModel.tag === "Exp"
                          ? "#06B6D4"
                          : "#A78BFA",
                    }}
                  />
                  {currentModel.name}
                  <ChevronDown size={11} />
                </button>

                {modelOpen && (
                  <div className="absolute bottom-8 left-0 z-50 w-52 bg-nebula border border-stardust rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
                    <p className="text-[10px] text-twilight uppercase tracking-wider px-3 pt-2 pb-1 font-semibold">
                      Select Model
                    </p>
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { onModelChange(m.id); setModelOpen(false); }}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm transition-colors ${
                          m.id === selectedModel
                            ? "bg-pulse/20 text-flare"
                            : "text-moonbeam hover:bg-white/5"
                        }`}
                      >
                        <span>{m.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                            m.tag === "Best"
                              ? "bg-pulse/20 text-flare"
                              : m.tag === "Fast" || m.tag === "Exp"
                              ? "bg-glow/20 text-shimmer"
                              : "bg-white/10 text-moonbeam"
                          }`}
                        >
                          {m.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right — char count + send */}
            <div className="flex items-center gap-2">
              {charCount > 1000 && (
                <span
                  className={`text-[10px] ${isOverLimit ? "text-red-400" : "text-twilight"}`}
                >
                  {charCount}/8000
                </span>
              )}

              {isStreaming ? (
                <button
                  onClick={onStop}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-xs font-medium"
                >
                  <Square size={12} fill="currentColor" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim() && !imageBase64}
                  className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 relative z-10"
                  title="Send (Enter)"
                >
                  <Send size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-twilight mt-2">
          Nova can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
}
