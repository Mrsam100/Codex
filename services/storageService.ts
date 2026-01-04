
import { CodexState } from '../types';

const STORAGE_KEY = 'codex_thought_surface_data';

export interface StorageError {
  type: 'quota' | 'parse' | 'unknown';
  message: string;
}

export const storageService = {
  save: (state: CodexState): StorageError | null => {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      return null;
    } catch (e: any) {
      console.error('Failed to save state to localStorage', e);

      // Check if it's a quota exceeded error
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        return {
          type: 'quota',
          message: 'Storage quota exceeded. Please export your data and clear old fragments, or use the browser\'s storage settings to increase the limit.'
        };
      }

      return {
        type: 'unknown',
        message: 'Failed to save your data. Please try exporting your work.'
      };
    }
  },

  load: (): { data: CodexState | null, error: StorageError | null } => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return { data: null, error: null };

      const parsed = JSON.parse(data);
      return { data: parsed, error: null };
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
      return {
        data: null,
        error: {
          type: 'parse',
          message: 'Failed to load saved data. Your data may be corrupted.'
        }
      };
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  },

  getStorageInfo: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const sizeInBytes = data ? new Blob([data]).size : 0;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

      // Estimate remaining storage (localStorage limit is typically 5-10MB)
      const estimatedLimit = 5 * 1024 * 1024; // 5MB
      const percentUsed = (sizeInBytes / estimatedLimit) * 100;

      return {
        sizeInBytes,
        sizeInKB,
        sizeInMB,
        percentUsed: Math.min(percentUsed, 100),
        isNearLimit: percentUsed > 80
      };
    } catch (e) {
      return null;
    }
  },

  exportJSON: (state: CodexState) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `codex_export_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      return null;
    } catch (e) {
      return 'Failed to export data. Please try again.';
    }
  }
};
