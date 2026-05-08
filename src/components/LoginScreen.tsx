/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Key, ArrowRight, ShieldCheck } from 'lucide-react';
import { useOS } from '../context/OSContext';

export function LoginScreen() {
  const { setSystemState, wallpaper, users, currentUserId, switchUser } = useOS();
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234' || password === '') {
       setSystemState('desktop');
    } else {
       setIsError(true);
       setTimeout(() => setIsError(false), 1000);
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center gap-8 w-full max-w-sm px-6"
      >
        <div className="flex flex-col items-center gap-4">
           {users.length > 1 && (
             <div className="flex gap-4 mb-4">
                {users.map(u => (
                  <button 
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      currentUserId === u.id ? 'border-[#3B82F6] scale-110 shadow-lg ring-4 ring-[#3B82F6]/20' : 'border-white/10 opacity-40 hover:opacity-100'
                    } flex items-center justify-center bg-white/5 overflow-hidden`}
                  >
                    <User size={20} className="text-white/60" />
                  </button>
                ))}
             </div>
           )}

           <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-os-bg flex items-center justify-center border border-white/10">
                 <User size={40} className="text-white/80" />
              </div>
           </div>
           
           <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tighter text-white">{currentUser?.username || 'Guest'}</h1>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                {currentUser?.role === 'admin' ? 'Root Administrator' : 'Standard Node'}
              </span>
           </div>
        </div>

        <form 
           onSubmit={handleLogin}
           className={`w-full glass rounded-2xl p-2 flex items-center gap-2 transition-all ${
             isError ? 'ring-2 ring-red-500/50 translate-x-1' : 'focus-within:ring-2 focus-within:ring-[#3B82F6]/50'
           }`}
        >
           <div className="p-3 text-white/20">
              <Key size={18} />
           </div>
           <input 
              type="password"
              placeholder="Enter PIN (e.g. 1234)"
              className="bg-transparent border-none outline-none text-white text-sm flex-1 placeholder:text-white/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
           />
           <button 
              type="submit"
              className="p-3 bg-[#3B82F6] text-white rounded-xl hover:bg-[#3B82F6]/80 transition-colors shadow-lg"
           >
              <ArrowRight size={18} />
           </button>
        </form>

        <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest mt-4">
           <ShieldCheck size={12} /> Biometric check bypassed
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="absolute bottom-10 left-10 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
         geminiOS / NY EDITION
      </div>
    </div>
  );
}
