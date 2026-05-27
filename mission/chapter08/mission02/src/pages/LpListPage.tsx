// src/pages/LpListPage.tsx

import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList, type SortOrder } from '../apis/lp';
import LpCard from '../components/LpCard';
import LpPostModal from '../components/LpPostModal';
import { CardSkeletonGrid } from '../components/Skeleton';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useThrottle from '../hooks/useThrottle';

const LpListPage = () => {
  const [sort, setSort] = useState<SortOrder>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const {searchKeyword} = useOutletContext<{searchKeyword: string}>();
  
  const isSearchEnabled = searchKeyword.trim() === "" 
  ? true
  : searchKeyword.trim().length > 0;
  
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['lps', 'search', sort, searchKeyword],
    queryFn: ({ pageParam = 0 }) => getLpList(sort, pageParam as number, searchKeyword),
    
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasNext) return lastPage.data.nextCursor;
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: isSearchEnabled,
  });

  const throttledIsIntersecting = useThrottle(isIntersecting, 1000);

  // Intersection Observer로 무한스크롤 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIsIntersecting(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);
  const fetchNextPageRef = useRef(fetchNextPage);

  hasNextPageRef.current = hasNextPage;
  isFetchingNextPageRef.current = isFetchingNextPage;
  fetchNextPageRef.current = fetchNextPage;

  useEffect(()=> {
    if (throttledIsIntersecting && hasNextPageRef.current && !isFetchingNextPageRef.current) {
      console.log('[Throttle] 다음 페이지 무한 스크롤 요청');
      fetchNextPageRef.current();
    }
  }, [throttledIsIntersecting]);

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  const handleCreate = () => {
    if (!accessToken) {
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-zinc-400">데이터를 불러오는 데 실패했습니다.</p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-500 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );

  return (
    <div className="relative">
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => {setSort('asc'); window.scrollTo(0,0); }}
          className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
            sort === 'asc'
              ? 'bg-white text-black border-white font-semibold'
              : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => {setSort('desc'); window.scrollTo(0,0);}}
          className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
            sort === 'desc'
              ? 'bg-white text-black border-white font-semibold'
              : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
          }`}
        >
          최신순
        </button>
      </div>

      {/* 초기 로딩 - 상단 스켈레톤 */}
      {isLoading ? (
        <CardSkeletonGrid count={12} />
      ) : (
        <>
          {/* LP 그리드 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1">
            {lps.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>

          {/* 추가 로딩 - 하단 스켈레톤 */}
          {isFetchingNextPage && (
            <div className="mt-1">
              <CardSkeletonGrid count={5} />
            </div>
          )}

          {/* 무한스크롤 트리거 */}
          <div ref={bottomRef} className="h-4" />
        </>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={handleCreate}
        className="fixed bottom-8 right-8 w-14 h-14 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-500 transition-colors flex items-center justify-center text-2xl z-30"
        aria-label="LP 추가"
      >
        +
      </button>

      <LpPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LpListPage;