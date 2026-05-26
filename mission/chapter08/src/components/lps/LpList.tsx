import type { LpDto } from '../../types/lp';
import { SKELETON_LP_FETCH_MORE_COUNT } from '../../constants/pagination';
import { SkeletonGrid } from '../ui/SkeletonCard';
import LpCard from './LpCard';

type LpListProps = {
  lps: LpDto[];
  debouncedSearch: string;
  onNavigate: (id: number) => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
};

function LpList({
  lps,
  debouncedSearch,
  onNavigate,
  isFetchingNextPage,
  hasNextPage,
}: LpListProps) {
  if (lps.length === 0) {
    return (
      <p className="mt-20 text-center text-sm text-slate-500">
        {debouncedSearch
          ? `"${debouncedSearch}"에 대한 검색 결과가 없습니다.`
          : 'LP가 없습니다.'}
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5">
        {lps.map((lp) => (
          <LpCard key={lp.id} lp={lp} onNavigate={onNavigate} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="mt-1">
          <SkeletonGrid count={SKELETON_LP_FETCH_MORE_COUNT} />
        </div>
      )}

      {!hasNextPage && (
        <p className="mt-6 text-center text-xs text-slate-600">모든 LP를 불러왔습니다.</p>
      )}
    </>
  );
}

export default LpList;
