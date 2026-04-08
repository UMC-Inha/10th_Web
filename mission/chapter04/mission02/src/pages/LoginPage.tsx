import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import { signin } from '../apis/authApi';

const validationRules = {
  email: (value: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return '유효하지 않은 이메일 형식입니다.';
    return null;
  },
  password: (value: string) => {
    if (value.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.';
    return null;
  },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, isValid } =
    useForm({ email: '', password: '' }, validationRules);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await signin(values);
      localStorage.setItem('accessToken', res.accessToken);
      navigate('/');
    } catch {
      setServerError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <div className="hidden w-1/2 flex-col items-center justify-center bg-indigo-950 lg:flex">
        <div className="text-center">
          <div className="mb-4 text-6xl">🎬</div>
          <h2 className="text-3xl font-bold text-white">MovieApp</h2>
          <p className="mt-2 text-indigo-300">당신만의 영화 공간</p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            ← 뒤로가기
          </button>

          <h1 className="mb-1 text-2xl font-bold text-white">로그인</h1>
          <p className="mb-8 text-sm text-white/40">계정에 로그인해 주세요.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">
                이메일
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {touched.email && errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/60">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="6자 이상 입력해 주세요"
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {touched.password && errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {serverError && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-center text-xs text-red-400">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
