import { Entry, EntryType, Mood, Location, Weather } from '../../types';
import { EntryStorage, MoodStorage, LocationStorage, WeatherStorage } from '../../database/storage';
import { generateId, getCurrentISODate } from '../../utils/helpers';

export interface CreateEntryInput {
  type: EntryType;
  title: string;
  content: string;
  mood?: Omit<Mood, 'id'>;
  location?: Omit<Location, 'id'>;
  weather?: Omit<Weather, 'id'>;
  tags?: string[];
  collectionId?: string;
  isPrivate?: boolean;
  entryDate?: string;
}

export interface UpdateEntryInput {
  title?: string;
  content?: string;
  mood?: Omit<Mood, 'id'>;
  location?: Omit<Location, 'id'>;
  weather?: Omit<Weather, 'id'>;
  tags?: string[];
  collectionId?: string;
  isPrivate?: boolean;
}

export const EntryService = {
  // Create a new entry
  async createEntry(input: CreateEntryInput): Promise<Entry> {
    const now = getCurrentISODate();
    const entryId = generateId();

    // Save mood if provided
    let moodId: string | undefined;
    if (input.mood) {
      moodId = generateId();
      await MoodStorage.save({ ...input.mood, id: moodId });
    }

    // Save location if provided
    let locationId: string | undefined;
    if (input.location) {
      locationId = generateId();
      await LocationStorage.save({ ...input.location, id: locationId });
    }

    // Save weather if provided
    let weatherId: string | undefined;
    if (input.weather) {
      weatherId = generateId();
      await WeatherStorage.save({ ...input.weather, id: weatherId });
    }

    const entry: Entry = {
      id: entryId,
      type: input.type,
      title: input.title,
      content: input.content,
      moodId,
      locationId,
      weatherId,
      collectionId: input.collectionId,
      isPrivate: input.isPrivate || false,
      entryDate: input.entryDate || now,
      createdAt: now,
      updatedAt: now,
      tags: input.tags || [],
      mediaIds: [],
    };

    await EntryStorage.save(entry);
    return entry;
  },

  // Update an existing entry
  async updateEntry(id: string, input: UpdateEntryInput): Promise<Entry | null> {
    const entry = await EntryStorage.getById(id);
    if (!entry) return null;

    const now = getCurrentISODate();

    // Update mood if provided
    let moodId = entry.moodId;
    if (input.mood) {
      moodId = generateId();
      await MoodStorage.save({ ...input.mood, id: moodId });
    }

    // Update location if provided
    let locationId = entry.locationId;
    if (input.location) {
      locationId = generateId();
      await LocationStorage.save({ ...input.location, id: locationId });
    }

    // Update weather if provided
    let weatherId = entry.weatherId;
    if (input.weather) {
      weatherId = generateId();
      await WeatherStorage.save({ ...input.weather, id: weatherId });
    }

    const updatedEntry: Entry = {
      ...entry,
      title: input.title ?? entry.title,
      content: input.content ?? entry.content,
      moodId,
      locationId,
      weatherId,
      collectionId: input.collectionId ?? entry.collectionId,
      isPrivate: input.isPrivate ?? entry.isPrivate,
      tags: input.tags ?? entry.tags,
      updatedAt: now,
    };

    await EntryStorage.save(updatedEntry);
    return updatedEntry;
  },

  // Delete an entry
  async deleteEntry(id: string): Promise<boolean> {
    try {
      await EntryStorage.delete(id);
      return true;
    } catch {
      return false;
    }
  },

  // Get all entries
  async getAllEntries(): Promise<Entry[]> {
    return EntryStorage.getAll();
  },

  // Get entry by ID
  async getEntryById(id: string): Promise<Entry | null> {
    return EntryStorage.getById(id);
  },

  // Get entries by date range
  async getEntriesByDateRange(startDate: string, endDate: string): Promise<Entry[]> {
    return EntryStorage.getByDateRange(startDate, endDate);
  },

  // Search entries
  async searchEntries(query: string): Promise<Entry[]> {
    return EntryStorage.search(query);
  },

  // Get entry with related data
  async getEntryWithDetails(id: string): Promise<{
    entry: Entry;
    mood: Mood | null;
    location: Location | null;
    weather: Weather | null;
  } | null> {
    const entry = await EntryStorage.getById(id);
    if (!entry) return null;

    const [mood, location, weather] = await Promise.all([
      entry.moodId ? MoodStorage.getById(entry.moodId) : null,
      entry.locationId ? LocationStorage.getById(entry.locationId) : null,
      entry.weatherId ? WeatherStorage.getById(entry.weatherId) : null,
    ]);

    return { entry, mood, location, weather };
  },

  // Get entries count by type
  async getEntriesCountByType(): Promise<Record<EntryType, number>> {
    const entries = await EntryStorage.getAll();
    const counts: Record<EntryType, number> = {
      daily: 0,
      weekly: 0,
      monthly: 0,
      story: 0,
      quick: 0,
    };

    entries.forEach((entry) => {
      counts[entry.type]++;
    });

    return counts;
  },

  // Get recent entries
  async getRecentEntries(limit: number = 10): Promise<Entry[]> {
    const entries = await EntryStorage.getAll();
    return entries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
};
