import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';

const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

type Theme = (typeof THEME)[keyof typeof THEME];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return THEME.LIGHT;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === THEME.LIGHT || stored === THEME.DARK) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME.DARK : THEME.LIGHT;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === THEME.DARK) {
      root.classList.add(THEME.DARK);
    } else {
      root.classList.remove(THEME.DARK);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme은 반드시 ThemeProvider 내부에서 사용해야 합니다');
  }
  return context;
};
