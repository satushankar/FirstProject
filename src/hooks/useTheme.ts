import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store';
import { lightTheme, darkTheme, Theme } from '../theme';

export function useTheme(): Theme {
  const systemColorScheme = useColorScheme();
  const themeSetting = useSettingsStore((state) => state.theme);

  // Determine which theme to use
  let isDark = false;

  if (themeSetting === 'system') {
    isDark = systemColorScheme === 'dark';
  } else {
    isDark = themeSetting === 'dark';
  }

  return isDark ? darkTheme : lightTheme;
}

export function useIsDarkMode(): boolean {
  const systemColorScheme = useColorScheme();
  const themeSetting = useSettingsStore((state) => state.theme);

  if (themeSetting === 'system') {
    return systemColorScheme === 'dark';
  }

  return themeSetting === 'dark';
}
