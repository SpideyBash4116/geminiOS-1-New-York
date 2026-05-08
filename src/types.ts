/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppId = 'terminal' | 'echo' | 'notes' | 'files' | 'settings' | 'browser' | 'syntax-terminal';

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

export type SystemState = 'booting' | 'setup' | 'login' | 'desktop' | 'shutdown' | 'restarting' | 'suspended' | 'recovery' | 'security_options';

export interface DiskInfo {
  id: string;
  name: string;
  capacity: number; // in GB
  used: number;    // in GB
  type: 'SSD' | 'HDD' | 'NVMe';
  isSystem: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface OSConfig {
  internetMode: 'auto' | 'manual';
}

export interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  wallpaper: string;
  vfs: Record<string, FileEntry>;
  isStartMenuOpen: boolean;
  systemState: SystemState;
  isSetupCompleted: boolean;
  disks: DiskInfo[];
  selectedDiskId: string | null;
  users: UserProfile[];
  currentUserId: string | null;
  config: OSConfig;
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
  completeSetup: (setupData: { username: string; internetMode: 'auto' | 'manual' }) => void;
  factoryReset: () => void;
  selectDisk: (id: string) => void;
  switchUser: (userId: string) => void;
  addUser: (username: string, role: 'admin' | 'user') => void;
  updateConfig: (config: Partial<OSConfig>) => void;
  // VFS Mutations
  writeFile: (path: string, name: string, content: string, type: 'file' | 'directory', parentId: string) => void;
  deleteFile: (id: string) => void;
}
