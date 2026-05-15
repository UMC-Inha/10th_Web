import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { uploadImage } from '../../apis/uploadsApi';
import { getMyInfo, getUserInfo, updateMyInfo } from '../../apis/usersApi';
import { useAuth } from '../../contexts/AuthContext';
import type { UserInfo } from '../../types/user';

function ProfileEditModal({
  initialName,
  initialBio,
  initialAvatar,
  onClose,
}: {
  initialName: string;
  initialBio: string;
  initialAvatar: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { userName, updateUserName } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialAvatar);
  const [error, setError] = useState('');

  const updateMutation = useMutation({
    mutationFn: async () => {
      let avatarUrl: string | null = avatarPreview || null;
      if (avatarFile) {
        try {
          avatarUrl = await uploadImage(avatarFile);
        } catch {
          // 업로드 실패 시 기존 avatar 유지
        }
      }
      return updateMyInfo({
        name: name.trim() || undefined,
        bio: bio.trim() || null,
        avatar: avatarUrl,
      });
    },

    // ── 낙관적 업데이트 ──────────────────────────────────────
    onMutate: async () => {
      // 1. 진행 중인 리페치 취소 (덮어쓰기 방지)
      await queryClient.cancelQueries({ queryKey: ['user', 'me'] });
      await queryClient.cancelQueries({ queryKey: ['myInfo'] });

      // 2. 이전 데이터 저장 (롤백용)
      const previousUser = queryClient.getQueryData<UserInfo>(['user', 'me']);
      const previousMyInfo = queryClient.getQueryData<UserInfo>(['myInfo']);
      const previousUserName = userName;

      // 3. 캐시 낙관적 업데이트
      const optimisticUpdate = (old: UserInfo | undefined) =>
        old ? { ...old, name: name.trim(), bio: bio.trim() || null } : old;
      queryClient.setQueryData<UserInfo>(['user', 'me'], optimisticUpdate);
      queryClient.setQueryData<UserInfo>(['myInfo'], optimisticUpdate);

      // 4. Nav-Bar 닉네임 즉시 업데이트
      updateUserName(name.trim());

      return { previousUser, previousMyInfo, previousUserName };
    },

    // ── 실패 시 롤백 ──────────────────────────────────────────
    onError: (err, _, context) => {
      if (context?.previousUser !== undefined) {
        queryClient.setQueryData(['user', 'me'], context.previousUser);
      }
      if (context?.previousMyInfo !== undefined) {
        queryClient.setQueryData(['myInfo'], context.previousMyInfo);
      }
      // Nav-Bar 닉네임 롤백
      if (context?.previousUserName !== undefined) {
        updateUserName(context.previousUserName ?? '');
      }
      setError(err instanceof Error ? err.message : '프로필 수정에 실패했습니다.');
    },

    // ── 성공 시 서버 응답으로 최종 동기화 ─────────────────────
    onSuccess: (data) => {
      if (data?.name) updateUserName(data.name);
      onClose();
    },

    // ── 항상 최종 서버 상태와 동기화 ───────────────────────────
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    updateMutation.mutate();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-md rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-bold text-white">프로필 수정</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="닫기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          {/* 프로필 사진 */}
          <div className="flex flex-col items-center gap-3">
            <label className="cursor-pointer">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="프로필 사진"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-pink-500/50"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/20 text-2xl font-bold text-pink-400">
                  {initialName.charAt(0).toUpperCase()}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <span className="text-xs text-slate-500">클릭하여 사진 변경 (선택)</span>
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-slate-300">
              이름 <span className="text-pink-500">*</span>
            </label>
            <input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="profile-bio" className="mb-1.5 block text-sm font-medium text-slate-300">
              자기소개 <span className="text-slate-500">(선택)</span>
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요"
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-11 w-full rounded-xl bg-pink-500 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateMutation.isPending ? '저장 중...' : '저장하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

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
