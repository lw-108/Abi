/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PowerScreen({ goNext }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const enterFullscreen = useCallback(() => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } catch {
      // Ignore fullscreen failure if not allowed
    }
  }, []);

  // Quick skip / accelerate boot on click or key press
  const handleInteraction = useCallback(() => {
    enterFullscreen();
    setProgress((prev) => Math.max(prev, 95));
  }, [enterFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        handleInteraction();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInteraction]);

  // Loading progress bar simulation
  useEffect(() => {
    const duration = 2200;
    const interval = 30;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment + (Math.random() * 1.8 - 0.7);
        if (next >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Smooth transition to desktop once boot completes
  useEffect(() => {
    if (isComplete) {
      const timeout = setTimeout(() => {
        goNext();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, goNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      onClick={handleInteraction}
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-black relative select-none cursor-default"
    >
      {/* Hello wallpaper background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/icons/hello.png"
          alt="Portfolio Hello"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Aesthetic Translucent Glass Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 absolute bottom-24 sm:bottom-28 flex flex-col items-center gap-3"
      >
        <div className="w-64 sm:w-72 h-3 sm:h-3.5 bg-black/35 backdrop-blur-2xl rounded-full p-[2.5px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.25)] flex items-center overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-white/75 via-white/95 to-white shadow-[0_0_12px_rgba(255,255,255,0.7)]"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.08, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
