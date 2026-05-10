import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import { deleteLp, getLpById, toggleLike } from '../../apis/lpsApi';
import LoginModal from '../../components/modals/LoginModal';
import ErrorState from '../../components/ui/ErrorState';
import { isAuthenticated } from '../../utils/authToken';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const loggedIn = isAuthenticated();
  const numericLpId = Number(lpId);

  const { data: lp, isLoading, isError, refetch } = useQuery({
    queryKey: ['lp', numericLpId],
    queryFn: () => getLpById(numericLpId),
    enabled: !!lpId && !isNaN(numericLpId),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(numericLpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', numericLpId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(numericLpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/', { replace: true });
    },
  });

  if (!loggedIn) {
    return <LoginModal from={location.pathname} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !lp) {
    return <ErrorState message="LP 정보를 불러오는 데 실패했습니다." onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5m7-7-7 7 7 7" />
        </svg>
        뒤로가기
      </button>

      {/* 썸네일 */}
      {lp.thumbnail && (
        <div className="mb-6 overflow-hidden rounded-xl">
          <img src={lp.thumbnail} alt={lp.title} className="w-full object-cover max-h-80" />
        </div>
      )}

      {/* 제목 & 메타 */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-white">{lp.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span>{formatDate(lp.createdAt)}</span>
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {lp.likes.length}
          </span>
          {lp.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lp.tags.map((tag) => (
                <span key={tag.id} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className="mb-8 rounded-xl bg-white/5 p-5 text-slate-300 leading-relaxed whitespace-pre-wrap">
        {lp.content || '본문이 없습니다.'}
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className="flex items-center gap-1.5 rounded-lg border border-pink-500 px-4 py-2 text-sm font-medium text-pink-400 hover:bg-pink-500 hover:text-white transition-colors disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          좋아요 {lp.likes.length}
        </button>
        <button
          className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors"
        >
          수정
        </button>
        <button
          onClick={() => {
            if (confirm('정말 삭제하시겠습니까?')) {
              deleteMutation.mutate();
            }
          }}
          disabled={deleteMutation.isPending}
          className="rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default LpDetailPage;
