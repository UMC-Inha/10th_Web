import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { signout } from '../apis/authApi';
import { clearAuthTokens, isAuthenticated } from '../utils/authToken';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);
  const loggedIn = isAuthenticated();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleSignout = async () => {
    try {
      await signout();
    } catch {
      // 실패해도 토큰 정리
    } finally {
      clearAuthTokens();
      onClose();
      navigate('/', { replace: true });
      // 헤더 상태 강제 갱신을 위해 페이지 리로드
      window.location.reload();
    }
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={[
          'fixed top-0 left-0 z-30 h-full w-48 bg-[#1a1a1a] flex flex-col pt-16',
          'transition-transform duration-300',
          'lg:translate-x-0 lg:sticky lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <nav className="flex flex-col gap-1 p-4 flex-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            찾기
          </Link>
          <Link
            to="/users/me"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            마이페이지
          </Link>
        </nav>

        {loggedIn && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleSignout}
              className="w-full text-left rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/10 transition-colors"
            >
              탈퇴하기
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
