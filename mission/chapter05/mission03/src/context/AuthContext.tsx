// src/context/AuthContext.tsx

import toast from "react-hot-toast";
import { postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";
import { useNavigate } from "react-router-dom";
import { createContext, type PropsWithChildren, useContext, useState } from "react";

interface AuthContextType {
    // 로그인 상태관리
    accessToken: string|null;
    refreshToken: string|null;
    login:(signinData: RequestSigninDto) => Promise<void>;
    logout:() => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({children}:PropsWithChildren) => {
    const navigate = useNavigate();
    const{getItem : getAccessTokenFromStorage,
          setItem : setAccessTokenInStorage, 
          removeItem : removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const{getItem : getRefreshTokenFromStorage, 
          setItem : setRefreshTokenInStorage, 
          removeItem : removeRefreshTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    // accessToken 이 았으면 로그인 된 사용자 임을 구분하는 상태 코드
    const[accessToken, setAccessToken] = useState<string|null>(
    // 지연 초기화하는 이유? LocalStorage 값은 한번 값을 받으면 계속해서 리렌더링될 필요가 없음
    getAccessTokenFromStorage(), // 함수를 넣어줘야 지연 초기화가 됨
    );
    const[refreshToken, setRefreshToken] = useState<string|null>(
    getRefreshTokenFromStorage(),
    );

    const login = async(signinData : RequestSigninDto) => {
        try{
            const response = await postSignin(signinData);
            const data = response.data;

            console.log('응답 데이터 :', data)
            if(data){
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;
                
                // 받아온 값을 LocalStorage에 저장
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                // 리렌더링을 유발하지 않는 이상 값이 변경 되지 않음 -> setFn을 이용해서 값을 주입시켜줘야 함
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                toast.success("로그인 성공");
                //window.location.href="/my";
                navigate("/my");
            }
        } catch (error) {
            console.log("로그인 오류", error)
            toast.error("아이디나 비밀번호를 다시 확인해주세요");
        }
    };

    const logout = async() => {
        try {
            // 값은 안받아오고 실행만 시킴
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공")
            navigate("/"); // SPA 방식으로 새로고침없이 이동 가능
            //window.location.href = "/my"; //-> 기존 방식은 새로고침이 발생함
            //localStorage.clear()를 안하는 이유는? 다른 정보들을 localStorage에 담는다면 해당 정보도 다 사라짐~ 로그인 유무에 관계 없이
        } catch (error){
            console.log("로그아웃 오류", error);
            alert("로그아웃 실패")
        }
    };

    return (
        <AuthContext.Provider value={{login, logout, accessToken, refreshToken}}>
            {children}
        </AuthContext.Provider>
    );
};

// hook으로 만듦
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context;
}
