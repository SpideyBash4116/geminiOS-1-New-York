/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, Power, RefreshCw, Moon } from 'lucide-react';
import { useOS } from '../context/OSContext';

export function SystemOverlays() {
  const { systemState, setSystemState } = useOS();

  useEffect(() => {
    if (systemState === 'shutdown') {
       // After some time, we could "turn off", but for demo we just show it
    } else if (systemState === 'restarting') {
       const timer = setTimeout(() => setSystemState('booting'), 3000);
       return () => clearTimeout(timer);
    }
  }, [systemState, setSystemState]);

  if (systemState === 'suspended') {
    return (
      <div 
        className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setSystemState('login')}
      >
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
           <Moon size={48} className="text-[#3B82F6]" />
           <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">System Suspended</span>
        </motion.div>
      </div>
    );
  }

  if (systemState === 'shutdown') {
    return (
      <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <Power size={48} className="text-red-500/50" />
           <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-white/20" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Shutting Down geminiOS...</span>
           </div>
           <button 
             onClick={() => setSystemState('booting')}
             className="mt-12 text-[10px] font-bold text-white/10 hover:text-white/40 uppercase tracking-widest transition-colors"
           >
             Power On
           </button>
        </div>
      </div>
    );
  }

  if (systemState === 'restarting') {
    return (
      <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <RefreshCw size={48} className="text-[#3B82F6]/50 animate-spin" style={{ animationDuration: '3s' }} />
           <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Restarting System...</span>
        </div>
      </div>
    );
  }

  return null;
}
