import { useState, useRef, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit3,
  Check,
  X,
  Download,
  MoreHorizontal,
  Zap,
  ChevronLeft,
} from "lucide-react";

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onExport,
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conv.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleRename() {
    if (editTitle.trim()) {
      onRename(conv.id, editTitle.trim());
    }
    setEditing(false);
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  return (
    <div
      className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/10 border border-purple-500/30"
          : "hover:bg-white/5 border border-transparent"
      }`}
      onClick={() => !editing && onSelect(conv.id)}
    >
      {/* Icon */}
      <div
        className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
          isActive
            ? "bg-gradient-to-br from-purple-600 to-cyan-600"
            : "bg-white/8"
        }`}
      >
        <MessageSquare size={13} className="text-white" />
      </div>

      {/* Title / Edit */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") { setEditTitle(conv.title); setEditing(false); }
            }}
            onBlur={handleRename}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white/10 text-starlight text-sm px-2 py-0.5 rounded-md outline-none border border-purple-500/50"
          />
        ) : (
          <>
            <p className="text-sm font-medium text-starlight truncate leading-tight">
              {conv.title}
            </p>
            <p className="text-xs text-twilight mt-0.5">
              {conv.messages.length} msg · {formatDate(conv.updatedAt)}
            </p>
          </>
        )}
      </div>

      {/* Actions */}
      {!editing && (
        <div
          className="shrink-0 relative"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className={`p-1 rounded-md transition-opacity ${
              menuOpen || isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } hover:bg-white/10 text-moonbeam`}
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 z-50 w-40 bg-nebula border border-stardust rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
              <button
                onClick={() => { setEditing(true); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-moonbeam hover:bg-white/5 hover:text-starlight transition-colors"
              >
                <Edit3 size={13} /> Rename
              </button>
              <button
                onClick={() => { onExport(conv.id); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-moonbeam hover:bg-white/5 hover:text-starlight transition-colors"
              >
                <Download size={13} /> Export
              </button>
              <div className="border-t border-stardust/50 my-0.5" />
              <button
                onClick={() => { onDelete(conv.id); setMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function groupByDate(conversations) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const week = new Date(today);
  week.setDate(week.getDate() - 7);

  const groups = { Today: [], Yesterday: [], "This week": [], Older: [] };

  conversations.forEach((c) => {
    const d = new Date(c.updatedAt);
    if (d.toDateString() === today.toDateString()) groups.Today.push(c);
    else if (d.toDateString() === yesterday.toDateString()) groups.Yesterday.push(c);
    else if (d > week) groups["This week"].push(c);
    else groups.Older.push(c);
  });

  return groups;
}

export default function Sidebar({
  conversations,
  activeId,
  onNew,
  onSelect,
  onDelete,
  onRename,
  onExport,
  onClose,
}) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const groups = groupByDate(filtered);

  return (
    <div className="flex flex-col h-full bg-cosmos border-r border-stardust/50">
      {/* Header */}
      <div className="p-4 border-b border-stardust/50">
        {/* Logo + close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pulse to-glow flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <div>
              <p className="font-bold text-starlight text-base leading-none">Nova</p>
              <p className="text-[10px] text-twilight">Created by Reshmith K</p>
            </div>
          </div>
          {/* Close on mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-moonbeam"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* New chat button */}
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl btn-primary text-white font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 relative z-10"
        >
          <Plus size={16} />
          New conversation
        </button>

        {/* Search */}
        {conversations.length > 3 && (
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-aurora border border-stardust rounded-lg px-3 py-2 text-sm text-moonbeam placeholder-twilight outline-none focus:border-pulse/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-twilight hover:text-moonbeam"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {conversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-aurora mx-auto mb-3 flex items-center justify-center">
              <MessageSquare size={20} className="text-twilight" />
            </div>
            <p className="text-sm text-twilight">No conversations yet</p>
            <p className="text-xs text-twilight/60 mt-1">Start chatting to see history</p>
          </div>
        )}

        {Object.entries(groups).map(([label, convs]) => {
          if (convs.length === 0) return null;
          return (
            <div key={label}>
              <p className="text-[11px] font-semibold text-twilight uppercase tracking-wider px-3 py-2 mt-2">
                {label}
              </p>
              <div className="space-y-0.5">
                {convs.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeId}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    onRename={onRename}
                    onExport={onExport}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-stardust/50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-aurora/50">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-moonbeam">Nova AI — by Reshmith K</span>
        </div>
      </div>
    </div>
  );
}
