import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../api/lpApi';
import { useDebounce } from '../hooks/useDebounce';
import { useSearchLps } from '../hooks/useSearchLps';
import type { SortOrder } from '../types/lp';
import LpCard from '../components/LpCard';
import { LpCardSkeleton, ErrorState } from '../components/Skeleton';
import CreateLpModal from '../components/CreateLpModal';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [sort, setSort] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();

  const debouncedQuery = useDebounce(searchQuery, 300);
  const isSearching = debouncedQuery.trim() !== '';

  const allLpsQuery = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }) => getLps(sort, pageParam as number, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  const searchQuery_ = useSearchLps(debouncedQuery, sort);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = isSearching ? searchQuery_ : allLpsQuery;

  const lps = data?.pages.flatMap((page) => page.data) ?? [];

  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  return (
    <div className="p-6 pb-20 relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">LP 목록</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSort('desc')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              sort === 'desc'
                ? 'bg-[#ff2d78] text-white'
                : 'bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort('asc')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              sort === 'asc'
                ? 'bg-[#ff2d78] text-white'
                : 'bg-[#1a1a1a] text-[#888] border border-[#333] hover:border-[#555]'
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="LP 검색..."
          className="w-full py-2.5 px-4 pl-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#ff2d78] transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          {Array.from({ length: 8 }).map((_, i) => <LpCardSkeleton key={i} />)}
        </div>
      )}

      {isError && <ErrorState message="LP 목록을 불러오지 못했어요." onRetry={refetch} />}

      {!isLoading && !isError && (
        <>
          {isSearching && (
            <p className="text-xs text-[#666] mb-3">
              "{debouncedQuery}" 검색 결과 {lps.length}개
            </p>
          )}

          {lps.length === 0 ? (
            <p className="text-center text-[#555] py-20">
              {isSearching ? '검색 결과가 없습니다.' : 'LP가 없습니다.'}
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
              {lps.map((lp) => <LpCard key={lp.id} lp={lp} />)}
            </div>
          )}

          {isFetchingNextPage && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mt-5">
              {Array.from({ length: 4 }).map((_, i) => <LpCardSkeleton key={i} />)}
            </div>
          )}

          <div ref={sentinelRef} className="h-10" />

          {!hasNextPage && lps.length > 0 && (
            <p className="text-center text-[#555] text-sm py-4">모든 LP를 불러왔습니다.</p>
          )}
        </>
      )}

      {isLoggedIn && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#ff2d78] text-white text-2xl flex items-center justify-center shadow-lg hover:bg-[#e0266a] transition-colors cursor-pointer z-20 border-none"
          aria-label="LP 추가"
        >
          +
        </button>
      )}

      {isModalOpen && <CreateLpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
