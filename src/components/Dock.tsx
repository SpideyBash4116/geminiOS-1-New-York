/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, FileText, FolderOpen, Settings, Globe } from 'lucide-react';
import { AppId } from '../types';

interface DockProps {
  openApp: (id: AppId) => void;
  activeAppId: string | null;
  openApps: AppId[];
}

const APPS: { id: AppId; icon: React.ReactNode; label: string; color: string }[] = [
  { id: 'terminal', icon: <Terminal size={20} />, label: 'Terminal', color: 'bg-zinc-800' },
  { id: 'echo', icon: <Cpu size={20} />, label: 'Echo AI', color: 'bg-amber-600' },
  { id: 'files', icon: <FolderOpen size={20} />, label: 'Files', color: 'bg-blue-600' },
  { id: 'notes', icon: <FileText size={20} />, label: 'Notes', color: 'bg-emerald-600' },
  { id: 'browser', icon: <Globe size={20} />, label: 'Hyperlink', color: 'bg-purple-600' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Settings', color: 'bg-zinc-500' },
];

export function Dock({ openApp, activeAppId, openApps }: DockProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-4 shadow-2xl relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#3B82F6]/5 blur-3xl -z-10 animate-glow" />
        
        {APPS.map((app, index) => {
          const isOpen = openApps.includes(app.id);
          const isActive = activeAppId?.startsWith(app.id);

          return (
            <React.Fragment key={app.id}>
              {index === 3 && <div className="w-[1px] h-6 bg-white/10 mx-1" />}
              
              <motion.button
                whileHover={{ scale: 1.1, translateY: -8 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => openApp(app.id)}
                className="relative group flex flex-col items-center"
              >
                {/* Tooltip */}
                <div className="absolute -top-12 px-3 py-1.5 rounded-lg glass text-[9px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {app.label}
                </div>

                <div className={`w-11 h-11 rounded-xl transition-all duration-500 flex items-center justify-center border ${
                  isActive 
                    ? 'bg-[#3B82F6]/20 border-[#3B82F6]/40 text-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                    : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10 hover:text-white'
                }`}>
                  {app.icon}
                </div>

                {/* Status Dot */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      key="dot"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute -bottom-1 w-1 h-1 rounded-full ${
                        isActive ? 'bg-[#3B82F6]' : 'bg-white/40'
                      }`}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
