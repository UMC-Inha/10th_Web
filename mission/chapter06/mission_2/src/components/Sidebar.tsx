import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isStatic?: boolean; // 항상 보이는 모드
}

const Sidebar = ({ isOpen, onClose, isStatic = false }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');

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
          className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="text-sm bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500 transition-colors"
        >
          검색
        </button>
      </form>

      <hr />

      {/* 메뉴 */}
      <nav className="flex flex-col gap-3 flex-1">
        <button
          onClick={() => handleNavigate('/')}
          className="text-left text-gray-700 hover:text-blue-400 transition-colors text-sm font-medium"
        >
          🏠 홈
        </button>
        {user && (
          <button
            onClick={() => handleNavigate('/mypage')}
            className="text-left text-gray-700 hover:text-blue-400 transition-colors text-sm font-medium"
          >
            👤 마이페이지
          </button>
        )}
      </nav>

      {/* 하단 로그인/로그아웃 */}
      <div className="border-t pt-4">
        {user ? (
          <div className="flex flex-col gap-2">
            <span className="text-gray-600 text-sm">{user.nickname}님</span>
            <button
              onClick={() => {
                logout();
                if (!isStatic) onClose();
                navigate('/');
              }}
              className="text-left text-red-400 hover:text-red-600 text-sm"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavigate('/login')}
              className="text-left text-gray-700 hover:text-blue-400 text-sm"
            >
              로그인
            </button>
            <button
              onClick={() => handleNavigate('/signup')}
              className="text-left text-gray-700 hover:text-blue-400 text-sm"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // 항상 보이는 모드 (데스크탑)
  if (isStatic) {
    return <div className="h-full">{content}</div>;
  }

  // 모바일 모드
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold">메뉴</h2>
          <button onClick={onClose}>✕</button>
        </div>
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
