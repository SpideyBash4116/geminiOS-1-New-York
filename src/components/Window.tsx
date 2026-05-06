/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  children: React.ReactNode;
}

export function Window({
  window,
  isActive,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  children,
}: WindowProps) {
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  if (window.isMinimized) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: window.isMaximized ? 0 : window.x,
        y: window.isMaximized ? 40 : window.y,
        width: window.isMaximized ? '100%' : window.width,
        height: window.isMaximized ? 'calc(100vh - 100px)' : window.height,
        zIndex: window.zIndex,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      onPointerDown={onFocus}
      className={`absolute glass rounded-3xl overflow-hidden flex flex-col window-shadow transition-all ${
        isActive ? 'ring-1 ring-[#3B82F6]/50 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'opacity-90 grayscale-[0.2]'
      } ${window.isMaximized ? 'rounded-none' : ''}`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Title Bar */}
      <div
        className="h-12 bg-white/[0.03] border-b border-white/5 flex items-center justify-between px-5 cursor-default select-none shrink-0"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#3B82F6]' : 'bg-white/20'}`} />
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            {window.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/30"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/30"
          >
            {window.isMaximized ? <Square size={10} /> : <Maximize2 size={12} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-all text-white/30"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-black/20">
        {children}
      </div>
    </motion.div>
  );
}
