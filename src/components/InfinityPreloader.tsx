'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfinityPreloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide the loader once initial mounting finishes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f4f3ef]"
        >
          <div className="flex flex-col items-center gap-6">
            <svg
              className="w-24 h-24 text-black"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background trace path */}
              <path
                d="M30 35 C15 35 15 65 30 65 C45 65 55 35 70 35 C85 35 85 65 70 65 C55 65 45 35 30 35 Z"
                stroke="rgba(0, 0, 0, 0.04)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Animating stroke path */}
              <motion.path
                d="M30 35 C15 35 15 65 30 65 C45 65 55 35 70 35 C85 35 85 65 70 65 C55 65 45 35 30 35 Z"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, pathOffset: 0 }}
                animate={{ pathLength: 1, pathOffset: 1 }}
                transition={{
                  duration: 2.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </svg>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center leading-none text-center"
            >
              <span className="text-[12px] font-extrabold tracking-[0.25em] text-black uppercase">
                INFINITY
              </span>
              <span className="text-[8px] font-light tracking-[0.3em] text-black/60 uppercase mt-1">
                TRADERS
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
