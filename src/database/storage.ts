import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entry, Tag, Collection, UserSettings, Mood, Location, Weather } from '../types';

// Storage keys
const STORAGE_KEYS = {
  ENTRIES: '@diary/entries',
  TAGS: '@diary/tags',
  COLLECTIONS: '@diary/collections',
  SETTINGS: '@diary/settings',
  MOODS: '@diary/moods',
  LOCATIONS: '@diary/locations',
  WEATHER: '@diary/weather',
  PIN_HASH: '@diary/pin_hash',
  HAS_SETUP: '@diary/has_setup',
} as const;

// Generic storage helpers
async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return null;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
    throw error;
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
}

// Entry operations
export const EntryStorage = {
  async getAll(): Promise<Entry[]> {
    const entries = await getItem<Entry[]>(STORAGE_KEYS.ENTRIES);
    return entries || [];
  },

  async getById(id: string): Promise<Entry | null> {
    const entries = await this.getAll();
    return entries.find((entry) => entry.id === id) || null;
  },

  async save(entry: Entry): Promise<void> {
    const entries = await this.getAll();
    const existingIndex = entries.findIndex((e) => e.id === entry.id);

    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.unshift(entry);
    }

    await setItem(STORAGE_KEYS.ENTRIES, entries);
  },

  async delete(id: string): Promise<void> {
    const entries = await this.getAll();
    const filtered = entries.filter((entry) => entry.id !== id);
    await setItem(STORAGE_KEYS.ENTRIES, filtered);
  },

  async deleteAll(): Promise<void> {
    await removeItem(STORAGE_KEYS.ENTRIES);
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Entry[]> {
    const entries = await this.getAll();
    return entries.filter((entry) => {
      const entryDate = entry.entryDate;
      return entryDate >= startDate && entryDate <= endDate;
    });
  },

  async search(query: string): Promise<Entry[]> {
    const entries = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.content.toLowerCase().includes(lowerQuery)
    );
  },
};

// Tag operations
export const TagStorage = {
  async getAll(): Promise<Tag[]> {
    const tags = await getItem<Tag[]>(STORAGE_KEYS.TAGS);
    return tags || [];
  },

  async save(tag: Tag): Promise<void> {
    const tags = await this.getAll();
    const existingIndex = tags.findIndex((t) => t.id === tag.id);

    if (existingIndex >= 0) {
      tags[existingIndex] = tag;
    } else {
      tags.push(tag);
    }

    await setItem(STORAGE_KEYS.TAGS, tags);
  },

  async delete(id: string): Promise<void> {
    const tags = await this.getAll();
    const filtered = tags.filter((tag) => tag.id !== id);
    await setItem(STORAGE_KEYS.TAGS, filtered);
  },
};

// Collection operations
export const CollectionStorage = {
  async getAll(): Promise<Collection[]> {
    const collections = await getItem<Collection[]>(STORAGE_KEYS.COLLECTIONS);
    return collections || [];
  },

  async save(collection: Collection): Promise<void> {
    const collections = await this.getAll();
    const existingIndex = collections.findIndex((c) => c.id === collection.id);

    if (existingIndex >= 0) {
      collections[existingIndex] = collection;
    } else {
      collections.push(collection);
    }

    await setItem(STORAGE_KEYS.COLLECTIONS, collections);
  },

  async delete(id: string): Promise<void> {
    const collections = await this.getAll();
    const filtered = collections.filter((collection) => collection.id !== id);
    await setItem(STORAGE_KEYS.COLLECTIONS, filtered);
  },
};

// Settings operations
export const SettingsStorage = {
  async get(): Promise<UserSettings | null> {
    return getItem<UserSettings>(STORAGE_KEYS.SETTINGS);
  },

  async save(settings: UserSettings): Promise<void> {
    await setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  async reset(): Promise<void> {
    await removeItem(STORAGE_KEYS.SETTINGS);
  },
};

// Auth operations
export const AuthStorage = {
  async getPinHash(): Promise<string | null> {
    return getItem<string>(STORAGE_KEYS.PIN_HASH);
  },

  async savePinHash(hash: string): Promise<void> {
    await setItem(STORAGE_KEYS.PIN_HASH, hash);
  },

  async hasSetup(): Promise<boolean> {
    const value = await getItem<boolean>(STORAGE_KEYS.HAS_SETUP);
    return value || false;
  },

  async setHasSetup(value: boolean): Promise<void> {
    await setItem(STORAGE_KEYS.HAS_SETUP, value);
  },

  async clearAuth(): Promise<void> {
    await removeItem(STORAGE_KEYS.PIN_HASH);
    await removeItem(STORAGE_KEYS.HAS_SETUP);
  },
};

// Mood operations
export const MoodStorage = {
  async getAll(): Promise<Mood[]> {
    const moods = await getItem<Mood[]>(STORAGE_KEYS.MOODS);
    return moods || [];
  },

  async save(mood: Mood): Promise<void> {
    const moods = await this.getAll();
    const existingIndex = moods.findIndex((m) => m.id === mood.id);

    if (existingIndex >= 0) {
      moods[existingIndex] = mood;
    } else {
      moods.push(mood);
    }

    await setItem(STORAGE_KEYS.MOODS, moods);
  },

  async getById(id: string): Promise<Mood | null> {
    const moods = await this.getAll();
    return moods.find((mood) => mood.id === id) || null;
  },
};

// Location operations
export const LocationStorage = {
  async getAll(): Promise<Location[]> {
    const locations = await getItem<Location[]>(STORAGE_KEYS.LOCATIONS);
    return locations || [];
  },

  async save(location: Location): Promise<void> {
    const locations = await this.getAll();
    const existingIndex = locations.findIndex((l) => l.id === location.id);

    if (existingIndex >= 0) {
      locations[existingIndex] = location;
    } else {
      locations.push(location);
    }

    await setItem(STORAGE_KEYS.LOCATIONS, locations);
  },

  async getById(id: string): Promise<Location | null> {
    const locations = await this.getAll();
    return locations.find((location) => location.id === id) || null;
  },
};

// Weather operations
export const WeatherStorage = {
  async getAll(): Promise<Weather[]> {
    const weather = await getItem<Weather[]>(STORAGE_KEYS.WEATHER);
    return weather || [];
  },

  async save(weather: Weather): Promise<void> {
    const weatherList = await this.getAll();
    const existingIndex = weatherList.findIndex((w) => w.id === weather.id);

    if (existingIndex >= 0) {
      weatherList[existingIndex] = weather;
    } else {
      weatherList.push(weather);
    }

    await setItem(STORAGE_KEYS.WEATHER, weatherList);
  },

  async getById(id: string): Promise<Weather | null> {
    const weatherList = await this.getAll();
    return weatherList.find((weather) => weather.id === id) || null;
  },
};

// Clear all data
export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
