import { colors } from './colors';
import { spacing, borderRadius } from './spacing';
import { typography, fontSizes, fontWeights } from './typography';

export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    divider: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
}

export const lightTheme: Theme = {
  colors: {
    primary: colors.primary[500],
    primaryLight: colors.primary[100],
    primaryDark: colors.primary[700],
    background: colors.white,
    surface: colors.neutral[50],
    surfaceVariant: colors.neutral[100],
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textTertiary: colors.neutral[400],
    border: colors.neutral[200],
    divider: colors.neutral[100],
    error: colors.error.main,
    success: colors.success.main,
    warning: colors.warning.main,
    info: colors.info.main,
  },
  spacing,
  borderRadius,
  typography,
};

export const darkTheme: Theme = {
  colors: {
    primary: colors.primary[400],
    primaryLight: colors.primary[900],
    primaryDark: colors.primary[300],
    background: colors.neutral[900],
    surface: colors.neutral[800],
    surfaceVariant: colors.neutral[700],
    text: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textTertiary: colors.neutral[500],
    border: colors.neutral[700],
    divider: colors.neutral[800],
    error: colors.error.light,
    success: colors.success.light,
    warning: colors.warning.light,
    info: colors.info.light,
  },
  spacing,
  borderRadius,
  typography,
};

export { colors, spacing, borderRadius, typography, fontSizes, fontWeights };
