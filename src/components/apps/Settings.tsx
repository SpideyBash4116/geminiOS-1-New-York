/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useOS } from '../../context/OSContext';
import { Monitor, Palette, Shield, Info, Check } from 'lucide-react';

const WALLPAPERS = [
  { 
    name: 'Metropolis Night', 
    url: 'https://images.unsplash.com/photo-1496871230353-066fc0371309?q=80&w=2070&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1496871230353-066fc0371309?q=80&w=200&auto=format&fit=crop'
  },
  { 
    name: 'Industrial Rain', 
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2112&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=200&auto=format&fit=crop'
  },
  { 
    name: 'Cyber Alley', 
    url: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1976&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=200&auto=format&fit=crop'
  },
  { 
    name: 'Concrete Jungle', 
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop'
  },
];

export default function Settings({ windowId }: { windowId?: string }) {
  const { wallpaper, setWallpaper } = useOS();

  return (
    <div className="flex h-full bg-black/50">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/5 bg-white/5 flex flex-col p-4 gap-2">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-os-accent/20 text-os-accent text-xs font-bold uppercase tracking-wider">
           <Palette size={16} /> Appearance
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/50 text-xs font-bold uppercase tracking-wider transition-colors">
           <Monitor size={16} /> Display
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/50 text-xs font-bold uppercase tracking-wider transition-colors">
           <Shield size={16} /> Security
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/50 text-xs font-bold uppercase tracking-wider transition-colors">
           <Info size={16} /> About
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-xl font-bold tracking-tighter mb-8 uppercase">Appearance</h2>
        
        <div className="space-y-8">
           <section>
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Desktop Wallpaper</h3>
              <div className="grid grid-cols-2 gap-4">
                 {WALLPAPERS.map((wp) => (
                   <div 
                      key={wp.url}
                      onClick={() => setWallpaper(wp.url)}
                      className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer group border-2 transition-all ${
                        wallpaper === wp.url ? 'border-os-accent' : 'border-transparent'
                      }`}
                   >
                      <img 
                        src={wp.thumb} 
                        alt={wp.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      {wallpaper === wp.url && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-os-accent text-black flex items-center justify-center">
                           <Check size={14} />
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 text-[8px] font-bold uppercase bg-black/60 px-2 py-1 rounded backdrop-blur-md tracking-tighter">
                         {wp.name}
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           <section className="space-y-4">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">System Theme</h3>
              <div className="glass p-4 rounded-2xl flex items-center justify-between">
                 <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-white/80">Glass Transparency</span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">Enable backdrop blurs for all windows</span>
                 </div>
                 <div className="w-10 h-6 rounded-full bg-os-accent p-1 cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-black ml-auto" />
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
