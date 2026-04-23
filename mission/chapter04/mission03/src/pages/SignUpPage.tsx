import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { signUp } from "../apis/auth";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";

const step1Schema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력하세요")
    .email("이메일 형식이 아니에요"),
});

const step2Schema = z
  .object({
    password: z
      .string()
      .min(1, "비밀번호를 입력하세요")
      .min(8, "8자 이상 입력하세요")
      .max(19, "19자 이하로 입력하세요")
      .regex(/[!@#$%^&*]/, "특수문자를 포함해야 해요"),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력하세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

const step3Schema = z.object({
  name: z.string().min(1, "닉네임을 입력하세요"),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type Step3Values = z.infer<typeof step3Schema>;
type Step = 1 | 2 | 3;

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
);

const UserPlaceholderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Step 1: Email 입력하기
const Step1 = ({
  defaultEmail,
  onNext,
}: {
  defaultEmail: string;
  onNext: (email: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: defaultEmail },
    mode: "onBlur",
  });

  return (
    <form
      onSubmit={handleSubmit(({ email }) => onNext(email))}
      className="flex flex-col gap-5"
    >
      <FormField id="s1-email" label="이메일" error={errors.email?.message}>
        <input
          id="s1-email"
          type="text"
          placeholder="이메일을 입력하세요."
          className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-300 outline-none focus:border-neutral-400 transition-colors duration-200 w-full"
          {...register("email")}
        />
      </FormField>

      <SubmitButton disabled={!isValid} label="다음" />
    </form>
  );
};

// Step 2: Password 입력하기
const Step2 = ({
  email,
  onNext,
}: {
  email: string;
  onNext: (password: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    mode: "onBlur",
  });

  return (
    <form
      onSubmit={handleSubmit(({ password }) => onNext(password))}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-100 text-xs text-neutral-500 tracking-wide">
        <MailIcon />
        <span>{email}</span>
      </div>

      <FormField
        id="s2-password"
        label="비밀번호"
        error={errors.password?.message}
      >
        <PasswordInput
          id="s2-password"
          placeholder="비밀번호를 입력하세요."
          {...register("password")}
        />
      </FormField>

      <FormField
        id="s2-confirm"
        label="비밀번호 확인"
        error={errors.passwordConfirm?.message}
      >
        <PasswordInput
          id="s2-confirm"
          placeholder="비밀번호를 다시 입력하세요."
          {...register("passwordConfirm")}
        />
      </FormField>

      <SubmitButton disabled={!isValid} label="다음" />
    </form>
  );
};

// Step 3: Profile / Name 입력하기
const Step3 = ({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: (name: string) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    mode: "onBlur",
  });

  return (
    <form
      onSubmit={handleSubmit(({ name }) => onSubmit(name))}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-200 flex items-center justify-center text-neutral-300 bg-neutral-50 select-none">
          <UserPlaceholderIcon />
        </div>
        <p className="text-xs text-neutral-400 tracking-wide">
          프로필 사진 (선택)
        </p>
      </div>

      <FormField id="s3-name" label="닉네임" error={errors.name?.message}>
        <input
          id="s3-name"
          type="text"
          placeholder="닉네임을 입력하세요."
          className="border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-300 outline-none focus:border-neutral-400 transition-colors duration-200 w-full"
          {...register("name")}
        />
      </FormField>

      <SubmitButton
        disabled={!isValid}
        isSubmitting={isSubmitting}
        label="회원가입 완료"
        loadingLabel="가입 중..."
      />
    </form>
  );
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep1 = (value: string) => {
    setEmail(value);
    setStep(2);
  };

  const handleStep2 = (value: string) => {
    setPassword(value);
    setStep(3);
  };

  const handleStep3 = async (name: string) => {
    setIsSubmitting(true);
    try {
      await signUp({ name, email, password });
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm flex flex-col">
        <div className="relative flex items-center justify-center mb-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-0 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          )}
          <h2 className="text-2xl font-light tracking-[0.15em] text-neutral-800">
            회원가입
          </h2>
        </div>

        {step === 1 && <Step1 defaultEmail={email} onNext={handleStep1} />}
        {step === 2 && <Step2 email={email} onNext={handleStep2} />}
        {step === 3 && (
          <Step3 isSubmitting={isSubmitting} onSubmit={handleStep3} />
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
