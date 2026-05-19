import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { clearAuthTokens, getUserName, isAuthenticated, setAuthTokens, setUserName as storeUserName } from '../utils/authToken';

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
    setUserName(name ?? null);
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
    setLoggedIn(false);
    setUserName(null);
  }, []);

  // 낙관적 업데이트 및 서버 응답 반영에 사용
  const updateUserName = useCallback((name: string) => {
    storeUserName(name);
    setUserName(name);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, userName, login, logout, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  return ctx;
}
