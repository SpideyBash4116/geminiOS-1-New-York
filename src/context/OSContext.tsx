/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppId, WindowState, OSState, FileEntry } from '../types';

interface OSContextType extends OSState {
  openApp: (id: AppId) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  setWallpaper: (url: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const INITIAL_VFS: Record<string, FileEntry> = {
  'root': { id: 'root', name: '/', type: 'directory', parentId: null, children: ['home'], updatedAt: Date.now() },
  'home': { id: 'home', name: 'home', type: 'directory', parentId: 'root', children: ['user'], updatedAt: Date.now() },
  'user': { id: 'user', name: 'user', type: 'directory', parentId: 'home', children: ['Documents', 'notes.txt'], updatedAt: Date.now() },
  'Documents': { id: 'Documents', name: 'Documents', type: 'directory', parentId: 'user', children: ['project_plan.pdf'], updatedAt: Date.now() },
  'project_plan.pdf': { id: 'project_plan.pdf', name: 'project_plan.pdf', type: 'file', parentId: 'Documents', content: 'SYSTEM_FILE_BINARY_CONTENT', updatedAt: Date.now() },
  'notes.txt': { id: 'notes.txt', name: 'notes.txt', type: 'file', parentId: 'user', content: '# geminiOS Build Notes\n\n- [ ] Fix window stacking\n- [ ] Implement VFS persistence\n- [ ] Enhance Echo prompts', updatedAt: Date.now() },
};

const DEFAULT_APPS: Record<AppId, { title: string; defaultWidth: number; defaultHeight: number }> = {
  terminal: { title: 'Terminal', defaultWidth: 600, defaultHeight: 400 },
  echo: { title: 'Echo AI', defaultWidth: 500, defaultHeight: 650 },
  notes: { title: 'Notes', defaultWidth: 700, defaultHeight: 500 },
  files: { title: 'Files', defaultWidth: 800, defaultHeight: 500 },
  settings: { title: 'Settings', defaultWidth: 500, defaultHeight: 450 },
  browser: { title: 'Hyperlink', defaultWidth: 1000, defaultHeight: 700 },
};

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OSState>({
    windows: [],
    activeWindowId: null,
    wallpaper: 'https://images.unsplash.com/photo-1496871230353-066fc0371309?q=80&w=2070&auto=format&fit=crop',
    vfs: INITIAL_VFS,
  });

  const openApp = useCallback((appId: AppId) => {
    setState((prev) => {
      const existing = prev.windows.find((w) => w.appId === appId);
      if (existing) {
        return {
          ...prev,
          activeWindowId: existing.id,
          windows: prev.windows.map((w) =>
            w.id === existing.id ? { ...w, isMinimized: false } : w
          ),
        };
      }

      const id = `${appId}-${Date.now()}`;
      const config = DEFAULT_APPS[appId];
      const newWindow: WindowState = {
        id,
        appId,
        title: config.title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: Math.max(0, ...prev.windows.map((w) => w.zIndex)) + 1,
        x: 80 + prev.windows.length * 40,
        y: 80 + prev.windows.length * 40,
        width: config.defaultWidth,
        height: config.defaultHeight,
      };

      return {
        ...prev,
        windows: [...prev.windows, newWindow],
        activeWindowId: id,
      };
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      windows: prev.windows.filter((w) => w.id !== id),
      activeWindowId: prev.activeWindowId === id ? null : prev.activeWindowId,
    }));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      activeWindowId: id,
      windows: prev.windows.map((w) => ({
        ...w,
        zIndex: w.id === id ? Math.max(0, ...prev.windows.map((win) => win.zIndex)) + 1 : w.zIndex,
      })),
    }));
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      windows: prev.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    }));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      windows: prev.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }));
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      windows: prev.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  }, []);

  const setWallpaper = useCallback((url: string) => {
    setState(prev => ({ ...prev, wallpaper: url }));
  }, []);

  return (
    <OSContext.Provider value={{
      ...state,
      openApp,
      closeWindow,
      focusWindow,
      toggleMinimize,
      toggleMaximize,
      updateWindowPosition,
      setWallpaper,
    }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (context === undefined) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
}
