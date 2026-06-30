import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

interface AuthContextValue {
  accessToken: string;
  userName: string;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState(() => {
    try { return JSON.parse(localStorage.getItem('accessToken') ?? '""') as string; }
    catch { return ''; }
  });
  const [userName, setUserName] = useState(() => {
    try { return JSON.parse(localStorage.getItem('userName') ?? '""') as string; }
    catch { return ''; }
  });

  // useCallback: login/logout이 매 렌더마다 새 참조로 생성되는 것을 방지
  const login = useCallback((token: string, refresh: string, name: string) => {
    localStorage.setItem('accessToken', JSON.stringify(token));
    localStorage.setItem('refreshToken', JSON.stringify(refresh));
    localStorage.setItem('userName', JSON.stringify(name));
    setAccessToken(token);
    setUserName(name);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    setAccessToken('');
    setUserName('');
  }, []);

  // useMemo: context value 객체가 매 렌더마다 새로 생성되는 것을 방지
  const value = useMemo<AuthContextValue>(
    () => ({ accessToken, userName, isLoggedIn: !!accessToken, login, logout }),
    [accessToken, userName, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
