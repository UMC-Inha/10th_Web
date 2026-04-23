import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { login } from '../api/authApi';
import axios from 'axios';
import { useState } from 'react';

type LoginValues = {
  email: string;
  password: string;
};

const validate = (values: LoginValues): Partial<Record<keyof LoginValues, string>> => {
  const errors: Partial<Record<keyof LoginValues, string>> = {};

  // 이메일 유효성 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!emailRegex.test(values.email)) {
    errors.email = '유효하지 않은 이메일 형식입니다.';
  }

  // 비밀번호 유효성 검사
  if (!values.password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (values.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
  }

  return errors;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, isValid } = useForm<LoginValues>({
    initialValues: { email: '', password: '' },
    validate,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setIsLoading(true);
      setServerError(null);
      const data = await login(values);
      // 토큰 저장
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? '로그인에 실패했습니다.');
      } else {
        setServerError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center mb-10 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-white text-xl hover:text-pink-400 transition-colors w-8 h-8 flex items-center justify-center"
          >
            ‹
          </button>
          <h1 className="text-white text-lg font-semibold w-full text-center">로그인</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            className="w-full border border-zinc-600 text-white py-3 rounded-lg flex items-center justify-center gap-3 hover:border-zinc-400 transition-colors text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            구글 로그인
          </button>

          {/* OR 구분선 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-zinc-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요!"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
            {touched.email && errors.email && (
              <p className="text-red-400 text-xs pl-1">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1">
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요!"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
            {touched.password && errors.password && (
              <p className="text-red-400 text-xs pl-1">{errors.password}</p>
            )}
          </div>

          {/* 서버 에러 */}
          {serverError && (
            <p className="text-red-400 text-xs text-center">{serverError}</p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all
              disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed
              enabled:bg-pink-600 enabled:text-white enabled:hover:bg-pink-500"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;