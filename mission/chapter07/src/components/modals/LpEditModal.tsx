import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { updateLp } from '../../apis/lpsApi';
import { uploadImage } from '../../apis/uploadsApi';
import type { LpDetailDto } from '../../types/lp';

type LpEditModalProps = {
  lp: LpDetailDto;
  onClose: () => void;
};

function LpEditModal({ lp, onClose }: LpEditModalProps) {
  const queryClient = useQueryClient();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(lp.title);
  const [content, setContent] = useState(lp.content);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(lp.thumbnail);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(lp.tags.map((t) => t.name));
  const [error, setError] = useState('');

  const updateMutation = useMutation({
    mutationFn: async () => {
      let thumbnailUrl: string | null | undefined = thumbnailPreview;
      if (thumbnailFile) {
        try {
          thumbnailUrl = await uploadImage(thumbnailFile);
        } catch {
          // 업로드 실패 시 기존 썸네일 유지
        }
      }
      return updateLp(lp.id, {
        title: title.trim(),
        content: content.trim(),
        thumbnail: thumbnailUrl,
        tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lp.id] });
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'LP 수정에 실패했습니다.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
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
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#1e1e1e] px-6 py-4">
          <h2 className="text-lg font-bold text-white">LP 수정하기</h2>
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
          {/* 썸네일 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">LP 사진</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-pink-500/50 hover:bg-pink-500/5">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="미리보기"
                  className="h-48 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-slate-500">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span className="text-sm">클릭하여 이미지 선택</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {thumbnailPreview && (
              <button
                type="button"
                onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                className="mt-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
              >
                이미지 제거
              </button>
            )}
          </div>

          {/* 제목 */}
          <div>
            <label htmlFor="edit-lp-title" className="mb-1.5 block text-sm font-medium text-slate-300">
              제목 <span className="text-pink-500">*</span>
            </label>
            <input
              id="edit-lp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="LP 제목을 입력하세요"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
            />
          </div>

          {/* 내용 */}
          <div>
            <label htmlFor="edit-lp-content" className="mb-1.5 block text-sm font-medium text-slate-300">
              내용 <span className="text-pink-500">*</span>
            </label>
            <textarea
              id="edit-lp-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="LP에 대해 설명해주세요..."
              rows={4}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
            />
          </div>

          {/* 태그 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">태그</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="태그 입력 후 추가 버튼 클릭"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-pink-500/50"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
              >
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-pink-500/20 px-2.5 py-0.5 text-xs text-pink-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-0.5 rounded-full hover:text-pink-100 transition-colors"
                      aria-label={`${tag} 태그 삭제`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 에러 */}
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          {/* 제출 */}
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-11 w-full rounded-xl bg-pink-500 text-sm font-semibold text-white hover:bg-pink-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateMutation.isPending ? '수정 중...' : '수정 완료'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LpEditModal;
