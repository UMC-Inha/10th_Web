import { createContext, useContext, useState } from "react";
import { signOut } from "../apis/auth";

type AuthContextType = {
  isLoggedIn: boolean;
  handleSignIn: () => void;
  handleSignOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken"), // boolean으로 저장
  );

  const handleSignIn = () => {
    setIsLoggedIn(true);
  };

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleSignIn, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 밖에서 사용했어요");
  return context;
};
