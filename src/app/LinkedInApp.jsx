import React, { useState } from "react";
import { useAppStore } from "../store/Appstore";
import {
  FiExternalLink,
  FiRefreshCw,
  FiLock,
  FiArrowLeft,
  FiArrowRight,
  FiCopy,
  FiCheck,
  FiSearch,
  FiHome,
  FiUsers,
  FiBriefcase,
  FiMessageSquare,
  FiBell,
  FiMapPin,
  FiMail,
  FiShield,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiSend
} from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

// Traffic lights component
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-2 shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-xs"
        onClick={() => windowId && close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-xs"
        onClick={() => windowId && minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-xs"
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

export default function LinkedInApp({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const linkedInUrl = "https://www.linkedin.com/in/abinaya";
  
  // Modes: "live-page" (proxied original page from linkedin.com) or "live-profile" (detailed interactive profile view)
  const [displayMode, setDisplayMode] = useState("live-page");
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const handleRefresh = () => {
    setIsIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(linkedInUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    setConnected((prev) => !prev);
  };

  return (
    <div className={`w-full h-full flex flex-col select-none overflow-hidden font-sans ${
      isDarkMode ? "bg-[#1b1f23] text-gray-200" : "bg-[#f3f2ef] text-gray-900"
    }`}>
      {/* Real macOS Browser Navigation Bar */}
      <div className={`window-drag-handle flex items-center justify-between px-3.5 py-2 border-b select-none shrink-0 ${
        isDarkMode ? "bg-[#282e33] border-[#38434f]" : "bg-white border-[#e0e0e0] shadow-xs"
      }`}>
        {/* Left: Traffic Lights & Navigation */}
        <div className="flex items-center gap-2">
          <TrafficLights windowId={windowId} />
          
          <div className="flex items-center gap-0.5 text-gray-400">
            <button className="p-1 rounded opacity-50 cursor-not-allowed" disabled>
              <FiArrowLeft size={14} />
            </button>
            <button className="p-1 rounded opacity-50 cursor-not-allowed" disabled>
              <FiArrowRight size={14} />
            </button>
            <button
              onClick={handleRefresh}
              className={`p-1 rounded transition ${isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
              title="Refresh"
            >
              <FiRefreshCw size={13} className={isIframeLoading && displayMode === "live-page" ? "animate-spin text-blue-500" : ""} />
            </button>
          </div>
        </div>

        {/* Center: Real URL address bar */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono border max-w-md w-full mx-3 ${
          isDarkMode ? "bg-[#1b1f23] border-[#38434f] text-gray-200" : "bg-[#f3f2ef] border-[#d8d8d8] text-gray-800"
        }`}>
          <FiLock size={12} className="text-emerald-500 shrink-0" />
          <span className="truncate flex-1 font-sans text-xs">https://www.linkedin.com/in/abinaya</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-sans font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE
          </span>
          <FaLinkedin size={13} className="text-[#0a66c2]" />
        </div>

        {/* Right: Mode Switcher & Open in Tab */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`flex items-center p-0.5 rounded-md border text-[11px] font-medium ${
            isDarkMode ? "bg-[#1b1f23] border-[#38434f]" : "bg-gray-100 border-gray-300"
          }`}>
            <button
              onClick={() => setDisplayMode("live-page")}
              className={`px-2 py-0.5 rounded transition ${
                displayMode === "live-page"
                  ? isDarkMode ? "bg-[#0a66c2] text-white" : "bg-white shadow-xs text-gray-900 font-semibold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Original live page from linkedin.com"
            >
              Live Page
            </button>
            <button
              onClick={() => setDisplayMode("live-profile")}
              className={`px-2 py-0.5 rounded transition ${
                displayMode === "live-profile"
                  ? isDarkMode ? "bg-[#0a66c2] text-white" : "bg-white shadow-xs text-gray-900 font-semibold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Profile Overview"
            >
              Profile View
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-md text-xs transition ${
              isDarkMode ? "hover:bg-[#38434f] text-gray-300" : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Copy URL"
          >
            {copied ? <FiCheck size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
          </button>
          
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-semibold rounded-md transition shadow-xs cursor-pointer"
            title="Open live website in new browser tab"
          >
            <span>Open in Tab</span>
            <FiExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
        {displayMode === "live-page" ? (
          /* Live Original Web Page from linkedin.com via Vite Proxy */
          <div className="w-full h-full relative bg-white">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#1b1f23] z-10">
                <div className="w-8 h-8 border-3 border-[#0a66c2] border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-xs text-gray-500 font-medium">
                  Streaming live from linkedin.com/in/abinaya...
                </span>
              </div>
            )}
            <iframe
              key={iframeKey}
              src="/live-linkedin/in/abinaya"
              title="Original LinkedIn Profile"
              onLoad={() => setIsIframeLoading(false)}
              onError={() => {
                setIsIframeLoading(false);
                setDisplayMode("live-profile");
              }}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        ) : (
          /* Full Interactive LinkedIn Profile View */
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 select-text">
            {/* Live Source Status Banner */}
            <div className={`max-w-4xl mx-auto mb-4 p-3 rounded-lg border flex items-center justify-between text-xs ${
              isDarkMode ? "bg-[#1e2328] border-[#38434f] text-gray-300" : "bg-blue-50 border-blue-200 text-blue-900"
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Original profile source: <strong>linkedin.com/in/abinaya</strong></span>
              </div>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline flex items-center gap-1 hover:text-blue-600"
              >
                <span>Visit directly on LinkedIn</span>
                <FiExternalLink size={11} />
              </a>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {/* Hero Profile Card */}
              <div className={`rounded-xl border overflow-hidden shadow-xs transition-colors ${
                isDarkMode ? "bg-[#1e2328] border-[#38434f]" : "bg-white border-[#e0e0e0]"
              }`}>
                {/* Cover Banner */}
                <div className="h-32 sm:h-44 w-full bg-linear-to-r from-blue-900 via-indigo-950 to-slate-900 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-white/90 border border-white/20">
                    🛡️ ISO 27001 · PCI-DSS · NIST
                  </div>
                </div>

                {/* Profile Header Details */}
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
                    <div className="relative">
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-[#1e2328] bg-linear-to-tr from-blue-700 via-indigo-700 to-slate-800 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold shadow-md">
                        AN
                      </div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1e2328] flex items-center justify-center text-white text-[10px]" title="Open to work">
                        ✓
                      </div>
                    </div>

                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#0a66c2] hover:underline"
                    >
                      <span>Pitowings Pvt. Ltd.</span>
                      <FiExternalLink size={12} />
                    </a>
                  </div>

                  {/* Name & Headline */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Abinaya N
                      </h1>
                      <span className="text-xs text-gray-500 font-medium">(She/Her)</span>
                      <FiCheckCircle size={15} className="text-[#0a66c2]" title="Verified Profile" />
                    </div>

                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 max-w-2xl leading-snug">
                      GRC Analyst | Cyber Security Engineer at Pitowings Pvt. Ltd. | ISO/IEC 27001 · PCI-DSS · NIST · ITSAR | ISC2 Certified in Cybersecurity (CC)
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-1">
                      <span className="flex items-center gap-1">
                        <FiMapPin size={12} />
                        <span>Chennai, Tamil Nadu, India</span>
                      </span>
                      <span>·</span>
                      <a
                        href="mailto:abinayacyber604@gmail.com"
                        className="text-[#0a66c2] font-semibold hover:underline"
                      >
                        Contact info
                      </a>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">
                        500+ connections
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        1,420 followers
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 mt-5">
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-xs"
                    >
                      <span>Open on LinkedIn.com</span>
                      <FiExternalLink size={12} />
                    </a>

                    <button
                      onClick={handleConnect}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold transition ${
                        connected
                          ? "border-emerald-500 text-emerald-500 bg-emerald-500/10"
                          : "border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2]/10"
                      }`}
                    >
                      <FiUsers size={13} />
                      <span>{connected ? "Pending" : "Connect"}</span>
                    </button>

                    <a
                      href="mailto:abinayacyber604@gmail.com"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold transition"
                    >
                      <FiSend size={12} />
                      <span>Message</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className={`p-6 rounded-xl border shadow-xs ${
                isDarkMode ? "bg-[#1e2328] border-[#38434f]" : "bg-white border-[#e0e0e0]"
              }`}>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                  About
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  GRC Analyst who turns ISO/IEC 27001, PCI-DSS, and NIST requirements into audit-ready, automated compliance workflows. Built and shipped AI-assisted validation tooling now used for live ITSAR assessments — cutting manual review effort while holding evidence quality steady. Comfortable across the full loop: control mapping, security testing, SIEM monitoring, and threat intelligence.
                </p>
              </div>

              {/* Experience Section */}
              <div className={`p-6 rounded-xl border shadow-xs ${
                isDarkMode ? "bg-[#1e2328] border-[#38434f]" : "bg-white border-[#e0e0e0]"
              }`}>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                  Experience
                </h2>

                <div className="space-y-6">
                  {/* Pitowings */}
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
                      <FiShield size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        Cyber Security Engineer
                      </h3>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        Pitowings Pvt. Ltd. · Full-time
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                        Present · Chennai, Tamil Nadu, India
                      </p>

                      <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 list-disc pl-4">
                        <li>Validated organizational assets and technical security controls against ISO/IEC 27001 requirements.</li>
                        <li>Ran PCI-DSS and NIST-based security testing across application portfolio.</li>
                        <li>Built AI-assisted ITSAR validation logic and shipped production validation frontend.</li>
                        <li>Owned Wazuh SIEM monitoring and vetted external threat feeds for OpenCTI ingestion.</li>
                      </ul>
                    </div>
                  </div>

                  {/* CyberTech Ninja */}
                  <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                      <FiBriefcase size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        Cyber Security Intern
                      </h3>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        CyberTech Ninja Pvt. Ltd. · Internship
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                        Jun 2024 – Jul 2024 · Chennai, India
                      </p>

                      <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 list-disc pl-4">
                        <li>Triaged security alerts and logs using SIEM workflows for incident response.</li>
                        <li>Authored security documentation and response-template SOPs.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className={`p-6 rounded-xl border shadow-xs ${
                isDarkMode ? "bg-[#1e2328] border-[#38434f]" : "bg-white border-[#e0e0e0]"
              }`}>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                  Education
                </h2>

                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                    <FiBookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Dr. Mahalingam College of Engineering and Technology
                    </h3>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Bachelor of Engineering (B.E.), Computer Science and Engineering (Cyber Security)
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      Grade: CGPA 8.5 / 10.0
                    </p>
                  </div>
                </div>
              </div>

              {/* Licenses & Certifications */}
              <div className={`p-6 rounded-xl border shadow-xs ${
                isDarkMode ? "bg-[#1e2328] border-[#38434f]" : "bg-white border-[#e0e0e0]"
              }`}>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                  Licenses & Certifications
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <FiAward size={20} className="text-blue-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Certified in Cybersecurity (CC)</div>
                      <div className="text-gray-500 text-[11px]">ISC2</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <FiAward size={20} className="text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Network Defense</div>
                      <div className="text-gray-500 text-[11px]">Cisco Networking Academy</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <FiAward size={20} className="text-purple-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Networking Security</div>
                      <div className="text-gray-500 text-[11px]">Blue Team Security</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <FiAward size={20} className="text-red-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Pre Security Learning Path</div>
                      <div className="text-gray-500 text-[11px]">TryHackMe</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
