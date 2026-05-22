// src/pages/MyPage.tsx

import { useState, useRef, type ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo, uploadProfileAvatar } from "../apis/auth";
import { getMyLikedLps, getMyLps } from "../apis/myLp";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { SortOrder } from "../apis/lp";

type TabType = "liked" | "my";

const Mypage = () => {
  const navigate = useNavigate();
  const { logout, setName: setAuthName } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("liked");
  const [lpSort, setLpSort] = useState<SortOrder>("desc");

  // 내 정보
  const { data, isLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });
  const profile = data?.data;

  // 내가 좋아요한 LP
  const { data: likedData } = useQuery({
    queryKey: ["myLikedLps", lpSort],
    queryFn: () => getMyLikedLps(lpSort),
    enabled: activeTab === "liked",
  });

  // 내가 작성한 LP
  const { data: myLpData } = useQuery({
    queryKey: ["myLps", lpSort],
    queryFn: () => getMyLps(lpSort),
    enabled: activeTab === "my",
  });

  const likedLps = likedData?.data?.data ?? [];
  const myLps = myLpData?.data?.data ?? [];
  const displayLps = activeTab === "liked" ? likedLps : myLps;

  // 프로필 수정 - 낙관적 업데이트
  const updateMutation = useMutation({
    mutationFn: (payload: { name: string; bio?: string; avatar?: string }) =>
      updateMyInfo(payload),

    // 낙관적 업데이트: 서버 응답 전에 먼저 UI 반영
    onMutate: async (payload) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });

      // 이전 값 저장 (롤백용)
      const previousMyInfo = queryClient.getQueryData(["myInfo"]);

      // NavBar 닉네임 즉시 변경
      if (payload.name) setAuthName(payload.name);

      // myInfo 캐시도 즉시 변경
      queryClient.setQueryData(["myInfo"], (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          name: payload.name,
          bio: payload.bio ?? old?.data?.bio,
          avatar: payload.avatar ?? old?.data?.avatar,
        },
      }));

      return { previousMyInfo };
    },

    onError: (_err, _payload, context) => {
      // 실패 시 롤백
      if (context?.previousMyInfo) {
        queryClient.setQueryData(["myInfo"], context.previousMyInfo);
        // NavBar도 롤백
        const prev = context.previousMyInfo as any;
        setAuthName(prev?.data?.name ?? null);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      setIsEditOpen(false);
      setSelectedFile(null);
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleOpenEdit = () => {
    if (!profile) return;
    setEditName(profile.name);
    setEditBio(profile.bio ?? "");
    setPreviewUrl(profile.avatar ?? null);
    setSelectedFile(null);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName) { alert("이름을 입력해주세요."); return; }

    let newAvatar = profile?.avatar;
    if (selectedFile) {
      try {
        newAvatar = await uploadProfileAvatar(selectedFile);
      } catch {
        alert("프로필 사진 업로드에 실패했습니다.");
        return;
      }
    }

    updateMutation.mutate({ name: trimmedName, bio: editBio, avatar: newAvatar });
  };

  if (isLoading || !profile) return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      로딩중...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 프로필 헤더 */}
      <div className="flex items-center gap-6 px-8 py-10">
        {/* 아바타 */}
        {profile.avatar ? (
          <img src={profile.avatar} alt="프로필" className="w-24 h-24 rounded-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-zinc-600 flex items-center justify-center text-4xl text-zinc-300">
            👤
          </div>
        )}

        {/* 이름/bio/이메일 */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <button
              onClick={handleOpenEdit}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          {profile.bio && <p className="text-zinc-400 text-sm mb-1">{profile.bio}</p>}
          <p className="text-zinc-500 text-sm">{profile.email}</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="border-b border-zinc-800">
        <div className="flex justify-center gap-12">
          <button
            onClick={() => setActiveTab("liked")}
            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "liked" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            내가 좋아요 한 LP
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "my" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            내가 작성한 LP
          </button>
        </div>
      </div>

      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 px-8 py-4">
        {(['asc', 'desc'] as const).map((o) => (
          <button
            key={o}
            onClick={() => setLpSort(o)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
              lpSort === o ? 'bg-white text-black border-white font-semibold' : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
            }`}
          >
            {o === 'asc' ? '오래된순' : '최신순'}
          </button>
        ))}
      </div>

      {/* LP 그리드 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 px-0">
        {displayLps.map((lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lps/${lp.id}`)}
            className="aspect-square cursor-pointer overflow-hidden group relative"
          >
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* 로그아웃 버튼 */}
      <div className="px-8 py-6">
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-500 hover:text-white transition-colors"
        >
          로그아웃
        </button>
      </div>

      {/* 프로필 수정 모달 */}
      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={handleEditClose}
        >
          <div
            className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleEditClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>

            {/* 아바타 */}
            <div className="flex justify-center">
              <button onClick={() => fileInputRef.current?.click()} className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-700 hover:opacity-80 transition-opacity">
                {previewUrl ? (
                  <img src={previewUrl} alt="미리보기" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-3xl">👤</div>
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* 이름 */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">이름</label>
              <div className="flex items-center gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-pink-500"
                />
                <button
                  onClick={handleSaveProfile}
                  disabled={updateMutation.isPending}
                  className="text-pink-500 hover:text-pink-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400">Bio (선택)</label>
              <input
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="자기소개"
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* 저장/취소 */}
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={updateMutation.isPending}
                className="flex-1 py-2.5 bg-pink-600 text-white rounded-lg text-sm font-semibold hover:bg-pink-500 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? "저장중..." : "저장"}
              </button>
              <button
                onClick={handleEditClose}
                className="flex-1 py-2.5 bg-zinc-800 text-white rounded-lg text-sm font-semibold hover:bg-zinc-700 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mypage;