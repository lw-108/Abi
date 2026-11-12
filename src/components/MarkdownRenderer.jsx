import React, { useState } from "react";
import { FiCopy, FiCheck, FiExternalLink, FiInfo, FiAlertTriangle, FiShield } from "react-icons/fi";
import { BsFillLightbulbFill, BsCheck2Square, BsSquare } from "react-icons/bs";

// Helper to render inline markdown elements (bold, italic, links, code, strikethrough, highlights)
export const renderInlineContent = (text) => {
  if (!text) return "";

  // Tokenize regex for links, bold, italic, strikethrough, underline, highlight, inline code
  const tokens = [];
  let remaining = text;
  let keyIndex = 0;

  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
  // Regex to match bold: **text**
  const boldRegex = /\*\*([^*]+)\*\*/;
  // Regex to match italic: *text*
  const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/;
  // Regex to match inline code: `code`
  const codeRegex = /`([^`]+)`/;
  // Regex to match strikethrough: ~~text~~
  const strikeRegex = /~~([^~]+)~~/;
  // Regex to match highlight: ==text==
  const highlightRegex = /==([^=]+)==/;
  // Regex to match underline: <u>text</u>
  const underlineRegex = /<u>(.*?)<\/u>/i;

  while (remaining.length > 0) {
    // Find earliest match among all patterns
    const matches = [
      { type: "link", match: remaining.match(linkRegex) },
      { type: "bold", match: remaining.match(boldRegex) },
      { type: "italic", match: remaining.match(italicRegex) },
      { type: "code", match: remaining.match(codeRegex) },
      { type: "strike", match: remaining.match(strikeRegex) },
      { type: "highlight", match: remaining.match(highlightRegex) },
      { type: "underline", match: remaining.match(underlineRegex) },
    ].filter((m) => m.match && m.match.index !== undefined);

    if (matches.length === 0) {
      tokens.push(<span key={keyIndex++}>{remaining}</span>);
      break;
    }

    // Sort by index to get the earliest match in the string
    matches.sort((a, b) => a.match.index - b.match.index);
    const earliest = matches[0];
    const matchIndex = earliest.match.index;
    const matchStr = earliest.match[0];

    // Push preceding text if any
    if (matchIndex > 0) {
      tokens.push(<span key={keyIndex++}>{remaining.slice(0, matchIndex)}</span>);
    }

    // Push matched element
    if (earliest.type === "link") {
      const linkText = earliest.match[1];
      const linkUrl = earliest.match[2];
      tokens.push(
        <a
          key={keyIndex++}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#007aff] hover:underline inline-flex items-center gap-0.5 font-medium cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{linkText}</span>
          <FiExternalLink size={11} className="inline ml-0.5 opacity-80" />
        </a>
      );
    } else if (earliest.type === "bold") {
      tokens.push(
        <strong key={keyIndex++} className="font-bold text-gray-900 dark:text-white">
          {earliest.match[1]}
        </strong>
      );
    } else if (earliest.type === "italic") {
      tokens.push(
        <em key={keyIndex++} className="italic">
          {earliest.match[1]}
        </em>
      );
    } else if (earliest.type === "code") {
      tokens.push(
        <code
          key={keyIndex++}
          className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[12.5px] text-pink-600 dark:text-pink-400 font-medium"
        >
          {earliest.match[1]}
        </code>
      );
    } else if (earliest.type === "strike") {
      tokens.push(
        <del key={keyIndex++} className="line-through opacity-70">
          {earliest.match[1]}
        </del>
      );
    } else if (earliest.type === "highlight") {
      tokens.push(
        <mark
          key={keyIndex++}
          className="bg-yellow-200 dark:bg-yellow-800/60 dark:text-yellow-100 px-1 py-0.2 rounded text-inherit"
        >
          {earliest.match[1]}
        </mark>
      );
    } else if (earliest.type === "underline") {
      tokens.push(
        <span key={keyIndex++} className="underline">
          {earliest.match[1]}
        </span>
      );
    }

    remaining = remaining.slice(matchIndex + matchStr.length);
  }

  return tokens;
};

// Code block with copy button and language tag
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-[#161b22] text-gray-100 shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/10 text-xs font-mono text-gray-400">
        <span className="uppercase text-[11px] font-bold tracking-wider text-blue-400">
          {language || "CODE"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-sans text-xs"
          title="Copy code"
        >
          {copied ? <FiCheck size={13} className="text-emerald-400" /> : <FiCopy size={13} />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-emerald-300 selection:bg-emerald-800/50">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = "";
  let inList = false;
  let listBuffer = [];
  let listType = "disc"; // "disc" | "ordered" | "task"

  const flushList = () => {
    if (listBuffer.length > 0) {
      if (listType === "ordered") {
        elements.push(
          <ol
            key={`ol-${elements.length}`}
            className="my-3 space-y-1.5 ml-6 list-decimal text-gray-700 dark:text-gray-300 text-[14.5px] leading-relaxed"
          >
            {listBuffer.map((item, i) => (
              <li key={i}>{renderInlineContent(item)}</li>
            ))}
          </ol>
        );
      } else if (listType === "task") {
        elements.push(
          <div key={`task-${elements.length}`} className="my-3 space-y-2 text-[14.5px]">
            {listBuffer.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {item.checked ? (
                  <BsCheck2Square className="text-emerald-500 shrink-0 mt-1" size={15} />
                ) : (
                  <BsSquare className="text-gray-400 shrink-0 mt-1" size={14} />
                )}
                <span className={item.checked ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}>
                  {renderInlineContent(item.text)}
                </span>
              </div>
            ))}
          </div>
        );
      } else {
        elements.push(
          <ul
            key={`ul-${elements.length}`}
            className="my-3 space-y-1.5 ml-5 list-disc text-gray-700 dark:text-gray-300 text-[14.5px] leading-relaxed"
          >
            {listBuffer.map((item, i) => (
              <li key={i}>{renderInlineContent(item)}</li>
            ))}
          </ul>
        );
      }
      listBuffer = [];
      inList = false;
    }
  };

  const flushCode = () => {
    if (codeBuffer.length > 0) {
      const codeText = codeBuffer.join("\n");
      elements.push(
        <CodeBlock key={`code-${elements.length}`} code={codeText} language={codeLang} />
      );
      codeBuffer = [];
      codeLang = "";
      inCodeBlock = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Code block fences
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Task list items: - [ ] or - [x]
    if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("- [x] ") || trimmed.startsWith("- [X] ")) {
      if (!inList || listType !== "task") {
        flushList();
        inList = true;
        listType = "task";
      }
      const isChecked = trimmed.startsWith("- [x] ") || trimmed.startsWith("- [X] ");
      listBuffer.push({ checked: isChecked, text: trimmed.slice(6) });
      return;
    }

    // Ordered / numbered list: 1. 2. etc.
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (!inList || listType !== "ordered") {
        flushList();
        inList = true;
        listType = "ordered";
      }
      listBuffer.push(orderedMatch[2]);
      return;
    }

    // Standard bullet points: - or * or • or →
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") || trimmed.startsWith("→ ")) {
      if (!inList || listType !== "disc") {
        flushList();
        inList = true;
        listType = "disc";
      }
      listBuffer.push(trimmed.slice(2));
      return;
    }

    // Exit list if not a list item
    flushList();

    // Horizontal Rule: ---, ***, ___
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(
        <hr
          key={index}
          className="my-8 border-t-2 border-slate-200 dark:border-slate-800 rounded-full"
        />
      );
      return;
    }

    // Decorative Text Arts (e.g. ✦ ───── ✦ or ━━━━━━━━━━ or ══════════)
    if (
      trimmed.startsWith("✦ ─") ||
      trimmed.startsWith("━━━") ||
      trimmed.startsWith("═══") ||
      trimmed.startsWith("/* ──") ||
      trimmed.startsWith("• • •")
    ) {
      elements.push(
        <div
          key={index}
          className="my-6 text-center font-mono text-xs text-blue-500/80 dark:text-blue-400/80 tracking-widest select-none overflow-x-auto py-1"
        >
          {trimmed}
        </div>
      );
      return;
    }

    // Centered Inset Image: ![caption](url)
    if (trimmed.startsWith("![") && trimmed.includes("](") && trimmed.endsWith(")")) {
      const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
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
        return;
      }
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={index}
          className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-8 mb-4 tracking-tight"
        >
          {renderInlineContent(line.slice(2))}
        </h1>
      );
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3 tracking-tight"
        >
          {renderInlineContent(line.slice(3))}
        </h2>
      );
      return;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={index}
          className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-5 mb-2 tracking-tight"
        >
          {renderInlineContent(line.slice(4))}
        </h3>
      );
      return;
    }
    if (line.startsWith("#### ")) {
      elements.push(
        <h4
          key={index}
          className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2"
        >
          {renderInlineContent(line.slice(5))}
        </h4>
      );
      return;
    }

    // Callout Alert Boxes and Quotes
    if (line.startsWith("> ")) {
      const quoteBody = line.slice(2).trim();

      // Tip Card
      if (quoteBody.startsWith("💡") || quoteBody.startsWith("[!TIP]")) {
        const clean = quoteBody.replace(/^💡\s*(\*\*Tip:\*\*)?/, "").replace(/^\[!TIP\]/, "").trim();
        elements.push(
          <div
            key={index}
            className="my-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 text-sm flex items-start gap-3 shadow-xs"
          >
            <BsFillLightbulbFill className="text-emerald-500 shrink-0 mt-0.5" size={17} />
            <div>
              <strong className="block font-bold text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wider mb-0.5">
                Pro Tip
              </strong>
              <div className="leading-relaxed">{renderInlineContent(clean)}</div>
            </div>
          </div>
        );
        return;
      }

      // Note Card
      if (quoteBody.startsWith("ℹ️") || quoteBody.startsWith("[!NOTE]")) {
        const clean = quoteBody.replace(/^ℹ️\s*(\*\*Note:\*\*)?/, "").replace(/^\[!NOTE\]/, "").trim();
        elements.push(
          <div
            key={index}
            className="my-4 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 text-sm flex items-start gap-3 shadow-xs"
          >
            <FiInfo className="text-blue-500 shrink-0 mt-0.5" size={17} />
            <div>
              <strong className="block font-bold text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wider mb-0.5">
                Note
              </strong>
              <div className="leading-relaxed">{renderInlineContent(clean)}</div>
            </div>
          </div>
        );
        return;
      }

      // Warning Card
      if (quoteBody.startsWith("⚠️") || quoteBody.startsWith("[!WARNING]")) {
        const clean = quoteBody.replace(/^⚠️\s*(\*\*Warning:\*\*)?/, "").replace(/^\[!WARNING\]/, "").trim();
        elements.push(
          <div
            key={index}
            className="my-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3 shadow-xs"
          >
            <FiAlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={17} />
            <div>
              <strong className="block font-bold text-amber-700 dark:text-amber-300 text-xs uppercase tracking-wider mb-0.5">
                Warning
              </strong>
              <div className="leading-relaxed">{renderInlineContent(clean)}</div>
            </div>
          </div>
        );
        return;
      }

      // Security Notice Card
      if (quoteBody.startsWith("🛡️") || quoteBody.startsWith("[!SECURITY]")) {
        const clean = quoteBody.replace(/^🛡️\s*(\*\*Security:?\*\*)?/, "").replace(/^\[!SECURITY\]/, "").trim();
        elements.push(
          <div
            key={index}
            className="my-4 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 text-sm flex items-start gap-3 shadow-xs"
          >
            <FiShield className="text-indigo-500 shrink-0 mt-0.5" size={17} />
            <div>
              <strong className="block font-bold text-indigo-700 dark:text-indigo-300 text-xs uppercase tracking-wider mb-0.5">
                Security Notice
              </strong>
              <div className="leading-relaxed">{renderInlineContent(clean)}</div>
            </div>
          </div>
        );
        return;
      }

      // Standard Blockquote
      elements.push(
        <blockquote
          key={index}
          className="border-l-4 border-[#007aff] pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300 bg-black/[0.02] dark:bg-white/[0.04] rounded-r-lg font-serif"
        >
          {renderInlineContent(quoteBody)}
        </blockquote>
      );
      return;
    }

    // Blank lines
    if (!trimmed) {
      elements.push(<div key={index} className="h-2.5" />);
      return;
    }

    // Standard paragraph
    elements.push(
      <p key={index} className="my-2.5 leading-relaxed text-[15px] text-gray-800 dark:text-gray-200">
        {renderInlineContent(line)}
      </p>
    );
  });

  flushList();
  flushCode();

  return <div className={`prose max-w-none font-sans leading-relaxed ${className}`}>{elements}</div>;
}
