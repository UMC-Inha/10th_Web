// src/pages/LoginPage.tsx

import { useForm } from "../hooks/useForm";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { type UserSigninInformation, validateSignin } from "../utils/validate";

const LoginPage = () => {
    const {login, accessToken} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if(accessToken){
            navigate("/");
        }
    },[navigate,accessToken]);

    const{values, errors,touched, getInputProps} =
        useForm<UserSigninInformation>({
            initialValue:{
                email:"",
                password:"",
            },
            validate: validateSignin,
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(values);
    };

    //구글 로그인
    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    };

    //오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
    const isDisabled = 
        Object.values(errors||{}).some((error)=>error.length>0)|| //오류가 있으면 true
        Object.values(values).some((value)=>value===""); //입력값이 비어있으면 True
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <h1 className="text-2xl font-bold mb-4">로그인</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    {...getInputProps("email")}
                    name="email"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.email && touched?.email? "border-red-500 bg-red-200":"border-gray-300"}`}
                    type={"email"}
                    placeholder={"이메일"}
                />
                {errors?.email&&touched?.email&&(
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input
                    {...getInputProps("password")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                        ${errors?.password&& touched?.password? "border-red-500 bg-red-200":"border-gray-300"}`}
                    type={"password"}
                    placeholder={"비밀번호"}
                />

                <button
                    type="submit"
                    disabled={isDisabled}
                    className={`w-[300px] h-[45px] flex items-center justify-center rounded-sm font-bold transition-colors border ${
                        isDisabled 
                            ? "bg-gray-100 text-black border-gray-200 cursor-not-allowed"
                            : "bg-white text-black border-gray-300 hover:bg-gray-50 active:bg-gray-100" 
                    }`}
                >
                    로그인
                </button>
                <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-[300px] h-[45px] flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
                    >
                        <img 
                            src="/images/google2.svg" 
                            alt="Google Logo" 
                            className="w-5 h-5 object-contain"
                        />
                        <span className="text-black font-bold">구글 로그인</span>
                    </button>
            </form>
        </div>
    )
}

export default LoginPage;