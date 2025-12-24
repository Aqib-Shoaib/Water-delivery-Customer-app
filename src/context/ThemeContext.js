import { createContext, useContext, useMemo, useState } from 'react';
import { DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

const ThemeContext = createContext(null);

export const PALETTE = {
  ocean: {
    primary: '#0ea5e9', // Sky 500
    primaryDark: '#0284c7', // Sky 600
    base: '#f0f9ff', // Sky 50
    surface: '#ffffff',
    text: '#0f172a', // Slate 900
    textSecondary: '#475569', // Slate 600
    border: '#e2e8f0', // Slate 200
    success: '#10b981',
    error: '#ef4444',
  },
  midnight: {
    primary: '#38bdf8', // Sky 400
    primaryDark: '#0ea5e9', // Sky 500
    base: '#0f172a', // Slate 900
    surface: '#1e293b', // Slate 800
    text: '#f8fafc', // Slate 50
    textSecondary: '#94a3b8', // Slate 400
    border: '#334155', // Slate 700
    success: '#34d399',
    error: '#f87171',
  }
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light'); // 'light' | 'dark'

  const OceanTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: PALETTE.ocean.primary,
      background: PALETTE.ocean.base,
      card: PALETTE.ocean.surface,
      text: PALETTE.ocean.text,
      border: PALETTE.ocean.border,
      notification: PALETTE.ocean.success,
      // Custom
      textSecondary: PALETTE.ocean.textSecondary,
      surface: PALETTE.ocean.surface,
      error: PALETTE.ocean.error,
    },
  };

  const MidnightTheme = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary: PALETTE.midnight.primary,
      background: PALETTE.midnight.base,
      card: PALETTE.midnight.surface,
      text: PALETTE.midnight.text,
      border: PALETTE.midnight.border,
      notification: PALETTE.midnight.success,
      // Custom
      textSecondary: PALETTE.midnight.textSecondary,
      surface: PALETTE.midnight.surface,
      error: PALETTE.midnight.error,
    },
  };

  const theme = mode === 'dark' ? MidnightTheme : OceanTheme;

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  const value = useMemo(() => ({ mode, theme, toggle }), [mode, theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
