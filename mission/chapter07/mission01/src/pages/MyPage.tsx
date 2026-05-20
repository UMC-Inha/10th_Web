// src/pages/MyPage.tsx

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResponseMyInfoDto } from "../types/auth";
import { getMyInfo, updateMyInfo, uploadProfileAvatar } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LpPostModal from "../components/LpPostModal";

const Mypage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, isLoading } = useQuery<ResponseMyInfoDto>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const profile = data?.data;

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatar ?? null);
    }
  }, [profile]);

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const updateMutation = useMutation({
    mutationFn: (payload: { name: string; bio?: string; avatar?: string }) => updateMyInfo(payload),
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
    setAvatarUrl(profile.avatar ?? null);
    setPreviewUrl(profile.avatar ?? null);
    setSelectedFile(null);
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      alert("이름을 입력해주세요.");
      return;
    }

    let newAvatar = avatarUrl ?? undefined;

    if (selectedFile) {
      try {
        newAvatar = await uploadProfileAvatar(selectedFile);
      } catch (error) {
        console.error(error);
        alert("프로필 사진 업로드에 실패했습니다.");
        return;
      }
    }

    updateMutation.mutate({
      name: trimmedName,
      bio: editBio,
      avatar: newAvatar,
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        로딩중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="mx-auto w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950/95 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="프로필"
                className="h-24 w-24 rounded-full object-cover border-4 border-pink-500"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-4xl text-zinc-400 border-4 border-pink-500">
                👤
              </div>
            )}
          </div>

          <div className="flex-1 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-2xl font-bold">{profile.name}</p>
                <p className="text-sm text-zinc-400 mt-1">{profile.email}</p>
              </div>
              <button
                onClick={handleOpenEdit}
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:border-pink-500 hover:text-pink-300"
              >
                설정
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap rounded-3xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 min-h-[78px]">
              {profile.bio || "소개를 추가해보세요."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-2xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
          >
            로그아웃
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-10 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl text-white shadow-lg transition hover:bg-pink-400"
      >
        +
      </button>

      <LpPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
          onClick={handleEditClose}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-zinc-700 bg-zinc-950/95 p-6 shadow-2xl shadow-black/70 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleEditClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 transition hover:bg-zinc-800 hover:text-pink-500"
            >
              ×
            </button>

            <div className="flex flex-col items-center gap-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={handleAvatarClick}
                className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 shadow-inner shadow-pink-500/20 transition hover:ring-2 hover:ring-pink-500/50"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="프로필 미리보기"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-zinc-300">사진 선택</span>
                )}
              </button>

              <div className="w-full space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-200">이름</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="이름"
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-200">Bio (선택)</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={4}
                    placeholder="자기소개를 입력해보세요"
                    className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              <div className="flex w-full gap-3">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateMutation.isPending ? "저장중..." : "저장"}
                </button>
                <button
                  type="button"
                  onClick={handleEditClose}
                  className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-pink-500"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mypage;