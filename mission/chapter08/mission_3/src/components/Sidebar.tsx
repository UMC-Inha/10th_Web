import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { deleteMyAccount } from '../api/user';
import DeleteConfirmModal from './DeleteConfirmModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isStatic?: boolean;
}

const Sidebar = ({ isOpen, onClose, isStatic = false }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      if (!isStatic) onClose();
      navigate('/');
    },
  });

  const { mutate: deleteAccountMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: () => {
      alert('회원 탈퇴에 실패했습니다.');
    },
  });

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isStatic) onClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${search}`);
      if (!isStatic) onClose();
    }
  };

  const content = (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* 검색창 */}
      <form onSubmit={handleSearch} className="flex flex-col gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색..."
          className="border border-gray-600 bg-transparent rounded-md px-3 py-2 text-sm outline-none focus:border-pink-400 text-white"
        />
        <button
          type="submit"
          className="text-sm bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-colors"
        >
          검색
        </button>
      </form>

      <hr className="border-gray-700" />

      {/* 메뉴 */}
      <nav className="flex flex-col gap-3 flex-1">
        <button
          onClick={() => handleNavigate('/')}
          className="text-left text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium"
        >
          홈
        </button>
        {user && (
          <button
            onClick={() => handleNavigate('/mypage')}
            className="text-left text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium"
          >
            마이페이지
          </button>
        )}
      </nav>

      {/* 하단 로그인/로그아웃 */}
      <div className="border-t border-gray-700 pt-4">
        {user ? (
          <div className="flex flex-col gap-2">
            <span className="text-gray-400 text-sm">{user.nickname}님</span>
            <button
              onClick={() => logoutMutate()}
              className="text-left text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              로그아웃
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-left text-gray-500 hover:text-red-400 text-sm transition-colors"
            >
              탈퇴하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavigate('/login')}
              className="text-left text-gray-400 hover:text-pink-400 text-sm transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => handleNavigate('/signup')}
              className="text-left text-gray-400 hover:text-pink-400 text-sm transition-colors"
            >
              회원가입
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={() => deleteAccountMutate()}
          onCancel={() => setShowDeleteModal(false)}
          isPending={isDeleting}
        />
      )}
    </div>
  );

  // 데스크탑 정적 사이드바
  if (isStatic) {
    return <div className="h-full">{content}</div>;
  }

  // 모바일 드로어 사이드바
  return (
    <>
      {/* 배경 오버레이 - opacity 트랜지션으로 fade in/out */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* 사이드바 패널 - translate-x 트랜지션으로 슬라이드 in/out */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] z-50 shadow-lg
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="font-bold text-white">메뉴</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
