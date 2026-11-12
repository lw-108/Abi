import React, { useState, useMemo } from "react";
import { useAppStore } from "../store/Appstore";
import {
  FiCopy,
  FiCheck,
  FiPrinter,
  FiFileText,
  FiShield,
  FiExternalLink,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiBookOpen,
  FiCpu,
  FiDownload
} from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { ABINAYA_RESUME_MD } from "../constants/abinayaBio";

// macOS Traffic Lights
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

export default function ResumeMarkdownViewer({ file, windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [copied, setCopied] = useState(false);

  const rawMarkdown = file?.content || ABINAYA_RESUME_MD;
  const fileName = file?.name || "About_Abinaya_N.md";

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([rawMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-full h-full flex flex-col select-none overflow-hidden font-sans ${
      isDarkMode ? "bg-[#0f172a] text-[#f8fafc]" : "bg-[#f8fafc] text-[#0f172a]"
    }`}>
      {/* macOS Window Header */}
      <div className={`window-drag-handle flex items-center justify-between px-3.5 py-2.5 border-b select-none shrink-0 ${
        isDarkMode ? "bg-[#1e293b] border-white/10" : "bg-[#ffffff] border-slate-200 shadow-xs"
      }`}>
        {/* Left: Traffic Lights & Title */}
        <div className="flex items-center gap-3">
          <TrafficLights windowId={windowId} />
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
              isDarkMode ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              <FiFileText size={13} />
              <span>{fileName}</span>
            </div>
          </div>
        </div>

        {/* Center: Window Subtitle */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Abinaya N</span>
          <span>·</span>
          <span>Cybersecurity Portfolio</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyMarkdown}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs"
            }`}
            title="Copy Markdown Source"
          >
            {copied ? <FiCheck size={13} className="text-emerald-500" /> : <FiCopy size={13} />}
            <span>{copied ? "Copied" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handleDownload}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs"
            }`}
            title="Download .md file"
          >
            <FiDownload size={13} />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handlePrint}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs"
            }`}
            title="Print or Save as PDF"
          >
            <FiPrinter size={13} />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Content Area: Pristine Resume Document View */}
      <div className="flex-1 overflow-y-auto select-text">
        <div className="max-w-4xl mx-auto p-6 sm:p-10 my-4">
            <div className={`p-8 sm:p-12 rounded-2xl shadow-xl border transition-colors ${
              isDarkMode 
                ? "bg-[#1e293b] border-slate-800 text-[#f8fafc]" 
                : "bg-white border-slate-200 text-[#0f172a]"
            }`}>
              {/* Resume Header */}
              <div className="border-b pb-8 mb-8 border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
                      ABINAYA N
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <FiShield size={12} />
                        GRC Analyst · Security Compliance · Risk & Controls
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Badges / Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-6 text-xs">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    isDarkMode ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}>
                    <FiMapPin className="text-blue-500 shrink-0" size={14} />
                    <span className="font-medium truncate">Chennai, Tamil Nadu, India</span>
                  </div>

                  <a
                    href="tel:+919842468450"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                      isDarkMode
                        ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    <FiPhone className="text-emerald-500 shrink-0" size={14} />
                    <span className="font-medium">+91 9842468450</span>
                  </a>

                  <a
                    href="mailto:abinayacyber604@gmail.com"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                      isDarkMode
                        ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-blue-500"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    <FiMail className="text-purple-500 shrink-0" size={14} />
                    <span className="font-medium truncate">abinayacyber604@gmail.com</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://www.linkedin.com/in/abinaya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border transition ${
                        isDarkMode
                          ? "bg-slate-800/80 border-slate-700 text-blue-400 hover:bg-slate-700"
                          : "bg-slate-50 border-slate-200 text-[#0077b5] hover:bg-slate-100"
                      }`}
                      title="Open LinkedIn Profile"
                    >
                      <FaLinkedin size={14} />
                      <span className="font-semibold text-xs">LinkedIn</span>
                    </a>

                    <a
                      href="https://github.com/Abinayanatrajan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border transition ${
                        isDarkMode
                          ? "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700"
                          : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                      }`}
                      title="Open GitHub Profile"
                    >
                      <FaGithub size={14} />
                      <span className="font-semibold text-xs">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Section: Professional Profile */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <FiShield className="text-blue-500" size={18} />
                  <h2 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white uppercase">
                    Professional Profile
                  </h2>
                </div>
                <div className={`p-4 rounded-xl border leading-relaxed text-sm ${
                  isDarkMode 
                    ? "bg-slate-900/60 border-slate-800 text-slate-200" 
                    : "bg-blue-50/50 border-blue-100 text-slate-800"
                }`}>
                  <p>
                    GRC Analyst who turns <strong className="font-semibold text-[#0f172a] dark:text-white">ISO/IEC 27001</strong>, <strong className="font-semibold text-[#0f172a] dark:text-white">PCI-DSS</strong>, and <strong className="font-semibold text-[#0f172a] dark:text-white">NIST</strong> requirements into audit-ready, automated compliance workflows. Built and shipped AI-assisted validation tooling now used for live ITSAR assessments — cutting manual review effort while holding evidence quality steady. Comfortable across the full loop: control mapping, security testing, SIEM monitoring, and threat intelligence.
                  </p>
                </div>
              </div>

              {/* Section: Core Competencies */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <FiCpu className="text-purple-500" size={18} />
                  <h2 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white uppercase">
                    Core Competencies
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3.5 rounded-xl border ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="font-bold text-[#0f172a] dark:text-white mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      GRC & Compliance Frameworks
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      ISO/IEC 27001 · PCI-DSS v4.0 · NIST SP 800-53 / CSF · ITSAR · ISO 9001 · Control Assessment · Risk & Compliance Mapping
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="font-bold text-[#0f172a] dark:text-white mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Compliance Automation
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      AI-Assisted Validation · Control Mapping Engines · Automated Evidence Checking · Rule Engines
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="font-bold text-[#0f172a] dark:text-white mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Threat Intelligence & SIEM
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      OpenCTI · External Threat Feeds · Maritime CTI · Wazuh SIEM · Splunk · Wireshark
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="font-bold text-[#0f172a] dark:text-white mb-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Security Testing & Tech Stack
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      RBAC / Permission Testing · OpenVAS · Nessus · Burp Suite · Nmap · Python · REST APIs · Docker · Git
                    </p>
                  </div>
                </div>
              </div>

              {/* Section: Professional Experience */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FiBriefcase className="text-emerald-500" size={18} />
                  <h2 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white uppercase">
                    Professional Experience
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Experience 1: Pitowings */}
                  <div className={`p-5 rounded-xl border transition-colors ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-[#0f172a] dark:text-white">
                          Cyber Security Engineer
                        </h3>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          Pitowings Pvt. Ltd.
                        </span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                      }`}>
                        Present · Chennai, India
                      </span>
                    </div>

                    <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-outside pl-4">
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">ISO/IEC 27001 Compliance:</strong> Validated organizational assets and technical security controls against ISO/IEC 27001 requirements, closing evidence gaps ahead of external certification audits.
                      </li>
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">PCI-DSS & NIST Testing:</strong> Ran PCI-DSS and NIST-based security testing across the application portfolio, surfacing vulnerabilities and routing them into remediation tracking before release.
                      </li>
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">Mobile & App Penetration Testing:</strong> Led penetration and functional testing on mobile applications, flagging high/critical vulnerabilities and verifying fixes with developers.
                      </li>
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">AI-Assisted ITSAR Tooling:</strong> Built the AI-assisted ITSAR validation logic (requirements, test objectives, preconditions, and outputs), replacing manual line-by-line review with automated checks.
                      </li>
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">Production Validation Platform:</strong> Shipped the frontend for the ITSAR AI validation platform, now the team's day-to-day tool for running live compliance assessments.
                      </li>
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">SIEM Operations:</strong> Owned Wazuh monitoring across the security stack, catching event-collection and pipeline failures before reaching reporting.
                      </li>
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">Threat Intelligence Pipeline:</strong> Vetted external CTI and RSS feeds ahead of OpenCTI ingestion, filtering out unreliable sources to maintain threat intelligence pipeline integrity.
                      </li>
                    </ul>
                  </div>

                  {/* Experience 2: CyberTech Ninja */}
                  <div className={`p-5 rounded-xl border transition-colors ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-[#0f172a] dark:text-white">
                          Cyber Security Intern
                        </h3>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          CyberTech Ninja Pvt. Ltd.
                        </span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                      }`}>
                        Jun 2024 – Jul 2024 · Chennai, India
                      </span>
                    </div>

                    <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-outside pl-4">
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">SIEM Alert Triage:</strong> Triaged security alerts and logs using SIEM workflows, supporting detection and incident-response investigations.
                      </li>
                      <li>
                        <strong className="text-[#0f172a] dark:text-white font-semibold">Runbook & Response Documentation:</strong> Authored security documentation and response-template updates that became part of the team's standard operating procedures.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section: Selected Projects */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FiBookOpen className="text-amber-500" size={18} />
                  <h2 className="text-lg font-bold tracking-tight text-[#0f172a] dark:text-white uppercase">
                    Selected Projects
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div>
                      <h3 className="font-bold text-sm text-[#0f172a] dark:text-white mb-1">
                        ISO/IEC 27001 Compliance Automation Platform
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                        Built pipeline stages for asset assessment and rule-based compliance scoring, replacing manual assessment steps with automated checks.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded w-fit">
                      Python · REST APIs · JSON · Docker · Rule Engine
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div>
                      <h3 className="font-bold text-sm text-[#0f172a] dark:text-white mb-1">
                        AI-Based Document & Compliance Validation (ITSAR)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                        Designed prompt-based validation rules that made compliance-document review outputs consistent, verifiable, and audit-ready.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded w-fit">
                      Python · OpenAI/LLM Prompt Engineering · React
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div>
                      <h3 className="font-bold text-sm text-[#0f172a] dark:text-white mb-1">
                        Cyber Threat Intelligence & OpenCTI Integration
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                        Integrated external and maritime CTI sources into OpenCTI for centralized collection, IOC tracking, and multi-tenant threat analysis.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded w-fit">
                      OpenCTI · Docker · Python · STIX/TAXII
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div>
                      <h3 className="font-bold text-sm text-[#0f172a] dark:text-white mb-1">
                        AI-Enhanced Vulnerability Scanner
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                        Paired AI analysis with OpenVAS scan output to auto-prioritize findings by risk score, exploitability, and attack vectors.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded w-fit">
                      Python · OpenVAS · AI/ML Risk Scoring
                    </span>
                  </div>
                </div>
              </div>

              {/* Section: Education & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
                {/* Education */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiBookOpen className="text-blue-500" size={18} />
                    <h2 className="text-base font-bold tracking-tight text-[#0f172a] dark:text-white uppercase">
                      Education
                    </h2>
                  </div>
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <h3 className="font-bold text-sm text-[#0f172a] dark:text-white">
                      B.E. — Computer Science & Engineering (Cyber Security)
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                      Dr. Mahalingam College of Engineering and Technology
                    </p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      CGPA: 8.5 / 10.0
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiAward className="text-amber-500" size={18} />
                    <h2 className="text-base font-bold tracking-tight text-[#0f172a] dark:text-white uppercase">
                      Certifications
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <span className="font-semibold text-[#0f172a] dark:text-white">Certified in Cybersecurity (CC)</span>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-[11px] font-bold">ISC2</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <span className="font-semibold text-[#0f172a] dark:text-white">Network Defense</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[11px] font-bold">Cisco</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <span className="font-semibold text-[#0f172a] dark:text-white">Networking Security</span>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-[11px] font-bold">Blue Team</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <span className="font-semibold text-[#0f172a] dark:text-white">Pre Security Learning Path</span>
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded text-[11px] font-bold">TryHackMe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
