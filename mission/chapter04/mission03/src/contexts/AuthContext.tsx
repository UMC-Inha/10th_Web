import { createContext, useContext } from "react";
import { signOut } from "../apis/auth";
import useLocalStorage from "../hooks/useLocalStorage";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  handleSignIn: (tokens: Tokens) => void;
  handleSignOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<string | null>("accessToken", null);
  const [, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>("refreshToken", null);

  const handleSignIn = ({ accessToken, refreshToken }: Tokens) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const handleSignOut = async () => {
    await signOut();
    removeAccessToken();
    removeRefreshToken();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!accessToken,
        handleSignIn,
        handleSignOut,
      }}
    >
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
