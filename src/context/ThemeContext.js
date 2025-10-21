import { createContext, useContext, useMemo, useState } from 'react';
import { DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light'); // 'light' | 'dark'

  const RedLight = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#dc2626',
      notification: '#dc2626',
    },
  };

  const RedDark = {
    ...NavigationDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      primary: '#f87171',
      notification: '#f87171',
    },
  };

  const theme = mode === 'dark' ? RedDark : RedLight;

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  const value = useMemo(() => ({ mode, theme, toggle }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
