import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      {/* 버거 버튼 - 모바일에서만 보임 */}
      <button className="md:hidden" onClick={onMenuClick}>
        <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
        </svg>
      </button>

      {/* 로고 */}
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate('/')}
      >
        🎵 LP판
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-2">
        {user ? (
          <div className="flex items-center gap-3">
            <span
              className="text-gray-600 cursor-pointer hover:text-blue-400 transition-colors text-sm"
              onClick={() => navigate('/mypage')}
            >
              {user.nickname}님 반갑습니다!
            </span>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-sm bg-blue-300 text-white rounded-md hover:bg-blue-500 transition-colors"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;