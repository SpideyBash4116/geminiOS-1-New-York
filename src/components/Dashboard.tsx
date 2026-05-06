/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Music, Cloud, Cpu, Calendar, ChevronRight } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="w-full h-full p-8 grid grid-cols-4 grid-rows-3 gap-4 pointer-events-auto overflow-auto custom-scrollbar">
      {/* Primary Assistant Card (2x2) */}
      <section className="col-span-2 row-span-2 bg-[#0F0F11] border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:border-[#3B82F6]/30 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Active Intelligence</span>
          </div>
          <h1 className="text-4xl font-light leading-tight text-white/90">
            Good morning.<br/>
            <span className="text-[#3B82F6] font-medium">NYC traffic is heavy</span> toward Midtown. Start earlier?
          </h1>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-[1px] w-full bg-white/5" />
          <div className="flex items-center justify-between opacity-60 text-sm">
            <span className="font-medium">Prompt Gemini...</span>
            <kbd className="bg-white/5 px-2 py-1 rounded border border-white/10 text-[10px] font-mono">⌘ K</kbd>
          </div>
        </div>
      </section>

      {/* Weather Card (1x1) */}
      <section className="bg-gradient-to-br from-[#1A1A1E] to-[#0A0A0B] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Weather</span>
        <div>
          <div className="text-5xl font-light text-white">72°</div>
          <div className="text-sm opacity-60 flex items-center gap-2">
             <Cloud size={14} /> Partly Cloudy
          </div>
        </div>
      </section>

      {/* System Resources (1x1) */}
      <section className="bg-[#0F0F11] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Kernel</span>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-bold"><span className="opacity-40">CPU</span><span>24%</span></div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-white/40 w-[24%]" /></div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1 font-bold"><span className="opacity-40">RAM</span><span>42%</span></div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#3B82F6] w-[42%]" /></div>
          </div>
        </div>
      </section>

      {/* Music/Media (2x1) */}
      <section className="col-span-2 bg-[#161618] border border-white/10 rounded-3xl p-6 flex items-center gap-6">
        <div className="w-24 h-24 bg-[#2A2A2E] rounded-xl flex items-center justify-center text-3xl shadow-inner">
           <Music size={32} className="text-white/20" />
        </div>
        <div className="flex-1">
          <div className="text-sm opacity-40 uppercase tracking-widest mb-1 text-[10px] font-bold">Now Playing</div>
          <div className="text-xl font-medium mb-1 text-white">Straphanger's Blues</div>
          <div className="text-sm opacity-60">The Jazz Messengers</div>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white w-1/3" />
            </div>
            <span className="text-[10px] opacity-40 font-mono">1:42 / 4:15</span>
          </div>
        </div>
      </section>

      {/* Workspace Navigator (1x1) */}
      <section className="bg-[#0F0F11] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Workspaces</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-square bg-[#3B82F6]/60 rounded-lg flex items-center justify-center border border-white/10 shadow-lg">
             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </div>
          <div className="aspect-square bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer" />
          <div className="aspect-square bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer" />
          <div className="aspect-square bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer" />
        </div>
      </section>

      {/* Schedule (1x1) */}
      <section className="bg-[#3B82F6] text-white rounded-3xl p-6 flex flex-col justify-between shadow-[0_0_40px_rgba(59,130,246,0.3)]">
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-bold">Upcoming</span>
        <div>
          <div className="text-2xl font-light mb-1">2:30 PM</div>
          <div className="text-sm font-medium leading-tight">Board Meeting: Q4 Roadmap</div>
          <div className="text-[10px] mt-2 opacity-70 flex items-center gap-1 uppercase tracking-widest font-bold">
            Conf Room A <ChevronRight size={10} />
          </div>
        </div>
      </section>
    </div>
  );
}
