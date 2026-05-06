/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useOS } from '../../context/OSContext';

interface LogEntry {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export default function SyntaxTerminal({ windowId }: { windowId?: string }) {
  const { vfs, writeFile, deleteFile, openApp, setSystemState, windows } = useOS();
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'system', text: 'Syntax Terminal v1.0.0a-alpha Prototype Build' },
    { type: 'system', text: 'Copyright (c) 2026 SpideyBash4116. Syntax is rightfully owned and created by SpideyBash4116. All rights reserved.' },
    { type: 'output', text: "Type 'help' for a list of commands." }
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('user');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const resolvePath = (path: string) => {
    if (!path || path === '.') return currentPath;
    if (path === '..') {
      const item = vfs[currentPath];
      return item?.parentId || currentPath;
    }
    // Simple look up in current dir
    const folder = vfs[currentPath];
    const target = folder.children?.find(id => vfs[id].name === path);
    return target || null;
  };

  const handleCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return;

    const parts = cmd.trim().match(/[^\s"']+|"([^"]*)"|'([^']*)'/g) || [];
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1).map(a => a.replace(/^["']|["']$/g, ''));
    
    setLogs(prev => [...prev, { type: 'input', text: `${currentPath}> ${cmd}` }]);

    switch (command) {
      case 'exit':
        // Close window logic could be here, for now just log
        setLogs(prev => [...prev, { type: 'system', text: 'Process exited with code 0.' }]);
        break;

      case 'help':
        setLogs(prev => [...prev, { type: 'output', text: `Available commands:
help                 - Show this help
exit                 - Exit terminal
clear                - Clear screen
echo <text>          - Print text
cd <path>            - Change directory
dir                  - List files
beep                 - Make a beep sound
open <path>          - Open file or folder with default application
move <src> <dest>    - Move a file (use quotes for spaces)
start <app>          - Start a program
notepad <file>       - Open file in Notes
explorer [path]      - Open File Explorer
restart              - Restart the terminal` }]);
        break;

      case 'clear':
        setLogs([]);
        break;

      case 'echo':
        setLogs(prev => [...prev, { type: 'output', text: args.join(' ') }]);
        break;

      case 'cd':
        if (!args[0]) {
          setLogs(prev => [...prev, { type: 'output', text: currentPath }]);
        } else {
          const newId = resolvePath(args[0]);
          if (newId && vfs[newId]?.type === 'directory') {
            setCurrentPath(newId);
          } else {
            setLogs(prev => [...prev, { type: 'error', text: 'Directory not found.' }]);
          }
        }
        break;

      case 'dir':
        const folder = vfs[currentPath];
        const entries: string[] = [];
        folder.children?.forEach(id => {
          const item = vfs[id];
          entries.push(`  [${item.type === 'directory' ? 'D' : 'F'}] ${item.name}`);
        });
        setLogs(prev => [...prev, 
          { type: 'output', text: 'Directories/Files:' },
          { type: 'output', text: entries.join('\n') || '  (Empty directory)' }
        ]);
        break;

      case 'beep':
        // Browser beep
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
        setLogs(prev => [...prev, { type: 'system', text: '[BEEP]' }]);
        break;

      case 'open':
      case 'start':
        if (!args[0]) {
          setLogs(prev => [...prev, { type: 'error', text: `Usage: ${command} <path>` }]);
        } else {
          const fileId = resolvePath(args[0]);
          if (fileId) {
            const file = vfs[fileId];
            if (file.type === 'file') {
              if (file.name.endsWith('.txt')) openApp('notes', { fileId });
              else openApp('terminal', { fileId });
            } else {
              openApp('files'); // Just open files app for now
            }
          } else {
            // Check if it's an app name
            const appNames: Record<string, any> = { 
                'notes': 'notes', 'terminal': 'terminal', 'echo': 'echo', 
                'browser': 'browser', 'settings': 'settings', 'files': 'files',
                'notepad': 'notes', 'explorer': 'files'
            };
            if (appNames[args[0].toLowerCase()]) {
                openApp(appNames[args[0].toLowerCase()]);
            } else {
                setLogs(prev => [...prev, { type: 'error', text: 'File or program not found.' }]);
            }
          }
        }
        break;

      case 'notepad':
        openApp('notes', args[0] ? { fileId: resolvePath(args[0]) } : undefined);
        break;

      case 'explorer':
        openApp('files');
        break;

      case 'move':
        if (args.length < 2) {
          setLogs(prev => [...prev, { type: 'error', text: 'Usage: move <src> <dest>' }]);
        } else {
          const srcId = resolvePath(args[0]);
          const destName = args[1];
          if (srcId) {
            const item = vfs[srcId];
            writeFile(`move-${Date.now()}`, destName, item.content || '', item.type, item.parentId!);
            deleteFile(srcId);
            setLogs(prev => [...prev, { type: 'output', text: 'File moved.' }]);
          } else {
            setLogs(prev => [...prev, { type: 'error', text: 'Source file not found.' }]);
          }
        }
        break;

      case 'restart':
        setLogs([
            { type: 'system', text: '--- Restarting Syntax Terminal ---' },
            { type: 'system', text: 'Syntax Terminal v1.0.0a-alpha Prototype Build' },
            { type: 'output', text: "Type 'help' for a list of commands." }
        ]);
        break;

      default:
        setLogs(prev => [...prev, { type: 'error', text: "Unknown command. Type 'help' for a list of commands." }]);
        break;
    }
  }, [currentPath, vfs, openApp, writeFile, deleteFile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] font-mono text-xs p-2 selection:bg-white selection:text-black">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-1 mb-2"
      >
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={`whitespace-pre-wrap leading-relaxed ${
              log.type === 'input' ? 'text-white' : 
              log.type === 'error' ? 'text-red-400' : 
              log.type === 'system' ? 'text-white/30' : 'text-zinc-300'
            }`}
          >
            {log.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center text-white shrink-0">
        <span className="text-[#3B82F6] font-bold">{currentPath}{'>'}</span>
        <input 
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-white p-0 m-0 focus:ring-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
}
