import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { clearAuthTokens, getUserName, isAuthenticated, setAuthTokens } from '../utils/authToken';

type AuthContextValue = {
  loggedIn: boolean;
  userName: string | null;
  login: (accessToken: string, refreshToken?: string | null, name?: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [userName, setUserName] = useState(() => getUserName());

  const login = useCallback((accessToken: string, refreshToken?: string | null, name?: string | null) => {
    setAuthTokens(accessToken, refreshToken, name);
    setLoggedIn(true);
    setUserName(name ?? null);
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
    setLoggedIn(false);
    setUserName(null);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  return ctx;
}
