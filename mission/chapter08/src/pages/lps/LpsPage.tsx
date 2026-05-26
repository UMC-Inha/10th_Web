import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import LpList from '../../components/lps/LpList';
import LpSearchBar from '../../components/lps/LpSearchBar';
import ErrorState from '../../components/ui/ErrorState';
import SortToggle from '../../components/ui/SortToggle';
import { SkeletonGrid } from '../../components/ui/SkeletonCard';
import { SKELETON_LP_GRID_COUNT } from '../../constants/pagination';
import { ROUTES } from '../../constants/paths';
import useLpInfinite from '../../hooks/useLpInfinite';

function LpsPage() {
  const navigate = useNavigate();
  const {
    sort,
    setSort,
    search,
    setSearch,
    debouncedSearch,
    lps,
    isLoading,
    isError,
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    refetch,
  } = useLpInfinite();

  const handleCardClick = useCallback((id: number) => navigate(ROUTES.lpDetail(id)), [navigate]);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <LpSearchBar value={search} onChange={setSearch} />
        <SortToggle value={sort} onChange={setSort} size="md" />
      </div>

      {isLoading && <SkeletonGrid count={SKELETON_LP_GRID_COUNT} />}

      {isError && (
        <ErrorState message="LP 목록을 불러오는 데 실패했습니다." onRetry={() => refetch()} />
      )}

      {isSuccess && (
        <LpList
          lps={lps}
          debouncedSearch={debouncedSearch}
          onNavigate={handleCardClick}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
        />
      )}
    </div>
  );
}

export default LpsPage;
