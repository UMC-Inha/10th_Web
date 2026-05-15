import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import AuthInput from '../../components/auth/AuthInput';
import { signin, signup } from '../../apis/authApi';
import { API_BASE_URL } from '../../apis/http';
import {
  signinFormSchema,
  signupFormSchema,
  type SigninFormValues,
  type SignupFormValues,
} from '../../schemas/authFormSchema';
import { useAuth } from '../../contexts/AuthContext';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const isSigninPage = location.pathname === '/auth/signin';
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const signinForm = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', bio: '', avatar: '' },
  });

  useEffect(() => {
    signinForm.reset();
    signupForm.reset();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 로그인 Mutation ──────────────────────────────────────
  const signinMutation = useMutation({
    mutationFn: (values: SigninFormValues) => signin(values),
    onSuccess: (result) => {
      if (!result.data) throw new Error('로그인 응답 데이터가 없습니다.');
      login(result.data.accessToken, result.data.refreshToken, result.data.name);
      navigate(from, { replace: true });
    },
  });

  // ── 회원가입 Mutation ─────────────────────────────────────
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
      navigate('/auth/signin', { replace: true });
    },
  });

  const handleSigninSubmit = signinForm.handleSubmit((values) => {
    signinMutation.mutate(values);
  });

  const handleSignupSubmit = signupForm.handleSubmit((values) => {
    signupMutation.mutate(values);
  });

  const handleGoogleSignin = () => {
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  const {
    register: registerSignin,
    formState: { errors: signinErrors },
  } = signinForm;

  const {
    register: registerSignup,
    formState: { errors: signupErrors },
  } = signupForm;

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center text-2xl font-extrabold text-pink-500">
          DOLIGO
        </Link>

        <div className="rounded-2xl bg-[#1e1e1e] p-6 shadow-xl border border-white/10">
          <h2 className="mb-1 text-xl font-bold text-white">{isSigninPage ? '로그인' : '회원가입'}</h2>
          <p className="mb-5 text-sm text-slate-500">
            {isSigninPage
              ? '서비스를 계속 이용하려면 로그인해 주세요.'
              : '간단한 정보 입력 후 바로 서비스를 시작할 수 있어요.'}
          </p>

          {/* 로그인 에러 */}
          {signinMutation.isError && (
            <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {signinMutation.error instanceof Error
                ? signinMutation.error.message
                : '로그인에 실패했습니다.'}
            </p>
          )}
          {/* 회원가입 에러 */}
          {signupMutation.isError && (
            <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {signupMutation.error instanceof Error
                ? signupMutation.error.message
                : '회원가입에 실패했습니다.'}
            </p>
          )}

          {isSigninPage ? (
            <form onSubmit={handleSigninSubmit} className="grid gap-3">
              <AuthInput
                id="signin-email"
                label="이메일"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                registration={registerSignin('email')}
                error={signinErrors.email?.message}
              />
              <AuthInput
                id="signin-password"
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                registration={registerSignin('password')}
                error={signinErrors.password?.message}
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
          ) : (
            <form onSubmit={handleSignupSubmit} className="grid gap-3">
              <AuthInput
                id="signup-name"
                label="이름"
                placeholder="이름을 입력하세요"
                autoComplete="name"
                registration={registerSignup('name')}
                error={signupErrors.name?.message}
              />
              <AuthInput
                id="signup-email"
                label="이메일"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                registration={registerSignup('email')}
                error={signupErrors.email?.message}
              />
              <AuthInput
                id="signup-password"
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력하세요"
                autoComplete="new-password"
                registration={registerSignup('password')}
                error={signupErrors.password?.message}
              />
              <AuthInput
                id="signup-bio"
                label="자기소개 (선택)"
                placeholder="자기소개를 입력하세요"
                registration={registerSignup('bio')}
                error={signupErrors.bio?.message}
              />
              <AuthInput
                id="signup-avatar"
                label="아바타 URL (선택)"
                type="url"
                placeholder="https://..."
                registration={registerSignup('avatar')}
                error={signupErrors.avatar?.message}
              />
              <button
                type="submit"
                className="h-11 rounded-xl bg-pink-500 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? '회원가입 중...' : '회원가입'}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-slate-500">
            {isSigninPage ? (
              <>
                계정이 없으신가요?{' '}
                <Link to="/auth/signup" className="text-pink-400 hover:underline">
                  회원가입
                </Link>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{' '}
                <Link to="/auth/signin" className="text-pink-400 hover:underline">
                  로그인
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
