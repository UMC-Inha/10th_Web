import { useState, useCallback, useMemo, type PropsWithChildren } from "react";
import { THEME, ThemeContext, type TTheme } from "./ThemeContext";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  // useCallback으로 메모이제이션하여 컴포넌트가 리렌더링될 때마다 함수가 새로 생성되지 않도록 한다.
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT,
    );
  }, []);

  // useMemo으로 theme과 toggleTheme이 변경될 때만 새로운 객체가 생성되도록 하여,
  // Context value 객체가 매 렌더마다 새로 생성되어 불필요한 하위 컴포넌트 리렌더링이 발생하는 것을 방지한다.
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
