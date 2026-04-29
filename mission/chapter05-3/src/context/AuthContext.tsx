import { createContext, useState, type PropsWithChildren ,useContext} from "react";
import type { RequestSignIn } from "../types/authType";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, signin } from "../apis/auth";

interface AuthContextType{
    accessToken:string | null;
    refreshToken: string | null;
    login: (signInData: RequestSignIn) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext :React.Context<AuthContextType> = createContext<AuthContextType>({
    accessToken:null,
    refreshToken:null,
    login: async() => {},
    logout: async() => {},
})


export const AuthProvider = ({children}:PropsWithChildren) => {
    const {
        setItem:setAccessTokeninStorage,
        getItem:getAccessTokeninStorage,
        removeItem:removeAccessTokeninStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken)
    const {
        setItem:setRefreshTokeninStorage,
        getItem:getRefreshTokeninStorage,
        removeItem:removeRefreshTokeninStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken)

    const [accessToken, setAccessToken] = useState<string|null>(
        getAccessTokeninStorage(),
    )
    const [refreshToken, setRefreshToken] = useState<string|null>(
        getRefreshTokeninStorage(),
    )
    const login = async (signinData:RequestSignIn) => {
        console.log(signinData)
        try{
            const {data}  = await signin(signinData)
            if(data){
                const newAccessToken = data.accessToken
                const newRefreshToken = data.refreshToken

                setAccessTokeninStorage(newAccessToken)
                setRefreshTokeninStorage(newRefreshToken)

                setAccessToken(newAccessToken)
                setRefreshToken(newRefreshToken)
            }
            alert("로그인 성공")
            window.location.href = "/me"
        }catch(error){
            console.error("로그인 에러",error)
            alert("로그인에 실패")
        }
    }
    
    const logout = async () => {
        try {
            await postLogout()
            removeAccessTokeninStorage()
            removeRefreshTokeninStorage()
            setAccessToken(null)
            setRefreshToken(null)
        }
        catch(error){
            console.error("로그 아웃 에러",error)
            alert("로그아웃 실패")
        }
    }
    return (
        <AuthContext.Provider value={{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("AuthContext를 찾을 수 없습니다")
    }
    return context
}