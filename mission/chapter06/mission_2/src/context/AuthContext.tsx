import { createContext, useContext, useState } from 'react';
import axiosInstance from '../api/axios';
interface User {
  email: string;
  nickname: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, accessToken: string, refreshToken: string) => void; // ✅ 토큰 파라미터 추가
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // login 함수에 토큰도 같이 저장
  const login = (userData: User, accessToken: string, refreshToken: string) => {
    // 유저 정보 저장
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // 토큰 저장
    // Access Token → 짧은 유효기간, API 요청할 때 사용
    localStorage.setItem('accessToken', accessToken);
    // Refresh Token → 긴 유효기간, Access Token 만료시 재발급용
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await axiosInstance.post('/auth/signout');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      // 서버 요청 성공/실패 상관없이 로컬은 항상 지워요
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider 밖에서 사용 불가!');
  return context;
};