/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { 
  FiSearch, 
  FiShare2, 
  FiClock, 
  FiTag, 
  FiBookOpen, 
  FiCopy, 
  FiCheck, 
  FiChevronRight, 
  FiFolder, 
  FiExternalLink,
  FiFileText,
  FiMaximize2
} from "react-icons/fi";
import { BsFolder2, BsQuote } from "react-icons/bs";
import { useAppStore } from "../../store/Appstore";
import { subscribeToBlogs } from "../../lib/firebase";
import MarkdownRenderer from "../../components/MarkdownRenderer";

// Traffic lights component inside Notes top bar
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-3 select-none">
      <button
        type="button"
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all shadow-xs"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all shadow-xs"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all shadow-xs"
        onClick={() => toggleMaximize(windowId)}
        title={maximized ? "Restore" : "Maximize"}
      >
        <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          {maximized ? (
            <>
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
};

// Markdown & Rich Content Parser for Reader POV
const renderArticleContent = (content) => {
  if (!content) return null;
  const lines = content.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let inList = false;
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-3 space-y-1.5 ml-5 list-disc text-gray-700 dark:text-gray-300 text-[14.5px]">
          {listBuffer.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );
      listBuffer = [];
      inList = false;
    }
  };

  const flushCode = () => {
    if (codeBuffer.length > 0) {
      const codeText = codeBuffer.join("\n");
      elements.push(
        <div key={`code-${elements.length}`} className="my-5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-[#1e1e24] text-gray-100 shadow-md">
          <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10 text-xs font-mono text-gray-400">
            <span>Code snippet</span>
            <button
              onClick={() => {
                try {
                  navigator.clipboard.writeText(codeText);
                } catch {
                  // ignore
                }
              }}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-sans"
            >
              <FiCopy size={12} />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-emerald-400">
            <code>{codeText}</code>
          </pre>
        </div>
      );
      codeBuffer = [];
      inCodeBlock = false;
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      inList = true;
      listBuffer.push(line.slice(2));
      return;
    } else {
      flushList();
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight font-sans">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3 tracking-tight font-sans">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-white mt-5 mb-2 font-sans">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-[#007aff] pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300 bg-black/[0.02] dark:bg-white/[0.04] rounded-r-lg font-serif">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.trim().startsWith("![") && line.trim().includes("](") && line.trim().endsWith(")")) {
      const match = line.trim().match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        elements.push(
          <figure key={index} className="my-6 flex flex-col items-center justify-center text-center w-full">
            <div className="max-w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md bg-black/5 dark:bg-white/5 inline-block">
              <img
                src={match[2]}
                alt={match[1] || "Inset Image"}
                className="mx-auto max-h-[500px] w-auto max-w-full object-contain rounded-2xl"
                loading="lazy"
              />
            </div>
            {match[1] && (
              <figcaption className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2.5 italic px-4">
                {match[1]}
              </figcaption>
            )}
          </figure>
        );
      }
    } else if (!line.trim()) {
      elements.push(<div key={index} className="h-3" />);
    } else {
      elements.push(
        <p key={index} className="my-2.5 leading-relaxed text-[15px] text-gray-800 dark:text-gray-200">
          {line}
        </p>
      );
    }
  });

  flushList();
  flushCode();

  return elements;
};

export default function Blogs({ windowId }) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const openApp = useAppStore((state) => state.openApp);

  const [notes, setNotes] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem("os_notes") || "[]");
      const clean = local.filter((n) => n.id !== 10 && n.title !== "Hello, Welcome to Mac" && !n.hasSketch);
      localStorage.setItem("os_notes", JSON.stringify(clean));
      return clean;
    } catch {
      return [];
    }
  });
  const [selectedNoteId, setSelectedNoteId] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem("os_notes") || "[]");
      const clean = local.filter((n) => n.id !== 10 && n.title !== "Hello, Welcome to Mac" && !n.hasSketch);
      return clean[0]?.id || null;
    } catch {
      return null;
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe exclusively to live Firestore blogs
  useEffect(() => {
    const unsubscribe = subscribeToBlogs((fetchedNotes) => {
      setIsLoading(false);
      if (fetchedNotes && fetchedNotes.length > 0) {
        setNotes(fetchedNotes);
        setSelectedNoteId((prevId) => {
          if (prevId && fetchedNotes.some((n) => String(n.id) === String(prevId))) {
            return prevId;
          }
          return fetchedNotes[0]?.id;
        });
      } else {
        setNotes([]);
      }
    });

    const handleLocalUpdate = (e) => {
      if (e?.detail?.blog) {
        setNotes((prev) => {
          const exists = prev.some((n) => String(n.id) === String(e.detail.blog.id));
          if (exists) {
            return prev.map((n) => (String(n.id) === String(e.detail.blog.id) ? e.detail.blog : n));
          }
          return [e.detail.blog, ...prev];
        });
        setSelectedNoteId(e.detail.blog.id);
      } else if (e?.detail?.deletedId) {
        setNotes((prev) => prev.filter((n) => String(n.id) !== String(e.detail.deletedId)));
      }
    };

    window.addEventListener("os_notes_updated", handleLocalUpdate);

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      window.removeEventListener("os_notes_updated", handleLocalUpdate);
    };
  }, []);

  // Filter notes by search & category
  const filteredNotes = notes.filter((n) => {
    if (selectedCategory !== "all" && n.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (n.title || "").toLowerCase().includes(q);
      const matchContent = (n.content || "").toLowerCase().includes(q);
      const matchTags = Array.isArray(n.tags) && n.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchContent || matchTags;
    }
    return true;
  });

  // Extract unique categories
  const categories = ["all", ...new Set(notes.map((n) => n.category).filter(Boolean))];

  // Active note details
  const activeNote = notes.find((n) => String(n.id) === String(selectedNoteId)) || filteredNotes[0] || null;

  // Calculate reading time
  const wordCount = activeNote?.content ? activeNote.content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleShare = () => {
    if (!activeNote) return;
    try {
      navigator.clipboard.writeText(`${window.location.origin}/#blog-${activeNote.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className={`w-full h-full flex overflow-hidden select-none font-sans ${
      isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#ffffff] text-gray-900"
    }`}>
      {/* 1. LEFT SIDEBAR: Notes & Blog Explorer */}
      {isSidebarOpen && (
        <aside className={`w-72 border-r flex flex-col shrink-0 transition-all select-none ${
          isDarkMode ? "border-white/10 bg-[#252528]/95" : "border-black/10 bg-[#f7f7f8]/95"
        }`}>
          {/* Top Bar: Traffic lights & Window title */}
          <div className="h-12 border-b flex items-center justify-between px-3.5 window-drag-handle border-black/5 dark:border-white/5">
            <div className="flex items-center">
              <TrafficLights windowId={windowId} />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                <FiBookOpen size={14} className="text-[#007aff]" />
                <span>Notes & Blogs</span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-400">
              {notes.length} {notes.length === 1 ? "story" : "stories"}
            </span>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-black/5 dark:border-white/5">
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${
              isDarkMode ? "bg-black/30 border-white/10 text-white" : "bg-white border-gray-200 text-gray-900 shadow-2xs"
            }`}>
              <FiSearch className="text-gray-400 shrink-0" size={13} />
              <input
                type="text"
                placeholder="Search blogs & tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-xs"
              />
            </div>
          </div>

          {/* Category Filter Pills (if multiple categories exist) */}
          {categories.length > 2 && (
            <div className="px-3 py-2 flex items-center gap-1.5 overflow-x-auto border-b border-black/5 dark:border-white/5 text-[11px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-full capitalize font-medium shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#007aff] text-white shadow-2xs"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Blogs List */}
          <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
                <span>Syncing with Firebase...</span>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 flex flex-col items-center gap-3">
                <BsFolder2 size={32} className="opacity-30" />
                <p>No published blogs found.</p>
                <p className="text-[11px] text-gray-500">
                  Open Keynote to write and publish your first article.
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = String(activeNote?.id) === String(note.id);
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3.5 cursor-pointer transition-colors relative ${
                      isSelected
                        ? "bg-[#007aff] text-white rounded-xl mx-2 my-1 shadow-sm"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isSelected 
                          ? "bg-white/20 text-white" 
                          : "bg-black/5 dark:bg-white/10 text-[#007aff]"
                      }`}>
                        {note.category || "Article"}
                      </span>
                      <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                        {note.date || "Recent"}
                      </span>
                    </div>

                    <h4 className={`text-[13px] font-semibold truncate mb-1 ${
                      isSelected ? "text-white" : "text-gray-900 dark:text-white"
                    }`}>
                      {note.title || "Untitled Article"}
                    </h4>

                    <p className={`text-[11.5px] line-clamp-2 leading-relaxed ${
                      isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {note.subtitle || (note.content ? note.content.slice(0, 90) : "No preview text")}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      )}

      {/* 2. RIGHT PANEL: Reader POV Article Viewer */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navigation & Reader Controls */}
        <header className={`h-12 border-b flex items-center justify-between px-5 window-drag-handle shrink-0 select-none ${
          isDarkMode ? "border-white/10 bg-[#212124]/70 backdrop-blur-xl" : "border-black/10 bg-white/70 backdrop-blur-xl"
        }`}>
          {/* Left: Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {!isSidebarOpen && <TrafficLights windowId={windowId} />}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <svg width="18" height="15" viewBox="0 0 18 15" fill="none" className="currentColor">
                <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                <line x1="5.5" y1="0.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate max-w-[300px]">
              {activeNote?.title || "Notes"}
            </span>
          </div>

          {/* Right: Share & Reading info */}
          <div className="flex items-center gap-2">
            {activeNote && (
              <>
                <button
                  onClick={handleShare}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    copiedLink
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : isDarkMode
                      ? "bg-white/10 hover:bg-white/15 text-white border-white/10"
                      : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200 shadow-2xs"
                  }`}
                  title="Share article link"
                >
                  {copiedLink ? <FiCheck size={13} /> : <FiShare2 size={13} />}
                  <span>{copiedLink ? "Link Copied" : "Share"}</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Reader Canvas (Normal User POV) */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 select-text">
          {activeNote ? (
            <article className="max-w-2xl mx-auto pb-16">
              {/* Cover Image Banner */}
              {activeNote.coverImage && (
                <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-8 border border-black/10 dark:border-white/10 shadow-lg">
                  <img
                    src={activeNote.coverImage}
                    alt={activeNote.title || "Cover"}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: `center ${activeNote.coverPosition ?? 50}%` }}
                    loading="eager"
                  />
                </div>
              )}

              {/* Meta Header */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400 mb-3 select-none">
                <span className="font-bold text-[#007aff] uppercase tracking-wider bg-[#007aff]/10 px-2.5 py-0.5 rounded-md">
                  {activeNote.category || "General"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FiClock size={12} />
                  <span>{readingTime} min read</span>
                </span>
                <span>•</span>
                <span>{activeNote.date || "Recent"}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-3">
                {activeNote.title || "Untitled Article"}
              </h1>

              {/* Subtitle / Excerpt */}
              {activeNote.subtitle && (
                <p className="text-lg text-gray-600 dark:text-gray-300 font-normal leading-relaxed mb-6">
                  {activeNote.subtitle}
                </p>
              )}

              {/* Author & Profile row */}
              <div className="flex items-center justify-between py-3 border-y border-black/10 dark:border-white/10 mb-8 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#007aff] to-[#5856d6] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {activeNote.author ? activeNote.author.charAt(0) : "A"}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">
                      {activeNote.author || "Abinaya Natarajan"}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Portfolio Author & Admin
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {Array.isArray(activeNote.tags) && activeNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {activeNote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rich Markdown Article Content */}
              <div className="leading-relaxed">
                <MarkdownRenderer content={activeNote.content} />
              </div>

              {/* End of article badge */}
              <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex flex-col items-center text-center gap-2 text-xs text-gray-400 select-none">
                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-500">
                  <FiBookOpen size={14} />
                </div>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Published with Blog Studio
                </p>
                <p className="text-[11px] text-gray-400 max-w-sm">
                  Created and synced across Portfolio Notes.
                </p>
              </div>
            </article>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500 h-full py-20 select-none">
              <BsFolder2 size={48} className="opacity-40" />
              <div className="text-center">
                <p className="text-[16px] font-semibold text-gray-700 dark:text-gray-300">No Article Selected</p>
                <p className="text-xs text-gray-400 mt-1">Select an article from the sidebar to read.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
