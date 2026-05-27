import { createContext, useContext, useState } from 'react';
import axiosInstance from '../api/axios';

interface User {
  id: number;
  email: string;
  nickname: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateNickname: (nickname: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');

      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('유저 정보 파싱 실패:', error);

      localStorage.removeItem('user');

      return null;
    }
  });

  const login = (
    userData: User,
    accessToken: string,
    refreshToken: string
  ) => {
    setUser(userData);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/signout');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setUser(null);

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  // 닉네임만 즉시 업데이트
  const updateNickname = (nickname: string) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        nickname,
      };

      localStorage.setItem('user', JSON.stringify(updated));

      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateNickname,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthProvider 밖에서 사용 불가!');
  }

  return context;
};