/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Cpu, FileText, FolderOpen, Settings, Globe, 
  Search, Power, LogOut, User, Zap, ChevronRight,
  RefreshCw, Moon, ShieldAlert
} from 'lucide-react';
import { useOS } from '../context/OSContext';
import { AppId, SystemState } from '../types';

const RECENT_APPS: { id: AppId; icon: React.ReactNode; label: string; color: string }[] = [
  { id: 'echo', icon: <Cpu size={16} />, label: 'Echo AI', color: 'bg-blue-500' },
  { id: 'terminal', icon: <Terminal size={16} />, label: 'Terminal', color: 'bg-zinc-700' },
  { id: 'files', icon: <FolderOpen size={16} />, label: 'Files', color: 'bg-zinc-700' },
];

const ALL_APPS: { id: AppId; icon: React.ReactNode; label: string; desc: string }[] = [
  { id: 'terminal', icon: <Terminal size={20} />, label: 'Terminal', desc: 'System shell and VFS browser' },
  { id: 'echo', icon: <Cpu size={20} />, label: 'Echo AI', desc: 'Integrated neural assistant' },
  { id: 'files', icon: <FolderOpen size={20} />, label: 'Files', desc: 'Virtual file system explorer' },
  { id: 'notes', icon: <FileText size={20} />, label: 'Notes', desc: 'Metropolis markdown editor' },
  { id: 'browser', icon: <Globe size={20} />, label: 'Hyperlink', desc: 'External web interface' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Settings', desc: 'Configuration and system info' },
  { id: 'syntax-terminal', icon: <Terminal size={20} />, label: 'Syntax Terminal', desc: 'Legacy alpha shell prototype' },
];

const POWER_OPTIONS: { id: SystemState; icon: React.ReactNode; label: string; color: string; desc: string }[] = [
  { id: 'shutdown', icon: <Power size={14} />, label: 'Shut Down', color: 'text-red-400', desc: 'Close all apps and power off' },
  { id: 'restarting', icon: <RefreshCw size={14} />, label: 'Restart', color: 'text-[#3B82F6]', desc: 'Close all apps and reboot' },
  { id: 'suspended', icon: <Moon size={14} />, label: 'Suspend', color: 'text-amber-400', desc: 'Low power sleep mode' },
  { id: 'security_options', icon: <ShieldAlert size={14} />, label: 'Security Options', color: 'text-os-accent', desc: 'Lock, Switch User, Recovery' },
];

export function StartMenu() {
  const { isStartMenuOpen, toggleStartMenu, openApp, logout, setSystemState } = useOS();
  const [showPowerMenu, setShowPowerMenu] = React.useState(false);

  const handlePowerAction = (state: SystemState) => {
    setShowPowerMenu(false);
    toggleStartMenu(false);
    setSystemState(state);
  };

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleStartMenu(false)}
            className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-[2px]"
          />

          {/* Menu Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-12 left-4 w-[480px] glass rounded-3xl z-[101] overflow-hidden flex flex-col shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          >
            {/* Header / Search */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 group focus-within:border-[#3B82F6]/50 transition-colors">
                <Search size={18} className="text-white/20 group-focus-within:text-[#3B82F6] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search geminiOS..." 
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Main Area */}
              <div className="flex-1 p-6 space-y-8 overflow-auto custom-scrollbar">
                {/* Pinned / Recent Section */}
                <section>
                  <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Quick Start</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {RECENT_APPS.map(app => (
                      <button
                        key={app.id}
                        onClick={() => openApp(app.id)}
                        className="flex flex-col items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all group"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${app.color} group-hover:scale-110 transition-transform`}>
                          {app.icon}
                        </div>
                        <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">{app.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* All Apps List */}
                <section>
                  <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Metropolis Node Index</h3>
                  <div className="space-y-2">
                    {ALL_APPS.map(app => (
                      <button
                        key={app.id}
                        onClick={() => openApp(app.id)}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 group-hover:text-[#3B82F6] group-hover:border-[#3B82F6]/30 transition-all">
                          {app.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{app.label}</div>
                          <div className="text-[10px] text-white/30">{app.desc}</div>
                        </div>
                        <ChevronRight size={14} className="text-white/10 group-hover:text-white/40 transition-colors" />
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="w-16 border-l border-white/5 bg-black/20 flex flex-col items-center py-6 gap-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center shadow-lg cursor-pointer">
                  <User size={18} className="text-white" />
                </div>
                
                <div className="flex-1 flex flex-col gap-4">
                   <button className="p-3 text-white/20 hover:text-white transition-colors">
                      <Zap size={20} />
                   </button>
                   <button className="p-3 text-white/20 hover:text-white transition-colors">
                      <Settings size={20} />
                   </button>
                </div>

                <div className="flex flex-col gap-2 relative">
                   <button 
                      onClick={() => logout()}
                      className="p-3 text-white/20 hover:text-white transition-colors"
                   >
                      <LogOut size={20} />
                   </button>
                   <button 
                      onClick={() => setShowPowerMenu(!showPowerMenu)}
                      className={`p-3 transition-colors ${showPowerMenu ? 'text-[#3B82F6]' : 'text-white/20 hover:text-red-500'}`}
                   >
                      <Power size={20} />
                   </button>

                   {/* Power Overlay Sub-menu */}
                   <AnimatePresence>
                      {showPowerMenu && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="absolute bottom-0 right-16 w-56 glass rounded-2xl p-2 shadow-2xl border border-white/10"
                        >
                           {POWER_OPTIONS.map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => handlePowerAction(opt.id)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                              >
                                 <div className={`${opt.color} group-hover:scale-110 transition-transform`}>
                                    {opt.icon}
                                 </div>
                                 <div>
                                    <div className="text-[10px] font-bold text-white/80 group-hover:text-white uppercase tracking-widest">{opt.label}</div>
                                    <div className="text-[8px] text-white/20">{opt.desc}</div>
                                 </div>
                              </button>
                           ))}
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between px-6">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Build 0.1.0-NY</span>
               </div>
               <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">User: spideybash4116</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
