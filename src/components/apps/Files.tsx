/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Folder, File, ChevronRight, Home, ArrowLeft } from 'lucide-react';

export default function Files({ windowId }: { windowId?: string }) {
  const { vfs, openApp } = useOS();
  const [currentId, setCurrentId] = useState('user');

  const currentFolder = vfs[currentId];
  const items = currentFolder.children?.map(id => vfs[id]) || [];

  const handleDoubleClick = (item: any) => {
    if (item.type === 'directory') {
      setCurrentId(item.id);
    } else {
      // Logic for opening files
      if (item.name.endsWith('.txt')) {
        openApp('notes', { fileId: item.id });
      } else if (item.name.endsWith('.pdf')) {
        // Mock opening PDF or just launching relevant app
        openApp('notes', { fileId: item.id, mode: 'preview' });
      } else {
        // Default to terminal or something else
        openApp('terminal', { fileId: item.id });
      }
    }
  };

  const goBack = () => {
    if (currentFolder.parentId) {
      setCurrentId(currentFolder.parentId);
    }
  };

  // Breadcrumbs logic
  const getPath = (id: string): string[] => {
    const item = vfs[id];
    if (!item.parentId) return [item.name];
    return [...getPath(item.parentId), item.name];
  };

  const path = getPath(currentId);

  return (
    <div className="flex flex-col h-full bg-black/50 overflow-hidden">
      {/* Navigation Bar */}
      <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-4">
        <button 
           onClick={goBack}
           disabled={!currentFolder.parentId}
           className="p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30"
        >
          <ArrowLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1 text-[11px] font-bold text-white/40 uppercase tracking-widest overflow-hidden">
           {path.map((segment, i) => (
             <React.Fragment key={i}>
                <span className="hover:text-white cursor-pointer px-1">{segment}</span>
                {i < path.length - 1 && <ChevronRight size={12} className="shrink-0" />}
             </React.Fragment>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 select-none">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {items.map((item) => (
            <div 
              key={item.id}
              onDoubleClick={() => handleDoubleClick(item)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className={`w-12 h-12 flex items-center justify-center transition-transform group-active:scale-95 ${
                item.type === 'directory' ? 'text-blue-400' : 'text-emerald-400'
              }`}>
                {item.type === 'directory' ? <Folder size={40} fill="currentColor" fillOpacity={0.2} /> : <File size={36} />}
              </div>
              <span className="text-[10px] font-medium text-white/70 text-center truncate w-full px-1">
                 {item.name}
              </span>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20">
             <Folder size={48} className="mb-2" />
             <span className="text-xs font-bold uppercase tracking-widest">Directory Empty</span>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-white/5 border-t border-white/5 flex items-center px-4 justify-between">
         <span className="text-[9px] uppercase font-bold tracking-widest text-white/30">{items.length} items</span>
         <span className="text-[9px] uppercase font-bold tracking-widest text-white/30">VFS v1.0</span>
      </div>
    </div>
  );
}
