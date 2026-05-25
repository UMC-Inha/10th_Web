import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { signout } from '../apis/authApi';
import { ROUTES } from '../constants/paths';
import { useAuth } from '../contexts/AuthContext';

type HeaderProps = {
  onMenuClick: () => void;
};

function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { loggedIn, userName, logout } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: signout,
    onSettled: () => {
      logout();
      navigate(ROUTES.home, { replace: true });
    },
  });

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-[#111111] px-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1 text-slate-300 hover:bg-white/10 transition-colors lg:hidden"
          aria-label="메뉴 열기"
        >
          <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
          </svg>
        </button>

        <Link to={ROUTES.home} className="text-xl font-extrabold text-pink-500 tracking-tight">
          DOLIGO
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-md p-1 text-slate-400 hover:text-white transition-colors" aria-label="검색">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {loggedIn ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-300 sm:block">
              <span className="font-semibold text-white">{userName ?? '사용자'}</span>님 반갑습니다.
            </span>
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {logoutMutation.isPending ? '처리 중...' : '로그아웃'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.authSignin}
              className="rounded-md px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
            >
              로그인
            </Link>
            <Link
              to={ROUTES.authSignup}
              className="rounded-md bg-pink-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
