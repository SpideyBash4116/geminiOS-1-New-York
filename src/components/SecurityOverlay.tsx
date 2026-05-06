/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Lock, UserCircle, Activity, Power, ShieldAlert, LogOut, X } from 'lucide-react';
import { useOS } from '../context/OSContext';

export function SecurityOverlay() {
  const { setSystemState, logout, toggleStartMenu } = useOS();

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
        // We could open a specific app here if we had a task manager appId
      },
      desc: 'Monitor system resources and active processes'
    },
    { 
      label: 'Recovery Mode', 
      icon: <ShieldAlert size={20} />, 
      action: () => setSystemState('recovery'),
      desc: 'Emergency repair and kernel diagnostics'
    },
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-os-bg/90 backdrop-blur-3xl flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-12">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Integrated Security</span>
                <h1 className="text-3xl font-bold tracking-tighter text-white">System Options</h1>
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
              className="w-full flex items-center gap-6 p-6 glass rounded-2xl hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/30 group transition-all text-left"
            >
              <div className="text-white/20 group-hover:text-[#3B82F6] transition-colors">
                {opt.icon}
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-white group-hover:translate-x-1 transition-transform">{opt.label}</div>
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
