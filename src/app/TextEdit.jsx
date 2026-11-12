import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/Appstore";

// Helper to decode Base64 UTF-8 text safely
const decodeBase64Text = (dataUrl) => {
  try {
    if (!dataUrl) return "";
    const base64Part = dataUrl.split(",")[1];
    if (!base64Part) return "";
    const binString = atob(base64Part);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error(e);
    return "Error decoding text file.";
  }
};

// Traffic lights inside the TextEdit header
const TrafficLights = ({ windowId, onClose }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-2 shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => {
          if (onClose) {
            onClose();
          } else if (windowId) {
            close(windowId);
          }
        }}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => windowId && minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
        onClick={() => windowId && toggleMaximize(windowId)}
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
      </div>
    </div>
  );
};

export default function TextEdit({ file, windowId, isDragging, isResizing }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const closeApp = useAppStore((s) => s.closeApp);

  const [editorText, setEditorText] = useState("");
  const [editorTitle, setEditorTitle] = useState("");

  // Intro and bio files are strictly read-only and non-modifiable
  const isReadOnly = file?.readOnly !== false && (
    file?.readOnly === true ||
    file?.name?.toLowerCase().includes("abinaya") ||
    file?.id?.includes("abinaya") ||
    file?.name?.toLowerCase().includes("about")
  );

  useEffect(() => {
    if (file) {
      setEditorTitle(file.name || "untitled.txt");
      const initialText = file.content || (file.url && file.url.startsWith("data:") ? decodeBase64Text(file.url) : "");
      setEditorText(initialText);
    }
  }, [file]);

  const handleClose = () => {
    closeApp(windowId);
  };

  return (
    <div className={`flex flex-col h-full w-full select-none transition-colors duration-150 ${
      isDarkMode ? "bg-[#1E1E1E] text-[#F9FAFB]" : "bg-[#FFFFFF] text-[#111827]"
    }`}>
      {/* Title Bar / TextEdit Unified macOS Header */}
      <div className={`window-drag-handle flex items-center justify-between border-b px-4 py-2.5 select-none ${
        isDarkMode ? "bg-[#2D2D2D] border-white/10 text-white" : "bg-[#F0F0F0] border-[#D0D0D0] text-[#111827]"
      }`}>
        {/* Left: Traffic Lights */}
        <div className="flex items-center gap-1.5">
          <TrafficLights windowId={windowId} onClose={handleClose} />
        </div>

        {/* Center: File Title */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold tracking-wide ${
            isDarkMode ? "text-[#F9FAFB]" : "text-[#111827]"
          }`}>
            {editorTitle}
          </span>
          {isReadOnly && (
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
              isDarkMode 
                ? "bg-white/15 text-gray-200 border border-white/15" 
                : "bg-gray-200 text-gray-800 border border-gray-300"
            }`}>
              Read-Only
            </span>
          )}
        </div>

        {/* Right: Format Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
          <span>UTF-8 Text</span>
        </div>
      </div>
      
      {/* Real Text File Content Area - Non-modifiable, high-contrast, fully visible on white background */}
      <div 
        className={`flex-1 p-6 sm:p-8 overflow-y-auto select-text font-mono text-[13px] leading-relaxed whitespace-pre-wrap ${
          isDarkMode 
            ? "bg-[#1E1E1E] text-[#F9FAFB]" 
            : "bg-[#FFFFFF] text-[#111827]"
        }`}
        style={{
          color: isDarkMode ? "#F9FAFB" : "#111827",
          backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF"
        }}
      >
        {editorText}
      </div>
    </div>
  );
}
