import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInfiniteLps from '../hooks/useInfiniteLps';
import LpCard from '../components/LpCard';
import LpCardSkeleton from '../components/LpCardSkeleton';

const HomePage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const bottomRef = useRef<HTMLDivElement>(null); // 맨 아래 감지용

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,   // 다음 페이지 불러오기
    hasNextPage,     // 다음 페이지 있는지
    isFetchingNextPage, // 다음 페이지 로딩 중인지
  } = useInfiniteLps(order);

  // 모든 페이지의 LP 합치기
  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  // 스크롤 감지 - 맨 아래 도달하면 다음 페이지 로드
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

      {/* 초기 로딩 - 상단 스켈레톤 */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <LpCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 에러 */}
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
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>

          {/* 하단 추가 로딩 스켈레톤 */}
          {isFetchingNextPage && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LpCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* 스크롤 감지 트리거 */}
          <div ref={bottomRef} className="h-10" />
        </>
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