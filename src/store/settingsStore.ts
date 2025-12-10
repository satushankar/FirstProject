import { create } from 'zustand';
import { UserSettings } from '../types';

interface SettingsStore extends UserSettings {
  setTheme: (theme: UserSettings['theme']) => void;
  setAccentColor: (color: string) => void;
  setFontSize: (size: UserSettings['fontSize']) => void;
  setEnableBiometrics: (enabled: boolean) => void;
  setEnableReminders: (enabled: boolean) => void;
  setReminderTime: (time: string | undefined) => void;
  setAutoLockTimeout: (timeout: number) => void;
  setEnableCloudSync: (enabled: boolean) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  accentColor: '#6366F1',
  fontSize: 'medium',
  enableBiometrics: false,
  enableReminders: true,
  reminderTime: '21:00',
  autoLockTimeout: 60,
  enableCloudSync: false,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaultSettings,

  setTheme: (theme) => set({ theme }),

  setAccentColor: (accentColor) => set({ accentColor }),

  setFontSize: (fontSize) => set({ fontSize }),

  setEnableBiometrics: (enableBiometrics) => set({ enableBiometrics }),

  setEnableReminders: (enableReminders) => set({ enableReminders }),

  setReminderTime: (reminderTime) => set({ reminderTime }),

  setAutoLockTimeout: (autoLockTimeout) => set({ autoLockTimeout }),

  setEnableCloudSync: (enableCloudSync) => set({ enableCloudSync }),

  updateSettings: (settings) => set((state) => ({ ...state, ...settings })),

  resetSettings: () => set(defaultSettings),
}));
