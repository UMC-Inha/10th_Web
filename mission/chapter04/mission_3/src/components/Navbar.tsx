import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';

const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useLocalStorage<{ email: string; nickname: string } | null>(
    'user',
    null,
  );

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
            <span className="text-gray-600">{user.nickname}님 안녕하세요!</span>
            <button
              onClick={() => {
                localStorage.removeItem('user'); // 로컬스토리지에서 user 삭제
                navigate('/');
                window.location.reload(); // 페이지 새로고침해서 상태 반영
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : (
          // 로그인 안 된 상태
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
