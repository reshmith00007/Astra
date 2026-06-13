import { useState, useCallback } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import TopBar from "@/components/TopBar";
import SettingsModal from "@/components/SettingsModal";
import useChat from "@/components/useChat";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
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
  } = useChat();

  const handleSend = useCallback(
    (text, imageBase64) => {
      sendMessage(text, imageBase64);
      setSidebarOpen(false);
    },
    [sendMessage]
  );

  const handleSuggestion = useCallback(
    (text) => {
      sendMessage(text);
      setSidebarOpen(false);
    },
    [sendMessage]
  );

  const handleModelChange = useCallback(
    (model) => {
      if (activeId) {
        setConversationModel(activeId, model);
      } else {
        updateSettings({ model });
      }
    },
    [activeId, setConversationModel, updateSettings]
  );

  const handleDelete = useCallback(
    (msgId) => {
      if (activeId) deleteMessage(activeId, msgId);
    },
    [activeId, deleteMessage]
  );

  const handleRegenerate = useCallback(() => {
    if (activeId) regenerateLastMessage(activeId);
  }, [activeId, regenerateLastMessage]);

  const currentModel = activeConversation?.model || settings.model;

  return (
    <>
      <Head>
        <title>Nova — AI by Reshmith K</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="cosmic-bg flex h-screen w-screen overflow-hidden">
        {/* Sidebar — desktop always visible, mobile overlay */}
        <>
          {/* Mobile overlay backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
              fixed md:relative inset-y-0 left-0 z-50
              w-72 md:w-64 lg:w-72 shrink-0
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <Sidebar
              conversations={conversations}
              activeId={activeId}
              onNew={() => {
                newConversation();
                setSidebarOpen(false);
              }}
              onSelect={(id) => {
                selectConversation(id);
                setSidebarOpen(false);
              }}
              onDelete={deleteConversation}
              onRename={renameConversation}
              onExport={exportConversation}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>

        {/* Main chat area */}
        <div className="flex flex-col flex-1 min-w-0 h-full">
          <TopBar
            conversation={activeConversation}
            onMenuToggle={() => setSidebarOpen((p) => !p)}
            onNewChat={newConversation}
            onSettings={() => setSettingsOpen(true)}
            onExport={exportConversation}
            isStreaming={isStreaming}
          />

          <ChatArea
            messages={activeConversation?.messages || []}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            onDelete={handleDelete}
            onRegenerate={handleRegenerate}
            onSuggestion={handleSuggestion}
          />

          <ChatInput
            onSend={handleSend}
            onStop={stopGeneration}
            isStreaming={isStreaming}
            selectedModel={currentModel}
            onModelChange={handleModelChange}
            isEmpty={!activeConversation || activeConversation.messages.length === 0}
          />
        </div>
      </div>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setSettingsOpen(false)}
          onClearAll={clearAll}
          conversationCount={conversations.length}
        />
      )}
    </>
  );
}
