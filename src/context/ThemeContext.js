import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { DARK_COLORS, LIGHT_COLORS } from '../constants';

const ThemeContext = createContext({ colors: DARK_COLORS, isDark: true });

export function ThemeProvider({ children }) {
  const scheme = useColorScheme();
  const value = useMemo(() => {
    const isDark = scheme !== 'light';
    return { colors: isDark ? DARK_COLORS : LIGHT_COLORS, isDark };
  }, [scheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext).colors;
}

export function useIsDark() {
  return useContext(ThemeContext).isDark;
}
