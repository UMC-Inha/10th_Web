import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { signIn } from "../apis/auth";
import { useAuth } from "../contexts/AuthContext";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .email("이메일 형식이 아니에요"),
  password: z
    .string()
    .min(1, "비밀번호를 입력하세요")
    .min(8, "8자 이상 입력하세요")
    .max(19, "19자 이하로 입력하세요")
    .regex(/[!@#$%^&*]/, "특수문자를 포함해야 해요"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleSignIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await signIn({
        email: values.email,
        password: values.password,
      });
      handleSignIn({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
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

        <FormField id="email" label="이메일" error={errors.email?.message}>
          <input
            id="email"
            type="text"
            placeholder="이메일을 입력하세요."
            className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-300 outline-none focus:border-neutral-400 transition-colors duration-200"
            {...register("email")}
          />
        </FormField>

        <FormField
          id="password"
          label="비밀번호"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            placeholder="비밀번호를 입력하세요."
            {...register("password")}
          />
        </FormField>

        <SubmitButton
          disabled={!isValid}
          isSubmitting={isSubmitting}
          label="로그인"
          loadingLabel="로그인 중..."
        />
      </form>
    </div>
  );
};

export default LoginPage;
