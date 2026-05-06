import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      {/* 로고 */}
      <div
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate('/')}
      >
        홈
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-2">
        {user ? (
          //로그인 된 상태
          <div className="flex items-center gap-3">
            <span
              className="text-gray-600 cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => navigate('/mypage')}
            >
              마이페이지
            </span>
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              로그아웃
            </Button>
          </div>
        ) : (
          // 로그인 안 된 상태
          <>
            <Button variant="secondary" onClick={() => navigate('/login')}>
              로그인
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-sm"
            >
              회원가입
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
