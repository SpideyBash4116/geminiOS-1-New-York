/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, UserCircle, Activity, Power, ShieldAlert, LogOut, X, RotateCcw, AlertTriangle } from 'lucide-react';
import { useOS } from '../context/OSContext';

export function SecurityOverlay() {
  const { setSystemState, logout, factoryReset, users, currentUserId } = useOS();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const handleAction = (action: () => void) => {
    action();
  };

  const options = [
    { 
      label: 'Lock', 
      icon: <Lock size={20} />, 
      action: () => setSystemState('login'),
      desc: 'Return to login screen while keeping apps open'
    },
    { 
      label: 'Switch User', 
      icon: <UserCircle size={20} />, 
      action: () => setSystemState('login'),
      desc: 'Sign in with a different metropolis node'
    },
    { 
      label: 'Sign Out', 
      icon: <LogOut size={20} />, 
      action: () => logout(),
      desc: 'Close all applications and end session'
    },
    { 
      label: 'Task Manager', 
      icon: <Activity size={20} />, 
      action: () => {
        setSystemState('desktop');
      },
      desc: 'Monitor system resources and active processes'
    },
    { 
      label: 'Recovery Mode', 
      icon: <ShieldAlert size={20} />, 
      action: () => setSystemState('recovery'),
      desc: 'Emergency repair and kernel diagnostics'
    },
    { 
      label: 'Factory Reset', 
      icon: <RotateCcw size={20} className="text-red-500" />, 
      action: () => setShowResetConfirm(true),
      desc: '[DANGEROUS] Wipe all local node data and reset setup',
      isDangerous: true
    },
  ];

  if (showResetConfirm) {
    return (
      <div className="fixed inset-0 z-[2001] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass rounded-3xl p-10 border border-red-500/20 text-center"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Factory Reset?</h2>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">
            This will permanently delete all local configuration, clear the Hyperlink cache, and reset your node identity. This action is irreversible.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => factoryReset()}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
            >
              Confirm Wipe System
            </button>
            <button 
              onClick={() => setShowResetConfirm(false)}
              className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-os-bg/90 backdrop-blur-3xl flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-os-accent/10 border border-os-accent/20 flex items-center justify-center text-os-accent">
                   <UserCircle size={28} />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-tighter text-white leading-none">{currentUser?.username || 'Guest'}</h1>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">
                      {currentUser?.role === 'admin' ? 'Root Administrator' : 'Standard Node'}
                    </span>
                </div>
            </div>
            <button 
                onClick={() => setSystemState('desktop')}
                className="p-3 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
            >
                <X size={24} />
            </button>
        </div>

        <div className="space-y-3">
          {options.map((opt, i) => (
            <motion.button
              key={opt.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleAction(opt.action)}
              className={`w-full flex items-center gap-6 p-6 glass rounded-2xl transition-all text-left group
                ${opt.isDangerous 
                  ? 'hover:bg-red-500/10 hover:border-red-500/30' 
                  : 'hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/30'
                }
              `}
            >
              <div className={`transition-colors ${
                opt.isDangerous ? 'text-red-500/40 group-hover:text-red-500' : 'text-white/20 group-hover:text-[#3B82F6]'
              }`}>
                {opt.icon}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-2">
                  {opt.label}
                  {opt.isDangerous && (
                    <span className="text-[8px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">Dangerous</span>
                  )}
                </div>
                <div className="text-sm text-white/30">{opt.desc}</div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
            <button 
                onClick={() => setSystemState('shutdown')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest border border-red-500/20"
            >
                <Power size={14} /> Shut Down System
            </button>
        </div>
      </div>
    </div>
  );
}
