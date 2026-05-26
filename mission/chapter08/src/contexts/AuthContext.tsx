import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AUTH_SESSION_INVALIDATED_EVENT,
  clearAuthTokens,
  getUserName,
  isAuthenticated,
  setAuthTokens,
  setUserName as storeUserName,
} from '../utils/authToken';

type AuthContextValue = {
  loggedIn: boolean;
  userName: string | null;
  login: (accessToken: string, refreshToken?: string | null, name?: string | null) => void;
  logout: () => void;
  updateUserName: (name: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [userName, setUserName] = useState(() => getUserName());

  const login = useCallback((accessToken: string, refreshToken?: string | null, name?: string | null) => {
    setAuthTokens(accessToken, refreshToken, name);
    setLoggedIn(true);
    setUserName(name ?? getUserName());
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
    setLoggedIn(false);
    setUserName(null);
  }, []);

  const updateUserName = useCallback((name: string) => {
    storeUserName(name);
    setUserName(name);
  }, []);

  useEffect(() => {
    const syncLoggedOut = () => {
      setLoggedIn(false);
      setUserName(null);
    };
    window.addEventListener(AUTH_SESSION_INVALIDATED_EVENT, syncLoggedOut);
    return () => window.removeEventListener(AUTH_SESSION_INVALIDATED_EVENT, syncLoggedOut);
  }, []);

  const value = useMemo(
    () => ({ loggedIn, userName, login, logout, updateUserName }),
    [loggedIn, userName, login, logout, updateUserName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  return ctx;
}
