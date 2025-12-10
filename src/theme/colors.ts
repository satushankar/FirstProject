export const colors = {
  // Primary colors
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main primary
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Semantic colors
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#DC2626',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#2563EB',
  },

  // Mood colors
  mood: {
    happy: '#FCD34D',
    sad: '#60A5FA',
    anxious: '#F87171',
    excited: '#FB923C',
    calm: '#34D399',
    frustrated: '#EF4444',
    tired: '#A78BFA',
    loved: '#F472B6',
    neutral: '#9CA3AF',
    thoughtful: '#6366F1',
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorPalette = typeof colors;
