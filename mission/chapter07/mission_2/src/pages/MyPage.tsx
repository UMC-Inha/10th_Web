import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useMyPage } from '../hooks/useMyPage';

const MyPage = () => {
  const navigate = useNavigate();
  const {
  user,
  isUpdating,
  isDeleting,
  updateProfileMutate,
  deleteAccountMutate,
  logoutMutate,
} = useMyPage();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState(user?.nickname ?? '');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  

  const handleProfileSubmit = () => {
  if (!name.trim()) {
    alert('닉네임을 입력해주세요.');
    return;
  }

  updateProfileMutate({
    name,
    bio,
    avatar,
  });

  setIsEditing(false);
};

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex items-center justify-center py-4 border-b border-gray-700">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 text-gray-500 hover:text-gray-300 transition-colors"
        >
          ＜
        </button>
        <h1 className="text-lg font-semibold text-white">마이페이지</h1>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 gap-6 p-6">
        {isEditing ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-500">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>

            <div className="relative w-full">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-black outline-none focus:border-pink-500 pr-10"
                placeholder="닉네임"
              />

              <button
                onClick={handleProfileSubmit}
                disabled={isUpdating || !name.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 disabled:opacity-50"
              >
                ✓
              </button>
            </div>

            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-black outline-none focus:border-pink-500"
              placeholder="bio"
            />

            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-black outline-none focus:border-pink-500"
              placeholder="avatar URL"
            />

            <p className="text-gray-500 text-sm">{user?.email}</p>

            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              취소
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-4xl">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  '👤'
                )}
              </div>

              <button
                onClick={() => {
                  setName(user?.nickname ?? '');
                  setIsEditing(true);
                }}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500 transition-colors text-sm"
                title="프로필 수정"
              >
                ⚙️
              </button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <h2 className="text-2xl font-bold text-white">
                {user?.nickname}
              </h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

            <button
              onClick={() => logoutMutate()}
              className="px-6 py-2 text-sm border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
            >
              로그아웃
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 hover:text-red-400 text-sm transition-colors"
            >
              탈퇴하기
            </button>
          </>
        )}
      </div>

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
