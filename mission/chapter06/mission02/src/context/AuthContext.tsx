// src/context/AuthContext.tsx

import toast from "react-hot-toast";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { createContext, type PropsWithChildren, useContext, useState, useEffect } from "react";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  name: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  name: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { getItem: getAccessTokenFromStorage, setItem: setAccessTokenInStorage, removeItem: removeAccessTokenFromStorage } =
    useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { getItem: getRefreshTokenFromStorage, setItem: setRefreshTokenInStorage, removeItem: removeRefreshTokenFromStorage } =
    useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
  const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());
  const [name, setName] = useState<string | null>(null);

  // 로그인 상태면 내 정보 가져와서 닉네임 세팅
  useEffect(() => {
    if (accessToken) {
      getMyInfo()
        .then((res) => setName(res.data.name))
        .catch(() => setName(null));
    } else {
      setName(null);
    }
  }, [accessToken]);

  const login = async (signinData: RequestSigninDto) => {
    try {
      const response = await postSignin(signinData);
      const data = response.data;

      if (data) {
        setAccessTokenInStorage(data.accessToken);
        setRefreshTokenInStorage(data.refreshToken);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        toast.success("로그인 성공");

        // 로그인 전에 가려던 페이지가 있으면 그쪽으로, 없으면 홈으로
        const from = (location.state as { from?: string })?.from ?? "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log("로그인 오류", error);
      toast.error("아이디나 비밀번호를 다시 확인해주세요");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      setName(null);
      toast.success("로그아웃 성공");
      navigate("/");
    } catch (error) {
      console.log("로그아웃 오류", error);
      toast.error("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, accessToken, refreshToken, name }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};