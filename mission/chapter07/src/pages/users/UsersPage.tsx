import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router';
import { getMyInfo, getUserInfo } from '../../apis/usersApi';
import ProfileEditModal from '../../components/modals/ProfileEditModal';

function UsersPage() {
  const { userId } = useParams();
  const isMyPage = !userId;
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId ?? 'me'],
    queryFn: () => (userId ? getUserInfo(userId) : getMyInfo()),
  });

  const errorMessage =
    error instanceof Error ? error.message : error ? '유저 정보를 불러오지 못했습니다.' : '';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center py-32 text-red-400 text-sm">
        {errorMessage}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg p-6">
      {showEditModal && isMyPage && (
        <ProfileEditModal
          initialName={user.name}
          initialBio={user.bio ?? ''}
          initialAvatar={user.avatar ?? ''}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* 프로필 카드 */}
      <div className="rounded-2xl bg-[#1e1e1e] border border-white/10 p-6">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-pink-500/30"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/20 text-2xl font-bold text-pink-400">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{user.name}</h1>
            <p className="text-sm text-slate-400 truncate">{user.email}</p>
          </div>

          {isMyPage && (
            <button
              onClick={() => setShowEditModal(true)}
              className="rounded-lg border border-white/20 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="프로필 설정"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          )}
        </div>

        {user.bio && (
          <div className="mt-4 rounded-lg bg-white/5 px-4 py-3">
            <p className="text-sm text-slate-300 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {!user.bio && isMyPage && (
          <div className="mt-4 rounded-lg border border-dashed border-white/10 px-4 py-3">
            <p className="text-sm text-slate-600">
              아직 자기소개가 없어요.{' '}
              <button
                onClick={() => setShowEditModal(true)}
                className="text-pink-400 hover:underline"
              >
                추가하기
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersPage;
