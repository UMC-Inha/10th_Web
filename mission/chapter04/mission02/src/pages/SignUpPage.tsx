import { useNavigate } from "react-router";
import { signUp } from "../apis/auth";
import useForm from "../hooks/useForm";
import type { SignUpRequest } from "../types/auth";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { name: "", email: "", password: "" },
    mode: "onBlur",
  });

  // 회원가입 API 호출 후 로그인 페이지로 이동
  const handleSignUp = async (values: SignUpRequest) => {
    try {
      await signUp(values);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="w-full max-w-sm flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1 text-center mb-2">
          <h2 className="text-2xl font-light tracking-[0.15em] text-neutral-800">
            Sign Up
          </h2>
          <p className="text-xs text-neutral-400 tracking-widest">
            계정을 만들어보세요
          </p>
        </div>

        {/* 이름 */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-xs tracking-widest text-neutral-500 uppercase"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            placeholder="이름을 입력하세요."
            className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-300 outline-none focus:border-neutral-400 transition-colors duration-200"
            {...register("name", { required: "이름을 입력하세요" })}
          />
          {formState.errors.name && (
            <p className="text-xs text-rose-400 tracking-wide">
              {formState.errors.name}
            </p>
          )}
        </div>

        {/* 이메일 */}
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

        {/* 비밀번호 */}
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
          {formState.isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
