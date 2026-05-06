import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

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
    </div>
  );
};

export default HomePage;
