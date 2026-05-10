import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getLps } from '../../apis/lpsApi';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonGrid } from '../../components/ui/SkeletonCard';
import type { LpDto, LpSortOrder } from '../../types/lp';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

type LpCardProps = {
  lp: LpDto;
  onClick: () => void;
};

function LpCard({ lp, onClick }: LpCardProps) {
  return (
    <div
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-md bg-neutral-800"
      onClick={onClick}
    >
      {lp.thumbnail ? (
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full bg-neutral-700" />
      )}

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="line-clamp-2 text-sm font-semibold text-white">{lp.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
          <span>{formatDate(lp.createdAt)}</span>
          <span className="flex items-center gap-0.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {lp.likes.length}
          </span>
        </div>
      </div>
    </div>
  );
}

function LpsPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<LpSortOrder>('desc');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['lps', sort],
    queryFn: () => getLps({ order: sort, limit: 50 }),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  const lps = data?.data ?? [];

  return (
    <div className="p-4">
      {/* 정렬 버튼 */}
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => setSort('asc')}
          className={[
            'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
            sort === 'asc'
              ? 'border-pink-500 bg-pink-500 text-white'
              : 'border-white/20 text-slate-300 hover:border-white/40',
          ].join(' ')}
        >
          오래된순
        </button>
        <button
          onClick={() => setSort('desc')}
          className={[
            'rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors',
            sort === 'desc'
              ? 'border-pink-500 bg-pink-500 text-white'
              : 'border-white/20 text-slate-300 hover:border-white/40',
          ].join(' ')}
        >
          최신순
        </button>
      </div>

      {isLoading && <SkeletonGrid count={20} />}

      {isError && (
        <ErrorState
          message="LP 목록을 불러오는 데 실패했습니다."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5">
          {lps.map((lp) => (
            <LpCard
              key={lp.id}
              lp={lp}
              onClick={() => navigate(`/lp/${lp.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LpsPage;
