/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppId, WindowState, OSState, FileEntry, OSContextType } from '../types';

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
  'syntax-terminal': { title: 'Syntax Terminal', defaultWidth: 650, defaultHeight: 450 },
};

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OSState>({
    windows: [],
    activeWindowId: null,
    wallpaper: 'https://images.unsplash.com/photo-1496871230353-066fc0371309?q=80&w=2070&auto=format&fit=crop',
    vfs: INITIAL_VFS,
    isStartMenuOpen: false,
    systemState: 'booting',
  });

  const setSystemState = useCallback((systemState: import('../types').SystemState) => {
    setState(prev => ({ ...prev, systemState, isStartMenuOpen: false }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      systemState: 'login', 
      windows: [], 
      activeWindowId: null,
      isStartMenuOpen: false 
    }));
  }, []);

  const toggleStartMenu = useCallback((open?: boolean) => {
    setState(prev => ({
      ...prev,
      isStartMenuOpen: open !== undefined ? open : !prev.isStartMenuOpen
    }));
  }, []);

  const openApp = useCallback((appId: AppId, params?: Record<string, any>) => {
    setState((prev) => {
      // Close start menu when opening an app
      const newState = { ...prev, isStartMenuOpen: false };
      const existing = newState.windows.find((w) => w.appId === appId);
      if (existing) {
        return {
          ...newState,
          activeWindowId: existing.id,
          windows: newState.windows.map((w) =>
            w.id === existing.id ? { ...w, isMinimized: false, params: params || w.params } : w
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
        params,
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

  const writeFile = useCallback((id: string, name: string, content: string, type: 'file' | 'directory', parentId: string) => {
    setState(prev => {
      const newVfs = { ...prev.vfs };
      newVfs[id] = {
        id,
        name,
        type,
        content,
        parentId,
        updatedAt: Date.now(),
        children: type === 'directory' ? [] : undefined
      };
      
      // Update parent's children
      if (newVfs[parentId]) {
        newVfs[parentId] = {
          ...newVfs[parentId],
          children: [...(newVfs[parentId].children || []), id]
        };
      }
      
      return { ...prev, vfs: newVfs };
    });
  }, []);

  const deleteFile = useCallback((id: string) => {
    setState(prev => {
      if (id === 'root' || id === 'home' || id === 'user') return prev; // Protect core folders
      
      const newVfs = { ...prev.vfs };
      const item = newVfs[id];
      if (!item) return prev;

      const parentId = item.parentId;
      delete newVfs[id];

      if (parentId && newVfs[parentId]) {
        newVfs[parentId] = {
          ...newVfs[parentId],
          children: (newVfs[parentId].children || []).filter(childId => childId !== id)
        };
      }

      return { ...prev, vfs: newVfs };
    });
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
      toggleStartMenu,
      setSystemState,
      logout,
      writeFile,
      deleteFile,
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
