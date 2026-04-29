import { useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import useForm from "../hooks/useForm"
import { validateSignIn, type UserSignIninformation } from "../utils/validate"
import { useNavigate } from "react-router-dom"

const LogInPage = () => {
    const {login, accessToken} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if(accessToken){
            navigate("/")
        }
    },[navigate, accessToken])
    const {values, errors, touched, getInputProps} = useForm<UserSignIninformation>({
        initialValue:{
            email:"",
            password:""
        },
        validate: validateSignIn,
    })
    const handleSubmit = async() => {
        await login(values)
    }

    const isdisabled = Object.values(errors || {}).some((error) => error.length > 0) || 
    Object.values(values).some((value) => value === "")!
    return (  
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <button
            onClick ={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-sm text-black-400 transition hover:text-white">
            ← 뒤로가기
            </button>
            <div className="flex flex-col gap-3">
                <input 
                {...getInputProps("email")}
                name="email"
                type="email" 
                placeholder="이메일"
                className = {`border border-[#ccc] w-[300px] p-[10px] focus:vorder-[#807bff] rounded-sm`}>
                </input>
                {errors?.email && touched?.email &&
                    <div className="text-red-500 text-sm">{errors.email}</div>}
                <input 
                {...getInputProps("password")}
                name="password"
                type="password" 
                placeholder="비밀번호"
                className = {`border border-[#ccc] w-[300px] p-[10px] focus:vorder-[#807bff] rounded-sm`}>
                </input>
                {errors?.password && touched?.password && 
                    <div className="text-red-500 text-sm">{errors.password}</div>}
                <button type="button" onClick={handleSubmit} disabled={isdisabled} 
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">
                    로그인
                </button>
            </div>
        </div>
    )
}
export default LogInPage