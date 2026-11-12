import { useState, useEffect } from "react";
import PowerScreen from "./layouts/PowerScreen";
import Desktop from "./layouts/DesktopWindow";
import { useAppStore } from "./store/Appstore";

export default function App() {
  // Always load the welcome screen on startup; persist session only if explicitly rebooted in same session
  const [stage, setStage] = useState(() => {
    try {
      if (sessionStorage.getItem("os_booted") === "true") {
        return "desktop";
      }
    } catch {
      // ignore
    }
    return "power";
  });

  const isDarkMode = useAppStore((s) => s.isDarkMode);

  // Initialize portfolio defaults (English language, completed setup, clean old lock states)
  useEffect(() => {
    try {
      localStorage.setItem("setup_lang", "English");
      localStorage.setItem("setup_country", "United States");
      localStorage.setItem("setup_completed", "true");
      // Remove any lingering lock screen or setup flags
      if (localStorage.getItem("os_state") === "lock") {
        localStorage.removeItem("os_state");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  const handleBootComplete = () => {
    try {
      sessionStorage.setItem("os_booted", "true");
      localStorage.setItem("os_state", "desktop");
    } catch {
      // ignore
    }
    setStage("desktop");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Welcome Screen with 'hello' wallpaper and boot animation */}
      {stage === "power" && (
        <PowerScreen goNext={handleBootComplete} />
      )}

      {/* Restart Sequence */}
      {stage === "restart" && (
        <PowerScreen autoBoot={true} goNext={handleBootComplete} />
      )}

      {/* Direct to Home Screen (Desktop) - No Lock Screen */}
      {stage === "desktop" && (
        <div className="absolute inset-0">
          <Desktop setStage={setStage} isLocked={false} />
        </div>
      )}
    </div>
  );
}
