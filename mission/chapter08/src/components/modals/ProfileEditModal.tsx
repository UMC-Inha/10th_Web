import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { uploadImage } from '../../apis/uploadsApi';
import { updateMyInfo } from '../../apis/usersApi';
import { QUERY_KEYS } from '../../constants/queryKeys';
import { useAuth } from '../../contexts/AuthContext';
import type { UserInfo } from '../../types/user';
import { readFileAsDataURL } from '../../utils/readFileAsDataURL';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import ModalOverlay from '../ui/ModalOverlay';

type ProfileEditModalProps = {
  initialName: string;
  initialBio: string;
  initialAvatar: string;
  onClose: () => void;
};

function ProfileEditModal({ initialName, initialBio, initialAvatar, onClose }: ProfileEditModalProps) {
  const queryClient = useQueryClient();
  const { userName, updateUserName } = useAuth();

  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialAvatar);
  const [error, setError] = useState('');

  const updateMutation = useMutation({
    mutationFn: async () => {
      let avatarUrl: string | null = avatarPreview || null;
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }
      return updateMyInfo({
        name: name.trim() || undefined,
        bio: bio.trim() || null,
        avatar: avatarUrl,
      });
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.user('me') });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.myInfo });

      const previousUser = queryClient.getQueryData<UserInfo>(QUERY_KEYS.user('me'));
      const previousMyInfo = queryClient.getQueryData<UserInfo>(QUERY_KEYS.myInfo);
      const previousUserName = userName;

      const optimisticUpdate = (old: UserInfo | undefined) =>
        old ? { ...old, name: name.trim(), bio: bio.trim() || null } : old;
      queryClient.setQueryData<UserInfo>(QUERY_KEYS.user('me'), optimisticUpdate);
      queryClient.setQueryData<UserInfo>(QUERY_KEYS.myInfo, optimisticUpdate);

      updateUserName(name.trim());

      return { previousUser, previousMyInfo, previousUserName };
    },

    onError: (err, _, context) => {
      if (context?.previousUser !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.user('me'), context.previousUser);
      }
      if (context?.previousMyInfo !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.myInfo, context.previousMyInfo);
      }
      if (context?.previousUserName !== undefined && context.previousUserName !== null) {
        updateUserName(context.previousUserName);
      }
      setError(getApiErrorMessage(err, '프로필 수정에 실패했습니다.'));
    },

    onSuccess: (data) => {
      if (data?.name) updateUserName(data.name);
      onClose();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user('me') });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myInfo });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    try {
      const preview = await readFileAsDataURL(file);
      setAvatarPreview(preview);
    } catch {
      setAvatarFile(null);
      setAvatarPreview(initialAvatar);
    }
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

  return (
    <ModalOverlay onClose={onClose} labelledBy="profile-edit-modal-title">
      <div className="w-full max-w-md rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 id="profile-edit-modal-title" className="text-lg font-bold text-white">프로필 수정</h2>
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
    </ModalOverlay>
  );
}

export default ProfileEditModal;
