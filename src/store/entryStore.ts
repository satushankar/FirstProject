import { create } from 'zustand';
import { Entry, EntryType } from '../types';

interface EntryStore {
  entries: Entry[];
  selectedEntry: Entry | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setEntries: (entries: Entry[]) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  setSelectedEntry: (entry: Entry | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Selectors
  getEntriesByType: (type: EntryType) => Entry[];
  getEntriesByDate: (date: string) => Entry[];
  getEntriesByTag: (tagId: string) => Entry[];
  getEntriesByCollection: (collectionId: string) => Entry[];
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: [],
  selectedEntry: null,
  isLoading: false,
  error: null,

  setEntries: (entries: Entry[]) => set({ entries }),

  addEntry: (entry: Entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),

  updateEntry: (id: string, updates: Partial<Entry>) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
          : entry
      ),
    })),

  deleteEntry: (id: string) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
      selectedEntry:
        state.selectedEntry?.id === id ? null : state.selectedEntry,
    })),

  setSelectedEntry: (entry: Entry | null) => set({ selectedEntry: entry }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),

  getEntriesByType: (type: EntryType) => {
    return get().entries.filter((entry) => entry.type === type);
  },

  getEntriesByDate: (date: string) => {
    return get().entries.filter((entry) => entry.entryDate.startsWith(date));
  },

  getEntriesByTag: (tagId: string) => {
    return get().entries.filter((entry) => entry.tags.includes(tagId));
  },

  getEntriesByCollection: (collectionId: string) => {
    return get().entries.filter((entry) => entry.collectionId === collectionId);
  },
}));
