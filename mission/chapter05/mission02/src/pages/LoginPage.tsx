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
                    className={`w-[300px] p-[10px] rounded-sm text-white font-bold transition-colors ${
                    isDisabled ? "bg-zinc-400 cursor-not-allowed" : "bg-[#807bff] hover:bg-[#6b65ff]"
                    }`}
                >
                    로그인
                </button>
            </form>
        </div>
    )
}

export default LoginPage;