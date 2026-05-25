import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { signup } from '../../apis/authApi';
import { ROUTES } from '../../constants/paths';
import { signupFormSchema, type SignupFormValues } from '../../schemas/authFormSchema';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import AuthInput from './AuthInput';

function SignupForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', bio: '', avatar: '' },
  });

  const signupMutation = useMutation({
    mutationFn: (values: SignupFormValues) => {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        ...(values.bio?.trim() ? { bio: values.bio.trim() } : {}),
        ...(values.avatar?.trim() ? { avatar: values.avatar.trim() } : {}),
      };
      return signup(payload);
    },
    onSuccess: () => {
      navigate(ROUTES.authSignin, { replace: true });
    },
  });

  return (
    <>
      {signupMutation.isError && (
        <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {getApiErrorMessage(signupMutation.error, '회원가입에 실패했습니다.')}
        </p>
      )}

      <form onSubmit={handleSubmit((values) => signupMutation.mutate(values))} className="grid gap-3">
        <AuthInput
          id="signup-name"
          label="이름"
          placeholder="이름을 입력하세요"
          autoComplete="name"
          registration={register('name')}
          error={errors.name?.message}
        />
        <AuthInput
          id="signup-email"
          label="이메일"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          registration={register('email')}
          error={errors.email?.message}
        />
        <AuthInput
          id="signup-password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          autoComplete="new-password"
          registration={register('password')}
          error={errors.password?.message}
        />
        <AuthInput
          id="signup-bio"
          label="자기소개 (선택)"
          placeholder="자기소개를 입력하세요"
          registration={register('bio')}
          error={errors.bio?.message}
        />
        <AuthInput
          id="signup-avatar"
          label="아바타 URL (선택)"
          type="url"
          placeholder="https://..."
          registration={register('avatar')}
          error={errors.avatar?.message}
        />
        <button
          type="submit"
          className="h-11 rounded-xl bg-pink-500 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? '회원가입 중...' : '회원가입'}
        </button>
      </form>
    </>
  );
}

export default SignupForm;
