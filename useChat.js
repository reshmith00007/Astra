import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const STORAGE_KEY = "nova_conversations";
const SETTINGS_KEY = "nova_settings";

function loadFromStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function createConversation(title = "New conversation") {
  return {
    id: uuidv4(),
    title,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    model: "llama-3.3-70b-versatile",
    tokenCount: 0,
  };
}

export default function useChat() {
  const [conversations, setConversations] = useState(() =>
    loadFromStorage(STORAGE_KEY, [])
  );
  const [activeId, setActiveId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [settings, setSettings] = useState(() =>
    loadFromStorage(SETTINGS_KEY, {
      model: "llama-3.3-70b-versatile",
      systemPrompt: "",
      temperature: 0.7,
      soundEnabled: false,
    })
  );

  const abortRef = useRef(null);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  // Persist
  const persist = useCallback((convs) => {
    setConversations(convs);
    saveToStorage(STORAGE_KEY, convs);
  }, []);

  const persistSettings = useCallback((s) => {
    setSettings(s);
    saveToStorage(SETTINGS_KEY, s);
  }, []);

  // Create new conversation
  const newConversation = useCallback(() => {
    const conv = createConversation();
    conv.model = settings.model;
    const updated = [conv, ...conversations];
    persist(updated);
    setActiveId(conv.id);
    return conv;
  }, [conversations, persist, settings.model]);

  // Select conversation
  const selectConversation = useCallback((id) => {
    setActiveId(id);
    setStreamingContent("");
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(
    (id) => {
      const updated = conversations.filter((c) => c.id !== id);
      persist(updated);
      if (activeId === id) {
        setActiveId(updated[0]?.id || null);
      }
    },
    [conversations, activeId, persist]
  );

  // Clear all
  const clearAll = useCallback(() => {
    persist([]);
    setActiveId(null);
  }, [persist]);

  // Rename conversation
  const renameConversation = useCallback(
    (id, newTitle) => {
      const updated = conversations.map((c) =>
        c.id === id ? { ...c, title: newTitle } : c
      );
      persist(updated);
    },
    [conversations, persist]
  );

  // Update conversation model
  const setConversationModel = useCallback(
    (id, model) => {
      const updated = conversations.map((c) =>
        c.id === id ? { ...c, model } : c
      );
      persist(updated);
    },
    [conversations, persist]
  );

  // Send message
  const sendMessage = useCallback(
    async (content, imageBase64 = null) => {
      if (!content.trim() && !imageBase64) return;
      if (isStreaming) return;

      let convId = activeId;
      let conv;

      // Create new conversation if none active
      if (!convId) {
        conv = createConversation();
        conv.model = settings.model;
        convId = conv.id;
        const updated = [conv, ...conversations];
        persist(updated);
        setActiveId(convId);
      } else {
        conv = conversations.find((c) => c.id === convId);
      }

      // Build user message
      const userMsg = {
        id: uuidv4(),
        role: "user",
        content,
        imageBase64,
        timestamp: Date.now(),
      };

      // Auto-title from first message
      const isFirst = (conv?.messages?.length || 0) === 0;
      const autoTitle = isFirst
        ? content.slice(0, 50) + (content.length > 50 ? "…" : "")
        : null;

      // Update conversation with user message
      const updatedWithUser = conversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              title: autoTitle || c.title,
              updatedAt: Date.now(),
            }
          : c
      );

      // Handle new conversation case
      const finalList = updatedWithUser.find((c) => c.id === convId)
        ? updatedWithUser
        : [{ ...conv, messages: [userMsg], title: autoTitle || conv.title }, ...updatedWithUser];

      persist(finalList);

      const currentConv = finalList.find((c) => c.id === convId);
      const messageHistory = currentConv.messages;

      // Start streaming
      setIsStreaming(true);
      setStreamingContent("");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messageHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            model: currentConv.model || settings.model,
            systemPrompt: settings.systemPrompt || undefined,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to get response");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let totalTokens = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.error) throw new Error(data.error);
                if (data.content) {
                  fullContent += data.content;
                  setStreamingContent(fullContent);
                }
                if (data.tokens) totalTokens = data.tokens;
                if (data.done && fullContent) {
                  // Save assistant message
                  const assistantMsg = {
                    id: uuidv4(),
                    role: "assistant",
                    content: fullContent,
                    timestamp: Date.now(),
                    model: currentConv.model || settings.model,
                    tokens: totalTokens,
                  };

                  setConversations((prev) => {
                    const updated = prev.map((c) =>
                      c.id === convId
                        ? {
                            ...c,
                            messages: [...c.messages, assistantMsg],
                            updatedAt: Date.now(),
                            tokenCount: (c.tokenCount || 0) + totalTokens,
                          }
                        : c
                    );
                    saveToStorage(STORAGE_KEY, updated);
                    return updated;
                  });
                }
              } catch (e) {
                if (e.message !== "SyntaxError") {
                  throw e;
                }
              }
            }
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
          // Save what we have
          if (streamingContent) {
            const partial = {
              id: uuidv4(),
              role: "assistant",
              content: streamingContent + " *(stopped)*",
              timestamp: Date.now(),
              stopped: true,
            };
            setConversations((prev) => {
              const updated = prev.map((c) =>
                c.id === convId
                  ? { ...c, messages: [...c.messages, partial], updatedAt: Date.now() }
                  : c
              );
              saveToStorage(STORAGE_KEY, updated);
              return updated;
            });
          }
        } else {
          toast.error(error.message || "Something went wrong");
        }
      } finally {
        setIsStreaming(false);
        setStreamingContent("");
        abortRef.current = null;
      }
    },
    [activeId, conversations, isStreaming, persist, settings, streamingContent]
  );

  // Stop generation
  const stopGeneration = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  // Delete message
  const deleteMessage = useCallback(
    (convId, msgId) => {
      const updated = conversations.map((c) =>
        c.id === convId
          ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) }
          : c
      );
      persist(updated);
    },
    [conversations, persist]
  );

  // Regenerate last message
  const regenerateLastMessage = useCallback(
    async (convId) => {
      const conv = conversations.find((c) => c.id === convId);
      if (!conv || conv.messages.length < 2) return;

      // Remove last assistant message
      const withoutLast = conv.messages.slice(0, -1);
      const lastUserMsg = withoutLast[withoutLast.length - 1];

      const updated = conversations.map((c) =>
        c.id === convId ? { ...c, messages: withoutLast } : c
      );
      persist(updated);

      // Re-send
      await sendMessage(lastUserMsg.content);
    },
    [conversations, persist, sendMessage]
  );

  // Update settings
  const updateSettings = useCallback(
    (updates) => {
      persistSettings({ ...settings, ...updates });
    },
    [settings, persistSettings]
  );

  // Export conversation
  const exportConversation = useCallback(
    (id) => {
      const conv = conversations.find((c) => c.id === id);
      if (!conv) return;

      const text = conv.messages
        .map((m) => `**${m.role === "user" ? "You" : "Nova"}:**\n${m.content}`)
        .join("\n\n---\n\n");

      const blob = new Blob([text], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${conv.title.slice(0, 30)}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Conversation exported");
    },
    [conversations]
  );

  return {
    conversations,
    activeId,
    activeConversation,
    isStreaming,
    streamingContent,
    settings,
    sendMessage,
    stopGeneration,
    newConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    clearAll,
    deleteMessage,
    regenerateLastMessage,
    updateSettings,
    exportConversation,
    setConversationModel,
  };
}
