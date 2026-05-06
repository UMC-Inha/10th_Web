import { createContext, type PropsWithChildren ,useContext, useEffect, useState} from "react";
import type { RequestSignIn } from "../types/authType";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, signin } from "../apis/auth";


interface AuthContextType{
    accessToken:string | null;
    refreshToken: string | null;
    login: (signInData: RequestSignIn) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean
}

export const AuthContext :React.Context<AuthContextType> = createContext<AuthContextType>({
    accessToken:null,
    refreshToken:null,
    login: async() => {},
    logout: async() => {},
    isLoading: true
})


export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { 
        value: accessToken, 
        setItem: setAccessToken, 
        removeItem: removeAccessToken,
        getItem: getAccessToken
    } = useLocalStorage<string>(LOCAL_STORAGE_KEY.accessToken);
    
    useEffect(
        () => {
            const token = getAccessToken()
            if(token){
                setAccessToken(token)
            }
            setIsLoading(false)
        },[])

    const { 
        value: refreshToken, 
        setItem: setRefreshToken, 
        removeItem: removeRefreshToken 
    } = useLocalStorage<string>(LOCAL_STORAGE_KEY.refreshToken);

    const login = async (signinData: RequestSignIn) => {
        try {
            const { data } = await signin(signinData);
            if (data) {
                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);
            }
            alert("로그인 성공");
        } catch (error) {
            console.error("로그인 에러", error);
            alert("로그인에 실패");
        }
    };

    const logout = async () => {
        try {
            await postLogout();
            removeAccessToken();
            removeRefreshToken();
        } catch (error) {
            console.error("로그 아웃 에러", error);
            alert("로그아웃 실패");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("AuthContext를 찾을 수 없습니다")
    }
    return context
}