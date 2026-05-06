/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';

interface LogEntry {
  type: 'input' | 'output' | 'error';
  text: string;
}

export default function Terminal({ windowId }: { windowId?: string }) {
  const { vfs, writeFile, deleteFile, windows } = useOS();
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'output', text: 'geminiOS [Version 0.1.0-NY]' },
    { type: 'output', text: '(c) 2026 Google DeepMind. All rights reserved.' },
    { type: 'output', text: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('user');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (windowId) {
      const win = windows.find(w => w.id === windowId);
      if (win?.params?.fileId) {
        const file = vfs[win.params.fileId];
        if (file) {
          setLogs(prev => [...prev, 
            { type: 'input', text: `> Opening ${file.name}...` },
            { type: 'output', text: file.content || '(Empty file)' }
          ]);
        }
      }
    }
  }, [windowId, windows, vfs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const trimmed = parts[0].toLowerCase();
    const args = parts.slice(1);
    const newLogs: LogEntry[] = [{ type: 'input', text: `> ${cmd}` }];

    if (!trimmed) {
       setLogs(prev => [...prev, ...newLogs]);
       return;
    }

    const currentFolder = vfs[currentPath];

    switch (trimmed) {
      case 'help':
        newLogs.push({ type: 'output', text: 'Available commands:\nhelp - Show this message\nclear - Clear terminal\nls - List directory contents\npwd - Show current directory\ncd [dir] - Change directory\ncat [file] - Display file content\ntouch [file] - Create empty file\nmkdir [dir] - Create directory\nrm [file] - Remove file\nmv [src] [dest] - Move file\necho [text] - Print text\nbeep - Play system alert\nwhoami - Show current user\nneofetch - Show system info' });
        break;
      case 'clear':
        setLogs([]);
        return;
      case 'pwd':
        newLogs.push({ type: 'output', text: `/${currentPath.replace('root/', '')}` });
        break;
      case 'cd':
        if (!args[0] || args[0] === '~') {
          setCurrentPath('user');
        } else if (args[0] === '..') {
          const item = vfs[currentPath];
          if (item?.parentId) setCurrentPath(item.parentId);
        } else {
          const targetId = currentFolder.children?.find(id => vfs[id].name === args[0]);
          if (targetId && vfs[targetId].type === 'directory') {
            setCurrentPath(targetId);
          } else {
            newLogs.push({ type: 'error', text: `cd: no such directory: ${args[0]}` });
          }
        }
        break;
      case 'ls':
        const content = currentFolder.children?.map(id => {
          const item = vfs[id];
          return item.type === 'directory' ? `${item.name}/` : item.name;
        }).join('  ') || '';
        newLogs.push({ type: 'output', text: content || 'Directory is empty' });
        break;
      case 'whoami':
        newLogs.push({ type: 'output', text: 'user@geminiOS' });
        break;
      case 'echo':
        newLogs.push({ type: 'output', text: args.join(' ') });
        break;
      case 'beep':
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.1);
        newLogs.push({ type: 'output', text: '[BEEP]' });
        break;
      case 'mv':
        if (args.length < 2) {
            newLogs.push({ type: 'error', text: 'mv: missing destination file operand' });
        } else {
            const srcId = currentFolder.children?.find(id => vfs[id].name === args[0]);
            if (srcId) {
                const item = vfs[srcId];
                writeFile(`mv-${Date.now()}`, args[1], item.content || '', item.type, currentPath);
                deleteFile(srcId);
                newLogs.push({ type: 'output', text: `Moved ${args[0]} to ${args[1]}` });
            } else {
                newLogs.push({ type: 'error', text: `mv: cannot stat '${args[0]}': No such file` });
            }
        }
        break;
      case 'cat':
        if (!args[0]) {
          newLogs.push({ type: 'error', text: 'cat: missing operand' });
        } else {
          const fileId = currentFolder.children?.find(id => vfs[id].name === args[0]);
          if (fileId && vfs[fileId].type === 'file') {
            newLogs.push({ type: 'output', text: vfs[fileId].content || '(Empty file)' });
          } else {
            newLogs.push({ type: 'error', text: `cat: ${args[0]}: No such file` });
          }
        }
        break;
      case 'touch':
        if (!args[0]) {
          newLogs.push({ type: 'error', text: 'touch: missing operand' });
        } else {
          const id = `file-${Date.now()}`;
          writeFile(id, args[0], '', 'file', currentPath);
          newLogs.push({ type: 'output', text: `Created file: ${args[0]}` });
        }
        break;
      case 'mkdir':
        if (!args[0]) {
          newLogs.push({ type: 'error', text: 'mkdir: missing operand' });
        } else {
          const id = `dir-${Date.now()}`;
          writeFile(id, args[0], '', 'directory', currentPath);
          newLogs.push({ type: 'output', text: `Created directory: ${args[0]}` });
        }
        break;
      case 'rm':
        if (!args[0]) {
          newLogs.push({ type: 'error', text: 'rm: missing operand' });
        } else {
          const fileId = currentFolder.children?.find(id => vfs[id].name === args[0]);
          if (fileId) {
            deleteFile(fileId);
            newLogs.push({ type: 'output', text: `Removed: ${args[0]}` });
          } else {
            newLogs.push({ type: 'error', text: `rm: cannot remove '${args[0]}': No such file or directory` });
          }
        }
        break;
      case 'neofetch':
        newLogs.push({ type: 'output', text: `
   /\\_/\\      user@geminiOS
  ( o.o )     -------------
   > ^ <      OS: geminiOS NY
              Kernel: 0.1.0
              Uptime: 14m
              Shell: gsh 1.0
              Resolution: 1920x1080
              WM: Metropolis
` });
        break;
      default:
        newLogs.push({ type: 'error', text: `Command not found: ${trimmed}` });
    }

    setLogs((prev) => [...prev, ...newLogs]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div 
      className="p-4 font-mono text-sm h-full flex flex-col bg-black/40"
      onClick={() => document.getElementById('term-input')?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto space-y-1 mb-2 custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className={`whitespace-pre-wrap leading-relaxed ${
            log.type === 'error' ? 'text-red-400' : 
            log.type === 'input' ? 'text-[#3B82F6] font-bold' : 'text-white/80'
          }`}>
            {log.text}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 shrink-0">
        <span className="text-[#3B82F6] font-bold tracking-widest leading-none mt-[2px]">{'>'}</span>
        <input
          id="term-input"
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-white/90 p-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
