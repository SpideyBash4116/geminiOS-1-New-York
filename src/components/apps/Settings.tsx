/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Monitor, Palette, Shield, Info, Check, HardDrive, Cpu, Database, User, Globe, Plus, Trash2 } from 'lucide-react';

const WALLPAPERS = [
  { 
    name: 'Metropolis Night', 
    url: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop',
    thumb: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=200&auto=format&fit=crop'
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
  const { wallpaper, setWallpaper, disks, selectedDiskId, users, addUser, config, updateConfig } = useOS();
  const [activeTab, setActiveTab] = useState<'appearance' | 'storage' | 'network' | 'users' | 'security' | 'about'>('appearance');
  const [newUserName, setNewUserName] = useState('');

  const selectedDisk = disks.find(d => d.id === selectedDiskId) || disks[0];

  return (
    <div className="flex h-full bg-black/50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/5 bg-white/5 flex flex-col p-4 gap-2 shrink-0">
        <button 
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${
            activeTab === 'appearance' ? 'bg-os-accent/20 text-os-accent' : 'text-white/50 hover:bg-white/5'
          }`}
        >
           <Palette size={16} /> Appearance
        </button>
        <button 
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${
            activeTab === 'storage' ? 'bg-os-accent/20 text-os-accent' : 'text-white/50 hover:bg-white/5'
          }`}
        >
           <HardDrive size={16} /> Storage
        </button>
        <button 
          onClick={() => setActiveTab('network')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${
            activeTab === 'network' ? 'bg-os-accent/20 text-os-accent' : 'text-white/50 hover:bg-white/5'
          }`}
        >
           <Globe size={16} /> Network
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${
            activeTab === 'users' ? 'bg-os-accent/20 text-os-accent' : 'text-white/50 hover:bg-white/5'
          }`}
        >
           <User size={16} /> Users
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${
            activeTab === 'security' ? 'bg-os-accent/20 text-os-accent' : 'text-white/50 hover:bg-white/5'
          }`}
        >
           <Shield size={16} /> Security
        </button>
        <div className="flex-1" />
        <button 
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${
            activeTab === 'about' ? 'bg-os-accent/20 text-os-accent' : 'text-white/50 hover:bg-white/5'
          }`}
        >
           <Info size={16} /> About
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto custom-scrollbar">
        {activeTab === 'appearance' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-tighter uppercase">Appearance</h2>
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
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-tighter uppercase">Storage Management</h2>
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-os-accent/10 text-os-accent">
                    {selectedDisk.type === 'NVMe' ? <Cpu size={32} /> : <Database size={32} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{selectedDisk.name}</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1 font-bold">
                      System Target • {selectedDisk.type} Partition
                    </p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-xl font-black text-white">{selectedDisk.capacity} GB</div>
                   <div className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Volume Size</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-black">
                  <span className="text-white/40">Resource Allocated</span>
                  <span className="text-os-accent">{((selectedDisk.used / selectedDisk.capacity) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden flex p-0.5">
                   <div 
                      className="h-full bg-os-accent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000"
                      style={{ width: `${(selectedDisk.used / selectedDisk.capacity) * 100}%` }}
                   />
                </div>
                <div className="flex justify-between text-[9px] text-white/20 font-bold tracking-tighter">
                  <span>{selectedDisk.used} GB OCCUPIED</span>
                  <span>{selectedDisk.capacity - selectedDisk.used} GB VACANT</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Secondary Nodes</h3>
              {disks.filter(d => d.id !== selectedDiskId).map(disk => (
                 <div key={disk.id} className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5 opacity-50">
                    <div className="flex items-center gap-3">
                      <HardDrive size={16} className="text-white/30" />
                      <span className="text-xs font-bold text-white/80">{disk.name}</span>
                    </div>
                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{disk.capacity} GB FREE</span>
                 </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-tighter uppercase">Network Connectivity</h2>
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-os-accent/10 text-os-accent">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Hyperlink Uplink Mode</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Control how Metropolis nodes connect to the grid</p>
                    </div>
                  </div>
                  <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                     <button 
                       className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${config.internetMode === 'auto' ? 'bg-os-accent text-white shadow-lg shadow-os-accent/20' : 'text-white/40 hover:text-white/60'}`}
                       onClick={() => updateConfig({ internetMode: 'auto' })}
                     >
                       Automatic
                     </button>
                     <button 
                       className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${config.internetMode === 'manual' ? 'bg-os-accent text-white shadow-lg shadow-os-accent/20' : 'text-white/40 hover:text-white/60'}`}
                       onClick={() => updateConfig({ internetMode: 'manual' })}
                     >
                       Manual
                     </button>
                  </div>
               </div>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Connection Status</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       Active • Zero-Latency
                    </span>
                 </div>
                 <div className="text-[9px] text-white/20 font-bold tracking-tighter">Metropolis Relay NY-04 • IPv12: 8f2a:44db:110c:00ff:42a1</div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-tighter uppercase">User Profiles</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-os-accent/10 flex items-center justify-center text-os-accent">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user.username}</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        {user.role === 'admin' ? 'Root Administrator' : 'Standard Node'}
                      </div>
                    </div>
                  </div>
                  {user.role !== 'admin' && (
                    <button className="p-2 text-white/10 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
               <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Deploy New Node</h3>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={newUserName}
                   onChange={(e) => setNewUserName(e.target.value)}
                   placeholder="Enter username..." 
                   className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-os-accent/50"
                 />
                 <button 
                   onClick={() => {
                     if (newUserName.trim()) {
                       addUser(newUserName, 'user');
                       setNewUserName('');
                     }
                   }}
                   className="flex items-center gap-2 px-4 py-2 bg-os-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-os-accent/80 transition-colors shadow-lg shadow-os-accent/20"
                 >
                   <Plus size={16} /> Add Node
                 </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8 flex flex-col items-center py-12">
            <div className="w-32 h-32 glass rounded-[40px] flex items-center justify-center border border-white/10 shadow-2xl relative mb-8">
               <div className="w-16 h-16 bg-os-accent rounded-2xl animate-pulse blur-[20px] absolute" />
               <div className="w-16 h-16 bg-os-accent rounded-2xl animate-pulse relative z-10" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">geminiOS NY</h1>
              <p className="text-os-accent font-bold uppercase tracking-[0.5em] text-[10px] mb-8">Industrial Metropolis v0.1.0</p>
              
              <div className="glass p-8 rounded-3xl border border-white/5 w-80 text-left space-y-4">
                 <div className="flex justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest font-mono">Kernel Codebase</span>
                    <span className="text-[10px] text-white/80 font-bold font-mono">NY-RELEASE-A1</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest font-mono">Hyperlink v.</span>
                    <span className="text-[10px] text-white/80 font-bold font-mono">4.2.0-SECURE</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest font-mono">Identity Hash</span>
                    <span className="text-[10px] text-os-accent font-bold font-mono">SPIDEY_BASH</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
