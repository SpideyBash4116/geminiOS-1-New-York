/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, Eye, Edit3, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useOS } from '../../context/OSContext';

export default function Notes({ windowId }: { windowId?: string }) {
  const { windows, vfs, writeFile } = useOS();
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [fileName, setFileName] = useState('New Note');
  const [fileId, setFileId] = useState<string | null>(null);

  useEffect(() => {
    if (windowId) {
      const win = windows.find(w => w.id === windowId);
      if (win?.params?.fileId) {
        const file = vfs[win.params.fileId];
        if (file) {
          setFileId(file.id);
          setFileName(file.name);
          setContent(file.content || '');
        }
      } else {
        setContent('# Welcome to geminiOS Notes\n\n- Write and edit markdown\n- Instant preview\n- Metropolis styled\n');
      }
    }
  }, [windowId, windows, vfs]);

  const handleSave = () => {
    if (fileId) {
      const file = vfs[fileId];
      writeFile(fileId, file.name, content, 'file', file.parentId!);
    } else {
      // Create new file in user directory by default
      const newId = `note-${Date.now()}`;
      writeFile(newId, fileName.includes('.') ? fileName : `${fileName}.txt`, content, 'file', 'user');
      setFileId(newId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/50">
      {/* ToolBar */}
      <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-white/50">
           <FileText size={16} />
           <input 
              className="bg-transparent border-none outline-none text-[10px] uppercase font-bold tracking-widest text-white/80 w-32"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
           />
        </div>

        <div className="flex items-center gap-1">
           <button 
              onClick={() => setMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                mode === 'edit' ? 'bg-[#3B82F6] text-white' : 'text-white/40 hover:bg-white/5'
              }`}
           >
              <Edit3 size={12} /> Edit
           </button>
           <button 
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                mode === 'preview' ? 'bg-[#3B82F6] text-white' : 'text-white/40 hover:bg-white/5'
              }`}
           >
              <Eye size={12} /> Preview
           </button>
           <div className="w-px h-4 bg-white/10 mx-1" />
           <button 
              onClick={handleSave}
              className="p-1.5 text-white/40 hover:text-white transition-colors"
           >
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
