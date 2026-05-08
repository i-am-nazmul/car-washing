"use client";

import React from "react";
import * as motion from "motion/react-client";

interface MessageProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttons: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
  onClose?: () => void;
}

export default function Message({
  isOpen,
  title,
  message,
  buttons,
  onClose,
}: MessageProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-3xl border border-amber-200/25 bg-[#070f2f] p-6 shadow-[0_0_30px_rgba(253,230,138,0.2)] sm:p-8"
      >
        <h2 className="text-2xl font-bold text-amber-200 mb-4">{title}</h2>
        <p className="text-amber-100/80 mb-6">{message}</p>

        <div className="flex gap-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => {
                button.onClick();
                onClose?.();
              }}
              className={`flex-1 rounded-lg px-4 py-3 font-semibold cursor-pointer transition ${
                button.variant === "secondary"
                  ? "border border-amber-200/30 bg-transparent text-amber-200 hover:bg-amber-200/10"
                  : "bg-linear-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
