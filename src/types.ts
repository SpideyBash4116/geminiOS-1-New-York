/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppId = 'terminal' | 'echo' | 'notes' | 'files' | 'settings' | 'browser';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  params?: Record<string, any>;
}

export interface FileEntry {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: string[]; // IDs of children
  parentId: string | null;
  updatedAt: number;
}

export type SystemState = 'booting' | 'login' | 'desktop' | 'shutdown' | 'restarting' | 'suspended' | 'recovery' | 'security_options';

export interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  wallpaper: string;
  vfs: Record<string, FileEntry>;
  isStartMenuOpen: boolean;
  systemState: SystemState;
}

export interface OSContextType extends OSState {
  openApp: (id: AppId, params?: Record<string, any>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  setWallpaper: (url: string) => void;
  toggleStartMenu: (open?: boolean) => void;
  setSystemState: (state: SystemState) => void;
  logout: () => void;
  // VFS Mutations
  writeFile: (path: string, name: string, content: string, type: 'file' | 'directory', parentId: string) => void;
  deleteFile: (id: string) => void;
}
