// src/components/Navbar.tsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { accessToken, name, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-4 gap-4">
      <button
        onClick={onMenuClick}
        className="text-white hover:text-pink-400 transition-colors"
        aria-label="메뉴 열기"
      >
        <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
        </svg>
      </button>

      <Link to="/" className="text-pink-500 font-black text-lg tracking-tight">
        돌려돌려LP판
      </Link>

      <div className="ml-auto flex items-center gap-4">
        <button className="text-zinc-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {accessToken ? (
          <>
            <span className="text-sm text-zinc-300 hidden sm:block">
              {name ? `${name}님 반갑습니다.` : '환영합니다!'}
            </span>
            <button
              onClick={logout}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-zinc-300 hover:text-white transition-colors">
              로그인
            </Link>
            <Link to="/signup" className="px-3 py-1.5 text-sm text-white bg-pink-600 rounded-lg hover:bg-pink-500 transition-colors font-semibold">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;