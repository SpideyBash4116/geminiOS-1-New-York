/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, ShieldCheck, Search } from 'lucide-react';

export default function Browser({ windowId }: { windowId?: string }) {
  const [url, setUrl] = useState('https://www.google.com/search?q=geminiOS+New+York');
  const [input, setInput] = useState(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = input;
    if (!target.startsWith('http')) {
      target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
    }
    setUrl(target);
    setInput(target);
  };

  return (
    <div className="flex flex-col h-full bg-os-bg">
      {/* Navigation Bar */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-white/5 rounded-md text-white/40"><ArrowLeft size={16} /></button>
          <button className="p-1.5 hover:bg-white/5 rounded-md text-white/40"><ArrowRight size={16} /></button>
          <button className="p-1.5 hover:bg-white/5 rounded-md text-white/40"><RotateCw size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 group focus-within:border-[#3B82F6]/30 transition-all">
            <ShieldCheck size={12} className="text-emerald-500/50" />
            <input 
              type="text"
              className="bg-transparent border-none outline-none text-[11px] text-white/70 w-full placeholder:text-white/10"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck="false"
            />
            <Search size={12} className="text-white/20" />
          </div>
        </form>

        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Secure Socket</span>
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-white relative">
        {/* We use an iframe, but many sites block embedding. In a real OS we'd have a proxy or native browser view. */}
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="Browser Viewport"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
        
        {/* Overlay if iframe fails or for aesthetic */}
        <div className="absolute inset-0 pointer-events-none border-t border-white/10 shadow-inner" />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-white/[0.02] border-t border-white/5 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
           <Globe size={10} /> Hyperlink Engine v4.2
        </div>
        <div className="text-[9px] text-white/20">JS Engine: v8-optimized</div>
      </div>
    </div>
  );
}
