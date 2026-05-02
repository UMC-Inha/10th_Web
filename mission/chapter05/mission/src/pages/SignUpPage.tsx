import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>();

  async function onSubmit(data: SignUpForm) {
    try {
      await api.post("/v1/auth/signup", data);
      navigate("/login");
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "회원가입에 실패했습니다.")
        : "알 수 없는 오류가 발생했습니다.";
      setError("root", { message });
    }
  }

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">SignUp</h1>
          <p className="text-gray-500 text-sm mt-1">새 계정을 만드세요</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                placeholder="홍길동"
                {...register("name", {
                  required: "이름을 입력해주세요.",
                  minLength: {
                    value: 2,
                    message: "이름은 2자 이상이어야 합니다.",
                  },
                })}
                className="w-full border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition-all"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                  minLength: {
                    value: 8,
                    message: "비밀번호는 8자 이상이어야 합니다.",
                  },
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
              {isSubmitting ? "처리 중..." : "가입하기"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-5">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="text-lime-600 hover:text-lime-700 font-semibold transition-colors"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
