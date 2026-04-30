import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import AuthInput from '../../components/auth/AuthInput';
import { signin, signout, signup } from '../../apis/authApi';
import { API_BASE_URL } from '../../apis/http';
import PageLayout from '../../layouts/PageLayout';
import {
  signinFormSchema,
  signupFormSchema,
  type SigninFormValues,
  type SignupFormValues,
} from '../../schemas/authFormSchema';
import { clearAuthTokens, setAuthTokens } from '../../utils/authToken';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSigninPage = location.pathname === '/auth/signin';
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const signinForm = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      avatar: '',
    },
  });

  const handleSigninSubmit = signinForm.handleSubmit(async (values) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await signin(values);
      if (!result.data) throw new Error('로그인 응답 데이터가 없습니다.');

      setAuthTokens(result.data.accessToken, result.data.refreshToken);
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    }
  });

  const handleSignupSubmit = signupForm.handleSubmit(async (values) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        ...(values.bio?.trim() ? { bio: values.bio.trim() } : {}),
        ...(values.avatar?.trim() ? { avatar: values.avatar.trim() } : {}),
      };

      await signup(payload);
      setSuccessMessage('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/auth/signin', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
    }
  });

  const handleSignout = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await signout();
      setSuccessMessage('로그아웃 되었습니다.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그아웃 요청에 실패했습니다.');
    } finally {
      // 서버 요청 실패 여부와 관계없이 프론트 보관 토큰은 정리
      clearAuthTokens();
    }
  };

  const handleGoogleSignin = () => {
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  const {
    register: registerSignin,
    formState: { errors: signinErrors, isSubmitting: isSigninSubmitting },
  } = signinForm;

  const {
    register: registerSignup,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
  } = signupForm;

  return (
    <PageLayout
      title="인증 페이지"
      description="Swagger 스펙 기반 회원가입/로그인 API 연결 페이지"
    >
      <section className="mt-5 w-full max-w-md">
        <h2 className="mb-1 text-2xl font-bold tracking-tight">{isSigninPage ? '로그인' : '회원가입'}</h2>
        <p className="mb-4 text-sm text-slate-500">
          {isSigninPage
            ? '서비스를 계속 이용하려면 로그인해 주세요.'
            : '간단한 정보 입력 후 바로 서비스를 시작할 수 있어요.'}
        </p>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          {errorMessage ? <p className="mb-3 text-sm text-red-600">{errorMessage}</p> : null}
          {successMessage ? <p className="mb-3 text-sm text-emerald-600">{successMessage}</p> : null}

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
                className="h-11 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSigninSubmitting}
              >
                {isSigninSubmitting ? '로그인 중...' : '로그인'}
              </button>
              <button
                type="button"
                className="h-11 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={handleGoogleSignin}
              >
                Google로 로그인
              </button>
              <button
                type="button"
                className="h-11 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={handleSignout}
              >
                로그아웃
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
                className="h-11 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSignupSubmitting}
              >
                {isSignupSubmitting ? '회원가입 중...' : '회원가입'}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

export default AuthPage;
