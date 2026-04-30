import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { signin, signup } from '../../apis/authApi';
import PageLayout from '../../layouts/PageLayout';
import { clearAuthTokens, setAccessToken, setRefreshToken } from '../../utils/authToken';
import type { SigninRequest, SignupRequest } from '../../types/auth';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSigninPage = location.pathname === '/auth/signin';
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [signinForm, setSigninForm] = useState<SigninRequest>({
    email: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState<SignupRequest>({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: '',
  });

  const handleSigninSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await signin(signinForm);
      if (!result.data) throw new Error('로그인 응답 데이터가 없습니다.');

      setAccessToken(result.data.accessToken);
      setRefreshToken(result.data.refreshToken);
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload: SignupRequest = {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
      };

      if (signupForm.bio?.trim()) payload.bio = signupForm.bio.trim();
      if (signupForm.avatar?.trim()) payload.avatar = signupForm.avatar.trim();

      await signup(payload);
      setSuccessMessage('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/auth/signin', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearToken = () => {
    clearAuthTokens();
  };

  return (
    <PageLayout
      title="인증 페이지"
      description="Swagger 스펙 기반 회원가입/로그인 API 연결 페이지"
    >
      <h2 style={{ marginTop: '16px' }}>{isSigninPage ? '로그인' : '회원가입'}</h2>

      {errorMessage ? <p style={{ color: '#d14343' }}>{errorMessage}</p> : null}
      {successMessage ? <p style={{ color: '#2f9e44' }}>{successMessage}</p> : null}

      {isSigninPage ? (
        <form onSubmit={handleSigninSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '360px' }}>
          <input
            type="email"
            placeholder="이메일"
            value={signinForm.email}
            onChange={(event) => setSigninForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={signinForm.password}
            onChange={(event) => setSigninForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
          <button type="button" onClick={handleClearToken}>
            저장된 토큰 삭제
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '420px' }}>
          <input
            type="text"
            placeholder="이름"
            value={signupForm.name}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="이메일"
            value={signupForm.email}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={signupForm.password}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="자기소개 (선택)"
            value={signupForm.bio ?? ''}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, bio: event.target.value }))}
          />
          <input
            type="url"
            placeholder="아바타 URL (선택)"
            value={signupForm.avatar ?? ''}
            onChange={(event) => setSignupForm((prev) => ({ ...prev, avatar: event.target.value }))}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '회원가입 중...' : '회원가입'}
          </button>
        </form>
      )}
    </PageLayout>
  );
}

export default AuthPage;
