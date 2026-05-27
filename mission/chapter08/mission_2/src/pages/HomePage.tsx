import { useEffect, useRef, useState } from 'react';
import useInfiniteLps from '../hooks/useInfiniteLps';
import useDebounce from '../hooks/useDebounce';
import useThrottle from '../hooks/useThrottle';

import LpCard from '../components/LpCard';
import LpCardSkeleton from '../components/LpCardSkeleton';
import CreateLpModal from '../components/CreateLpModal';

const HomePage = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const bottomRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);

  const [scrollTrigger, setScrollTrigger] = useState(0);
  const throttledScrollTrigger = useThrottle(scrollTrigger, 1000);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLps(order, debouncedSearch);

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  useEffect(() => {
    if (isLoading || isError) return;
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('[Observer] 바닥 감지');
          setScrollTrigger((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [isLoading, isError]);

  useEffect(() => {
    if (throttledScrollTrigger > 0 && hasNextPage && !isFetchingNextPage) {
      console.log('[Throttle] 1초에 한 번만 다음 페이지 요청');
      fetchNextPage();
    }
  }, [throttledScrollTrigger, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="relative min-h-full p-6">
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="LP 검색..."
          className="w-full border border-gray-600 bg-transparent rounded-md px-4 py-2 text-sm outline-none focus:border-pink-400 text-white"
        />

        {search !== debouncedSearch && (
          <p className="text-xs text-gray-500 mt-1">입력 감지 중...</p>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setOrder('desc')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            order === 'desc'
              ? 'bg-pink-500 text-white'
              : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
          }`}
        >
          최신순
        </button>

        <button
          onClick={() => setOrder('asc')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            order === 'asc'
              ? 'bg-pink-500 text-white'
              : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
          }`}
        >
          오래된순
        </button>
      </div>

      {debouncedSearch && !isLoading && (
        <p className="text-sm text-gray-400 mb-4">
          "<span className="text-pink-400">{debouncedSearch}</span>" 검색 결과{' '}
          {lps.length === 0 ? '없음' : `${lps.length}건`}
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <LpCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>

          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {lps.length === 0 && debouncedSearch ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lps.map((lp) => (
                <LpCard key={lp.id} lp={lp} />
              ))}
            </div>
          )}

          {isFetchingNextPage && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <LpCardSkeleton key={i} />
              ))}
            </div>
          )}

          <div ref={bottomRef} className="h-20" />
        </>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 text-white rounded-full text-2xl shadow-lg hover:bg-pink-600 transition-colors flex items-center justify-center z-40"
      >
        +
      </button>

      {isModalOpen && <CreateLpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default HomePage;
