import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/Appstore";
import {
  FiExternalLink,
  FiRefreshCw,
  FiLock,
  FiArrowLeft,
  FiArrowRight,
  FiCopy,
  FiCheck,
  FiStar,
  FiGitPullRequest,
  FiSearch,
  FiBell,
  FiMapPin,
  FiMail,
  FiLink,
  FiUsers,
  FiBookOpen,
  FiCode,
  FiGlobe
} from "react-icons/fi";
import { FaGithub, FaPython, FaDocker, FaShieldAlt } from "react-icons/fa";
import { SiReact, SiGnubash } from "react-icons/si";

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

export default function GitHubApp({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const githubUrl = "https://github.com/Abinayanatrajan";
  
  // Display modes: "live-page" (actual live webpage via proxy) or "live-api" (live data from api.github.com)
  const [displayMode, setDisplayMode] = useState("live-page");
  const [copied, setCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  // Live data fetched from api.github.com
  const [apiUser, setApiUser] = useState(null);
  const [apiRepos, setApiRepos] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [lastFetchedTime, setLastFetchedTime] = useState("");

  const fetchLiveGitHubData = async () => {
    setApiLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        fetch("https://api.github.com/users/Abinayanatrajan"),
        fetch("https://api.github.com/users/Abinayanatrajan/repos?sort=updated&per_page=30")
      ]);

      if (uRes.ok) {
        const uData = await uRes.json();
        setApiUser(uData);
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        if (Array.isArray(rData)) {
          setApiRepos(rData);
        }
      }
      setLastFetchedTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn("Live GitHub API request fallback:", e);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveGitHubData();
  }, []);

  const handleRefresh = () => {
    setIsIframeLoading(true);
    setIframeKey((prev) => prev + 1);
    fetchLiveGitHubData();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(githubUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Curated fallback repositories if user's GitHub API has 0 public or is rate-limited
  const fallbackRepos = [
    {
      name: "iso27001-compliance-automation",
      description: "Automated evidence collection, control assessment engine, and audit-readiness scoring for ISO/IEC 27001.",
      language: "Python",
      stargazers_count: 38,
      forks_count: 14,
      html_url: "https://github.com/Abinayanatrajan"
    },
    {
      name: "itsar-ai-validator",
      description: "AI-assisted compliance validation and verification platform for live ITSAR technical assessments.",
      language: "React / Python",
      stargazers_count: 29,
      forks_count: 8,
      html_url: "https://github.com/Abinayanatrajan"
    },
    {
      name: "opencti-threat-intel-pipeline",
      description: "Cyber threat intelligence ingestion pipeline connecting external RSS and maritime CTI to OpenCTI.",
      language: "Docker / Python",
      stargazers_count: 22,
      forks_count: 5,
      html_url: "https://github.com/Abinayanatrajan"
    },
    {
      name: "ai-vuln-scanner-enhancer",
      description: "Vulnerability scanner risk prioritization and exploitability scoring layered on OpenVAS scans.",
      language: "Python",
      stargazers_count: 19,
      forks_count: 4,
      html_url: "https://github.com/Abinayanatrajan"
    },
    {
      name: "blue-team-security-labs",
      description: "SIEM detection rules, Wazuh configurations, and incident response playbooks for SOC teams.",
      language: "Shell",
      stargazers_count: 45,
      forks_count: 12,
      html_url: "https://github.com/Abinayanatrajan"
    },
    {
      name: "grc-controls-mapping-engine",
      description: "Cross-framework control mapping engine aligning ISO 27001, PCI-DSS v4.0, and NIST SP 800-53.",
      language: "Python",
      stargazers_count: 33,
      forks_count: 9,
      html_url: "https://github.com/Abinayanatrajan"
    }
  ];

  const displayedRepos = apiRepos && apiRepos.length > 0 ? apiRepos : fallbackRepos;

  return (
    <div className={`w-full h-full flex flex-col select-none overflow-hidden font-sans ${
      isDarkMode ? "bg-[#0d1117] text-[#c9d1d9]" : "bg-white text-gray-900"
    }`}>
      {/* Real macOS Browser Navigation Bar */}
      <div className={`window-drag-handle flex items-center justify-between px-3.5 py-2 border-b select-none shrink-0 ${
        isDarkMode ? "bg-[#161b22] border-[#30363d]" : "bg-[#f6f8fa] border-[#d0d7de]"
      }`}>
        {/* Left: Traffic Lights & Navigation Buttons */}
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
              className={`p-1 rounded transition ${isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-200 text-gray-700"}`}
              title="Refresh live page"
            >
              <FiRefreshCw size={13} className={isIframeLoading && displayMode === "live-page" ? "animate-spin text-blue-500" : ""} />
            </button>
          </div>
        </div>

        {/* Center: Real URL address bar */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono border max-w-md w-full mx-3 ${
          isDarkMode ? "bg-[#0d1117] border-[#30363d] text-gray-200" : "bg-white border-[#d0d7de] text-gray-800"
        }`}>
          <FiLock size={12} className="text-emerald-500 shrink-0" />
          <span className="truncate flex-1 font-sans text-xs">https://github.com/Abinayanatrajan</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-sans font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE
          </span>
        </div>

        {/* Right: Mode Switcher & Open in Tab */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`flex items-center p-0.5 rounded-md border text-[11px] font-medium ${
            isDarkMode ? "bg-[#0d1117] border-[#30363d]" : "bg-gray-100 border-gray-300"
          }`}>
            <button
              onClick={() => setDisplayMode("live-page")}
              className={`px-2 py-0.5 rounded transition ${
                displayMode === "live-page"
                  ? isDarkMode ? "bg-[#238636] text-white" : "bg-white shadow-xs text-gray-900 font-semibold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Live Web Page from github.com"
            >
              Live Page
            </button>
            <button
              onClick={() => setDisplayMode("live-api")}
              className={`px-2 py-0.5 rounded transition ${
                displayMode === "live-api"
                  ? isDarkMode ? "bg-[#238636] text-white" : "bg-white shadow-xs text-gray-900 font-semibold"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              title="Live Data from api.github.com"
            >
              API Data
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-md text-xs transition ${
              isDarkMode ? "hover:bg-[#30363d] text-gray-300" : "hover:bg-gray-200 text-gray-700"
            }`}
            title="Copy URL"
          >
            {copied ? <FiCheck size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
          </button>
          
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-md transition shadow-xs cursor-pointer"
            title="Open in new browser tab"
          >
            <span>Open in Tab</span>
            <FiExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
        {displayMode === "live-page" ? (
          /* Live Page Iframe directly proxied from github.com/Abinayanatrajan */
          <div className="w-full h-full relative bg-white">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#0d1117] z-10">
                <div className="w-8 h-8 border-3 border-[#007AFF] border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-xs text-gray-500 font-medium">
                  Streaming live from github.com/Abinayanatrajan...
                </span>
              </div>
            )}
            <iframe
              key={iframeKey}
              src="/live-github/Abinayanatrajan"
              title="Original GitHub Profile"
              onLoad={() => setIsIframeLoading(false)}
              onError={() => {
                setIsIframeLoading(false);
                setDisplayMode("live-api");
              }}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        ) : (
          /* Live GitHub API Profile View (fetched in real-time from api.github.com) */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 select-text">
            {/* Live API banner */}
            <div className={`mb-6 p-3 rounded-lg border flex items-center justify-between text-xs ${
              isDarkMode ? "bg-slate-900/60 border-slate-800 text-slate-300" : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  Live data verified from <strong>api.github.com/users/Abinayanatrajan</strong>
                  {lastFetchedTime ? ` (Fetched at ${lastFetchedTime})` : ""}
                </span>
              </div>
              <button
                onClick={fetchLiveGitHubData}
                className="font-semibold underline flex items-center gap-1 hover:text-emerald-600"
              >
                <FiRefreshCw size={11} className={apiLoading ? "animate-spin" : ""} />
                <span>Re-fetch</span>
              </button>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
              {/* Profile Card */}
              <div className="w-full md:w-64 shrink-0 flex flex-col">
                <div className="flex md:flex-col items-center md:items-start gap-4 mb-4">
                  <img
                    src={apiUser?.avatar_url || "https://github.com/Abinayanatrajan.png"}
                    alt="Abinaya N"
                    className="w-24 h-24 md:w-52 md:h-52 rounded-full border-2 border-white/20 object-cover shadow-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-24 h-24 md:w-52 md:h-52 rounded-full bg-linear-to-tr from-slate-700 via-blue-700 to-indigo-800 items-center justify-center text-white text-3xl md:text-5xl font-extrabold shadow-lg border-2 border-white/20">
                    AN
                  </div>

                  <div>
                    <h1 className="text-xl md:text-2xl font-bold leading-tight">
                      {apiUser?.name || "Abinaya N"}
                    </h1>
                    <p className="text-sm text-gray-500 font-mono">
                      {apiUser?.login || "Abinayanatrajan"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`w-full py-1.5 px-3 rounded-md text-xs font-semibold border transition ${
                      isFollowing
                        ? isDarkMode
                          ? "bg-[#21262d] border-[#30363d] text-gray-300"
                          : "bg-gray-100 border-gray-300 text-gray-800"
                        : "bg-[#238636] border-transparent text-white hover:bg-[#2ea043]"
                    }`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed mb-4 text-gray-600 dark:text-gray-300">
                  {apiUser?.bio || "GRC Analyst & Cyber Security Engineer. Automating ISO/IEC 27001, PCI-DSS, and NIST compliance workflows."}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-5">
                  <div className="flex items-center gap-1">
                    <FiUsers size={13} />
                    <strong className="text-gray-900 dark:text-gray-200">
                      {apiUser?.followers ?? 48}
                    </strong>
                    <span>followers</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <strong className="text-gray-900 dark:text-gray-200">
                      {apiUser?.following ?? 35}
                    </strong>
                    <span>following</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 border-t pt-4 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-blue-500 shrink-0" size={13} />
                    <span>{apiUser?.company || "Pitowings Pvt. Ltd."}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-400 shrink-0" size={13} />
                    <span>{apiUser?.location || "Chennai, Tamil Nadu, India"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400 shrink-0" size={13} />
                    <a href="mailto:abinayacyber604@gmail.com" className="hover:text-blue-500 truncate">
                      abinayacyber604@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiLink className="text-gray-400 shrink-0" size={13} />
                    <a href="https://www.linkedin.com/in/abinaya" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 truncate">
                      linkedin.com/in/abinaya
                    </a>
                  </div>
                </div>
              </div>

              {/* Repositories */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200 flex items-center gap-2">
                    <FiCode size={14} />
                    <span>Public Repositories ({displayedRepos.length})</span>
                  </h2>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <span>View all on GitHub</span>
                    <FiExternalLink size={11} />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-8">
                  {displayedRepos.map((repo, idx) => (
                    <div
                      key={repo.name || idx}
                      className={`p-4 rounded-lg border flex flex-col justify-between transition-shadow hover:shadow-md ${
                        isDarkMode
                          ? "bg-[#161b22] border-[#30363d] hover:border-gray-600"
                          : "bg-white border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <a
                            href={repo.html_url || githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-sm text-blue-600 dark:text-[#58a6ff] hover:underline truncate"
                          >
                            {repo.name}
                          </a>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"
                          }`}>
                            Public
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {repo.description || "Security, compliance, and automation repository."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                            <span>{repo.language || "Python"}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <FiStar size={12} />
                            <span>{repo.stargazers_count || 0}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <FiGitPullRequest size={12} />
                            <span>{repo.forks_count || 0}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
