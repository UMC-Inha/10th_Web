// src/layouts/ProtectedLayout.tsx

import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

// 토큰이 없으면 로그인 페이지로 , 토큰이 있다면 접근 가능하게
const ProtectedLayout = () => {
    const{accessToken} = useAuth();

    if (!accessToken){
        //replace 사용해서 history에 남기기 않게 함
        return <Navigate to={"/login"}replace/>
    }
  return <Outlet/>
}

export default ProtectedLayout