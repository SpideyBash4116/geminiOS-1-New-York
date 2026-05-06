/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';

export function RecoveryScreen() {
  const { setSystemState } = useOS();
  const [logs, setLogs] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  const recoverySteps = [
    "CHECKING_DISK_INTEGRITY...",
    "VFS_REPAIR_INITIALIZED",
    "RESTORING_KERNEL_PANIC_LOGS...",
    "FLUSHING_L3_CACHE",
    "AUTH_RECOVERY_KEY_REQUIRED: [SKIPPED]",
    "SYSTEM_STABILIZED",
    "READY_FOR_REBOOT"
  ];

  useEffect(() => {
    if (step < recoverySteps.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, `[ 0.00${step} ] ${recoverySteps[step]}`]);
        setStep(s => s + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-mono p-12 text-sm selection:bg-white selection:text-black">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="border border-white/20 p-4 bg-white/5">
           <h1 className="text-os-accent font-bold mb-2 tracking-tighter">GEMINI RECOVERY UTILITY v0.4</h1>
           <p className="text-white/40 text-[10px]">CODENAME: NEW YORK REDEMPTION</p>
        </div>

        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
          {step === recoverySteps.length && (
            <div className="mt-8 space-y-4">
               <div className="text-os-accent animate-pulse">RECOVERY_COMPLETE. SYSTEM_READY.</div>
               <div className="flex gap-4">
                  <button 
                    onClick={() => setSystemState('booting')}
                    className="bg-white text-black px-4 py-1 hover:bg-white/80 transition-colors"
                  >
                    REBOOT_SYSTEM
                  </button>
                  <button 
                    onClick={() => setSystemState('login')}
                    className="border border-white px-4 py-1 hover:bg-white/10 transition-colors"
                  >
                    LOGIN_SCREEN
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
