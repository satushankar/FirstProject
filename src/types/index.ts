// Entry Types
export type EntryType = 'daily' | 'weekly' | 'monthly' | 'story' | 'quick';

export interface Entry {
  id: string;
  type: EntryType;
  title: string;
  content: string;
  moodId?: string;
  locationId?: string;
  weatherId?: string;
  collectionId?: string;
  isPrivate: boolean;
  entryDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  tags: string[];
  mediaIds: string[];
}

// Media Types
export type MediaType = 'photo' | 'video' | 'audio' | 'drawing';

export interface Media {
  id: string;
  entryId: string;
  type: MediaType;
  filePath: string;
  thumbnailPath?: string;
  duration?: number; // For audio/video in seconds
  createdAt: string;
}

// Mood Types
export interface Mood {
  id: string;
  emoji: string;
  label: string;
  intensity: number; // 1-10
  notes?: string;
}

export const MOOD_OPTIONS: Omit<Mood, 'id' | 'notes'>[] = [
  { emoji: '😊', label: 'Happy', intensity: 8 },
  { emoji: '😢', label: 'Sad', intensity: 3 },
  { emoji: '😰', label: 'Anxious', intensity: 4 },
  { emoji: '🤩', label: 'Excited', intensity: 9 },
  { emoji: '😌', label: 'Calm', intensity: 6 },
  { emoji: '😤', label: 'Frustrated', intensity: 4 },
  { emoji: '😴', label: 'Tired', intensity: 3 },
  { emoji: '🥰', label: 'Loved', intensity: 9 },
  { emoji: '😐', label: 'Neutral', intensity: 5 },
  { emoji: '🤔', label: 'Thoughtful', intensity: 6 },
];

// Location Types
export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  placeName?: string;
  address?: string;
}

// Weather Types
export interface Weather {
  id: string;
  condition: string;
  temperature: number;
  humidity: number;
  icon: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// Collection Types
export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  createdAt: string;
}

// User Settings
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  enableBiometrics: boolean;
  enableReminders: boolean;
  reminderTime?: string; // HH:mm format
  autoLockTimeout: number; // in seconds
  enableCloudSync: boolean;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  isLocked: boolean;
  hasSetupPin: boolean;
  biometricsAvailable: boolean;
  biometricsEnabled: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Lock: undefined;
  SetupPin: undefined;
  Main: undefined;
  EntryDetail: { entryId: string };
  EntryEditor: { entryId?: string; type?: EntryType };
  CollectionDetail: { collectionId: string };
  Settings: undefined;
  MoodAnalytics: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Search: undefined;
  Profile: undefined;
};
