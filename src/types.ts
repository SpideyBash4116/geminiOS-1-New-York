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

export interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  wallpaper: string;
  vfs: Record<string, FileEntry>;
}
