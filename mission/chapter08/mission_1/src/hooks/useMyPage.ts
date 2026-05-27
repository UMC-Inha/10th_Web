import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile, deleteMyAccount } from '../api/user';

export const useMyPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateNickname } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: updateProfileMutate, isPending: isUpdating } = useMutation({
    mutationFn: (profileData: { name: string; bio: string; avatar: string }) =>
      updateMyProfile(profileData),
    onMutate: async (profileData) => {
      const previousNickname = user?.nickname;
      updateNickname(profileData.name);
      return { previousNickname };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      alert('프로필이 수정되었습니다.');
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNickname) updateNickname(context.previousNickname);
      alert('프로필 수정에 실패했습니다.');
    },
  });

  const { mutate: deleteAccountMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => { logout(); navigate('/login'); },
    onError: () => { alert('회원 탈퇴에 실패했습니다.'); },
  });

  const { mutate: logoutMutate } = useMutation({
    mutationFn: async () => { await logout(); },
    onSuccess: () => { navigate('/'); },
  });

  return {
    user,
    isUpdating,
    isDeleting,
    updateProfileMutate,
    deleteAccountMutate,
    logoutMutate,
  };
};