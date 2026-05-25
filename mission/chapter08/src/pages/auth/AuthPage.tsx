import { Link, useLocation } from 'react-router';
import SigninForm from '../../components/auth/SigninForm';
import SignupForm from '../../components/auth/SignupForm';
import { ROUTES } from '../../constants/paths';

function AuthPage() {
  const location = useLocation();
  const isSigninPage = location.pathname === ROUTES.authSignin;
  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.home;

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to={ROUTES.home} className="mb-8 block text-center text-2xl font-extrabold text-pink-500">
          DOLIGO
        </Link>

        <div key={location.pathname} className="rounded-2xl bg-[#1e1e1e] p-6 shadow-xl border border-white/10">
          <h2 className="mb-1 text-xl font-bold text-white">{isSigninPage ? '로그인' : '회원가입'}</h2>
          <p className="mb-5 text-sm text-slate-500">
            {isSigninPage
              ? '서비스를 계속 이용하려면 로그인해 주세요.'
              : '간단한 정보 입력 후 바로 서비스를 시작할 수 있어요.'}
          </p>

          {isSigninPage ? <SigninForm redirectTo={from} /> : <SignupForm />}

          <p className="mt-4 text-center text-sm text-slate-500">
            {isSigninPage ? (
              <>
                계정이 없으신가요?{' '}
                <Link to={ROUTES.authSignup} className="text-pink-400 hover:underline">
                  회원가입
                </Link>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{' '}
                <Link to={ROUTES.authSignin} className="text-pink-400 hover:underline">
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
