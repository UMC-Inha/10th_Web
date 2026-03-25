import { createContext, useContext, useState, type PropsWithChildren } from 'react';

type theme {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
}

type TTheme = 'LIGHT' | 'DARK';

interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({children}: PropsWithChildren) => {
  const [theme, setTheme] = useState<TTheme>('LIGHT');

  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === 'LIGHT' ? 'DARK' : 'LIGHT'
    ); 
  }
  return{
    <ThemeContext.Provider value = {{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  }
}

export const useTheme=() => {
  const context = useContext(ThemeContext);
  if(!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}