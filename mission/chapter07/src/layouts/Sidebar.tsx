import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { deleteMyAccount } from '../apis/usersApi';
import ConfirmModal from '../components/modals/ConfirmModal';
import { useAuth } from '../contexts/AuthContext';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);
  const { loggedIn, logout } = useAuth();
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const withdrawMutation = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      logout();
      onClose();
      navigate('/auth/signin', { replace: true });
    },
    onError: () => {
      // 탈퇴 실패 시에도 로컬 토큰 정리 후 로그인 페이지로 이동
      logout();
      onClose();
      navigate('/auth/signin', { replace: true });
    },
  });

  return (
    <>
      {/* 탈퇴 확인 모달 */}
      {showWithdrawConfirm && (
        <ConfirmModal
          message={`정말 탈퇴하시겠습니까?\n탈퇴 후에는 모든 데이터가 삭제됩니다.`}
          confirmLabel="예, 탈퇴합니다"
          cancelLabel="아니오"
          onConfirm={() => {
            setShowWithdrawConfirm(false);
            withdrawMutation.mutate();
          }}
          onCancel={() => setShowWithdrawConfirm(false)}
        />
      )}

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
              onClick={() => setShowWithdrawConfirm(true)}
              disabled={withdrawMutation.isPending}
              className="w-full text-left rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {withdrawMutation.isPending ? '탈퇴 처리 중...' : '탈퇴하기'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
