/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Eye, Edit3, Save } from 'lucide-react';

export default function Notes() {
  const [content, setContent] = useState('# Project: geminiOS NY\n\n## Status\n- Build: ALPHA\n- UI: Metropolis / Industrial\n- Core: React + Motion\n\n## Roadmap\n1. [x] Core Shell\n2. [x] Terminal Module\n3. [x] Echo AI Integration\n4. [ ] Multi-User Persistence\n');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="flex flex-col h-full bg-black/50">
      {/* ToolBar */}
      <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-white/50">
           <FileText size={16} />
           <span className="text-[10px] uppercase font-bold tracking-widest">README.md</span>
        </div>

        <div className="flex items-center gap-1">
           <button 
              onClick={() => setMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                mode === 'edit' ? 'bg-os-accent text-black' : 'text-white/40 hover:bg-white/5'
              }`}
           >
              <Edit3 size={12} /> Edit
           </button>
           <button 
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                mode === 'preview' ? 'bg-os-accent text-black' : 'text-white/40 hover:bg-white/5'
              }`}
           >
              <Eye size={12} /> Preview
           </button>
           <div className="w-px h-4 bg-white/10 mx-1" />
           <button className="p-1.5 text-white/40 hover:text-white transition-colors">
              <Save size={14} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {mode === 'edit' ? (
          <textarea
            className="w-full h-full bg-transparent border-none outline-none p-6 font-mono text-sm text-white/80 leading-relaxed resize-none focus:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck="false"
          />
        ) : (
          <div className="p-8 prose prose-invert prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-a:text-os-accent">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
