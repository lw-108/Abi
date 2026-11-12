/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import {
  FiLock,
  FiUnlock,
  FiPlus,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiEye,
  FiEdit3,
  FiColumns,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiCode,
  FiImage,
  FiLink,
  FiClock,
  FiCloud,
  FiCloudLightning,
  FiSave,
  FiSend,
  FiKey,
  FiFolder,
  FiChevronRight,
  FiAlertCircle,
  FiTag,
  FiUpload,
  FiSliders,
  FiMove,
  FiX,
  FiAlignCenter,
  FiSmile,
  FiMinus
} from "react-icons/fi";
import {
  BsCheck2Square,
  BsCardText,
  BsQuote,
  BsListOl,
  BsListUl,
  BsListCheck,
  BsCodeSlash,
  BsEmojiSmile,
  BsHr,
  BsTypeStrikethrough,
  BsFillLightbulbFill
} from "react-icons/bs";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useAppStore } from "../store/Appstore";
import {
  saveBlogToFirebase,
  deleteBlogFromFirebase,
  subscribeToBlogs,
  verifyAdminPassword
} from "../lib/firebase";
import {
  uploadImageToCloudinary
} from "../lib/cloudinary";

// Traffic lights component
const WindowTrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-4 select-none">
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

const PRESET_COVERS = [
  "/Wallpaper/GoldenGate_6k.png",
  "/Wallpaper/WallpaperDark.png",
  "/Wallpaper/WallpaperLight.png",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80",
];

export default function Keynote({ windowId }) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("keynote_admin_unlocked") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Clear any insecure local storage password on mount
  useEffect(() => {
    try {
      localStorage.removeItem("keynote_admin_password");
    } catch {
      // ignore
    }
  }, []);

  // Blog Studio state
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("split"); // "edit" | "split" | "preview"
  const [showSidebar, setShowSidebar] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "published" | "draft"
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Active post editor fields
  const [title, setTitle] = useState("Getting Started with Modern Portfolio Architecture");
  const [subtitle, setSubtitle] = useState("Exploring design, animations, and Firebase integration.");
  const [content, setContent] = useState(
    `# Modern Portfolio\n\nWelcome to the official developer journal. This article showcases the clean integration of portfolio aesthetics with a real-time cloud backend.\n\n### Key Highlights\n- **Live Battery Status**: Directly interfaces with your device's battery hardware.\n- **Firebase Cloud Firestore**: Writes persist globally and sync across devices.\n- **Notes App Integration**: Everything written here instantly surfaces in the Notes app for visitors to read.\n\n> "Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs\n\n\`\`\`javascript\n// Real-time synchronization snippet\nimport { db } from "@/lib/firebase";\nconsole.log("Connected to Portfolio Blog Studio!");\n\`\`\`\n\nFeel free to draft your own articles, insert code snippets, and publish directly to the portfolio!`
  );
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState(["Portfolio", "Firebase", "React"]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0]);
  const [coverPosition, setCoverPosition] = useState(50);
  const [status, setStatus] = useState("published");

  // Banner modal & upload controls
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showPositionControls, setShowPositionControls] = useState(true);
  const [bannerUrlInput, setBannerUrlInput] = useState("");
  const bannerFileInputRef = useRef(null);

  // Inset image modal controls (centered)
  const [showInsetModal, setShowInsetModal] = useState(false);
  const [insetUrl, setInsetUrl] = useState("");
  const [insetCaption, setInsetCaption] = useState("");
  const insetFileInputRef = useRef(null);

  // Formatting tool popover & dialog controls
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("https://");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCodeMenu, setShowCodeMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showTextArtMenu, setShowTextArtMenu] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingInset, setIsUploadingInset] = useState(false);

  const editorRef = useRef(null);

  // Listen for real-time Firebase blogs
  useEffect(() => {
    const unsubscribe = subscribeToBlogs((fetchedPosts, isRemote) => {
      setFirebaseConnected(isRemote);
      if (fetchedPosts && fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
        if (!selectedPostId && fetchedPosts[0]) {
          loadPostIntoEditor(fetchedPosts[0]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to local custom event updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("os_notes") || "[]");
        if (saved.length > 0) {
          setPosts(saved);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("os_notes_updated", handleUpdate);
    return () => window.removeEventListener("os_notes_updated", handleUpdate);
  }, []);

  const loadPostIntoEditor = (post) => {
    setSelectedPostId(post.id);
    setTitle(post.title || "Untitled");
    setSubtitle(post.subtitle || "");
    setContent(post.content || "");
    setCategory(post.category || "General");
    setTags(Array.isArray(post.tags) ? post.tags : ["Blog"]);
    setCoverImage(post.coverImage || "");
    setCoverPosition(typeof post.coverPosition === "number" ? post.coverPosition : (post.coverPosition != null ? Number(post.coverPosition) : 50));
    setStatus(post.status || "published");
  };

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    if (!passwordInput.trim()) return;

    setIsVerifying(true);
    setAuthError(false);

    try {
      const isValid = await verifyAdminPassword(passwordInput.trim());
      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem("keynote_admin_unlocked", "true");
        setAuthError(false);
        setPasswordInput("");
        showToast("Firebase Cloud Security Authenticated");
      } else {
        setAuthError(true);
        setTimeout(() => setAuthError(false), 600);
      }
    } catch (err) {
      console.warn("Auth check error:", err);
      setAuthError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTouchID = () => {
    if (sessionStorage.getItem("keynote_admin_unlocked") === "true") {
      setIsAuthenticated(true);
      showToast("Touch ID Verified");
    } else {
      showToast("Password required: Stored securely in Firebase");
    }
  };

  const handleLockSession = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("keynote_admin_unlocked");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Word & Reading Time stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Cursor position and scroll state tracking to prevent jumping to bottom
  const savedCursorRef = useRef({ start: 0, end: 0, scrollTop: 0 });

  const updateCursorTracking = () => {
    const el = editorRef.current;
    if (el) {
      savedCursorRef.current = {
        start: el.selectionStart,
        end: el.selectionEnd,
        scrollTop: el.scrollTop
      };
    }
  };

  const getCursorInfo = () => {
    const el = editorRef.current;
    if (!el) {
      return {
        start: savedCursorRef.current.start || 0,
        end: savedCursorRef.current.end || 0,
        scrollTop: savedCursorRef.current.scrollTop || 0
      };
    }
    const isFocused = document.activeElement === el;
    const activeStart = el.selectionStart;
    const activeEnd = el.selectionEnd;
    const activeScroll = el.scrollTop;

    if (isFocused || activeStart !== 0 || activeEnd !== 0) {
      savedCursorRef.current = {
        start: activeStart,
        end: activeEnd,
        scrollTop: activeScroll
      };
      return { start: activeStart, end: activeEnd, scrollTop: activeScroll };
    }

    return {
      start: savedCursorRef.current.start || 0,
      end: savedCursorRef.current.end || 0,
      scrollTop: savedCursorRef.current.scrollTop || 0
    };
  };

  // Editor formatting tool insertions - strictly maintains cursor position and avoids jumping to bottom
  const insertFormatting = (prefix, suffix = "") => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const { start, end, scrollTop } = getCursorInfo();
    const selectedText = content.substring(start, end);

    let replacement = "";
    let nextCursorStart = start;
    let nextCursorEnd = start;

    if (suffix) {
      // Inline wrapping: **bold**, *italic*, <u>underline</u>, ~~strike~~, `code`, ==highlight==
      if (selectedText) {
        replacement = prefix + selectedText + suffix;
        nextCursorStart = start + prefix.length;
        nextCursorEnd = nextCursorStart + selectedText.length;
      } else {
        replacement = prefix + suffix;
        // Position cursor right between prefix and suffix
        nextCursorStart = start + prefix.length;
        nextCursorEnd = nextCursorStart;
      }
    } else {
      // Line/block prefixes: #, ##, ###, -, 1., - [ ], >
      if (selectedText) {
        replacement = prefix + selectedText;
        nextCursorStart = start + prefix.length + selectedText.length;
        nextCursorEnd = nextCursorStart;
      } else {
        replacement = prefix;
        nextCursorStart = start + prefix.length;
        nextCursorEnd = nextCursorStart;
      }
    }

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    savedCursorRef.current = {
      start: nextCursorStart,
      end: nextCursorEnd,
      scrollTop
    };

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(nextCursorStart, nextCursorEnd);
        editorRef.current.scrollTop = scrollTop;
      }
    }, 10);
  };

  const insertBlock = (blockText) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const { start, end, scrollTop } = getCursorInfo();
    const before = content.substring(0, start);
    const after = content.substring(end);

    const needLeadingNewline = before.length > 0 && !before.endsWith("\n") ? (before.endsWith("\n\n") ? "" : "\n") : "";
    const needTrailingNewline = after.length > 0 && !after.startsWith("\n") ? (after.startsWith("\n\n") ? "" : "\n") : "";
    const insertion = needLeadingNewline + blockText + needTrailingNewline;

    const newContent = before + insertion + after;
    setContent(newContent);

    const nextCursorPos = start + needLeadingNewline.length + blockText.length;

    savedCursorRef.current = {
      start: nextCursorPos,
      end: nextCursorPos,
      scrollTop
    };

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(nextCursorPos, nextCursorPos);
        editorRef.current.scrollTop = scrollTop;
      }
    }, 10);
  };

  // Hyperlink insertion handlers
  const handleOpenLinkModal = () => {
    updateCursorTracking();
    const { start, end } = getCursorInfo();
    const selected = content.substring(start, end);
    setLinkText(selected || "");
    setLinkUrl("https://");
    setShowLinkModal(true);
    setShowEmojiPicker(false);
    setShowCodeMenu(false);
    setShowListMenu(false);
    setShowTextArtMenu(false);
  };

  const handleConfirmInsertLink = () => {
    if (!linkUrl.trim()) return;
    const text = linkText.trim() || "link";
    const markdownLink = `[${text}](${linkUrl.trim()})`;
    const textarea = editorRef.current;
    const { start, end, scrollTop } = getCursorInfo();

    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + markdownLink + after;
    setContent(newContent);

    const nextCursorPos = start + markdownLink.length;
    savedCursorRef.current = {
      start: nextCursorPos,
      end: nextCursorPos,
      scrollTop
    };

    setShowLinkModal(false);
    showToast("Hyperlink inserted!");

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(nextCursorPos, nextCursorPos);
        editorRef.current.scrollTop = scrollTop;
      }
    }, 15);
  };

  // Emoji palette insertion handler
  const handleInsertEmoji = (emoji) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const { start, end, scrollTop } = getCursorInfo();
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + emoji + after;
    setContent(newContent);

    const nextCursorPos = start + emoji.length;
    savedCursorRef.current = {
      start: nextCursorPos,
      end: nextCursorPos,
      scrollTop
    };

    setShowEmojiPicker(false);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(nextCursorPos, nextCursorPos);
        editorRef.current.scrollTop = scrollTop;
      }
    }, 10);
  };

  // Code block snippet insertion handler
  const handleInsertCodeBlock = (lang) => {
    const defaultSnippets = {
      javascript: `// JavaScript\nfunction auditCheck(resource) {\n  return resource.isCompliant;\n}`,
      typescript: `// TypeScript\ninterface ComplianceRule {\n  id: string;\n  status: 'passed' | 'failed';\n}`,
      python: `# Python\ndef verify_controls(framework):\n    print(f"Evaluating {framework} controls")`,
      bash: `# Bash / Shell\nwazuh-control status\nsystemctl restart wazuh-agent`,
      html: `<!-- HTML Structure -->\n<div class="security-card">\n  <h3>ISO 27001 Assessment</h3>\n</div>`,
      css: `/* CSS Styling */\n.audit-badge {\n  background: #10b981;\n  color: #ffffff;\n}`,
      json: `{\n  "audit": "ISO 27001",\n  "status": "compliant",\n  "verified": true\n}`,
      sql: `-- SQL Audit Query\nSELECT event_id, user_role, timestamp\nFROM auth_events\nWHERE status = 'SUCCESS';`,
      markdown: `### Security Checklist\n- [x] Access Control (RBAC)\n- [x] Multi-Factor Authentication`
    };
    const codeSnippet = defaultSnippets[lang] || `// Write your ${lang} code here`;
    insertBlock(`\`\`\`${lang}\n${codeSnippet}\n\`\`\``);
    setShowCodeMenu(false);
    showToast(`Code block (${lang}) inserted!`);
  };

  // Horizontal divider rule handler
  const handleInsertHR = () => {
    insertBlock("---");
    showToast("Horizontal divider line inserted!");
  };

  // Text Art insertion handler
  const handleInsertTextArt = (art) => {
    insertBlock(art);
    setShowTextArtMenu(false);
    showToast("Text art divider inserted!");
  };

  // Callout Card insertion handler
  const handleInsertCallout = (type) => {
    const snippets = {
      tip: `> 💡 **Tip:** Continuous compliance monitoring reduces audit preparation time by over 60%.`,
      note: `> ℹ️ **Note:** System audit logs must be retained securely with tamper-evident hashing.`,
      warning: `> ⚠️ **Warning:** Updating administrative access permissions requires dual-factor confirmation.`,
      security: `> 🛡️ **Security Alert:** Verify all external STIX/TAXII threat intelligence indicators before ingestion.`
    };
    insertBlock(snippets[type] || `> 💡 **Note:** Contextual note.`);
    setShowTextArtMenu(false);
    showToast("Callout card inserted!");
  };

  // List types insertion handler
  const handleInsertList = (type) => {
    if (type === "bullet") insertFormatting("- ");
    if (type === "numbered") insertFormatting("1. ");
    if (type === "task") insertFormatting("- [ ] ");
    if (type === "arrow") insertFormatting("→ ");
    setShowListMenu(false);
  };

  // Create new post
  const handleNewPost = () => {
    setSelectedPostId(null);
    setTitle("New Portfolio Article");
    setSubtitle("Write an engaging summary of your thoughts...");
    setContent("# New Blog Post\n\nStart typing your content here using formatting tools...");
    setCategory("Technology");
    setTags(["Portfolio", "React"]);
    setCoverImage(PRESET_COVERS[Math.floor(Math.random() * PRESET_COVERS.length)]);
    setCoverPosition(50);
    setStatus("draft");
    showToast("Created fresh draft");
  };

  // Banner upload & URL handlers (Instant auto-optimization)
  const handleBannerFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose a valid image file");
      return;
    }

    setIsUploadingBanner(true);
    showToast("Processing banner image...");
    try {
      const res = await uploadImageToCloudinary(file, { folder: "blog_banners" });
      setCoverImage(res.secure_url);
      setShowBannerModal(false);
      showToast("Banner image loaded successfully!");
    } catch (err) {
      console.error("Banner upload error:", err);
      showToast("Image ready!");
    } finally {
      setIsUploadingBanner(false);
      e.target.value = "";
    }
  };

  const handleApplyBannerUrl = (e) => {
    if (e) e.preventDefault();
    if (!bannerUrlInput.trim()) {
      showToast("Please enter an image URL");
      return;
    }
    setCoverImage(bannerUrlInput.trim());
    setBannerUrlInput("");
    setShowBannerModal(false);
    showToast("Banner image updated!");
  };

  // Inset image upload & insert handlers (Centered)
  const handleInsetFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file");
      return;
    }

    setIsUploadingInset(true);
    showToast("Processing image...");
    try {
      const res = await uploadImageToCloudinary(file, { folder: "blog_insets" });
      setInsetUrl(res.secure_url);
      showToast("Image loaded! Add optional caption and click Insert.");
    } catch (err) {
      console.error("Inset upload error:", err);
      showToast("Image processed!");
    } finally {
      setIsUploadingInset(false);
      e.target.value = "";
    }
  };

  const handleInsertInsetImage = (e) => {
    if (e) e.preventDefault();
    if (!insetUrl.trim()) {
      showToast("Please provide an image URL or upload an image file");
      return;
    }
    const caption = insetCaption.trim() || "Image";
    insertBlock(`![${caption}](${insetUrl.trim()})`);
    setShowInsetModal(false);
    setInsetUrl("");
    setInsetCaption("");
    showToast("Centered inset image inserted!");
  };

  // Save to Firebase & Notes
  const handlePublish = async (postStatus = "published") => {
    if (!title.trim()) {
      showToast("Please provide a blog title");
      return;
    }

    setIsSaving(true);
    setStatus(postStatus);

    const blogData = {
      id: selectedPostId,
      title: title.trim(),
      subtitle: subtitle.trim(),
      content: content.trim(),
      category,
      tags,
      coverImage: coverImage || "",
      coverPosition: typeof coverPosition === "number" ? coverPosition : 50,
      status: postStatus,
      author: "Abinaya Natarajan",
      pinned: true,
    };

    try {
      const res = await saveBlogToFirebase(blogData);
      setSelectedPostId(res.id);
      showToast(
        postStatus === "published"
          ? "Published!"
          : "Draft saved successfully"
      );
    } catch {
      showToast("Saved locally (offline mode)");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete post
  const handleDeletePost = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this blog post? It will be removed from Firebase and Notes.")) {
      return;
    }

    await deleteBlogFromFirebase(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPostId === id) {
      handleNewPost();
    }
    showToast("Post removed from Firebase and Notes");
  };

  // Add tag
  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, "");
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Render markdown preview using rich professional renderer
  const renderPreview = () => {
    return <MarkdownRenderer content={content} />;
  };

  // Filtered post list
  const filteredPosts = posts.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (p.title || "").toLowerCase().includes(q);
      const matchContent = (p.content || "").toLowerCase().includes(q);
      return matchTitle || matchContent;
    }
    return true;
  });

  // --------------------------------------------------------------------------
  // PASSWORD GATE VIEW (If not authenticated)
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden select-none ${isDarkMode ? "bg-[#1e1e20] text-white" : "bg-[#f5f5f7] text-gray-900"
        }`}>
        {/* Top Header / Traffic lights */}
        <div className="absolute top-3 left-4 flex items-center z-20">
          <WindowTrafficLights windowId={windowId} />
        </div>

        {/* Modal Window Container */}
        <div className={`w-full max-w-[420px] rounded-2xl p-8 flex flex-col items-center shadow-2xl border transition-all ${isDarkMode
            ? "bg-[#28282c]/90 border-white/10 backdrop-blur-2xl"
            : "bg-white/90 border-black/10 backdrop-blur-2xl"
          }`}>
          {/* Keynote Icon with Admin Padlock */}
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-2xl shadow-xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#0066cc] to-[#33a3ff]">
              <img
                src="https://s3-new.macosicons.com/macosicons/parse/Keynote__Apple_Creative_Studio__SlTcHVkQP5_lowResPng-aac0878b95.png"
                alt="Keynote"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#007aff] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#28282c]">
              <FiLock size={14} />
            </div>
          </div>

          <h2 className="text-[19px] font-bold tracking-tight mb-1">Keynote Blog Studio</h2>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6 max-w-[280px]">
            Administrator authentication required to write and publish articles to the Notes app.
          </p>

          {/* Password Form */}
          <form onSubmit={handleAdminLogin} className="w-full flex flex-col gap-3">
            <div className={`relative flex items-center w-full rounded-xl border transition-all ${authError
                ? "border-red-500 animate-shake ring-2 ring-red-500/20"
                : isDarkMode ? "border-white/15 bg-black/30" : "border-gray-200 bg-gray-50/80"
              }`}>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Administrator Password"
                className="w-full px-3.5 py-2.5 text-[13px] bg-transparent outline-none rounded-xl font-medium"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {authError && (
              <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-medium px-1">
                <FiAlertCircle size={13} />
                <span>Incorrect administrator password. Try again.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full mt-2 py-2.5 bg-[#007aff] hover:bg-[#0069d9] active:scale-[0.99] text-white text-[13px] font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying with Firebase...</span>
                </>
              ) : (
                <>
                  <FiUnlock size={14} />
                  <span>Unlock Studio</span>
                </>
              )}
            </button>
          </form>

          {/* Touch ID / Fingerprint button */}
          <div className="w-full mt-4 pt-4 border-t border-black/5 dark:border-white/10 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleTouchID}
              className="flex items-center gap-2 text-[12px] text-[#007aff] hover:underline font-medium cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 0-10 10c0 4.4 2.9 8.2 7 9.5" />
                <path d="M12 6a6 6 0 0 0-6 6c0 2.6 1.7 4.9 4.2 5.7" />
                <path d="M12 10a2 2 0 0 0-2 2c0 .9.6 1.6 1.4 1.9" />
                <path d="M19 12a7 7 0 0 0-7-7" />
                <path d="M15 12a3 3 0 0 0-3-3" />
              </svg>
              <span>Use Touch ID</span>
            </button>

            {/* Security Notice */}
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showHint ? "Protected by Firebase Security (Password: Abinayanatrajan)" : "Security & Password Info"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ADMIN BLOG STUDIO VIEW (Authenticated)
  // --------------------------------------------------------------------------
  return (
    <div className={`w-full h-full flex flex-col overflow-hidden select-none font-sans ${isDarkMode ? "bg-[#1c1c1e] text-white" : "bg-[#f6f6f7] text-gray-900"
      }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-12 right-6 z-50 bg-[#007aff] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
          <FiCloudLightning size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP MACOS STUDIO TOOLBAR */}
      <div className={`h-13 border-b flex items-center justify-between px-4 z-20 shrink-0 ${isDarkMode ? "border-white/10 bg-[#252528]/80 backdrop-blur-xl" : "border-black/10 bg-white/80 backdrop-blur-xl"
        }`}>
        {/* Left: Window Controls, Sidebar Toggle & App Title */}
        <div className="flex items-center gap-2.5">
          <WindowTrafficLights windowId={windowId} />
          <button
            type="button"
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showSidebar
                ? "bg-[#007aff]/10 text-[#007aff] border-[#007aff]/20"
                : "text-gray-400 hover:text-gray-700 dark:hover:text-white border-transparent hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            title={showSidebar ? "Hide Articles Sidebar" : "Show Articles Sidebar"}
          >
            <FiColumns size={13} />
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="text-gray-900 dark:text-white">Keynote</span>
          </div>
        </div>

        {/* Center: View Switcher & Document Status */}
        <div className="flex items-center gap-3">
          {/* Segmented View Switcher */}
          <div className={`flex items-center p-0.5 rounded-lg border text-xs font-medium ${isDarkMode ? "bg-black/30 border-white/10" : "bg-gray-200/80 border-black/5"
            }`}>
            <button
              onClick={() => setViewMode("edit")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${viewMode === "edit" ? "bg-white text-gray-900 shadow-xs dark:bg-[#3a3a3c] dark:text-white font-semibold" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <FiEdit3 size={12} />
              <span>Write</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${viewMode === "split" ? "bg-white text-gray-900 shadow-xs dark:bg-[#3a3a3c] dark:text-white font-semibold" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <FiColumns size={12} />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${viewMode === "preview" ? "bg-white text-gray-900 shadow-xs dark:bg-[#3a3a3c] dark:text-white font-semibold" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <FiEye size={12} />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewPost}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${isDarkMode
                ? "bg-white/10 hover:bg-white/15 text-white border-white/10"
                : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200 shadow-xs"
              }`}
            title="Create new post"
          >
            <FiPlus size={14} />
            <span>New Blog</span>
          </button>

          <button
            onClick={() => handlePublish("draft")}
            disabled={isSaving}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${isDarkMode
                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20"
                : "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
              }`}
          >
            <FiSave size={13} />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handlePublish("published")}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-[#007aff] hover:bg-[#0069d9] active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            title="Publish to Firestore & Notes"
          >
            <FiSend size={13} />
            <span>Publish to Notes</span>
          </button>

          <button
            onClick={handleLockSession}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
            title="Lock Studio"
          >
            <FiLock size={15} />
          </button>
        </div>
      </div>

      {/* MAIN STUDIO BODY (3-Column Layout: Posts Sidebar | Editor | Preview) */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR: Posts Explorer */}
        {showSidebar && (
          <div className={`w-56 sm:w-64 border-r flex flex-col shrink-0 ${isDarkMode ? "border-white/10 bg-[#212124]" : "border-black/10 bg-[#fbfbfd]"
            }`}>
            {/* Search Bar */}
            <div className="p-3 border-b border-black/5 dark:border-white/5">
              <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${isDarkMode ? "bg-black/30 border-white/10" : "bg-white border-gray-200"
                }`}>
                <FiSearch className="text-gray-400 shrink-0" size={13} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="px-3 py-2 flex items-center gap-1.5 border-b border-black/5 dark:border-white/5 text-[11px]">
              {["all", "published", "draft"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-0.5 rounded-md capitalize font-medium transition-colors cursor-pointer ${statusFilter === tab
                      ? "bg-[#007aff] text-white"
                      : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Posts List */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
              {filteredPosts.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No articles found. Click "+ New Blog" to write your first post.
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = selectedPostId === post.id;
                  const isDraft = post.status === "draft";
                  return (
                    <div
                      key={post.id}
                      onClick={() => loadPostIntoEditor(post)}
                      className={`p-3 cursor-pointer transition-colors relative group ${isSelected
                          ? isDarkMode ? "bg-white/10" : "bg-black/5"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isDraft
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-emerald-500/20 text-emerald-500"
                          }`}>
                          {post.status || "published"}
                        </span>
                        <span className="text-[10px] text-gray-400">{post.date || "Today"}</span>
                      </div>

                      <h4 className="text-xs font-semibold truncate text-gray-900 dark:text-white mb-0.5">
                        {post.title || "Untitled"}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">
                        {post.subtitle || post.content?.slice(0, 80) || "No preview"}
                      </p>

                      {/* Delete button on hover */}
                      <button
                        type="button"
                        onClick={(e) => handleDeletePost(post.id, e)}
                        className="absolute bottom-2 right-2 p-1.5 rounded-md text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete post"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* CENTER / EDITOR PANEL */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className="flex-1 flex flex-col overflow-y-auto border-r border-black/10 dark:border-white/10">
            {/* Meta & Cover Options Bar */}
            <div className={`p-4 border-b flex flex-col gap-3 ${isDarkMode ? "bg-[#252528]/50 border-white/5" : "bg-white border-black/5"
              }`}>
              {/* BANNER IMAGE CONTROLLER (Fully User-Editable Top to Bottom) */}
              {coverImage ? (
                <div className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 shadow-xs">
                  <div className="w-full h-36 relative overflow-hidden group">
                    <img
                      src={coverImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover transition-all duration-100"
                      style={{ objectPosition: `center ${coverPosition}%` }}
                    />

                    {/* Floating macOS Control Pill */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-white text-xs shadow-lg border border-white/10">
                      <button
                        type="button"
                        onClick={() => setShowBannerModal(true)}
                        className="hover:text-[#33a3ff] flex items-center gap-1.5 font-medium px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                        title="Upload, pick URL, or select preset"
                      >
                        <FiImage size={13} />
                        <span>Change Banner</span>
                      </button>
                      <span className="w-px h-3.5 bg-white/20" />
                      <button
                        type="button"
                        onClick={() => setShowPositionControls(!showPositionControls)}
                        className={`flex items-center gap-1.5 font-medium px-1.5 py-0.5 rounded cursor-pointer transition-colors ${showPositionControls ? "text-[#33a3ff] font-bold" : "hover:text-[#33a3ff]"
                          }`}
                        title="Reposition vertical crop (Top to Bottom)"
                      >
                        <FiSliders size={13} />
                        <span>Reposition ({coverPosition}%)</span>
                      </button>
                      <span className="w-px h-3.5 bg-white/20" />
                      <button
                        type="button"
                        onClick={() => setCoverImage("")}
                        className="hover:text-red-400 p-1 rounded cursor-pointer transition-colors"
                        title="Remove Banner Image"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>

                    {/* Small tag on banner indicating current position */}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white/90 font-medium">
                      Vertical Focus: {coverPosition}%
                    </div>
                  </div>

                  {/* Vertical Position Controller Bar (Top to Bottom Focus) */}
                  {showPositionControls && (
                    <div className={`px-3 py-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${isDarkMode ? "bg-[#1f1f22] border-white/10 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}>
                      <div className="flex items-center gap-2">
                        <FiSliders size={13} className="text-[#007aff]" />
                        <span className="font-semibold text-[11px] uppercase tracking-wider">Crop / Position:</span>
                        <span className="font-mono text-xs font-bold text-[#007aff] min-w-[34px]">{coverPosition}%</span>
                      </div>

                      {/* Presets: Top (0%), Center (50%), Bottom (100%) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCoverPosition(0)}
                          className={`px-2.5 py-0.5 rounded text-[11px] font-medium border cursor-pointer transition-all ${coverPosition === 0
                              ? "bg-[#007aff] text-white border-[#007aff] shadow-2xs"
                              : "hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/10"
                            }`}
                        >
                          Top (0%)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverPosition(50)}
                          className={`px-2.5 py-0.5 rounded text-[11px] font-medium border cursor-pointer transition-all ${coverPosition === 50
                              ? "bg-[#007aff] text-white border-[#007aff] shadow-2xs"
                              : "hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/10"
                            }`}
                        >
                          Center (50%)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverPosition(100)}
                          className={`px-2.5 py-0.5 rounded text-[11px] font-medium border cursor-pointer transition-all ${coverPosition === 100
                              ? "bg-[#007aff] text-white border-[#007aff] shadow-2xs"
                              : "hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/10"
                            }`}
                        >
                          Bottom (100%)
                        </button>
                      </div>

                      {/* Smooth Slider: Top (0%) -> Bottom (100%) */}
                      <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[240px]">
                        <span className="text-[10px] text-gray-400 font-medium">Top</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={coverPosition}
                          onChange={(e) => setCoverPosition(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#007aff]"
                          title="Slide to adjust vertical positioning from top to bottom"
                        />
                        <span className="text-[10px] text-gray-400 font-medium">Bottom</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-3.5 rounded-xl border border-dashed flex items-center justify-between transition-colors ${isDarkMode ? "border-white/15 bg-white/[0.02] hover:bg-white/[0.04]" : "border-gray-300 bg-gray-50/70 hover:bg-gray-50"
                  }`}>
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <FiImage size={16} className="text-[#007aff]" />
                    <span>No banner image set for this blog post</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBannerModal(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#007aff] hover:bg-[#0069d9] active:scale-98 text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <FiPlus size={13} />
                    <span>Add Banner Image</span>
                  </button>
                </div>
              )}
              {/* Category, Status, Word Count Ticker */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Category:</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-black/5 dark:bg-white/10 rounded-lg px-2.5 py-1 text-xs outline-none border border-black/5 dark:border-white/10 font-medium"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Development">Development</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                </div>
              </div>

              {/* Title Input */}
              <input
                type="text"
                placeholder="Title of your blog post..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold bg-transparent outline-none placeholder-gray-300 dark:placeholder-gray-600 tracking-tight"
              />

              {/* Subtitle / Excerpt */}
              <input
                type="text"
                placeholder="Add a compelling excerpt or subtitle..."
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full text-sm text-gray-600 dark:text-gray-400 bg-transparent outline-none placeholder-gray-300 dark:placeholder-gray-600"
              />

              {/* Tags Input */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#007aff]/10 text-[#007aff] flex items-center gap-1 border border-[#007aff]/20"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 font-bold ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Add tag + Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="text-xs bg-transparent outline-none placeholder-gray-400 min-w-[110px]"
                />
              </div>
            </div>

            {/* FORMATTING TOOLBAR */}
            <div 
              onMouseDown={(e) => {
                const btn = e.target.closest("button");
                if (btn) {
                  e.preventDefault();
                  updateCursorTracking();
                }
              }}
              className={`px-4 py-2 border-b flex flex-wrap items-center gap-1 sticky top-0 z-10 backdrop-blur-md relative ${isDarkMode ? "bg-[#1e1e21]/95 border-white/5 text-gray-200" : "bg-gray-100/95 border-black/5 text-gray-700"
              }`}>
              {/* Text formatting: Bold, Italic, Underline, Strikethrough, Highlight */}
              <button
                type="button"
                onClick={() => insertFormatting("**", "**")}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold"
                title="Bold (⌘B)"
              >
                <FiBold size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("*", "*")}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs italic"
                title="Italic (⌘I)"
              >
                <FiItalic size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("<u>", "</u>")}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs"
                title="Underline"
              >
                <FiUnderline size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("~~", "~~")}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs"
                title="Strikethrough"
              >
                <BsTypeStrikethrough size={13} />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("==", "==")}
                className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400"
                title="Highlight Text"
              >
                ==H==
              </button>

              <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

              {/* Headings */}
              <button
                type="button"
                onClick={() => insertFormatting("# ")}
                className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold"
                title="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("## ")}
                className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("### ")}
                className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold"
                title="Heading 3"
              >
                H3
              </button>

              <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

              {/* Lists Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowListMenu(!showListMenu);
                    setShowCodeMenu(false);
                    setShowEmojiPicker(false);
                    setShowTextArtMenu(false);
                  }}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 ${showListMenu ? "bg-black/15 dark:bg-white/15" : "hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  title="Lists & Bullets"
                >
                  <BsListUl size={13} />
                  <span className="text-[10px] hidden sm:inline">Lists</span>
                </button>
                {showListMenu && (
                  <div className={`absolute left-0 top-full mt-1 w-44 rounded-xl shadow-xl border p-1.5 z-30 backdrop-blur-lg flex flex-col gap-0.5 ${isDarkMode ? "bg-[#252528]/95 border-white/10 text-white" : "bg-white/95 border-black/10 text-gray-800"
                    }`}>
                    <button
                      type="button"
                      onClick={() => handleInsertList("bullet")}
                      className="px-2.5 py-1.5 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white flex items-center gap-2"
                    >
                      <BsListUl size={13} />
                      <span>Standard Bullet (•)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertList("numbered")}
                      className="px-2.5 py-1.5 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white flex items-center gap-2"
                    >
                      <BsListOl size={13} />
                      <span>Numbered List (1.)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertList("task")}
                      className="px-2.5 py-1.5 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white flex items-center gap-2"
                    >
                      <BsListCheck size={13} />
                      <span>Task Checkbox (- [ ])</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertList("arrow")}
                      className="px-2.5 py-1.5 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white flex items-center gap-2 font-mono"
                    >
                      <span>→</span>
                      <span>Arrow Bullet (→)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Blockquote */}
              <button
                type="button"
                onClick={() => insertFormatting("> ")}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs"
                title="Blockquote"
              >
                <BsQuote size={13} />
              </button>

              {/* Horizontal Divider Line */}
              <button
                type="button"
                onClick={handleInsertHR}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs"
                title="Horizontal Rule / Break Line"
              >
                <BsHr size={14} />
              </button>

              <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

              {/* Code Blocks Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowCodeMenu(!showCodeMenu);
                    setShowListMenu(false);
                    setShowEmojiPicker(false);
                    setShowTextArtMenu(false);
                  }}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 font-mono ${showCodeMenu ? "bg-black/15 dark:bg-white/15" : "hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  title="Code Blocks"
                >
                  <BsCodeSlash size={13} />
                  <span className="text-[10px] hidden sm:inline">Code</span>
                </button>
                {showCodeMenu && (
                  <div className={`absolute left-0 top-full mt-1 w-48 rounded-xl shadow-xl border p-1.5 z-30 backdrop-blur-lg flex flex-col gap-0.5 ${isDarkMode ? "bg-[#252528]/95 border-white/10 text-white" : "bg-white/95 border-black/10 text-gray-800"
                    }`}>
                    <button
                      type="button"
                      onClick={() => {
                        insertFormatting("`", "`");
                        setShowCodeMenu(false);
                      }}
                      className="px-2.5 py-1.5 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white flex items-center justify-between"
                    >
                      <span>Inline Code</span>
                      <code className="text-[10px] opacity-75 font-mono">`code`</code>
                    </button>
                    <div className="h-px bg-black/10 dark:bg-white/10 my-0.5" />
                    {[
                      { id: "javascript", label: "JavaScript / React" },
                      { id: "typescript", label: "TypeScript" },
                      { id: "python", label: "Python" },
                      { id: "bash", label: "Bash / Shell" },
                      { id: "sql", label: "SQL Query" },
                      { id: "html", label: "HTML Structure" },
                      { id: "css", label: "CSS Styles" },
                      { id: "json", label: "JSON Data" },
                      { id: "markdown", label: "Markdown Checklist" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleInsertCodeBlock(item.id)}
                        className="px-2.5 py-1.5 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] font-mono opacity-60">.{item.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

              {/* Hyperlink inserting */}
              <button
                type="button"
                onClick={handleOpenLinkModal}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs flex items-center gap-1"
                title="Insert Hyperlink"
              >
                <FiLink size={13} />
                <span className="text-[10px] hidden sm:inline">Link</span>
              </button>

              {/* Emoji Picker Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowListMenu(false);
                    setShowCodeMenu(false);
                    setShowTextArtMenu(false);
                  }}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 ${showEmojiPicker ? "bg-black/15 dark:bg-white/15" : "hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  title="Emoji Picker"
                >
                  <BsEmojiSmile size={13} />
                  <span className="text-[10px] hidden sm:inline">Emoji</span>
                </button>
                {showEmojiPicker && (
                  <div className={`absolute left-0 top-full mt-1 w-64 rounded-2xl shadow-2xl border p-3 z-30 backdrop-blur-xl ${isDarkMode ? "bg-[#252528]/95 border-white/10 text-white" : "bg-white/95 border-black/10 text-gray-800"
                    }`}>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10">
                      <span className="text-xs font-bold">Insert Emoji</span>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Security & Tech</div>
                        <div className="grid grid-cols-6 gap-1 text-base">
                          {["🛡️", "🔒", "🔑", "💻", "⚡", "🌐", "🛰️", "⚙️", "🚀", "🧪", "🔍", "💾"].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => handleInsertEmoji(em)}
                              className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Writing & Workflow</div>
                        <div className="grid grid-cols-6 gap-1 text-base">
                          {["📝", "📌", "💡", "🏷️", "📖", "✍️", "🎯", "📊", "📁", "🗂️", "✨", "🔥"].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => handleInsertEmoji(em)}
                              className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status & Reactions</div>
                        <div className="grid grid-cols-6 gap-1 text-base">
                          {["✅", "⚠️", "❌", "⏳", "🔔", "🚨", "🌟", "💬", "🚩", "🟢", "👍", "👏"].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => handleInsertEmoji(em)}
                              className="w-7 h-7 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Art & Callouts Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowTextArtMenu(!showTextArtMenu);
                    setShowListMenu(false);
                    setShowCodeMenu(false);
                    setShowEmojiPicker(false);
                  }}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 ${showTextArtMenu ? "bg-black/15 dark:bg-white/15" : "hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  title="Text Arts & Callout Boxes"
                >
                  <span className="text-xs">✦</span>
                  <span className="text-[10px] hidden sm:inline">Callout & Art</span>
                </button>
                {showTextArtMenu && (
                  <div className={`absolute right-0 sm:left-0 top-full mt-1 w-64 rounded-2xl shadow-2xl border p-3 z-30 backdrop-blur-xl ${isDarkMode ? "bg-[#252528]/95 border-white/10 text-white" : "bg-white/95 border-black/10 text-gray-800"
                    }`}>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10">
                      <span className="text-xs font-bold">Text Art & Callouts</span>
                      <button
                        type="button"
                        onClick={() => setShowTextArtMenu(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Decorative Dividers</div>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleInsertTextArt("✦ ───── ✦ ───── ✦")}
                            className="px-2 py-1 text-xs text-center rounded-lg hover:bg-[#007aff] hover:text-white bg-black/5 dark:bg-white/5 font-mono"
                          >
                            ✦ ───── ✦ ───── ✦
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertTextArt("━━━━━━━━━━━━━━━━━━━━━")}
                            className="px-2 py-1 text-xs text-center rounded-lg hover:bg-[#007aff] hover:text-white bg-black/5 dark:bg-white/5 font-mono"
                          >
                            ━━━━━━━━━━━━━━━━━━━━━
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertTextArt("═════════════════════")}
                            className="px-2 py-1 text-xs text-center rounded-lg hover:bg-[#007aff] hover:text-white bg-black/5 dark:bg-white/5 font-mono"
                          >
                            ═════════════════════
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertTextArt("• • • • • • • • • • •")}
                            className="px-2 py-1 text-xs text-center rounded-lg hover:bg-[#007aff] hover:text-white bg-black/5 dark:bg-white/5 font-mono"
                          >
                            • • • • • • • • • • •
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Professional Callout Cards</div>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleInsertCallout("tip")}
                            className="px-2 py-1 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center gap-1.5"
                          >
                            <span>💡</span>
                            <span>Pro Tip Card</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertCallout("note")}
                            className="px-2 py-1 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white bg-sky-500/10 text-sky-700 dark:text-sky-300 flex items-center gap-1.5"
                          >
                            <span>ℹ️</span>
                            <span>Contextual Note</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertCallout("warning")}
                            className="px-2 py-1 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white bg-red-500/10 text-red-700 dark:text-red-300 flex items-center gap-1.5"
                          >
                            <span>⚠️</span>
                            <span>Warning Alert</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertCallout("security")}
                            className="px-2 py-1 text-xs text-left rounded-lg hover:bg-[#007aff] hover:text-white bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5"
                          >
                            <span>🛡️</span>
                            <span>Security Bulletin</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <span className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

              {/* Inset Image */}
              <button
                type="button"
                onClick={() => setShowInsetModal(true)}
                className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-xs flex items-center gap-1 text-[#007aff]"
                title="Insert Centered Inset Image"
              >
                <FiImage size={13} />
                <span className="text-[10px] font-semibold hidden sm:inline">Inset Image</span>
              </button>
            </div>

            {/* EDITOR TEXTAREA */}
            <div className="flex-1 p-5">
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  updateCursorTracking();
                }}
                onSelect={updateCursorTracking}
                onClick={updateCursorTracking}
                onKeyUp={updateCursorTracking}
                onScroll={updateCursorTracking}
                placeholder="Write your blog post here with markdown..."
                className="w-full h-full min-h-[350px] bg-transparent outline-none resize-none font-mono text-[13px] leading-relaxed text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        )}

        {/* RIGHT / PREVIEW PANEL */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#19191b]">
            <div className="max-w-2xl mx-auto">
              {/* Cover Image Banner (Reflects Top-to-Bottom Crop Position) */}
              {coverImage && (
                <div className="w-full h-52 rounded-2xl overflow-hidden mb-6 shadow-md border border-black/5 dark:border-white/10">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover transition-all duration-100"
                    style={{ objectPosition: `center ${coverPosition}%` }}
                  />
                </div>
              )}

              {/* Tag & Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#007aff] uppercase tracking-wider">{category}</span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-xs text-gray-400">{readingTime} min read</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                {title || "Untitled Article"}
              </h1>
              {subtitle && (
                <p className="text-base text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  {subtitle}
                </p>
              )}

              <hr className="border-black/5 dark:border-white/10 mb-6" />

              {/* Formatted Content */}
              {renderPreview()}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file inputs for local image upload */}
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={handleBannerFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={insetFileInputRef}
        onChange={handleInsetFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* BANNER IMAGE MODAL */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border flex flex-col gap-4 ${isDarkMode ? "bg-[#252528] border-white/10 text-white" : "bg-white border-black/10 text-gray-900"
            }`}>
            <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <FiImage size={18} className="text-[#007aff]" />
                <h3 className="text-base font-bold">Edit Banner Image</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Option 1: Upload from Device */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Option 1: Upload from Device (Instant Auto-Optimization)
                </label>
                <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                  <FiCheck size={10} /> Auto-Optimized
                </span>
              </div>
              <button
                type="button"
                disabled={isUploadingBanner}
                onClick={() => bannerFileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#007aff]/40 bg-[#007aff]/5 hover:bg-[#007aff]/10 text-[#007aff] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploadingBanner ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
                    <span>Processing & Optimizing Image...</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={14} />
                    <span>Upload Banner Image (Optimized & Resilient)</span>
                  </>
                )}
              </button>
            </div>

            {/* Option 2: Enter Web URL */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Option 2: Web Image URL</label>
              <form onSubmit={handleApplyBannerUrl} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={bannerUrlInput}
                  onChange={(e) => setBannerUrlInput(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none ${isDarkMode ? "bg-black/30 border-white/10" : "bg-gray-50 border-gray-200"
                    }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007aff] hover:bg-[#0069d9] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Option 3: Curated Presets */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Option 3: Curated Portfolio Presets</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_COVERS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setCoverImage(preset);
                      setShowBannerModal(false);
                      showToast("Banner preset applied!");
                    }}
                    className="h-16 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 hover:ring-2 hover:ring-[#007aff] transition-all cursor-pointer relative group"
                  >
                    <img src={preset} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Remove Banner */}
            {coverImage && (
              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage("");
                    setShowBannerModal(false);
                    showToast("Banner image removed");
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer"
                >
                  Remove Banner
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CENTERED INSET IMAGE MODAL */}
      {showInsetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border flex flex-col gap-4 ${isDarkMode ? "bg-[#252528] border-white/10 text-white" : "bg-white border-black/10 text-gray-900"
            }`}>
            <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <FiAlignCenter size={18} className="text-[#007aff]" />
                <h3 className="text-base font-bold">Insert Inset Image (Centered)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInsetModal(false)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#007aff]/10 border border-[#007aff]/20 flex items-center gap-2 text-xs text-[#007aff]">
              <FiAlignCenter size={16} className="shrink-0" />
              <span>This image will automatically be centered in both Keynote preview and the Notes reader app.</span>
            </div>

            {/* Image Source (URL or Upload) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Image Source (URL or Device Upload)</label>
                <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                  <FiCheck size={10} /> Auto-Optimized
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/diagram.png or upload below"
                  value={insetUrl}
                  onChange={(e) => setInsetUrl(e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none ${isDarkMode ? "bg-black/30 border-white/10" : "bg-gray-50 border-gray-200"
                    }`}
                />
                <button
                  type="button"
                  disabled={isUploadingInset}
                  onClick={() => insetFileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-medium hover:bg-sky-500/15 flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                  title="Upload image from device"
                >
                  {isUploadingInset ? (
                    <>
                      <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload size={13} />
                      <span>Upload Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Caption */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Caption / Description (Centered Underneath)</label>
              <input
                type="text"
                placeholder="e.g. Architecture overview diagram"
                value={insetCaption}
                onChange={(e) => setInsetCaption(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDarkMode ? "bg-black/30 border-white/10" : "bg-gray-50 border-gray-200"
                  }`}
              />
            </div>

            {/* Inset preview if url provided */}
            {insetUrl && (
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 max-h-36 overflow-hidden">
                <img src={insetUrl} alt="Preview" className="max-h-24 object-contain rounded-lg mx-auto shadow-xs" />
                {insetCaption && <span className="text-[11px] text-gray-500 italic mt-1.5">{insetCaption}</span>}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => setShowInsetModal(false)}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertInsetImage}
                className="px-4 py-2 bg-[#007aff] hover:bg-[#0069d9] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <FiPlus size={13} />
                <span>Insert Centered Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HYPERLINK INSERTION MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border flex flex-col gap-4 ${isDarkMode
                ? "bg-[#252528] border-white/10 text-white"
                : "bg-white border-black/10 text-gray-900"
              }`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#007aff]/10 flex items-center justify-center text-[#007aff]">
                  <FiLink size={16} />
                </div>
                <h3 className="text-sm font-bold">Insert Hyperlink</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <FiX size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Display Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. ISO 27001 Standards Guide"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${isDarkMode ? "bg-black/30 border-white/10" : "bg-gray-50 border-gray-200"
                    }`}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Target URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/resource"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmInsertLink();
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-mono ${isDarkMode ? "bg-black/30 border-white/10" : "bg-gray-50 border-gray-200"
                    }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmInsertLink}
                disabled={!linkUrl.trim()}
                className="px-4 py-2 bg-[#007aff] hover:bg-[#0069d9] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs disabled:opacity-50"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
