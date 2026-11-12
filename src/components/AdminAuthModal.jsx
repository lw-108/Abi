/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiUnlock, FiAlertCircle, FiX, FiCheck } from "react-icons/fi";
import { verifyAdminPassword } from "../lib/firebase";

/**
 * Strictly requires administrator authentication for CRUD actions.
 */
export function isAdminAuthenticated() {
  return false;
}

/**
 * Sets admin authentication flag in session.
 */
export function setAdminAuthenticated(val = true) {
  // Session unlock
}

export default function AdminAuthModal({
  isOpen,
  onClose,
  onSuccess,
  actionName = "modify system files",
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!password.trim() || isVerifying) return;

    setIsVerifying(true);
    setAuthError(false);

    try {
      const isValid = await verifyAdminPassword(password.trim());
      if (isValid) {
        setAdminAuthenticated(true);
        setIsVerifying(false);
        setPassword("");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setIsVerifying(false);
        setAuthError(true);
      }
    } catch (err) {
      console.error("Admin verification error:", err);
      setIsVerifying(false);
      setAuthError(true);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 select-none"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[380px] bg-[#28282c]/95 dark:bg-[#28282c]/95 bg-white/95 text-gray-900 dark:text-white rounded-2xl shadow-2xl border border-black/10 dark:border-white/15 p-6 backdrop-blur-2xl flex flex-col items-center relative"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Cancel"
          >
            <FiX size={15} />
          </button>

          {/* Security Padlock Icon with Glow */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0066cc] to-[#33a3ff] flex items-center justify-center text-white shadow-lg mb-3">
            <FiLock size={26} />
          </div>

          <h3 className="text-base font-bold tracking-tight text-center mb-1">
            Administrator Authorization
          </h3>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4 px-2 leading-relaxed">
            Administrator password is required to <span className="font-semibold text-gray-700 dark:text-gray-200">{actionName}</span>.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <div
              className={`relative flex items-center w-full rounded-xl border transition-all ${
                authError
                  ? "border-red-500 ring-2 ring-red-500/20 animate-shake"
                  : "border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 focus-within:border-[#007aff]"
              }`}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError(false);
                }}
                placeholder="Enter Firebase Admin Password"
                className="w-full px-3.5 py-2 text-xs bg-transparent outline-none font-medium text-gray-900 dark:text-white"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {authError && (
              <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-medium px-1">
                <FiAlertCircle size={13} className="shrink-0" />
                <span>Incorrect administrator password from Firebase.</span>
              </div>
            )}

            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying || !password.trim()}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#007aff] hover:bg-[#0069d9] active:scale-[0.99] text-white shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <FiUnlock size={13} />
                    <span>Authorize</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
