import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { signin } from '../../apis/authApi';
import { API_BASE_URL } from '../../apis/http';
import { API_AUTH_PATHS } from '../../constants/paths';
import { useAuth } from '../../contexts/AuthContext';
import { signinFormSchema, type SigninFormValues } from '../../schemas/authFormSchema';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import AuthInput from './AuthInput';

type SigninFormProps = {
  redirectTo: string;
};

function SigninForm({ redirectTo }: SigninFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const signinMutation = useMutation({
    mutationFn: (values: SigninFormValues) => signin(values),
    onSuccess: (result) => {
      if (!result.data) throw new Error('로그인 응답 데이터가 없습니다.');
      login(result.data.accessToken, result.data.refreshToken, result.data.name);
      navigate(redirectTo, { replace: true });
    },
  });

  const handleGoogleSignin = () => {
    window.location.href = `${API_BASE_URL}${API_AUTH_PATHS.googleLogin}`;
  };

  return (
    <>
      {signinMutation.isError && (
        <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {getApiErrorMessage(signinMutation.error, '로그인에 실패했습니다.')}
        </p>
      )}

      <form onSubmit={handleSubmit((values) => signinMutation.mutate(values))} className="grid gap-3">
        <AuthInput
          id="signin-email"
          label="이메일"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          registration={register('email')}
          error={errors.email?.message}
        />
        <AuthInput
          id="signin-password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          registration={register('password')}
          error={errors.password?.message}
        />
        <button
          type="submit"
          className="h-11 rounded-xl bg-pink-500 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={signinMutation.isPending}
        >
          {signinMutation.isPending ? '로그인 중...' : '로그인'}
        </button>
        <button
          type="button"
          className="h-11 rounded-xl border border-white/20 bg-transparent text-sm font-semibold text-slate-300 transition hover:bg-white/10"
          onClick={handleGoogleSignin}
        >
          Google로 로그인
        </button>
      </form>
    </>
  );
}

export default SigninForm;
