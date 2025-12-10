import { create } from 'zustand';
import { AuthState } from '../types';

interface AuthStore extends AuthState {
  setAuthenticated: (value: boolean) => void;
  setLocked: (value: boolean) => void;
  setHasSetupPin: (value: boolean) => void;
  setBiometricsAvailable: (value: boolean) => void;
  setBiometricsEnabled: (value: boolean) => void;
  unlock: () => void;
  lock: () => void;
  reset: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLocked: true,
  hasSetupPin: false,
  biometricsAvailable: false,
  biometricsEnabled: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

  setLocked: (value: boolean) => set({ isLocked: value }),

  setHasSetupPin: (value: boolean) => set({ hasSetupPin: value }),

  setBiometricsAvailable: (value: boolean) => set({ biometricsAvailable: value }),

  setBiometricsEnabled: (value: boolean) => set({ biometricsEnabled: value }),

  unlock: () =>
    set({
      isAuthenticated: true,
      isLocked: false,
    }),

  lock: () =>
    set({
      isAuthenticated: false,
      isLocked: true,
    }),

  reset: () => set(initialState),
}));
