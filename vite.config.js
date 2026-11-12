import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/live-github": {
        target: "https://github.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/live-github/, ""),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            delete proxyRes.headers["x-frame-options"];
            delete proxyRes.headers["content-security-policy"];
            delete proxyRes.headers["content-security-policy-report-only"];
          });
        },
      },
      "/live-linkedin": {
        target: "https://www.linkedin.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/live-linkedin/, ""),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            delete proxyRes.headers["x-frame-options"];
            delete proxyRes.headers["content-security-policy"];
            delete proxyRes.headers["content-security-policy-report-only"];
          });
        },
      },
    },
  },
});
