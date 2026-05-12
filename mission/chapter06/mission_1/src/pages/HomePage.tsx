import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLps from '../hooks/useLps';
import LpCard from '../components/LpCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const { data, isLoading, isError, refetch } = useLps(order);

  const lps = data?.data?.data ?? [];

  return (
    <div className="relative min-h-full p-6">
      {/* 정렬 버튼 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setOrder('desc')}
          className={`px-4 py-2 rounded-md text-sm transition-colors
            ${order === 'desc' ? 'bg-blue-400 text-white' : 'border border-gray-300 hover:bg-gray-100'}`}
        >
          최신순
        </button>
        <button
          onClick={() => setOrder('asc')}
          className={`px-4 py-2 rounded-md text-sm transition-colors
            ${order === 'asc' ? 'bg-blue-400 text-white' : 'border border-gray-300 hover:bg-gray-100'}`}
        >
          오래된순
        </button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* 에러 상태 */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* LP 목록 */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lps.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        </div>
      )}

      {/* 우측 하단 플로팅 버튼 */}
      <button
        onClick={() => navigate('/lp/create')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-400 text-white rounded-full text-2xl shadow-lg hover:bg-blue-500 transition-colors flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;