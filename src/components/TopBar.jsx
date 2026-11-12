// src/components/TopBar.jsx
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Calendar } from "./ui/calendar";
import { useAppStore } from "../store/Appstore";
import { 
  FiSearch, 
  FiMic, 
  FiMonitor, 
  FiShoppingBag, 
  FiClock, 
  FiXCircle, 
  FiMoon, 
  FiRefreshCw, 
  FiPower, 
  FiLock, 
  FiUser, 
  FiChevronRight,
  FiFolderPlus,
  FiPlusSquare,
  FiPlus,
  FiFileText,
  FiInfo,
  FiEdit3,
  FiCopy,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiScissors,
  FiClipboard,
  FiMaximize,
  FiGrid,
  FiList,
  FiColumns,
  FiImage,
  FiMinusSquare,
  FiMaximize2,
  FiArrowLeft,
  FiArrowRight,
  FiHome,
  FiFile,
  FiDownload,
  FiMinus,
  FiLayers,
  FiHelpCircle,
  FiAward
} from "react-icons/fi";
import { useBattery } from "../hooks/useBattery";

// macOS Style Apple Logo
const AppleLogo = () => (
  <svg width="14" height="17" viewBox="0 0 170 170" fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71 0.12 1.083 0.17 2.166 0.17 3.241z"/>
  </svg>
);

// macOS Style WiFi Icon
const MacWifiIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
    <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
    <path d="M8 6.5c1.66 0 3.14.69 4.22 1.78a.75.75 0 1 1-1.06 1.06A4.5 4.5 0 0 0 8 8a4.5 4.5 0 0 0-3.16 1.34.75.75 0 1 1-1.06-1.06A5.98 5.98 0 0 1 8 6.5z"/>
    <path d="M8 3c2.76 0 5.26 1.12 7.07 2.93a.75.75 0 1 1-1.06 1.06A8.48 8.48 0 0 0 8 4.5a8.48 8.48 0 0 0-6.01 2.49.75.75 0 1 1-1.06-1.06A9.98 9.98 0 0 1 8 3z"/>
  </svg>
);

// Helper to get 3 battery stages
const getBatteryStage = (level) => {
  const pct = Math.max(0, Math.min(100, level));
  if (pct <= 20) {
    return {
      stage: "low",
      color: "#ff453a", // Low - Red
      text: "Low",
      bgClass: "bg-red-500/20 text-red-400 border-red-500/30",
    };
  }
  if (pct < 80) {
    return {
      stage: "medium",
      color: "#ffd60a", // Medium - Yellow
      text: "Medium",
      bgClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };
  }
  return {
    stage: "full",
    color: "#34c759", // Full - Green
    text: "Full",
    bgClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
};

// macOS Style Dynamic Machine Battery Icon with 3 Color Stages
const MacBatteryIcon = ({ level = 100, charging = false }) => {
  const pct = Math.max(0, Math.min(100, level));
  // Total fill width inside border is 14px
  const fillWidth = Math.max(1.5, (pct / 100) * 14);
  const stage = getBatteryStage(pct);
  const fillColor = charging ? "#34c759" : stage.color;

  return (
    <svg width="24" height="13" viewBox="0 0 24 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      {/* Outer chassis */}
      <rect x="0.75" y="1.25" width="18.5" height="10.5" rx="3.5" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
      {/* Terminal tip */}
      <path d="M20.5 4.5C21.05 4.5 21.5 4.95 21.5 5.5V7.5C21.5 8.05 21.05 8.5 20.5 8.5V4.5Z" fill="currentColor" opacity="0.6" />
      {/* Dynamic 3-stage level fill: low-red, medium-yellow, full-green */}
      <rect
        x="2.25"
        y="2.75"
        width={fillWidth}
        height="7.5"
        rx="2"
        fill={fillColor}
        className="transition-colors duration-300"
      />
      {/* Charging bolt overlay */}
      {charging && (
        <path
          d="M10.5 1.5L7 7H10.5L9 11.5L14 6H10.5L11.5 1.5H10.5Z"
          fill="#ffffff"
          stroke="#1c1c1e"
          strokeWidth="0.5"
        />
      )}
    </svg>
  );
};

function getSystemTime(compact = false) {
  const now = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  try {
    const t = now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: tz
    });
    if (compact) return t;
    const weekday = now.toLocaleString("en-US", { weekday: "short", timeZone: tz });
    const month = now.toLocaleString("en-US", { month: "short", timeZone: tz });
    const day = now.toLocaleString("en-US", { day: "numeric", timeZone: tz });
    return `${weekday}, ${month} ${day}  ${t}`;
  } catch {
    const t = now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    if (compact) return t;
    const weekday = now.toLocaleString("en-US", { weekday: "short" });
    const month = now.toLocaleString("en-US", { month: "short" });
    const day = now.getDate();
    return `${weekday}, ${month} ${day}  ${t}`;
  }
}

export default function TopBar({ appTitle = "Finder", setStage }) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const openApp = useAppStore((state) => state.openApp);
  const battery = useBattery();
  const [showBatteryPercent, setShowBatteryPercent] = useState(() => {
    try {
      return localStorage.getItem("os_show_battery_percent") !== "false";
    } catch {
      return true;
    }
  });

  function handleAction(action) {
    if (action === "restart") setStage("restart");
    if (action === "shutdown") {
      setStage("power");
    }
  }

  const [time, setTime] = useState(() => getSystemTime(false));
  const [compactTime, setCompactTime] = useState(() => getSystemTime(true));

  useEffect(() => {
    const update = () => {
      setTime(getSystemTime(false));
      setCompactTime(getSystemTime(true));
    };
    // Sync every 5s instead of 1s to save CPU & avoid unnecessary re-renders
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, []);

  const hoverStyle =
    "cursor-pointer bg-transparent hover:bg-white/10 hover:backdrop-blur-xl rounded px-1.5 py-0.5 transition-all duration-150";

  return (
<div
  className="w-full h-7 flex items-center justify-between px-2 select-none fixed top-0 left-0 z-[999998] text-white"
  style={{
    background: "linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0))"
  }}
>
      {/* LEFT */}
      <div className="flex items-center gap-0 text-[14px] font-semibold text-white">
        {/* Apple Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`cursor-pointer flex items-center justify-center w-8 h-7 ${hoverStyle}`}
          >
            <AppleLogo />
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="start"
            alignOffset={6}
            className={`shadow-2xl backdrop-blur-2xl rounded-xl min-w-[240px] mt-1.5 p-1 select-none border transition-all duration-300
            ${isDarkMode 
              ? "bg-[#121212]/75 text-white border-white/10" 
              : "bg-[#f5f5f7]/72 text-gray-900 border-black/[0.08] border-white/60"
            }`}>
            <DropdownMenuItem className={`flex items-center gap-2.5 px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
              <FiMonitor className="w-4 h-4 opacity-75" />
              <span className="flex-1">About This Portfolio</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

            <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
              <div className="flex items-center gap-2.5">
                <FiShoppingBag className="w-4 h-4 opacity-75" />
                <span>App Store...</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-white/70' : 'bg-black/5 text-black/60'}`}>4 updates</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

            <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
              <div className="flex items-center gap-2.5">
                <FiClock className="w-4 h-4 opacity-75" />
                <span>Recent Items</span>
              </div>
              <FiChevronRight className="w-3.5 h-3.5 opacity-60" />
            </DropdownMenuItem>

            <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

            <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
              <div className="flex items-center gap-2.5">
                <FiXCircle className="w-4 h-4 opacity-75" />
                <span>Force Quit</span>
              </div>
              <span className="text-xs opacity-50 font-normal">⌥⇧⌘⎋</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

            <DropdownMenuItem className={`flex items-center gap-2.5 px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`} onClick={() => handleAction("sleep")}>
              <FiMoon className="w-4 h-4 opacity-75" />
              <span className="flex-1">Sleep</span>
            </DropdownMenuItem>

            <DropdownMenuItem className={`flex items-center gap-2.5 px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`} onClick={() => handleAction("restart")}>
              <FiRefreshCw className="w-4 h-4 opacity-75" />
              <span className="flex-1">Restart...</span>
            </DropdownMenuItem>

            <DropdownMenuItem className={`flex items-center gap-2.5 px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`} onClick={() => handleAction("shutdown")}>
              <FiPower className="w-4 h-4 opacity-75" />
              <span className="flex-1">Shut Down...</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* App Name - Bold like Finder */}
        <span className={`font-semibold text-[14px] cursor-pointer ${hoverStyle}`}>
          {appTitle || "Finder"}
        </span>

        {/* Menu Items */}
        <div className="hidden sm:flex items-center gap-2.5 text-[14px] font-semibold text-white/90">
          {/* FILE */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              File
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              alignOffset={6}
              className={`shadow-2xl backdrop-blur-2xl rounded-xl min-w-[240px] mt-1.5 p-1 select-none border transition-all duration-300
              ${isDarkMode 
                ? "bg-[#121212]/75 text-white border-white/10" 
                : "bg-[#f5f5f7]/72 text-gray-900 border-black/[0.08] border-white/60"
              }`}>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiFolderPlus className="w-4 h-4 opacity-75" />
                  <span>New Folder</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⇧⌘N</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiPlusSquare className="w-4 h-4 opacity-75" />
                  <span>New Finder Window</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘N</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiPlus className="w-4 h-4 opacity-75" />
                  <span>New Tab</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘T</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiFileText className="w-4 h-4 opacity-75" />
                  <span>Open</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘O</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiInfo className="w-4 h-4 opacity-75" />
                  <span>Get Info</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘I</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiEdit3 className="w-4 h-4 opacity-75" />
                  <span>Rename</span>
                </div>
                <span className="text-xs opacity-50 font-normal">Enter</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiCopy className="w-4 h-4 opacity-75" />
                  <span>Duplicate</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘D</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* EDIT */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              Edit
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              alignOffset={6}
              className={`shadow-2xl backdrop-blur-2xl rounded-xl min-w-[240px] mt-1.5 p-1 select-none border transition-all duration-300
              ${isDarkMode 
                ? "bg-[#121212]/75 text-white border-white/10" 
                : "bg-[#f5f5f7]/72 text-gray-900 border-black/[0.08] border-white/60"
              }`}>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiCornerUpLeft className="w-4 h-4 opacity-75" />
                  <span>Undo</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘Z</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiCornerUpRight className="w-4 h-4 opacity-75" />
                  <span>Redo</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⇧⌘Z</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiScissors className="w-4 h-4 opacity-75" />
                  <span>Cut</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘X</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiCopy className="w-4 h-4 opacity-75" />
                  <span>Copy</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘C</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiClipboard className="w-4 h-4 opacity-75" />
                  <span>Paste</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘V</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiMaximize className="w-4 h-4 opacity-75" />
                  <span>Select All</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘A</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiSearch className="w-4 h-4 opacity-75" />
                  <span>Find</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘F</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* VIEW */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              View
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              alignOffset={6}
              className={`shadow-2xl backdrop-blur-2xl rounded-xl min-w-[240px] mt-1.5 p-1 select-none border transition-all duration-300
              ${isDarkMode 
                ? "bg-[#121212]/75 text-white border-white/10" 
                : "bg-[#f5f5f7]/72 text-gray-900 border-black/[0.08] border-white/60"
              }`}>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiGrid className="w-4 h-4 opacity-75" />
                  <span>as Icons</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘1</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiList className="w-4 h-4 opacity-75" />
                  <span>as List</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘2</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiColumns className="w-4 h-4 opacity-75" />
                  <span>as Columns</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘3</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiImage className="w-4 h-4 opacity-75" />
                  <span>as Gallery</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘4</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiColumns className="w-4 h-4 opacity-75" />
                  <span>Show Sidebar</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌥⌘S</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiMinusSquare className="w-4 h-4 opacity-75" />
                  <span>Hide Toolbar</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌥⌘T</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiMaximize2 className="w-4 h-4 opacity-75" />
                  <span>Enter Full Screen</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌃⌘F</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* GO */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              Go
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              alignOffset={6}
              className={`shadow-2xl backdrop-blur-2xl rounded-xl min-w-[240px] mt-1.5 p-1 select-none border transition-all duration-300
              ${isDarkMode 
                ? "bg-[#121212]/75 text-white border-white/10" 
                : "bg-[#f5f5f7]/72 text-gray-900 border-black/[0.08] border-white/60"
              }`}>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiArrowLeft className="w-4 h-4 opacity-75" />
                  <span>Back</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘[</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiArrowRight className="w-4 h-4 opacity-75" />
                  <span>Forward</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘]</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiMonitor className="w-4 h-4 opacity-75" />
                  <span>Desktop</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⇧⌘D</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiHome className="w-4 h-4 opacity-75" />
                  <span>Home</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⇧⌘H</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiFile className="w-4 h-4 opacity-75" />
                  <span>Documents</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⇧⌘O</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiDownload className="w-4 h-4 opacity-75" />
                  <span>Downloads</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌥⌘L</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* WINDOW */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              Window
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              alignOffset={6}
              className={`shadow-2xl backdrop-blur-2xl rounded-xl min-w-[240px] mt-1.5 p-1 select-none border transition-all duration-300
              ${isDarkMode 
                ? "bg-[#121212]/75 text-white border-white/10" 
                : "bg-[#f5f5f7]/72 text-gray-900 border-black/[0.08] border-white/60"
              }`}>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiMinus className="w-4 h-4 opacity-75" />
                  <span>Minimize</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘M</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiMaximize2 className="w-4 h-4 opacity-75" />
                  <span>Zoom</span>
                </div>
                <span className="text-xs opacity-50 font-normal">—</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiMaximize2 className="w-4 h-4 opacity-75" />
                  <span>Enter Full Screen</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌃⌘F</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiLayers className="w-4 h-4 opacity-75" />
                  <span>Bring All to Front</span>
                </div>
                <span className="text-xs opacity-50 font-normal">—</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* HELP */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              Help
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              alignOffset={6}
              className={`shadow-2xl backdrop-blur-2xl rounded-xl min-w-[240px] mt-1.5 p-1 select-none border transition-all duration-300
              ${isDarkMode 
                ? "bg-[#121212]/75 text-white border-white/10" 
                : "bg-[#f5f5f7]/72 text-gray-900 border-black/[0.08] border-white/60"
              }`}>
              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiHelpCircle className="w-4 h-4 opacity-75" />
                  <span>Portfolio Help</span>
                </div>
                <span className="text-xs opacity-50 font-normal">⌘?</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className={`my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`} />

              <DropdownMenuItem className={`flex items-center justify-between px-3 py-1.5 text-[13.5px] rounded-lg transition-colors focus:bg-[#007aff] focus:text-white cursor-pointer ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                <div className="flex items-center gap-2.5">
                  <FiAward className="w-4 h-4 opacity-75" />
                  <span>See What's New</span>
                </div>
                <span className="text-xs opacity-50 font-normal">—</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* CENTER — empty like macOS */}
      <div className="flex-1"></div>

      {/* RIGHT */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-[13px] font-medium text-white pr-1 sm:pr-2">
        {/* Dynamic Battery Indicator with 3 Color Stages (Low-Red, Medium-Yellow, Full-Green) */}
        <div className="flex items-center gap-1 sm:gap-1.5 rounded-[6px] px-1 sm:px-1.5 py-0.5 select-none text-white">
          {showBatteryPercent && (
            <span className="text-[11px] sm:text-[11.5px] font-medium tracking-tight font-mono text-white select-none">
              {battery.level}%
            </span>
          )}
          <MacBatteryIcon level={battery.level} charging={battery.charging} />
        </div>

        <div className="cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors">
          <MacWifiIcon />
        </div>

        {/* Siri icon - white swirl (hidden on narrow mobile view for clean fit) */}
        <div 
          onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new Event('os_edit_widgets')); }}
          className="w-5 h-5 cursor-pointer hover:bg-white/10 rounded-full hidden sm:flex items-center justify-center transition-colors p-0.5"
          title="Widgets Panel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
            <path d="M 4.5 12 C 8 6, 11 6, 12 12 C 13 18, 16 18, 19.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* TIME - Responsive: Compact on mobile, Full on desktop */}
        <DropdownMenu>
          <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle} font-medium`}>
            <span className="text-[12px] sm:text-[13.5px] font-semibold whitespace-nowrap">
              <span className="hidden sm:inline">{time}</span>
              <span className="inline sm:hidden">{compactTime}</span>
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-black/40 backdrop-blur-2xl border-white/10 text-white shadow-2xl rounded-lg px-2 py-2 mt-1">
            <DropdownMenuLabel className="font-semibold text-white">Calendar</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem className="focus:bg-white/10">
              <Calendar mode="single" selected={new Date()} className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
