import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken"),
  );

  function login(newAccessToken: string, newRefreshToken: string) {
    // localStorage: 새로고침 후에도 로그인 상태 유지
    // state: 컴포넌트 리렌더링 트리거 (ProtectedRoute가 즉시 반응)
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setAccessToken(newAccessToken);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // null로 설정하면 ProtectedRoute가 리렌더링되어 /login으로 자동 리다이렉트
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
