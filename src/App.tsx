/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { useOS } from './context/OSContext';
import { TopBar } from './components/TopBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { Dashboard } from './components/Dashboard';
import { StartMenu } from './components/StartMenu';
import { LoginScreen } from './components/LoginScreen';
import { RecoveryScreen } from './components/RecoveryScreen';
import { SecurityOverlay } from './components/SecurityOverlay';
import { SystemOverlays } from './components/SystemOverlays';

// Lazy load apps to keep initial bundle light
const TerminalApp = React.lazy(() => import('./components/apps/Terminal'));
const EchoApp = React.lazy(() => import('./components/apps/Echo'));
const NotesApp = React.lazy(() => import('./components/apps/Notes'));
const FilesApp = React.lazy(() => import('./components/apps/Files'));
const SettingsApp = React.lazy(() => import('./components/apps/Settings'));
const BrowserApp = React.lazy(() => import('./components/apps/Browser'));

export default function App() {
  const os = useOS();

  const activeWindow = os.windows.find((w) => w.id === os.activeWindowId);

  const renderAppContent = (appId: string, windowId: string) => {
    switch (appId) {
      case 'terminal': return <TerminalApp windowId={windowId} />;
      case 'echo': return <EchoApp windowId={windowId} />;
      case 'notes': return <NotesApp windowId={windowId} />;
      case 'files': return <FilesApp windowId={windowId} />;
      case 'settings': return <SettingsApp windowId={windowId} />;
      case 'browser': return <BrowserApp windowId={windowId} />;
      default: return (
        <div className="flex items-center justify-center h-full text-white/20 select-none">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 tracking-tighter">APP_NOT_FOUND</div>
            <div className="text-xs uppercase tracking-widest font-mono">Module execution failed: {appId}</div>
          </div>
        </div>
      );
    }
  };

  React.useEffect(() => {
    if (os.systemState === 'booting') {
       const timer = setTimeout(() => os.setSystemState('login'), 2000);
       return () => clearTimeout(timer);
    }
  }, [os.systemState, os.setSystemState]);

  if (os.systemState === 'booting') {
    return (
      <div className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center font-sans cursor-wait">
        <div className="flex flex-col gap-1 items-start">
           <div className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">Initialization BIOS v3.1</div>
           <div className="text-[#3B82F6] font-bold tracking-tighter text-3xl mb-4">geminiOS <span className="font-light opacity-50">/ NY</span></div>
           <div className="space-y-1">
              <div className="text-white/40 text-[8px] font-mono animate-pulse">CPU_CORE: 0x827FF ONLINE</div>
              <div className="text-white/40 text-[8px] font-mono animate-pulse" style={{ animationDelay: '100ms' }}>VFS_MOUNT: /dev/sda1 {"->"} /root</div>
              <div className="text-white/40 text-[8px] font-mono animate-pulse" style={{ animationDelay: '200ms' }}>NEURAL_INIT: CONNECTED (GEMINI_EYE)</div>
              <div className="text-white/40 text-[8px] font-mono animate-pulse" style={{ animationDelay: '300ms' }}>METROPOLIS_LAYER: RENDER_READY</div>
           </div>
        </div>
      </div>
    );
  }

  if (os.systemState === 'login') return <LoginScreen />;
  if (os.systemState === 'recovery') return <RecoveryScreen />;
  if (os.systemState === 'security_options') return <SecurityOverlay />;

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-cover bg-center relative transition-all duration-1000"
      style={{ backgroundImage: `url(${os.wallpaper})` }}
    >
      <SystemOverlays />
      {/* OS Overlay / Vignette */}
      <div className="absolute inset-0 bg-black/40 backdrop-brightness-75 pointer-events-none" />
      
      <TopBar activeAppTitle={activeWindow?.title} />
      
      <StartMenu />

      {/* Desktop Workspace */}
      <main className="absolute inset-0 pt-10 pb-24 overflow-hidden flex items-center justify-center">
        {/* Bento Dashboard Layer */}
        <div className="w-full max-w-6xl max-h-[800px] z-0 opacity-80 scale-95 pointer-events-none group-has-[:not(.hidden)]:opacity-20 transition-opacity duration-700">
           <Dashboard />
        </div>

        {os.windows.map((w) => (
          <Window
            key={w.id}
            window={w}
            isActive={os.activeWindowId === w.id}
            onFocus={() => os.focusWindow(w.id)}
            onClose={() => os.closeWindow(w.id)}
            onMinimize={() => os.toggleMinimize(w.id)}
            onMaximize={() => os.toggleMaximize(w.id)}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-os-accent border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              {renderAppContent(w.appId, w.id)}
            </Suspense>
          </Window>
        ))}
      </main>

      <Dock 
        openApp={os.openApp} 
        activeAppId={os.activeWindowId} 
        openApps={os.windows.map(w => w.appId)} 
      />
    </div>
  );
}
