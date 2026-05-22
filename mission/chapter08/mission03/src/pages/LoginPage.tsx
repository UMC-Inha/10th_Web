// src/pages/LoginPage.tsx

import { useForm } from "../hooks/useForm";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { type UserSigninInformation, validateSignin } from "../utils/validate";

const LoginPage = () => {
    const { login, accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken) {
            navigate("/");
        }
    }, [navigate, accessToken]);

    const { values, errors, touched, getInputProps } =
        useForm<UserSigninInformation>({
            initialValue: {
                email: "",
                password: "",
            },
            validate: validateSignin,
        });

    const loginMutation = useMutation({
        mutationFn: () => login(values),
        onSuccess: () => {
            navigate("/");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loginMutation.isPending) return;
        loginMutation.mutate();
    };

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    };

    const isDisabled =
        Object.values(errors || {}).some((error) => error.length > 0) ||
        Object.values(values).some((value) => value === "") ||
        loginMutation.isPending;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/95 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
                <h1 className="mb-6 text-3xl font-bold text-white text-center">로그인</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <input
                            {...getInputProps("email")}
                            name="email"
                            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 ${
                                errors?.email && touched?.email ? "border-red-500 bg-red-950" : "border-zinc-700 bg-zinc-900"
                            }`}
                            type="email"
                            placeholder="이메일"
                        />
                        {errors?.email && touched?.email && (
                            <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <input
                            {...getInputProps("password")}
                            className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 ${
                                errors?.password && touched?.password ? "border-red-500 bg-red-950" : "border-zinc-700 bg-zinc-900"
                            }`}
                            type="password"
                            placeholder="비밀번호"
                        />
                        {errors?.password && touched?.password && (
                            <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            isDisabled
                                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                                : "bg-pink-500 text-white hover:bg-pink-400"
                        }`}
                    >
                        {loginMutation.isPending ? "로그인 중..." : "로그인"}
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-pink-500 hover:bg-zinc-800 flex items-center justify-center gap-3"
                    >
                        <img
                            src="/images/google2.svg"
                            alt="Google Logo"
                            className="w-5 h-5 object-contain"
                        />
                        구글 로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
