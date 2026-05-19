import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile, deleteMyAccount } from '../api/user';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState(user?.nickname ?? '');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // ── 프로필 수정 mutation ──
  const { mutate: updateProfileMutate, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) => updateMyProfile(formData),
    onSuccess: (data) => {
      // AuthContext user 정보 업데이트가 필요하면 login 재호출하거나
      // 여기서는 간단히 쿼리 무효화 후 편집 모드 종료
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      setIsEditing(false);
      alert('프로필이 수정되었습니다.');
    },
    onError: () => {
      alert('프로필 수정에 실패했습니다.');
    },
  });

  // ── 탈퇴 mutation ──
  const { mutate: deleteAccountMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: () => {
      alert('회원 탈퇴에 실패했습니다.');
    },
  });

  // ── 로그아웃 mutation ──
  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      navigate('/');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = () => {
    const formData = new FormData();
    formData.append('name', name);
    // bio는 옵션 → 비어있어도 전송 가능
    if (bio) formData.append('bio', bio);
    if (avatarFile) formData.append('avatar', avatarFile);
    updateProfileMutate(formData);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="relative flex items-center justify-center py-4 border-b border-gray-700">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 text-gray-500 hover:text-gray-300 transition-colors"
        >
          ＜
        </button>
        <h1 className="text-lg font-semibold text-white">마이페이지</h1>
      </div>

      {/* 본문 */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6 p-6">
        {isEditing ? (
          /* ── 편집 모드 ── */
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            {/* 아바타 */}
            <div
              className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-500 hover:border-pink-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* 이름 입력 */}
            <div className="relative w-full">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500 pr-10"
                placeholder="이름"
              />
              <button
                onClick={handleProfileSubmit}
                disabled={isUpdating || !name.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 disabled:opacity-50"
              >
                ✓
              </button>
            </div>

            {/* bio 입력 (옵션) */}
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500"
              placeholder="프론트 짱 (선택)"
            />

            {/* 이메일 표시 */}
            <p className="text-gray-500 text-sm">{user?.email}</p>

            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              취소
            </button>
          </div>
        ) : (
          /* ── 일반 모드 ── */
          <>
            {/* 아바타 + 설정 버튼 */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl">
                👤
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors text-sm"
                title="프로필 수정"
              >
                ⚙️
              </button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <h2 className="text-2xl font-bold text-white">{user?.nickname}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={() => logoutMutate()}
              className="px-6 py-2 text-sm border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
            >
              로그아웃
            </button>

            {/* 탈퇴하기 버튼 */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 hover:text-red-400 text-sm transition-colors"
            >
              탈퇴하기
            </button>
          </>
        )}
      </div>

      {/* 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={() => deleteAccountMutate()}
          onCancel={() => setShowDeleteModal(false)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
};

export default MyPage;