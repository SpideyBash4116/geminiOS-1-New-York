/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';

interface LogEntry {
  type: 'input' | 'output' | 'error';
  text: string;
}

export default function Terminal() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: 'output', text: 'geminiOS [Version 0.1.0-NY]' },
    { type: 'output', text: '(c) 2026 Google DeepMind. All rights reserved.' },
    { type: 'output', text: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLogs: LogEntry[] = [{ type: 'input', text: `> ${cmd}` }];

    if (!trimmed) {
       setLogs(prev => [...prev, ...newLogs]);
       return;
    }

    switch (trimmed) {
      case 'help':
        newLogs.push({ type: 'output', text: 'Available commands: help, clear, ls, cat, date, whoami, neofetch' });
        break;
      case 'clear':
        setLogs([]);
        return;
      case 'date':
        newLogs.push({ type: 'output', text: new Date().toString() });
        break;
      case 'whoami':
        newLogs.push({ type: 'output', text: 'user@geminiOS' });
        break;
      case 'ls':
        newLogs.push({ type: 'output', text: 'Documents/  notes.txt  system/  bin/' });
        break;
      case 'cat notes.txt':
        newLogs.push({ type: 'output', text: 'Welcome to geminiOS. This is a local file stored in VFS.' });
        break;
      case 'neofetch':
        newLogs.push({ type: 'output', text: `
   /\\_/\\      user@geminiOS
  ( o.o )     -------------
   > ^ <      OS: geminiOS NY
              Kernel: 0.1.0
              Uptime: 2m
              Shell: gsh 1.0
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
