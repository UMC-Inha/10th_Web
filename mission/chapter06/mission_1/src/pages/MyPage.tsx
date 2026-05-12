import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="relative flex items-center justify-center py-4 border-b border-gray-200">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ＜
        </button>
        <h1 className="text-lg font-semibold">마이페이지</h1>
      </div>

      {/* 본문 */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        <div className="text-6xl">👤</div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold">{user?.nickname}</h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="px-6 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;