import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProtected } from '../apis/authApi';

const HomePage = () => {
  const navigate = useNavigate();
  const [protectedMsg, setProtectedMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProtected().then(setProtectedMsg).catch(() => {});
  }, []);

  const handleTestProtected = async () => {
    try {
      const msg = await fetchProtected();
      setProtectedMsg(msg);
    } catch {
      setProtectedMsg('요청 실패');
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold text-white">어서오세요!</h1>
      <p className="text-white/40">원하는 카테고리를 선택해 영화를 탐색해보세요.</p>
      <button
        onClick={() => navigate('/popular')}
        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        인기 영화 보러가기
      </button>
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          onClick={handleTestProtected}
          className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
        >
          보호된 API 호출 테스트
        </button>
        {protectedMsg && (
          <p className="text-xs text-green-400">{protectedMsg}</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
