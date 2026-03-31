import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

type TTheme = 'LIGHT' | 'DARK';

interface IThemeContext {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setThemeState] = useState<TTheme>('LIGHT');

  const setTheme = useCallback((newTheme: TTheme) => {
    setThemeState(newTheme);
  },[]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'LIGHT' ? 'DARK' : 'LIGHT'));
  },[]);

  const value = useMemo(()=>({
    theme, setTheme, toggleTheme
  }), [theme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};