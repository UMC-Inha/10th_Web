import { useNavigate } from "react-router";
import { signIn } from "../apis/auth";
import useForm from "../hooks/useForm";
import type { SignInRequest } from "../types/auth";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleSignIn } = useAuth();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  // 로그인 API 호출 후 토큰 저장 및 홈으로 이동
  const handleLogin = async (values: SignInRequest) => {
    try {
      const response = await signIn(values);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      handleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full max-w-sm flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1 text-center mb-2">
          <h2 className="text-2xl font-light tracking-[0.15em] text-neutral-800">
            Login
          </h2>
          <p className="text-xs text-neutral-400 tracking-widest">
            계속하려면 로그인하세요
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs tracking-widest text-neutral-500 uppercase"
          >
            이메일
          </label>
          <input
            id="email"
            type="text"
            placeholder="이메일을 입력하세요."
            className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-300 outline-none focus:border-neutral-400 transition-colors duration-200"
            {...register("email", {
              required: "이메일을 입력하세요",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "이메일 형식이 아니에요",
              },
            })}
          />
          {formState.errors.email && (
            <p className="text-xs text-rose-400 tracking-wide">
              {formState.errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs tracking-widest text-neutral-500 uppercase"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요."
            className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-300 outline-none focus:border-neutral-400 transition-colors duration-200"
            {...register("password", {
              required: "비밀번호를 입력하세요",
              minLength: { value: 8, message: "8자 이상 입력하세요" },
              maxLength: { value: 19, message: "19자 이하로 입력하세요" },
              pattern: {
                value: /^(?=.*[!@#$%^&*])/,
                message: "특수문자를 포함해야 해요",
              },
            })}
          />
          {formState.errors.password && (
            <p className="text-xs text-rose-400 tracking-wide">
              {formState.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!formState.isValid || formState.isSubmitting}
          className="mt-2 bg-neutral-800 text-white text-xs tracking-[0.2em] uppercase py-3 hover:bg-neutral-600 transition-colors duration-300 disabled:bg-neutral-300 disabled:cursor-not-allowed"
        >
          {formState.isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
