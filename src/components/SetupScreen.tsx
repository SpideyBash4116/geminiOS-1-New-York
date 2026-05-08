/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Globe, User, ArrowRight, Check, HardDrive, Database, Cpu } from 'lucide-react';
import { useOS } from '../context/OSContext';

export function SetupScreen() {
  const { completeSetup, disks, selectedDiskId, selectDisk } = useOS();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('Administrator');
  const [internetMode, setInternetMode] = useState<'auto' | 'manual'>('manual');

  const steps = [
    {
      title: "Welcome to geminiOS",
      content: "The next generation of personal computing, powered by Metropolis nodes and neural-metamorphic kernel architectures.",
      icon: <Sparkles className="text-[#3B82F6]" size={48} />,
      nextLabel: "Initialize System"
    },
    {
      title: "Digital Sovereignty",
      content: "Your data is encrypted using 512-bit post-quantum lattice primitives. We don't just protect your privacy; we institutionalize it.",
      icon: <Shield className="text-emerald-500" size={48} />,
      nextLabel: "Agree & Continue"
    },
    {
      title: "Storage Partitioning",
      content: "Select the target disk for kernel deployment. The chosen drive will be formatted with the geminiFS file system.",
      icon: <HardDrive className="text-amber-500" size={48} />,
      nextLabel: "Provision Disk",
      isStorage: true
    },
    {
      title: "Global Connectivity",
      content: "geminiOS connects seamlessly to the global Hyperlink engine. Choose how your system handles uplink protocols.",
      icon: <Globe className="text-purple-500" size={48} />,
      nextLabel: "Configure Network",
      isNetwork: true
    },
    {
      title: "Root Identity",
      content: "Define the administrative handle for this node. This profile will have unrestricted kernel-level access.",
      icon: <User className="text-blue-500" size={48} />,
      nextLabel: "Finalize Setup",
      isIdentity: true
    }
  ];

  const handleNext = () => {
    if (steps[step].isStorage && !selectedDiskId) return;
    if (steps[step].isIdentity && !username.trim()) return;

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeSetup({ username, internetMode });
    }
  };

  return (
    <div className="h-screen w-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[120px]" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-xl glass rounded-[32px] p-12 flex flex-col items-center text-center gap-8 border border-white/5 shadow-2xl"
        >
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 mb-4 scale-110">
            {steps[step].icon}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-white">
              {steps[step].title}
            </h1>
            <p className="text-white/40 leading-relaxed max-w-md mx-auto text-lg">
              {steps[step].content}
            </p>
          </div>

          {steps[step].isStorage && (
            <div className="w-full space-y-3 mt-4">
              {disks.map((disk) => (
                <button
                  key={disk.id}
                  onClick={() => selectDisk(disk.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    selectedDiskId === disk.id 
                      ? 'bg-[#3B82F6]/20 border-[#3B82F6] ring-1 ring-[#3B82F6]' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${selectedDiskId === disk.id ? 'bg-[#3B82F6] text-white' : 'bg-white/10 text-white/40'}`}>
                    {disk.type === 'NVMe' ? <Cpu size={20} /> : <Database size={20} />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-white text-sm">{disk.name}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">{disk.type} • {disk.capacity} GB</div>
                  </div>
                  {selectedDiskId === disk.id && (
                    <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {steps[step].isNetwork && (
            <div className="w-full space-y-3 mt-4">
              <button
                onClick={() => setInternetMode('auto')}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  internetMode === 'auto' 
                    ? 'bg-[#3B82F6]/20 border-[#3B82F6] ring-1 ring-[#3B82F6]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`p-3 rounded-xl ${internetMode === 'auto' ? 'bg-[#3B82F6] text-white' : 'bg-white/10 text-white/40'}`}>
                  <Sparkles size={20} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-white text-sm">Automatic Uplink</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">Connect automatically on boot</div>
                </div>
              </button>
              <button
                onClick={() => setInternetMode('manual')}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  internetMode === 'manual' 
                    ? 'bg-[#3B82F6]/20 border-[#3B82F6] ring-1 ring-[#3B82F6]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`p-3 rounded-xl ${internetMode === 'manual' ? 'bg-[#3B82F6] text-white' : 'bg-white/10 text-white/40'}`}>
                  <Shield size={20} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-white text-sm">Manual Authorization</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest">Require explicit kernel toggle</div>
                </div>
              </button>
            </div>
          )}

          {steps[step].isIdentity && (
            <div className="w-full space-y-6 mt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] block text-left px-2">Root Administrative Name</label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Administrator"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#3B82F6]/50 focus:bg-white/10 transition-all font-bold tracking-tight"
                />
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-left">
                <p className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest leading-relaxed">
                  Warning: The root user possesses ultimate authority over the node. Choose a handle you will recognize across the system.
                </p>
              </div>
            </div>
          )}

          {/* Progress Indicators */}
          <div className="flex gap-2 mt-4">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === step ? 'w-8 bg-[#3B82F6]' : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="mt-8 group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold uppercase text-[12px] tracking-[0.2em] hover:bg-[#3B82F6] hover:text-white transition-all duration-500 shadow-xl"
          >
            {steps[step].nextLabel}
            {step === steps.length - 1 ? (
              <Check size={18} />
            ) : (
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            )}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Footer Branding */}
      <div className="absolute bottom-12 text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">
        Provisioning Metropolis Node 0xFF42A
      </div>
    </div>
  );
}
