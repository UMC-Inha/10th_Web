import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const GOOGLE_LOGIN_URL = "http://localhost:8000/v1/auth/google/login";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  async function onSubmit(data: LoginForm) {
    try {
      const res = await api.post("/v1/auth/signin", data);
      login(res.data.data.accessToken, res.data.data.refreshToken);
      navigate("/my");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ??
          "이메일 또는 비밀번호를 확인해주세요.")
        : "알 수 없는 오류가 발생했습니다.";
      setError("root", { message });
    }
  }

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-500 text-sm mt-1">계정에 로그인하세요</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "올바른 이메일 형식이 아닙니다.",
                  },
                })}
                className="w-full border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                })}
                className="w-full border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-lime-400 hover:bg-lime-500 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-3 text-sm transition-colors cursor-pointer shadow-sm mt-1"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>

        {/* Google 로그인 */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button
            onClick={() => {
              window.location.href = GOOGLE_LOGIN_URL;
            }}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl px-4 py-3 text-sm transition-colors cursor-pointer shadow-sm"
          >
            Google로 로그인
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-5">
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="text-lime-600 hover:text-lime-700 font-semibold transition-colors"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
