import { create } from "zustand";

export const useAppStore = create((set) => ({
  windows: [],
  maxZ: 1,
  isLocked: false,
  isDarkMode: localStorage.getItem('os_dark_mode') === 'true',

  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    localStorage.setItem('os_dark_mode', String(next));
    return { isDarkMode: next };
  }),

  openApp: (appId, component, options = {}) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      
      // If app is already open and not explicitly marked multi-window, focus existing
      const isMultiWindow = options.multiWindow === true;
      if (!isMultiWindow) {
        const existingIndex = state.windows.findIndex((w) => w.appId === appId);
        if (existingIndex !== -1) {
          const updated = [...state.windows];
          updated[existingIndex] = {
            ...updated[existingIndex],
            component: component || updated[existingIndex].component,
            minimized: false,
            z: newZ,
            ...options,
          };
          return {
            maxZ: newZ,
            windows: updated,
          };
        }
      }

      return {
        maxZ: newZ,
        windows: [
          ...state.windows,
          {
            id: Date.now() + Math.random(),
            appId,
            component,
            minimized: false,
            maximized: false,
            z: newZ,
            // Store original position for restore
            prevSize: null,
            ...options,
          },
        ],
      };
    }),

  closeApp: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  focusApp: (id) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, z: newZ } : w
        ),
      };
    }),

  minimizeApp: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    })),

  restoreApp: (id) =>
    set((state) => {
      const newZ = state.maxZ + 1;
      return {
        maxZ: newZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimized: false, z: newZ } : w
        ),
      };
    }),

  toggleMaximize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    })),

  setLocked: (locked) =>
    set({ isLocked: locked }),

  // Hide all windows (for lock screen)
  hideAllWindows: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, minimized: true })),
    })),
}));
