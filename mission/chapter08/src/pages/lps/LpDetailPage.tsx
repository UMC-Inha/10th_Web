import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import CommentSection from '../../components/lps/CommentSection';
import LpActionBar from '../../components/lps/LpActionBar';
import LpDetailHeader from '../../components/lps/LpDetailHeader';
import ConfirmModal from '../../components/modals/ConfirmModal';
import LoginModal from '../../components/modals/LoginModal';
import LpEditModal from '../../components/modals/LpEditModal';
import ErrorState from '../../components/ui/ErrorState';
import useLpDetail from '../../hooks/useLpDetail';
import { useAuth } from '../../contexts/AuthContext';

type LpDetailContentProps = {
  lpId: number;
};

function LpDetailContent({ lpId }: LpDetailContentProps) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    lp,
    myInfo,
    isLoading,
    isError,
    refetch,
    isOwner,
    isLiked,
    likeError,
    deleteError,
    likeMutation,
    deleteMutation,
  } = useLpDetail(lpId);

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
      {showDeleteConfirm && (
        <ConfirmModal
          message="정말 삭제하시겠습니까?&#10;삭제된 LP는 복구할 수 없습니다."
          confirmLabel="삭제"
          onConfirm={() => {
            setShowDeleteConfirm(false);
            deleteMutation.mutate();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showEditModal && <LpEditModal lp={lp} onClose={() => setShowEditModal(false)} />}

      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5m7-7-7 7 7 7" />
        </svg>
        뒤로가기
      </button>

      <LpDetailHeader lp={lp} />

      <LpActionBar
        likeCount={lp.likes.length}
        isLiked={isLiked}
        isOwner={isOwner}
        likeError={likeError}
        deleteError={deleteError}
        isLikePending={likeMutation.isPending}
        isDeletePending={deleteMutation.isPending}
        onLike={() => likeMutation.mutate()}
        onEdit={() => setShowEditModal(true)}
        onDelete={() => setShowDeleteConfirm(true)}
      />

      <CommentSection lpId={lpId} myInfo={myInfo ?? undefined} />
    </div>
  );
}

function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const location = useLocation();
  const { loggedIn } = useAuth();
  const numericLpId = lpId && !isNaN(Number(lpId)) ? Number(lpId) : null;

  if (!loggedIn) {
    return <LoginModal from={location.pathname} />;
  }

  if (numericLpId === null) {
    return <ErrorState message="잘못된 LP 주소입니다." />;
  }

  return <LpDetailContent lpId={numericLpId} />;
}

export default LpDetailPage;
