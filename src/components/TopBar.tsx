/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2, Search, LayoutGrid } from 'lucide-react';
import { useOS } from '../context/OSContext';

export function TopBar({ activeAppTitle }: { activeAppTitle?: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { toggleStartMenu } = useOS();

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-os-bg/40 backdrop-blur-md flex items-center justify-between px-4 z-50 select-none">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => toggleStartMenu()}
          className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
        >
          <div className="w-4 h-4 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-full group-active:scale-90 transition-transform" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-white">
            geminiOS <span className="font-normal opacity-40">/ NEW YORK</span>
          </span>
        </button>

        <div className="h-4 w-px bg-white/5" />

        <div className="text-[10px] font-medium text-white/50 uppercase tracking-[0.2em]">
          {activeAppTitle || 'Finder'}
        </div>
      </div>

      <div className="flex items-center gap-6 text-[11px] font-medium tracking-tighter opacity-70">
        <div className="flex items-center gap-4">
          <span className="hover:text-white cursor-pointer transition-colors">NY-01 CENTRAL</span>
          <span className="opacity-40">68°F</span>
          <span>{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}</span>
        </div>
        
        <div className="bg-white/10 px-2 py-1 rounded text-white font-bold">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
